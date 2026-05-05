from typing import TypedDict, List, Any, Dict, Optional


class GraphState(TypedDict):
    input_data: Dict[str, Any]
    scenario_summary: str
    generated_scenarios: List[str]
    agent_suggestions: List[Dict[str, Any]]
    decision_paths: List[Dict[str, Any]]
    scored_paths: List[Dict[str, Any]]
    recommended_path: str
    explanation: str
    workflow_trace: List[str]
    errors: List[str]
