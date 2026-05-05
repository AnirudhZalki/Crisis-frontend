# CrisisMind AI 🚨

### LangGraph-Based Multi-Agent Disaster Decision Simulator with Vectorless RAG Weather Context

> Simulate disaster. Compare actions. Predict outcomes. Explain the safest decision. **Now with live weather context integration.**

Built for **Hack Fusion 2025** under the **AI/ML Innovation** theme.

---

## What is CrisisMind AI?

CrisisMind AI is a real-time disaster decision support system that now includes **vectorless RAG for weather context retrieval**. A crisis officer enters disaster details — flood type, affected population, rescue teams, hospital capacity — and the system:

1. **Retrieves structured weather context** based on disaster type and location
2. **Runs a LangGraph multi-agent workflow** coordinating 10 expert AI agents
3. **Applies weather-adjusted scoring** to 3 decision paths
4. **Generates weather-aware agent suggestions**
5. **Provides LLM-enhanced explanations** using retrieved weather data

**No black box. No guessing. Full explainability. Weather-aware decisions.**

---

## 🌦️ Vectorless RAG Weather Context Feature

**What it does:**
- Retrieves structured weather data based on disaster type (flood → heavy rain, fire → dry/windy, earthquake → dust risk)
- Applies weather adjustments to risk scores, route safety, and travel feasibility
- Integrates weather context into agent suggestions and LLM explanations
- Works offline with demo fallback — no API keys or internet required

**Why it's innovative:**
- **Vectorless RAG**: Direct structured data retrieval, not vector similarity search
- **Prevents LLM hallucination**: LLMs explain weather impact, don't invent it
- **Offline-first**: Demo weather logic ensures app works without connectivity
- **Explainable adjustments**: Weather deltas are transparent and clamped

**Weather Logic:**
- **Flood disasters**: Heavy rainfall (28mm), high wind (32km/h), reduced visibility
- **Fire disasters**: Dry conditions, strong winds (38km/h), medium risk
- **Earthquake disasters**: Clear weather with dust risk, moderate visibility impact
- **Score adjustments**: Heavy rain (+12 risk), high wind (+8 risk), low visibility (+6 risk)

---

## Live Demo Flow

1. Enter disaster details (or click **Load Demo Flood Scenario**)
2. System **retrieves weather context** based on disaster type
3. Click **Run LangGraph Simulation**
4. See all 13 LangGraph agents execute with **weather-aware suggestions**
5. Get **weather-adjusted** decision paths with scores
6. Read the AI explanation for why the best path was chosen, **including weather impact**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, Uvicorn |
| AI Orchestration | LangGraph 1.x (StateGraph) |
| Agent Logic | Deterministic Python + Weather Context |
| Weather Retrieval | Vectorless RAG (Demo Fallback) |
| Database | SQLite |
| Frontend | React + Vite |
| Styling | Custom CSS (dark dashboard theme) |

---

## Project Structure

```
crisismind-ai/
├── backend/
│   ├── main.py                  # FastAPI server
│   ├── langgraph_workflow.py    # LangGraph StateGraph (14 nodes)
│   ├── agents.py                # 5 expert agents (weather-aware)
│   ├── scoring.py               # Weather-adjusted scoring engine
│   ├── simulator.py             # Workflow orchestrator
│   ├── database.py              # SQLite persistence
│   ├── schemas.py               # Pydantic models
│   ├── graph_state.py           # LangGraph typed state
│   ├── tools/
│   │   └── weather_retriever.py # Vectorless RAG weather logic
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
│           ├── WeatherContextCard.jsx    # NEW: Weather display
│           └── History.jsx
└── docs/
    ├── architecture.md
    ├── langgraph-flow.md
    └── presentation-script.md
```

---

## LangGraph Workflow (Updated)

```
START
  → validate_input
  → weather_retriever          # NEW: Retrieves weather context
  → resource_context
  → scenario_generator
  → medical_agent (weather-aware)
  → rescue_agent (weather-aware)
  → transport_agent (weather-aware)
  → shelter_agent
  → ngo_agent
  → fire_safety_agent (weather-aware)
  → resource_agent
  → safety_agent (weather-aware)
  → decision_path
  → scoring (weather-adjusted)
  → route_planner
  → coordinator
  → ollama_explanation (weather-enhanced)
  → persistence
  → response
END
```

Each node is a deterministic Python expert agent. Weather context enhances decision-making without requiring LLM API keys.

---

## Expert Agents (Weather-Aware)

| Agent | Role | Weather Integration |
|-------|------|-------------------|
| Medical Agent | Analyzes hospital capacity vs estimated injured | Warns about ambulance delays in heavy rain |
| Rescue Agent | Analyzes team availability and evacuation strategy | Suggests boats/life jackets for floods, weather risk notes |
| Transport Agent | Analyzes blocked roads and safe routes | Avoids low-lying routes in rain, visibility warnings |
| Resource Agent | Analyzes supplies, budget, resource pressure | Standard resource analysis |
| Safety Agent | Analyzes vulnerable population priorities | Weather risk warnings for high-risk conditions |
| Fire & Safety Agent | Analyzes danger zones and safety protocols | Weather risk integration for fire spread |

---

## Decision Paths (Weather-Adjusted)

