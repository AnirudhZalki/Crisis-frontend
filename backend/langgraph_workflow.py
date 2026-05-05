# -*- coding: utf-8 -*-
"""
LangGraph multi-agent workflow for CrisisMind AI.
All nodes are deterministic Python functions -- no LLM required for MVP.
Compatible with LangGraph 1.x
"""
from langgraph.graph import StateGraph, START, END
from graph_state import GraphState
from agents import medical_agent, rescue_agent, transport_agent, resource_agent, safety_agent, scenario_generator
from scoring import score_all_paths, get_risk_level, compute_risk_score

OK = "[OK]"

# -- Node definitions --

def validate_input_node(state: GraphState) -> GraphState:
    d = state["input_data"]
    errors = []
    if d.get("severity_level", 0) < 0 or d.get("severity_level", 0) > 100:
        errors.append("severity_level must be 0-100")
    if d.get("affected_population", 0) <= 0:
        errors.append("affected_population must be positive")
    return {**state, "errors": errors, "workflow_trace": [f"validate_input {OK}"]}


def scenario_generator_node(state: GraphState) -> GraphState:
    summary, scenarios = scenario_generator(state["input_data"])
    return {
        **state,
        "scenario_summary": summary,
        "generated_scenarios": scenarios,
        "workflow_trace": state["workflow_trace"] + [f"scenario_generator {OK}"],
    }


def medical_agent_node(state: GraphState) -> GraphState:
    result = medical_agent(state["input_data"])
    return {
        **state,
        "agent_suggestions": state.get("agent_suggestions", []) + [result],
        "workflow_trace": state["workflow_trace"] + [f"medical_agent {OK}"],
    }


def rescue_agent_node(state: GraphState) -> GraphState:
    result = rescue_agent(state["input_data"])
    return {
        **state,
        "agent_suggestions": state["agent_suggestions"] + [result],
        "workflow_trace": state["workflow_trace"] + [f"rescue_agent {OK}"],
    }


def transport_agent_node(state: GraphState) -> GraphState:
    result = transport_agent(state["input_data"])
    return {
        **state,
        "agent_suggestions": state["agent_suggestions"] + [result],
        "workflow_trace": state["workflow_trace"] + [f"transport_agent {OK}"],
    }


def resource_agent_node(state: GraphState) -> GraphState:
    result = resource_agent(state["input_data"])
    return {
        **state,
        "agent_suggestions": state["agent_suggestions"] + [result],
        "workflow_trace": state["workflow_trace"] + [f"resource_agent {OK}"],
    }


def safety_agent_node(state: GraphState) -> GraphState:
    result = safety_agent(state["input_data"])
    return {
        **state,
        "agent_suggestions": state["agent_suggestions"] + [result],
        "workflow_trace": state["workflow_trace"] + [f"safety_agent {OK}"],
    }


def decision_path_node(state: GraphState) -> GraphState:
    return {
        **state,
        "workflow_trace": state["workflow_trace"] + [f"decision_path {OK}"],
    }


def scoring_node(state: GraphState) -> GraphState:
    paths = score_all_paths(state["input_data"])
    return {
        **state,
        "scored_paths": paths,
        "workflow_trace": state["workflow_trace"] + [f"scoring {OK}"],
    }


def coordinator_node(state: GraphState) -> GraphState:
    best = max(state["scored_paths"], key=lambda p: p["final_decision_score"])
    return {
        **state,
        "recommended_path": best["path_id"],
        "workflow_trace": state["workflow_trace"] + [f"coordinator {OK}"],
    }


