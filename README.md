# SkillSphere AI — AI-Powered Workforce Digital Twin

> **“Know your workforce today. Predict the skills you need tomorrow.”**

SkillSphere AI connects current employee capabilities to future business requirements through a dynamic Skill Graph, predictive demand modeling, granular gap analysis, and explainable AI recommendations.

---

## Table of Contents

- [Overview](#overview)
- [Core Mission & Value Proposition](#core-mission--value-proposition)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Quick Start Guide](#quick-start-guide)
  - [Method 1: Docker Compose (Full Stack)](#method-1-docker-compose-full-stack)
  - [Method 2: Local Development (Fastest Local Setup)](#method-2-local-development-fastest-local-setup)
- [API Reference](#api-reference)
- [Design System & Editorial Philosophy](#design-system--editorial-philosophy)
- [Team Information](#team-information)

---

## Overview

Modern enterprises face rapid technological disruption. Traditional HR platforms only catalog past achievements, leaving engineering and product leaders unable to answer critical questions:
- *Which existing engineers can transition into emerging roles (e.g., Edge AI, Quantum Computing)?*
- *What critical skill gaps will block product roadmap milestones 12–18 months from now?*
- *Should we upskill internal talent, reskill adjacent roles, or hire externally?*

**SkillSphere AI** provides a real-time **Workforce Digital Twin**: a graph-based simulation layer that models talent inventory, quantifies capability adjacencies, forecasts future skill demands, and outputs auditable, explainable transition plans.

---

## Core Mission & Value Proposition

- **Dynamic Skill Graph**: Moves beyond flat resumes by mapping multi-dimensional relationships between employees, skills, roles, and project deliverables.
- **Predictive Readiness**: Machine learning models project skill demand across 6-to-24 month horizons based on company product roadmaps and industry trend vectors.
- **Explainable Recommendations (XAI)**: Generates human-understandable transition paths detailing similarity scores, missing proficiencies, and targeted action categories (*Upskill*, *Reskill*, or *Hire*).
- **High-Fidelity Offline Resilience**: Built-in resilient mock architecture guarantees the frontend dashboard remains fully interactive even without a live backend connection.

---

## Key Features

### 1. Interactive D3 Force-Directed Skill Graph
- Visualizes multi-type nodes (`Employee`, `Skill`, `Role`, `Project`) with relationship edges (`HAS_SKILL`, `IN_ROLE`, `REQUIRES`, `WORKS_ON`).
- Features real-time physics simulation, interactive node dragging, dynamic zoom/pan (`[0.3x, 3.0x]`), and connected-component focus on hover.

### 2. Department-by-Skill Heatmap
- A high-density matrix displaying skill distribution and capability depth across key organizational departments (*Engineering*, *AI*, *Hardware*, *Semiconductor*, *Strategy*).

### 3. Gap Analysis & Severity Triage
- Automated comparison between current organizational benchmarks and required target skill levels.
- Immediate severity categorization (`Critical`, `Moderate`, `Emerging`) with color-coded tags to guide executive resourcing.

### 4. Predictive Skill Demand Timeline
- Recharts-powered multi-series forecasting tracking demand velocity for emerging disciplines (e.g., Edge AI, FPGA, Computer Vision, Machine Learning).

### 5. Explainable AI (XAI) Transition Cards
- Grounded decision justification: Inspect why an employee (e.g., *Employee #104 — A. Raman*) is recommended for transition, evaluating cosine similarity, adjacent competency overlap, and required upskilling modules.

---

## System Architecture

The platform is structured into a 6-layer decoupled intelligence pipeline:

```
┌────────────────────────────────────────────────────────┐
│               Layer 6: Presentation (UI)               │
│      React 18 • Vite • TypeScript • Tailwind CSS       │
│         Framer Motion • Recharts • D3.js v7            │
└───────────────────────────▲────────────────────────────┘
                            │ REST / JSON (HTTP Proxy)
┌───────────────────────────┴────────────────────────────┐
│              Layer 5: API & Orchestration              │
│       FastAPI (Python 3.11+) • Pydantic v2 • CORS      │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│         Layer 4: AI & Recommendation Engine            │
│  Sentence Transformers (all-MiniLM-L6-v2) / TF-IDF     │
│       Cosine Similarity • LLM Explainability API       │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│             Layer 3: Analytics & Prediction            │
│      Scikit-Learn • NetworkX Centrality • Pandas       │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│               Layer 2: Graph Intelligence              │
│      Neo4j (Cypher) Mirroring + NetworkX In-Memory     │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│              Layer 1: Relational Data Store            │
│        PostgreSQL / SQLite • SQLAlchemy 2.0 ORM        │
└────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend UI** | React 18, TypeScript, Vite | Fast, typed, reactive single-page application |
| **Styling** | Tailwind CSS | Custom Swiss editorial paper palette (`#F7F4EF`) |
| **Motion** | Framer Motion | Smooth, spring/cubic-bezier scroll and layout transitions |
| **Graph Visualization** | D3.js (v7) | Force-directed physics network with drag and zoom |
| **Charts** | Recharts | Responsive SVG timeseries and demand velocity line charts |
| **Backend API** | FastAPI, Uvicorn | High-performance asynchronous REST API with OpenAPI docs |
| **Relational Database** | PostgreSQL / SQLite | Primary relational store for workforce and catalog records |
| **Graph Database** | Neo4j 5.x | Property graph store for skill topologies & traversals |
| **Data Science / ML** | Scikit-learn, NetworkX, Pandas | TF-IDF, graph centrality, capability matrix analysis |
| **Embeddings** | Sentence Transformers | Semantic text embeddings (`all-MiniLM-L6-v2`) |
| **Containerization** | Docker, Docker Compose | Production-grade container orchestration |

---

## Project Directory Structure

```
Workforce/
├── docker-compose.yml              # Multi-container orchestration (DBs + API + Web)
├── README.md                       # Comprehensive project documentation
├── .env.example                    # Template environment variables
│
├── frontend/                       # React + TypeScript client
│   ├── index.html                  # HTML entry point with Inter font preload
│   ├── package.json                # Frontend dependencies & build scripts
│   ├── tsconfig.json               # TypeScript compiler configuration
│   ├── vite.config.ts              # Vite dev server with /api reverse proxy
│   ├── tailwind.config.js          # Custom theme tokens (paper, sage, ink, rule)
│   └── src/
│       ├── App.tsx                 # Root routes, page transitions, 404 fallback
│       ├── main.tsx                # React DOM root mounting
│       ├── index.css               # Global Tailwind directives & typography
│       ├── pages/
│       │   ├── Landing.tsx         # Product landing page with interactive hero
│       │   ├── Dashboard.tsx       # Live digital twin analytics & graph dashboard
│       │   └── Architecture.tsx    # Detailed 6-layer architecture specifications
│       ├── components/
│       │   ├── Header.tsx          # Navigation header with SPA client links
│       │   ├── Footer.tsx          # Institutional footer with team attribution
│       │   ├── SkillGraph.tsx      # Interactive D3 force simulation component
│       │   ├── HeroGraph.tsx       # Animated decorative SVG network for landing hero
│       │   ├── MotionBits.tsx      # CountUp counter & SkillBar progress components
│       │   ├── Pipeline.tsx        # Responsive architecture pipeline display
│       │   ├── Section.tsx         # Scroll-triggered reveal section wrappers
│       │   └── GapTag.tsx          # Severity status indicator pills
│       └── lib/
│           ├── api.ts              # Strongly-typed fetch client for FastAPI endpoints
│           ├── mock.ts             # Rich fallback data for resilient offline demo
│           └── motion.ts           # Framer Motion easing curve tokens
│
└── backend/                        # FastAPI Python service
    ├── Dockerfile                  # Container build recipe
    ├── requirements.txt            # Pinned requirements for production / Docker
    ├── requirements-local.txt      # Zero-compiler requirements for local dev
    ├── seed_db.py                  # Standalone database seeder script
    ├── .env.example                # Backend configuration template
    └── app/
        ├── main.py                 # FastAPI application factory & lifespan seeder
        ├── config.py               # Pydantic Settings environment configuration
        ├── database.py             # SQLAlchemy engine & session factory
        ├── models.py               # Relational ORM models & association tables
        ├── schemas.py              # Pydantic validation & response schemas
        ├── neo4j_client.py         # Lazy Neo4j connection driver
        ├── seed.py                 # Initial data fixture (employees, skills, roles)
        ├── routers/
        │   ├── catalog.py          # /api/skills, /api/roles, /api/projects
        │   ├── employees.py        # /api/employees with query filtering
        │   └── intelligence.py     # Graph, gap analysis, prediction & XAI routes
        └── services/
            ├── analytics.py        # Skill gap calculation & snapshot metrics
            ├── embeddings.py       # Sentence Transformers with TF-IDF fallback
            ├── graph_service.py    # Graph construction & NetworkX centrality
            └── recommend.py        # Recommendation matrix & XAI narrative engine
```

---

## Quick Start Guide

### Method 1: Docker Compose (Full Stack)

This is the recommended production approach. It automatically provisions PostgreSQL, Neo4j, the FastAPI backend, and an Nginx frontend container without needing any local toolchains:

```powershell
# From the project root (Workforce):
docker compose up --build
```

#### Service URLs:
- **Web Application**: [http://localhost:8080](http://localhost:8080)
- **FastAPI Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Neo4j Browser**: [http://localhost:7474](http://localhost:7474) *(Username: `neo4j`, Password: `skillsphere`)*

---

### Method 2: Local Development (Fastest Local Setup)

To run the application natively on Windows, macOS, or Linux:

#### Step 1: Start the Backend (Terminal 1)

```powershell
cd backend

# 1. Create and activate a virtual environment:
# On PowerShell:
python -m venv .venv
.\.venv\Scripts\Activate.ps1
# On Command Prompt (cmd.exe):
# .venv\Scripts\activate.bat

# 2. Install dependencies (uses built-in SQLite for zero external setup):
pip install -r requirements-local.txt

# 3. Start the FastAPI server:
uvicorn app.main:app --reload --port 8000
```
> The backend will automatically generate `skillsphere.db` using SQLite and pre-seed all employees, skills, roles, and project relationships.

#### Step 2: Start the Frontend (Terminal 2)

```powershell
cd frontend

# 1. Install dependencies:
npm install

# 2. Start the Vite development server:
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser. The Vite development proxy forwards all `/api/*` calls directly to `http://localhost:8000`.

---

## API Reference

The backend exposes 9 comprehensive REST endpoints documented interactively via OpenAPI / Swagger at `/docs`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck returning service status, timestamp, and seed state |
| `GET` | `/api/employees` | List all employees with optional `department` and `role` query filters |
| `GET` | `/api/skills` | List all cataloged enterprise skills and categories |
| `GET` | `/api/roles` | List all benchmark job roles and required competencies |
| `GET` | `/api/projects` | List all strategic projects and technological domains |
| `GET` | `/api/graph` | Multi-node force graph topology (`nodes` and `edges`) with centrality highlights |
| `GET` | `/api/gap-analysis` | Organizational skill gaps scored by benchmark deficiency and triage severity |
| `GET` | `/api/predict` | 24-month horizon predictive demand trajectories across critical disciplines |
| `GET` | `/api/recommendations`| Scored transition recommendations categorized by `Upskill`, `Reskill`, or `Hire` |
| `GET` | `/api/explain/{id}` | Explainable AI rationale, similarity calculation, and narrative for an employee |

---

## Design System & Editorial Philosophy

SkillSphere AI strictly follows a **Swiss Editorial Design System** designed for executive clarity:

- **Surface Palette**:
  - Paper Background: `#F7F4EF` (warm archival cream)
  - Pure Surface: `#FFFFFF`
  - Subtle Dividing Rule: `#E3DED6`
- **Typography & Ink**:
  - Primary Ink: `#141414` (dense near-black)
  - Secondary Ink: `#5F5A54` (graphite grey)
  - Font Families: *Inter*, *Helvetica Neue*, system neutral sans-serif
- **Signal Accents**:
  - Sage (Strong/Accent): `#2F5D50`
  - Ochre (Moderate/Attention): `#B7791F`
  - Brick Red (Critical/Deficiency): `#A33A2B`
- **Explicit Anti-Patterns**: No generic AI tropes — strictly avoided floating neon glowing cards, purple-to-blue gradients, dark sci-fi themes, or non-functional 3D assets.

---

## Team Information

**Team Gryffindor**  
**Team ID**: `161D9A799A0E`

- **Satyam Kumar**
- **Sukhdeep Singh**
- **Dhruv Oberoi**
- **Ushakirana S**

*Sapthagiri NPS University School of Engineering & Technology*  
*B.E. Electronics & Communication Engineering*

---

> *“Don’t just manage the workforce you have. Build the workforce you’ll need.”*