| Path | Strategy | Wins When | Weather Impact |
|------|----------|-----------|----------------|
| A | Fast Mass Evacuation | Low severity, few blockages | Most affected by heavy rain (route safety -15) |
| B | Prioritized Evacuation + Medical Camp | High severity, hospital overload | Moderate weather impact, prioritizes vulnerable |
| C | Resource-Conservative Delayed Response | Very low severity only | Least affected by weather conditions |

---

## Scoring Formulas (Weather-Enhanced)

```
Final Decision Score  = 0.35 × Safety + 0.25 × Resource + 0.20 × Speed + 0.10 × Cost + 0.10 × Confidence

Risk Score           += Weather Risk Delta (Heavy rain: +12, Wind: +8, Visibility: +6)
Route Safety Score   += Weather Route Safety Delta (Rain: -15, Wind: -6, Visibility: -5)
Travel Feasibility   += Weather Travel Delta (Rain: -10, Wind: -5, Visibility: -5)
Confidence Score     += Weather Confidence Delta (Weather impact: -3 to -5)

Success Probability   = 0.30 × Safety + 0.25 × Resource + 0.20 × Speed
                      + 0.15 × Confidence + 0.10 × (100 - Risk)
```

Risk Levels: `0–30 = Low` | `31–60 = Medium` | `61–80 = High` | `81–100 = Critical`

**Weather Adjustments**: All scores clamped between 0-100. Adjustments applied after base calculation.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/simulate` | Run full LangGraph simulation (includes weather context) |
| GET | `/history` | List all past simulations |
| GET | `/simulation/{id}` | Get one simulation by ID (includes weather_context in response) |
| GET | `/llm/status` | Check Ollama LLM availability |

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
  "disaster_type": "flood",
  "location": "Zone A - Riverside District",
  "severity_level": 80,
  "affected_population": 20000,
  "vulnerable_population": 5000,
  "available_rescue_teams": 12,
  "required_rescue_teams": 15,
  "hospital_capacity": 500,
  "estimated_injured": 700,
  "blocked_roads": 4,
  "weather_condition": "Heavy rainfall expected",
  "response_time_limit": 6,
  "budget_level": "Medium"
}
```

### Expected Output (Weather-Enhanced)

```json
{
  "simulation_id": "abc123",
  "disaster_type": "flood",
  "location": "Zone A - Riverside District",
  "weather_context": {
    "source": "demo_weather_retriever",
    "location": "Zone A",
    "condition": "Heavy rainfall expected",
    "rainfall_mm": 28,
    "wind_speed_kmph": 32,
    "visibility_km": 4,
    "risk_level": "High",
    "risk_note": "Heavy rainfall may increase flood risk and reduce road safety."
  },
  "recommended_path": "B",
  "final_score": 68.2,
  "success_probability": 79,
  "risk_level": "High",
  "agent_suggestions": [
    {
      "agent": "Rescue Agent",
      "suggestion": "Rescue team shortage... Boat-assisted evacuation possible... Weather alert: Heavy rainfall increases flood risk — prioritize boats and life jackets."
    }
  ]
}
```

---

## Key Features for Judges

- **🌦️ Vectorless RAG Weather Context** — Innovative weather retrieval system that prevents LLM hallucination
- **Real LangGraph multi-agent workflow** — not a mock, actual StateGraph with 14 nodes including weather integration
- **Weather-adjusted scoring** — Transparent score modifications based on retrieved weather data
- **Explainable AI** — every score has a reason, every recommendation has a justification including weather impact
- **Human-in-the-loop** — approval step built into the explanation
- **Zero external dependency** — works fully offline, no API keys needed for weather or LLM
- **Simulation history** — every run is saved and reviewable with weather context
- **Professional dashboard** — dark theme, score cards, comparison table, agent cards, weather display

---

## Innovation Highlights

### Vectorless RAG Implementation
- **No vectors, no embeddings** — Direct structured data retrieval based on disaster type
- **Demo fallback logic** — Works offline without internet or API keys
- **LLM hallucination prevention** — LLMs explain provided weather data, don't invent it
- **Transparent adjustments** — Weather deltas clearly applied to scores (clamped 0-100)

### Weather-Aware Decision Making
- **Flood scenarios**: Heavy rain detection → boat prioritization, route safety penalties
- **Fire scenarios**: Wind analysis → fire spread risk assessment
- **Earthquake scenarios**: Dust visibility impact → safety adjustments
- **Agent integration**: All relevant agents incorporate weather context in suggestions

### Technical Excellence
- **LangGraph orchestration** — 14-node workflow with weather retrieval node
- **Deterministic scoring** — Rule-based with weather modifiers
- **Frontend integration** — Dedicated weather context card with risk badges
- **API consistency** — Weather context included in all simulation responses

---

## Team

Built with passion for **Hack Fusion 2025** — AI/ML Innovation Track

> "Our enhanced MVP now features vectorless RAG for weather context retrieval, ensuring disaster response decisions are informed by realistic weather conditions without requiring external APIs. The LangGraph workflow coordinates weather-aware expert agents, making the system both reliable and explainable. Each agent suggestion and score calculation now incorporates retrieved weather data, preventing LLM hallucination while maintaining full offline capability."

---

## Repository

🔗 **GitHub**: https://github.com/trivenipatil658/crisismind-ai

**Latest Commit**: `1c8cdee` - Add vectorless RAG weather context feature

---

*Last updated: May 6, 2026*
