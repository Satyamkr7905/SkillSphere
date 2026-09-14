from __future__ import annotations

from sqlalchemy.orm import Session

from app.models import Employee, Project, Role, Skill, employee_projects, employee_skills, role_skills
from app.neo4j_client import run_query

SKILLS = [
    ("Embedded C", "Embedded", "Low-level firmware and microcontroller programming."),
    ("Python", "Software", "General-purpose language for ML, tooling, and automation."),
    ("Machine Learning", "AI", "Supervised and unsupervised model development."),
    ("Computer Vision", "AI", "Image understanding for perception systems."),
    ("Edge AI", "AI", "On-device inference, quantization, and deployment."),
    ("FPGA", "Hardware", "Hardware acceleration and RTL implementation."),
    ("RTL Design", "Semiconductor", "Register-transfer level digital design."),
    ("Verification", "Semiconductor", "Functional verification of digital systems."),
    ("VLSI", "Semiconductor", "Very-large-scale integration design flow."),
    ("Computer Architecture", "Hardware", "Processor and SoC architecture."),
    ("Embedded AI", "Embedded", "AI workloads on constrained devices."),
    ("TensorFlow Lite", "AI", "Mobile and edge model runtime."),
    ("Linux", "Systems", "Embedded and server Linux administration."),
    ("Project Leadership", "Core", "Planning, communication, and delivery."),
]

ROLES = [
    ("Firmware Engineer", "Engineering", "Embedded C, Linux, board bring-up."),
    ("ML Engineer", "AI", "Python, ML, model training pipelines."),
    ("Edge AI Engineer", "AI", "Edge AI, CV, Embedded C, FPGA."),
    ("FPGA Engineer", "Hardware", "FPGA, RTL, verification."),
    ("VLSI Design Engineer", "Semiconductor", "RTL, VLSI, architecture."),
    ("Computer Vision Engineer", "AI", "CV, Python, ML."),
    ("Project Leadership", "Strategy", "Program management, delivery, and roadmap execution."),
]

PROJECTS = [
    ("Industrial Sensor Hub", "Embedded", "Firmware for factory sensors."),
    ("Vision QC Pilot", "AI", "Camera-based quality inspection."),
    ("Edge Inference Board", "Hardware", "FPGA-assisted inference prototype."),
    ("People Analytics Platform", "Software", "Internal HR analytics."),
    ("New Product: Edge-AI Camera", "Strategy", "12-month Edge-AI launch."),
]

# public_id, name, dept, role, years, performance, certs, skill proficiencies, project names
EMPLOYEES = [
    ("104", "A. Raman", "Engineering", "Firmware Engineer", 7, 0.88, "Embedded Linux; C Certified",
     {"Embedded C": 0.86, "Python": 0.72, "Linux": 0.8, "Machine Learning": 0.55, "Computer Vision": 0.34, "Edge AI": 0.22},
     ["Industrial Sensor Hub", "Vision QC Pilot"]),
    ("118", "M. Iyer", "AI", "ML Engineer", 5, 0.84, "TensorFlow Developer",
     {"Python": 0.9, "Machine Learning": 0.82, "Computer Vision": 0.6, "Edge AI": 0.3, "TensorFlow Lite": 0.45},
     ["Vision QC Pilot", "People Analytics Platform"]),
    ("131", "S. Kapoor", "Hardware", "FPGA Engineer", 9, 0.81, "Xilinx Certified",
     {"FPGA": 0.88, "RTL Design": 0.8, "Verification": 0.7, "Embedded C": 0.5, "Edge AI": 0.28},
     ["Edge Inference Board"]),
    ("142", "N. Desai", "Engineering", "Firmware Engineer", 4, 0.79, "",
     {"Embedded C": 0.78, "Python": 0.61, "Linux": 0.66, "Computer Architecture": 0.4},
     ["Industrial Sensor Hub"]),
    ("156", "P. Chen", "AI", "Computer Vision Engineer", 6, 0.86, "OpenCV Specialist",
     {"Python": 0.85, "Computer Vision": 0.8, "Machine Learning": 0.7, "Edge AI": 0.35},
     ["Vision QC Pilot", "New Product: Edge-AI Camera"]),
    ("167", "R. Mehta", "Semiconductor", "VLSI Design Engineer", 8, 0.83, "VLSI Pro",
     {"VLSI": 0.84, "RTL Design": 0.78, "Computer Architecture": 0.72, "FPGA": 0.4, "Verification": 0.55},
     ["Edge Inference Board"]),
    ("178", "L. Banerjee", "Engineering", "Firmware Engineer", 3, 0.76, "",
     {"Embedded C": 0.7, "Python": 0.58, "Linux": 0.5, "Embedded AI": 0.2},
     ["Industrial Sensor Hub"]),
    ("189", "K. Sharma", "AI", "ML Engineer", 4, 0.8, "AWS ML",
     {"Python": 0.88, "Machine Learning": 0.74, "TensorFlow Lite": 0.5, "Project Leadership": 0.45},
     ["People Analytics Platform", "Vision QC Pilot"]),
    ("201", "J. Thomas", "Hardware", "FPGA Engineer", 5, 0.77, "",
     {"FPGA": 0.62, "RTL Design": 0.55, "Embedded C": 0.48, "Verification": 0.5},
     ["Edge Inference Board"]),
    ("214", "H. Patel", "AI", "ML Engineer", 2, 0.74, "",
     {"Python": 0.8, "Machine Learning": 0.52, "Computer Vision": 0.28, "Edge AI": 0.12},
     ["People Analytics Platform"]),
    ("226", "G. Singh", "Engineering", "Firmware Engineer", 11, 0.9, "ARM Accredited",
     {"Embedded C": 0.92, "Linux": 0.85, "Computer Architecture": 0.7, "Embedded AI": 0.4, "Python": 0.6},
     ["Industrial Sensor Hub", "New Product: Edge-AI Camera"]),
    ("238", "F. Nair", "Strategy", "Project Leadership", 10, 0.87, "PMP",
     {"Project Leadership": 0.9, "Python": 0.4, "Machine Learning": 0.25},
     ["New Product: Edge-AI Camera", "People Analytics Platform"]),
]