def explainability_node(state: GraphState) -> GraphState:
    d = state["input_data"]
    best_id = state["recommended_path"]
    best = next(p for p in state["scored_paths"] if p["path_id"] == best_id)
    risk_score = compute_risk_score(d)
    risk_level = get_risk_level(risk_score)

    reasons = []
    if best["safety_score"] >= 70:
        reasons.append(f"Safety Score is high ({best['safety_score']}/100), protecting the most lives.")
    if best["resource_score"] >= 60:
        reasons.append(f"Resource Score ({best['resource_score']}/100) shows efficient use of available teams and supplies.")
    if best["speed_score"] >= 65:
        reasons.append(f"Speed Score ({best['speed_score']}/100) ensures timely response within the {d['response_time_limit']}-hour window.")
    if best["confidence_score"] >= 75:
        reasons.append(f"Confidence Score ({best['confidence_score']}/100) reflects high model certainty for this scenario.")
    if not reasons:
        reasons.append(f"Path {best_id} achieved the highest Final Decision Score ({best['final_decision_score']}/100) across all weighted criteria.")

    warnings = []
    if d["blocked_roads"] >= 3:
        warnings.append(f"[WARNING] {d['blocked_roads']} roads are blocked -- alternate routes must be activated.")
    if d["estimated_injured"] > d["hospital_capacity"]:
        warnings.append(f"[WARNING] Hospital overload: {d['estimated_injured']} injured vs {d['hospital_capacity']} capacity.")
    if d["available_rescue_teams"] < d["required_rescue_teams"]:
        warnings.append(f"[WARNING] Rescue team shortage: {d['available_rescue_teams']} available vs {d['required_rescue_teams']} required.")
    if risk_level in ("High", "Critical"):
        warnings.append(f"[WARNING] Overall risk level is {risk_level} -- immediate action required.")

    explanation = (
        f"Path {best_id} -- '{best['name']}' is recommended with a Final Decision Score of "
        f"{best['final_decision_score']}/100.\n\n"
        "Key reasons:\n" + "\n".join(f"* {r}" for r in reasons) +
        ("\n\nRisk warnings:\n" + "\n".join(warnings) if warnings else "") +
        "\n\n[HUMAN APPROVAL REQUIRED] A senior crisis officer should review and approve this decision before execution."
    )

    return {
        **state,
        "explanation": explanation,
        "workflow_trace": state["workflow_trace"] + [f"explainability {OK}"],
    }


def persistence_node(state: GraphState) -> GraphState:
    return {
        **state,
        "workflow_trace": state["workflow_trace"] + [f"persistence {OK}"],
    }


def response_node(state: GraphState) -> GraphState:
    return {
        **state,
        "workflow_trace": state["workflow_trace"] + [f"response {OK}"],
    }


# -- Build graph --

def build_workflow():
    graph = StateGraph(GraphState)

    graph.add_node("validate_input", validate_input_node)
    graph.add_node("scenario_generator", scenario_generator_node)
    graph.add_node("medical_agent", medical_agent_node)
    graph.add_node("rescue_agent", rescue_agent_node)
    graph.add_node("transport_agent", transport_agent_node)
    graph.add_node("resource_agent", resource_agent_node)
    graph.add_node("safety_agent", safety_agent_node)
    graph.add_node("decision_path", decision_path_node)
    graph.add_node("scoring", scoring_node)
    graph.add_node("coordinator", coordinator_node)
    graph.add_node("explainability", explainability_node)
    graph.add_node("persistence", persistence_node)
    graph.add_node("response", response_node)

    graph.add_edge(START, "validate_input")
    graph.add_edge("validate_input", "scenario_generator")
    graph.add_edge("scenario_generator", "medical_agent")
    graph.add_edge("medical_agent", "rescue_agent")
    graph.add_edge("rescue_agent", "transport_agent")
    graph.add_edge("transport_agent", "resource_agent")
    graph.add_edge("resource_agent", "safety_agent")
    graph.add_edge("safety_agent", "decision_path")
    graph.add_edge("decision_path", "scoring")
    graph.add_edge("scoring", "coordinator")
    graph.add_edge("coordinator", "explainability")
    graph.add_edge("explainability", "persistence")
    graph.add_edge("persistence", "response")
    graph.add_edge("response", END)

    return graph.compile()


workflow = build_workflow()
