from __future__ import annotations

import networkx as nx
from sqlalchemy.orm import Session

from app.models import Employee, Project, Role, Skill, employee_projects, employee_skills, role_skills
from app.neo4j_client import run_query
from app.schemas import GraphEdge, GraphNode, GraphOut


def graph_from_postgres(db: Session) -> GraphOut:
    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []

    for emp in db.query(Employee).all():
        nodes.append(
            GraphNode(
                id=f"emp-{emp.id}",
                label=f"{emp.name} (#{emp.public_id})",
                type="employee",
                group=emp.department,
            )
        )
    for skill in db.query(Skill).all():
        nodes.append(GraphNode(id=f"skill-{skill.id}", label=skill.name, type="skill", group=skill.category))
    for role in db.query(Role).all():
        nodes.append(GraphNode(id=f"role-{role.id}", label=role.name, type="role", group=role.department))
    for project in db.query(Project).all():
        nodes.append(GraphNode(id=f"project-{project.id}", label=project.name, type="project", group=project.domain))

    for row in db.execute(employee_skills.select()).mappings():
        edges.append(
            GraphEdge(
                source=f"emp-{row['employee_id']}",
                target=f"skill-{row['skill_id']}",
                relation="HAS_SKILL",
            )
        )
    for row in db.execute(employee_projects.select()).mappings():
        edges.append(
            GraphEdge(
                source=f"emp-{row['employee_id']}",
                target=f"project-{row['project_id']}",
                relation="WORKS_ON",
            )
        )
    for row in db.execute(role_skills.select()).mappings():
        edges.append(
            GraphEdge(
                source=f"role-{row['role_id']}",
                target=f"skill-{row['skill_id']}",
                relation="REQUIRES",
            )
        )
    for emp in db.query(Employee).all():
        role = db.query(Role).filter(Role.name == emp.current_role).first()
        if role:
            edges.append(GraphEdge(source=f"emp-{emp.id}", target=f"role-{role.id}", relation="IN_ROLE"))

    return GraphOut(nodes=nodes, edges=edges)


def graph_from_neo4j() -> GraphOut | None:
    try:
        node_rows = run_query(
            """
            MATCH (n)
            RETURN n.id AS id, coalesce(n.name, n.id) AS label,
                   labels(n)[0] AS type, coalesce(n.department, n.category, n.domain, '') AS group
            """
        )
        edge_rows = run_query(
            """
            MATCH (a)-[r]->(b)
            RETURN a.id AS source, b.id AS target, type(r) AS relation
            """
        )
        if not node_rows:
            return None
        type_map = {"Employee": "employee", "Skill": "skill", "Role": "role", "Project": "project"}
        nodes = [
            GraphNode(
                id=row["id"],
                label=row["label"],
                type=type_map.get(row["type"], (row["type"] or "node").lower()),
                group=row["group"] or "",
            )
            for row in node_rows
        ]
        edges = [
            GraphEdge(source=row["source"], target=row["target"], relation=row["relation"])
            for row in edge_rows
        ]
        return GraphOut(nodes=nodes, edges=edges)
    except Exception:
        return None


def centrality_highlights(graph: GraphOut) -> list[str]:
    g = nx.Graph()
    for n in graph.nodes:
        g.add_node(n.id)
    for e in graph.edges:
        g.add_edge(e.source, e.target)
    if g.number_of_nodes() == 0:
        return []
    scores = nx.degree_centrality(g)
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:6]
    labels = {n.id: n.label for n in graph.nodes}
    return [labels[i] for i, _ in ranked]
