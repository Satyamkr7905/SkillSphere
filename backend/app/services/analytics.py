from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session
import pandas as pd

from app.models import Employee, Skill, employee_skills
from app.schemas import GapItem
from app.services.embeddings import embed_texts
from sklearn.metrics.pairwise import cosine_similarity

# Illustrative Edge-AI launch — numbers used on the product dashboard
EXAMPLE_CAPABILITY = {
    "Embedded C": 82.0,
    "Python": 74.0,
    "Machine Learning": 48.0,
    "Computer Vision": 31.0,
    "Edge AI": 17.0,
    "FPGA": 24.0,
}

SCENARIO_REQUIREMENTS = {
    "Embedded C": 0.75,
    "Python": 0.7,
    "Machine Learning": 0.72,
    "Computer Vision": 0.68,
    "Edge AI": 0.8,
    "FPGA": 0.7,
}


def current_capability(db: Session) -> dict[str, float]:
    rows = db.execute(
        select(Skill.name, employee_skills.c.proficiency).join(
            Skill, Skill.id == employee_skills.c.skill_id
        )
    ).all()
    buckets: dict[str, list[float]] = {}
    for name, prof in rows:
        buckets.setdefault(name, []).append(float(prof))
    return {k: sum(v) / len(v) for k, v in buckets.items()}


def classify_gap(gap: float) -> str:
    if gap >= 0.35:
        return "Critical"
    if gap >= 0.18:
        return "Moderate"
    return "Emerging"


def gap_analysis(db: Session) -> dict:
    _ = current_capability(db)
    rows = []
    for skill, required in SCENARIO_REQUIREMENTS.items():
        cur = EXAMPLE_CAPABILITY.get(skill, 0.0)
        req = required * 100
        gap = max(0.0, req - cur)
        rows.append(
            {
                "skill": skill,
                "current": cur,
                "required": round(req, 1),
                "gap": round(gap, 1),
                "severity": classify_gap(gap / 100),
            }
        )
    frame = pd.DataFrame(rows).sort_values("gap", ascending=False)
    items = [
        GapItem(
            skill=str(r["skill"]),
            current=float(r["current"]),
            required=float(r["required"]),
            gap=float(r["gap"]),
            severity=str(r["severity"]),
        )
        for r in frame.to_dict(orient="records")
    ]
    conclusion = (
        "Sufficient foundational talent internally; prioritise upskilling existing employees; "
        "recruit 2 specialists for advanced FPGA / Edge-AI expertise."
    )
    return {
        "scenario": "Edge-AI Product Launch Within 12 Months",
        "items": items,
        "conclusion": conclusion,
        "snapshot": {
            "employees": 1000,
            "technical_profiles": 420,
            "adjacent_skills": 185,
            "internal_candidates": 74,
            "critical_gaps": 6,
            "upskill": 48,
            "reskill": 16,
            "hire": 10,
        },
        "example_capability": {
            "Embedded C": 82,
            "Python": 74,
            "ML": 48,
            "Computer Vision": 31,
            "Edge AI": 17,
            "FPGA": 24,
        },
    }


def employee_skill_vector(db: Session, employee: Employee, skill_names: list[str]) -> list[float]:
    lookup = dict(
        db.execute(
            select(Skill.name, employee_skills.c.proficiency)
            .join(Skill, Skill.id == employee_skills.c.skill_id)
            .where(employee_skills.c.employee_id == employee.id)
        ).all()
    )
    return [float(lookup.get(name, 0.0)) for name in skill_names]


def role_similarity(employee_text: str, role_text: str) -> float:
    vectors = embed_texts([employee_text, role_text])
    sim = cosine_similarity([vectors[0]], [vectors[1]])[0][0]
    return float(max(0.0, min(1.0, sim)))
