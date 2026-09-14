from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Project, Role, Skill
from app.schemas import ProjectOut, RoleOut, SkillOut

skills_router = APIRouter(prefix="/api/skills", tags=["skills"])
roles_router = APIRouter(prefix="/api/roles", tags=["roles"])
projects_router = APIRouter(prefix="/api/projects", tags=["projects"])


@skills_router.get("", response_model=list[SkillOut])
def list_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()


@roles_router.get("", response_model=list[RoleOut])
def list_roles(db: Session = Depends(get_db)):
    rows = []
    for role in db.query(Role).all():
        rows.append(
            RoleOut(
                id=role.id,
                name=role.name,
                department=role.department,
                description=role.description,
                skills=[s.name for s in role.skills],
            )
        )
    return rows


@projects_router.get("", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()
