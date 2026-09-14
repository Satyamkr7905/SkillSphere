from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.analytics import gap_analysis
from app.services.graph_service import centrality_highlights, graph_from_neo4j, graph_from_postgres
from app.services.recommend import build_recommendations, demand_forecast, explain_employee

graph_router = APIRouter(prefix="/api/graph", tags=["graph"])
gap_router = APIRouter(prefix="/api/gap-analysis", tags=["gap"])
predict_router = APIRouter(prefix="/api/predict", tags=["predict"])
recs_router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])
explain_router = APIRouter(prefix="/api/explain", tags=["explain"])


@graph_router.get("")
def get_graph(db: Session = Depends(get_db)):
    graph = graph_from_neo4j() or graph_from_postgres(db)
    return {"graph": graph, "central": centrality_highlights(graph)}


@gap_router.get("")
def get_gaps(db: Session = Depends(get_db)):
    return gap_analysis(db)


@predict_router.get("")
def get_predict():
    return demand_forecast()


@recs_router.get("")
def get_recommendations(action: str | None = None, department: str | None = None, db: Session = Depends(get_db)):
    recs = build_recommendations(db)
    if action:
        recs = [r for r in recs if r.action.lower() == action.lower()]
    if department:
        recs = [r for r in recs if department.lower() in r.department.lower()]
    return recs


@explain_router.get("/{employee_id}")
async def get_explain(employee_id: str, db: Session = Depends(get_db)):
    data = await explain_employee(db, employee_id)
    if not data:
        raise HTTPException(status_code=404, detail="Employee not found")
    return data
