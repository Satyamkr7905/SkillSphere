from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.neo4j_client import close_driver
from app.routers.catalog import projects_router, roles_router, skills_router
from app.routers.employees import router as employees_router
from app.routers.intelligence import (
    explain_router,
    gap_router,
    graph_router,
    predict_router,
    recs_router,
)
from app.seed import seed_neo4j, seed_postgres


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    if settings.seed_on_startup:
        db = SessionLocal()
        try:
            seed_postgres(db)
            try:
                seed_neo4j(db)
            except Exception:
                # Graph store is optional at boot; Postgres remains source of truth.
                pass
        finally:
            db.close()
    yield
    close_driver()


app = FastAPI(title="SkillSphere AI", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees_router)
app.include_router(skills_router)
app.include_router(roles_router)
app.include_router(projects_router)
app.include_router(graph_router)
app.include_router(gap_router)
app.include_router(predict_router)
app.include_router(recs_router)
app.include_router(explain_router)


@app.get("/api/health")
def health():
    return {"status": "ok", "product": "SkillSphere AI"}
