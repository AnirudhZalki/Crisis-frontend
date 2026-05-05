from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict


class DisasterInput(BaseModel):
    disaster_type: str = Field(..., example="Flood")
    location: str = Field(..., example="Zone A")
    severity_level: int = Field(..., ge=0, le=100, example=80)
    affected_population: int = Field(..., example=20000)
    vulnerable_population: int = Field(..., example=5000)
    available_rescue_teams: int = Field(..., example=12)
    required_rescue_teams: int = Field(..., example=15)
    hospital_capacity: int = Field(..., example=500)
    estimated_injured: int = Field(..., example=700)
    blocked_roads: int = Field(..., example=4)
    weather_condition: str = Field(..., example="Heavy rainfall expected for 6 hours")
    response_time_limit: int = Field(..., example=6)
    budget_level: str = Field(..., example="Medium")


class AgentSuggestion(BaseModel):
    agent: str
    suggestion: str
    pros: List[str]
    cons: List[str]


class DecisionPath(BaseModel):
    path_id: str
    name: str
    description: str
    safety_score: float
    speed_score: float
    resource_score: float
    cost_score: float
    confidence_score: float
    risk_score: float
    success_probability: float
    failure_probability: float
    final_decision_score: float
    rank: int
    pros: List[str]
    cons: List[str]


class SimulationResponse(BaseModel):
    simulation_id: str
    disaster_type: str
    location: str
    scenario_summary: str
    generated_scenarios: List[str]
    agent_suggestions: List[AgentSuggestion]
    decision_paths: List[DecisionPath]
    recommended_path: str
    explanation: str
    risk_level: str
    workflow_trace: List[str]
    created_at: str


class SimulationHistoryItem(BaseModel):
    simulation_id: str
    disaster_type: str
    location: str
    recommended_path: str
    final_score: float
    risk_level: str
    created_at: str