ROLE_SKILL_MAP = {
    "Firmware Engineer": {"Embedded C": 0.85, "Linux": 0.7, "Python": 0.5},
    "ML Engineer": {"Python": 0.85, "Machine Learning": 0.85, "TensorFlow Lite": 0.5},
    "Edge AI Engineer": {"Edge AI": 0.85, "Computer Vision": 0.7, "Embedded C": 0.65, "FPGA": 0.55, "Machine Learning": 0.7, "Python": 0.75},
    "FPGA Engineer": {"FPGA": 0.9, "RTL Design": 0.75, "Verification": 0.65},
    "VLSI Design Engineer": {"VLSI": 0.85, "RTL Design": 0.8, "Computer Architecture": 0.7},
    "Computer Vision Engineer": {"Computer Vision": 0.85, "Python": 0.75, "Machine Learning": 0.7},
    "Project Leadership": {"Project Leadership": 0.85, "Python": 0.4, "Machine Learning": 0.3},
}


def seed_postgres(db: Session) -> None:
    if db.query(Employee).count() > 0:
        return

    skill_by_name = {}
    for name, category, desc in SKILLS:
        s = Skill(name=name, category=category, description=desc)
        db.add(s)
        skill_by_name[name] = s

    role_by_name = {}
    for name, dept, desc in ROLES:
        r = Role(name=name, department=dept, description=desc)
        db.add(r)
        role_by_name[name] = r

    project_by_name = {}
    for name, domain, desc in PROJECTS:
        p = Project(name=name, domain=domain, description=desc)
        db.add(p)
        project_by_name[name] = p

    db.flush()

    for role_name, skills in ROLE_SKILL_MAP.items():
        for skill_name, level in skills.items():
            db.execute(
                role_skills.insert().values(
                    role_id=role_by_name[role_name].id,
                    skill_id=skill_by_name[skill_name].id,
                    required_level=level,
                )
            )

    for row in EMPLOYEES:
        public_id, name, dept, role, years, perf, certs, profs, projects = row
        emp = Employee(
            public_id=public_id,
            name=name,
            department=dept,
            current_role=role,
            years_experience=years,
            performance=perf,
            certifications=certs,
        )
        db.add(emp)
        db.flush()
        for skill_name, level in profs.items():
            db.execute(
                employee_skills.insert().values(
                    employee_id=emp.id,
                    skill_id=skill_by_name[skill_name].id,
                    proficiency=level,
                )
            )
        for pname in projects:
            db.execute(
                employee_projects.insert().values(
                    employee_id=emp.id,
                    project_id=project_by_name[pname].id,
                )
            )

    db.commit()


def seed_neo4j(db: Session) -> None:
    run_query("MATCH (n) DETACH DELETE n")

    for skill in db.query(Skill).all():
        run_query(
            "MERGE (s:Skill {id: $id}) SET s.name = $name, s.category = $category",
            id=f"skill-{skill.id}",
            name=skill.name,
            category=skill.category,
        )
    for role in db.query(Role).all():
        run_query(
            "MERGE (r:Role {id: $id}) SET r.name = $name, r.department = $department",
            id=f"role-{role.id}",
            name=role.name,
            department=role.department,
        )
    for project in db.query(Project).all():
        run_query(
            "MERGE (p:Project {id: $id}) SET p.name = $name, p.domain = $domain",
            id=f"project-{project.id}",
            name=project.name,
            domain=project.domain,
        )
    for emp in db.query(Employee).all():
        run_query(
            "MERGE (e:Employee {id: $id}) SET e.name = $name, e.public_id = $pid, e.department = $dept, e.role = $role",
            id=f"emp-{emp.id}",
            name=emp.name,
            pid=emp.public_id,
            dept=emp.department,
            role=emp.current_role,
        )

    for row in db.execute(employee_skills.select()).mappings():
        run_query(
            """
            MATCH (e:Employee {id: $eid}), (s:Skill {id: $sid})
            MERGE (e)-[r:HAS_SKILL]->(s)
            SET r.proficiency = $p
            """,
            eid=f"emp-{row['employee_id']}",
            sid=f"skill-{row['skill_id']}",
            p=row["proficiency"],
        )
    for row in db.execute(employee_projects.select()).mappings():
        run_query(
            """
            MATCH (e:Employee {id: $eid}), (p:Project {id: $pid})
            MERGE (e)-[:WORKS_ON]->(p)
            """,
            eid=f"emp-{row['employee_id']}",
            pid=f"project-{row['project_id']}",
        )
    for row in db.execute(role_skills.select()).mappings():
        run_query(
            """
            MATCH (r:Role {id: $rid}), (s:Skill {id: $sid})
            MERGE (r)-[rel:REQUIRES]->(s)
            SET rel.level = $level
            """,
            rid=f"role-{row['role_id']}",
            sid=f"skill-{row['skill_id']}",
            level=row["required_level"],
        )
    for emp in db.query(Employee).all():
        role = db.query(Role).filter(Role.name == emp.current_role).first()
        if role:
            run_query(
                """
                MATCH (e:Employee {id: $eid}), (r:Role {id: $rid})
                MERGE (e)-[:IN_ROLE]->(r)
                """,
                eid=f"emp-{emp.id}",
                rid=f"role-{role.id}",
            )
