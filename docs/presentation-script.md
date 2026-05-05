# Presentation Script — CrisisMind AI

## 1-Minute Elevator Pitch
"CrisisMind AI is a real-time disaster decision simulator powered by LangGraph multi-agent AI.
A crisis officer enters disaster details — flood type, affected population, rescue teams, hospital capacity.
Our system runs 10 expert AI agents in a LangGraph workflow, generates 3 decision paths, scores them using
explainable formulas, and recommends the safest action — with full reasoning. No black box. No guessing."

## Demo Flow (3 minutes)
1. Open the dashboard → show the professional UI
2. Click "Load Demo Flood Scenario" → fields auto-fill
3. Click "Run LangGraph Simulation" → show loading state
4. Point to Workflow Trace → "These are our 10 LangGraph agents running in sequence"
5. Point to Recommended Decision Card → "Path B wins with score 78/100, 82% success probability"
6. Point to Decision Comparison Table → "Path A is fast but risky. Path C is cheap but dangerous."
7. Point to Agent Suggestions → "Each agent gives expert advice — Medical, Rescue, Transport, Resource, Safety"
8. Point to Explainability Box → "We explain WHY this path was chosen — transparent AI"
9. Point to History → "Every simulation is saved for audit and review"

## Key Technical Points for Judges
- LangGraph StateGraph with 13 nodes and typed state
- 5 deterministic expert agents (no LLM dependency for MVP)
- Weighted scoring formulas — fully explainable
- FastAPI backend with SQLite persistence
- React dashboard with real-time results
- Human-in-the-loop approval concept built in

## Q&A Preparation
Q: Why LangGraph?
A: LangGraph gives us a structured, auditable multi-agent workflow. Each agent's output flows into the next via shared state — exactly how real crisis command centers work.

Q: Does it need an API key?
A: No. The MVP uses deterministic Python agents. LLM enhancement is optional via .env file.

Q: How is this different from a simple form?
A: The LangGraph workflow coordinates 10 agents, each analyzing a different dimension of the crisis. The scoring engine uses 5 weighted formulas. The result is explainable, ranked, and auditable — not just a lookup table.

Q: Can this scale to real disasters?
A: Yes. Each deterministic agent can be upgraded to an LLM agent with the same graph architecture. The backend is stateless and can be deployed to AWS Lambda or EC2.
