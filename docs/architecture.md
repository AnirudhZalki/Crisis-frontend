# CrisisMind AI — Architecture

## Overview
CrisisMind AI is a LangGraph-based multi-agent disaster decision simulator built for the Hack Fusion 2025 AI/ML Innovation track.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, Uvicorn |
| AI Orchestration | LangGraph 1.x (StateGraph) |
| Agent Logic | Deterministic Python (MVP), Optional LLM |
| Database | SQLite |
| Frontend | React + Vite |
| Styling | Custom CSS (dark dashboard theme) |

## System Flow
```
User Input (React Form)
        ↓
POST /simulate (FastAPI)
        ↓
LangGraph StateGraph Workflow
        ↓
13 Nodes × 5 Expert Agents
        ↓
Scoring Engine (weighted formulas)
        ↓
Coordinator → Best Path Selected
        ↓
Explainability Engine
        ↓
SQLite Persistence
        ↓
JSON Response → React Dashboard
```

## Scoring Formula
```
Final Decision Score = 0.35×Safety + 0.25×Resource + 0.20×Speed + 0.10×Cost + 0.10×Confidence
Risk Score = 0.30×Severity + 0.20×PopExposure + 0.20×Vulnerability + 0.15×ResourceShortage + 0.15×DelayRisk
Success Probability = 0.30×Safety + 0.25×Resource + 0.20×Speed + 0.15×Confidence + 0.10×(100-Risk)
```
