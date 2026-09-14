from __future__ import annotations

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.models import Employee, Role, Skill, employee_projects, employee_skills, role_skills
from app.schemas import ExplainOut, RecommendationOut
from app.services.analytics import SCENARIO_REQUIREMENTS
from app.services.embeddings import pairwise_similarity


TARGET_ROLE = "Edge AI Engineer"


def _certs(emp: Employee) -> list[str]:
    if not emp.certifications:
        return []
    return [c.strip() for c in emp.certifications.split(";") if c.strip()]


def _employee_text(emp: Employee, skills: dict[str, float], projects: list[str]) -> str:
    skill_line = ", ".join(f"{k} {int(v * 100)}" for k, v in skills.items())
    return (
        f"{emp.current_role} in {emp.department}. Experience {emp.years_experience} years. "
        f"Skills: {skill_line}. Projects: {', '.join(projects)}. Certs: {', '.join(_certs(emp))}."
    )


def _role_text(db: Session, role: Role) -> str:
    reqs = db.execute(
        select(Skill.name, role_skills.c.required_level)
        .join(Skill, Skill.id == role_skills.c.skill_id)
        .where(role_skills.c.role_id == role.id)
    ).all()
    skill_line = ", ".join(f"{n} {int(l * 100)}" for n, l in reqs)
    return f"{role.name} in {role.department}. Requires {skill_line}. {role.description}"


def _skill_map(db: Session, emp: Employee) -> dict[str, float]:
    rows = db.execute(
        select(Skill.name, employee_skills.c.proficiency)
        .join(Skill, Skill.id == employee_skills.c.skill_id)
        .where(employee_skills.c.employee_id == emp.id)
    ).all()
    return {n: float(p) for n, p in rows}


def _projects(db: Session, emp: Employee) -> list[str]:
    from app.models import Project

    rows = db.execute(
        select(Project.name)
        .join(employee_projects, Project.id == employee_projects.c.project_id)
        .where(employee_projects.c.employee_id == emp.id)
    ).all()
    return [r[0] for r in rows]


def _choose_action(similarity: float, missing: list[str], emp: Employee) -> str:
    if similarity >= 0.55 and len(missing) <= 3:
        return "Upskill"
    if emp.department in {"Engineering", "AI", "Hardware", "Semiconductor"} and similarity >= 0.35:
        return "Reskill"
    if similarity < 0.28:
        return "Hire"
    return "Redeploy"


def _readiness(similarity: float) -> str:
    if similarity >= 0.6:
        return "High"
    if similarity >= 0.4:
        return "Moderate"
    return "Developing"


def build_recommendations(db: Session) -> list[RecommendationOut]:
    target = db.query(Role).filter(Role.name == TARGET_ROLE).first()
    if not target:
        return []
    role_blob = _role_text(db, target)
    recs: list[RecommendationOut] = []
    for emp in db.query(Employee).all():
        skills = _skill_map(db, emp)
        projects = _projects(db, emp)
        sim = pairwise_similarity(_employee_text(emp, skills, projects), role_blob)
        missing = [
            skill
            for skill, required in SCENARIO_REQUIREMENTS.items()
            if skills.get(skill, 0) < required - 0.15
        ]
        action = _choose_action(sim, missing, emp)
        recs.append(
            RecommendationOut(
                employee_id=emp.public_id,
                name=emp.name,
                current_role=emp.current_role,
                target_role=TARGET_ROLE,
                action=action,
                department=emp.department,
                readiness=_readiness(sim),
                similarity=round(sim, 2),
                missing_skills=missing[:4],
            )
        )
    recs.sort(key=lambda r: r.similarity, reverse=True)
    return recs


async def _llm_narrative(explain: ExplainOut) -> str:
    if not settings.llm_api_url or not settings.llm_api_key:
        return explain.narrative
    prompt = (
        f"Write two short sentences explaining why {explain.action} is recommended for "
        f"{explain.name} toward {explain.target_role}. Reasons: {'; '.join(explain.reasons)}."
    )
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            res = await client.post(
                settings.llm_api_url,
                headers={"Authorization": f"Bearer {settings.llm_api_key}"},
                json={
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 120,
                },
            )
            res.raise_for_status()
            data = res.json()
            return data["choices"][0]["message"]["content"].strip()
    except Exception:
        return explain.narrative


async def explain_employee(db: Session, public_id: str) -> ExplainOut | None:
    emp = db.query(Employee).filter(Employee.public_id == public_id).first()
    if not emp:
        return None
    recs = {r.employee_id: r for r in build_recommendations(db)}
    rec = recs.get(public_id)
    if not rec:
        return None
    skills = _skill_map(db, emp)
    projects = _projects(db, emp)
    reasons = []
    if skills.get("Python", 0) >= 0.65:
        reasons.append("Strong in Python")
    ml_projects = [p for p in projects if "Vision" in p or "Analytics" in p or "Edge" in p]
    if ml_projects:
        reasons.append(f"Completed {len(ml_projects)} machine learning related project(s)")
    if skills.get("Embedded C", 0) >= 0.6 or emp.current_role == "Firmware Engineer":
        reasons.append("Hands-on embedded systems experience")
    reasons.append(f"{int(rec.similarity * 100)}% skill similarity with target role")
    if rec.missing_skills:
        reasons.append("Missing " + " and ".join(rec.missing_skills[:2]) + " skills")

    narrative = (
        f"Recommend {rec.action.upper()} for Employee #{emp.public_id}. "
        f"Estimated transition readiness: {rec.readiness}."
    )
    explain = ExplainOut(
        employee_id=emp.public_id,
        name=emp.name,
        action=rec.action,
        target_role=rec.target_role,
        reasons=reasons,
        missing_skills=rec.missing_skills,
        similarity=rec.similarity,
        readiness=rec.readiness,
        narrative=narrative,
    )
    explain.narrative = await _llm_narrative(explain)
    return explain


def demand_forecast() -> dict:
    """Simple 12-month demand curve used by the dashboard chart."""
    series = [
        {"skill": "Embedded C", "demand": 62, "horizon_months": 12},
        {"skill": "Python", "demand": 70, "horizon_months": 12},
        {"skill": "Machine Learning", "demand": 84, "horizon_months": 12},
        {"skill": "Computer Vision", "demand": 78, "horizon_months": 12},
        {"skill": "Edge AI", "demand": 96, "horizon_months": 12},
        {"skill": "FPGA", "demand": 88, "horizon_months": 12},
        {"skill": "RTL Design", "demand": 54, "horizon_months": 12},
        {"skill": "VLSI", "demand": 48, "horizon_months": 12},
    ]
    timeline = [
        {"month": "M0", "Edge AI": 22, "FPGA": 28, "ML": 40, "CV": 30},
        {"month": "M3", "Edge AI": 38, "FPGA": 42, "ML": 52, "CV": 44},
        {"month": "M6", "Edge AI": 58, "FPGA": 55, "ML": 64, "CV": 58},
        {"month": "M9", "Edge AI": 78, "FPGA": 70, "ML": 74, "CV": 68},
        {"month": "M12", "Edge AI": 96, "FPGA": 88, "ML": 84, "CV": 78},
    ]
    return {
        "scenario": "Edge-AI Product Launch Within 12 Months",
        "series": series,
        "timeline": timeline,
    }
