from sqlalchemy import Column, Float, ForeignKey, Integer, String, Table, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

employee_skills = Table(
    "employee_skills",
    Base.metadata,
    Column("employee_id", ForeignKey("employees.id"), primary_key=True),
    Column("skill_id", ForeignKey("skills.id"), primary_key=True),
    Column("proficiency", Float, nullable=False, default=0.5),
)

employee_projects = Table(
    "employee_projects",
    Base.metadata,
    Column("employee_id", ForeignKey("employees.id"), primary_key=True),
    Column("project_id", ForeignKey("projects.id"), primary_key=True),
)

role_skills = Table(
    "role_skills",
    Base.metadata,
    Column("role_id", ForeignKey("roles.id"), primary_key=True),
    Column("skill_id", ForeignKey("skills.id"), primary_key=True),
    Column("required_level", Float, nullable=False, default=0.7),
)


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    public_id: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    department: Mapped[str] = mapped_column(String(80))
    current_role: Mapped[str] = mapped_column(String(120))
    years_experience: Mapped[float] = mapped_column(Float)
    performance: Mapped[float] = mapped_column(Float)
    certifications: Mapped[str] = mapped_column(Text, default="")

    skills = relationship("Skill", secondary=employee_skills, back_populates="employees")
    projects = relationship("Project", secondary=employee_projects, back_populates="employees")


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    category: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(Text, default="")

    employees = relationship("Employee", secondary=employee_skills, back_populates="skills")
    roles = relationship("Role", secondary=role_skills, back_populates="skills")


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    department: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(Text, default="")

    skills = relationship("Skill", secondary=role_skills, back_populates="roles")


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(160), unique=True)
    domain: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(Text, default="")

    employees = relationship("Employee", secondary=employee_projects, back_populates="projects")
