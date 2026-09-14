from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Employee
from app.schemas import EmployeeOut

router = APIRouter(prefix="/api/employees", tags=["employees"])


@router.get("", response_model=list[EmployeeOut])
def list_employees(department: str | None = None, role: str | None = None, db: Session = Depends(get_db)):
    q = db.query(Employee)
    if department:
        q = q.filter(Employee.department.ilike(f"%{department}%"))
    if role:
        q = q.filter(Employee.current_role.ilike(f"%{role}%"))
    out = []
    for emp in q.all():
        out.append(
            EmployeeOut(
                id=emp.id,
                public_id=emp.public_id,
                name=emp.name,
                department=emp.department,
                current_role=emp.current_role,
                years_experience=emp.years_experience,
                performance=emp.performance,
                certifications=[c.strip() for c in emp.certifications.split(";") if c.strip()]
                if emp.certifications
                else [],
                skills=[s.name for s in emp.skills],
            )
        )
    return out
