from __future__ import annotations

from pydantic import BaseModel


class EmployeeOut(BaseModel):
    id: int
    public_id: str
    name: str
    department: str
    current_role: str
    years_experience: float
    performance: float
    certifications: list[str]
    skills: list[str]

    class Config:
        from_attributes = True


class SkillOut(BaseModel):
    id: int
    name: str
    category: str
    description: str

    class Config:
        from_attributes = True


class RoleOut(BaseModel):
    id: int
    name: str
    department: str
    description: str
    skills: list[str]

    class Config:
        from_attributes = True


class ProjectOut(BaseModel):
    id: int
    name: str
    domain: str
    description: str

    class Config:
        from_attributes = True


class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    group: str


class GraphEdge(BaseModel):
    source: str
    target: str
    relation: str


class GraphOut(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]


class GapItem(BaseModel):
    skill: str
    current: float
    required: float
    gap: float
    severity: str


class GapAnalysisOut(BaseModel):
    scenario: str
    items: list[GapItem]
    conclusion: str


class PredictItem(BaseModel):
    skill: str
    demand: int
    horizon_months: int


class PredictOut(BaseModel):
    scenario: str
    series: list[PredictItem]


class RecommendationOut(BaseModel):
    employee_id: str
    name: str
    current_role: str
    target_role: str
    action: str
    department: str
    readiness: str
    similarity: float
    missing_skills: list[str]


class ExplainOut(BaseModel):
    employee_id: str
    name: str
    action: str
    target_role: str
    reasons: list[str]
    missing_skills: list[str]
    similarity: float
    readiness: str
    narrative: str
