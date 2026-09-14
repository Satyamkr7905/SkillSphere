"""Seed Postgres + Neo4j independently of server startup."""

from app.database import Base, SessionLocal, engine
from app.seed import seed_neo4j, seed_postgres

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_postgres(db)
        seed_neo4j(db)
        print("Seed complete.")
    finally:
        db.close()
