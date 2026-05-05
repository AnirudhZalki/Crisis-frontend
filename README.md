# CrisisMind AI 🚨

### LangGraph-Based Multi-Agent Disaster Decision Simulator

> Simulate disaster. Compare actions. Predict outcomes. Explain the safest decision.

Built for **Hack Fusion 2025** under the **AI/ML Innovation** theme.

---

## What is CrisisMind AI?

CrisisMind AI is a real-time disaster decision support system. A crisis officer enters disaster details — flood type, affected population, rescue teams, hospital capacity — and the system runs a **LangGraph multi-agent workflow** that coordinates 10 expert AI agents, generates 3 decision paths, scores them using explainable formulas, and recommends the safest action with full reasoning.

**No black box. No guessing. Full explainability.**

---

## Live Demo Flow

1. Enter disaster details (or click **Load Demo Flood Scenario**)
2. Click **Run LangGraph Simulation**
3. See all 13 LangGraph agents execute in real time
4. Get ranked decision paths with scores
5. Read the AI explanation for why the best path was chosen

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, Uvicorn |
| AI Orchestration | LangGraph 1.x (StateGraph) |
| Agent Logic | Deterministic Python (no LLM required) |
| Database | SQLite |
| Frontend | React + Vite |
| Styling | Custom CSS (dark dashboard theme) |

---

## Project Structure

```
crisismind-ai/
├── backend/
│   ├── main.py                  # FastAPI server
│   ├── langgraph_workflow.py    # LangGraph StateGraph (13 nodes)
│   ├── agents.py                # 5 expert agents
│   ├── scoring.py               # Weighted scoring engine
│   ├── simulator.py             # Workflow orchestrator
│   ├── database.py              # SQLite persistence
│   ├── schemas.py               # Pydantic models
│   ├── graph_state.py           # LangGraph typed state
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── api.js
│       ├── styles.css
│       └── components/
│           ├── CrisisForm.jsx
│           ├── RecommendationCard.jsx
│           ├── WorkflowTrace.jsx
│           ├── DecisionComparison.jsx
│           ├── AgentSuggestions.jsx
│           ├── ExplainabilityBox.jsx
│           └── History.jsx
└── docs/
    ├── architecture.md
    ├── langgraph-flow.md
    └── presentation-script.md
```

---

## LangGraph Workflow

```
START
  → validate_input
  → scenario_generator
  → medical_agent
  → rescue_agent
  → transport_agent
  → resource_agent
  → safety_agent
  → decision_path
  → scoring
  → coordinator
  → explainability
  → persistence
  → response
END
```

Each node is a deterministic Python expert agent. No LLM API key required for MVP.

---

## Expert Agents

| Agent | Role |
|-------|------|
| Medical Agent | Analyzes hospital capacity vs estimated injured |
| Rescue Agent | Analyzes team availability and evacuation strategy |
| Transport Agent | Analyzes blocked roads and safe routes |
| Resource Agent | Analyzes supplies, budget, resource pressure |
| Safety Agent | Analyzes vulnerable population priorities |

---

## Decision Paths

| Path | Strategy | Wins When |
|------|----------|-----------|
| A | Fast Mass Evacuation | Low severity, few blockages |
| B | Prioritized Evacuation + Medical Camp | High severity, hospital overload |
| C | Resource-Conservative Delayed Response | Very low severity only |

---

## Scoring Formulas

```
Final Decision Score  = 0.35 × Safety + 0.25 × Resource + 0.20 × Speed + 0.10 × Cost + 0.10 × Confidence

Risk Score            = 0.30 × Severity + 0.20 × PopExposure + 0.20 × Vulnerability
                      + 0.15 × ResourceShortage + 0.15 × DelayRisk

Success Probability   = 0.30 × Safety + 0.25 × Resource + 0.20 × Speed
                      + 0.15 × Confidence + 0.10 × (100 - Risk)
```

Risk Levels: `0–30 = Low` | `31–60 = Medium` | `61–80 = High` | `81–100 = Critical`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/simulate` | Run full LangGraph simulation |
| GET | `/history` | List all past simulations |
| GET | `/simulation/{id}` | Get one simulation by ID |

Swagger UI available at: `http://127.0.0.1:8000/docs`

---

## How to Run Locally

### Prerequisites
- Python 3.11 or 3.12
- Node.js 20 LTS or higher
- Git

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Open in Browser

- Frontend: http://localhost:5173
- Backend API: http://127.0.0.1:8000
- Swagger UI: http://127.0.0.1:8000/docs

---

## Sample Input (Demo Flood Scenario)

```json
{
  "disaster_type": "Flood",
  "location": "Zone A - Riverside District",
  "severity_level": 80,
  "affected_population": 20000,
  "vulnerable_population": 5000,
  "available_rescue_teams": 12,
  "required_rescue_teams": 15,
  "hospital_capacity": 500,
  "estimated_injured": 700,
  "blocked_roads": 4,
  "weather_condition": "Heavy rainfall expected for 6 hours",
  "response_time_limit": 6,
  "budget_level": "Medium"
}
```

### Expected Output

```
Recommended Path : B — Prioritized Evacuation + Medical Camp
Final Score      : 71.1 / 100
Success Prob     : 82%
Risk Level       : Medium
```

---

## Key Features for Judges

- **Real LangGraph multi-agent workflow** — not a mock, actual StateGraph with 13 nodes
- **Explainable AI** — every score has a reason, every recommendation has a justification
- **Human-in-the-loop** — approval step built into the explanation
- **Zero LLM dependency** — works fully offline, no API keys needed
- **Simulation history** — every run is saved and reviewable
- **Professional dashboard** — dark theme, score cards, comparison table, agent cards

---

## Team

Built with passion for **Hack Fusion 2025** — AI/ML Innovation Track

> "Our MVP uses LangGraph to coordinate deterministic expert agents, making the workflow reliable and explainable.
> Each agent can later be upgraded with an LLM for richer reasoning, while keeping the same graph architecture."
