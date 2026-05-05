def clamp(value: float) -> float:
    return max(0.0, min(100.0, value))


def get_risk_level(risk_score: float) -> str:
    if risk_score <= 30:
        return "Low"
    elif risk_score <= 60:
        return "Medium"
    elif risk_score <= 80:
        return "High"
    return "Critical"


def compute_risk_score(d: dict) -> float:
    severity = d["severity_level"]
    pop_exposure = min(100, d["affected_population"] / 500)
    vulnerability = min(100, (d["vulnerable_population"] / max(d["affected_population"], 1)) * 100)
    team_shortage = max(0, d["required_rescue_teams"] - d["available_rescue_teams"])
    resource_shortage = min(100, (team_shortage / max(d["required_rescue_teams"], 1)) * 100)
    delay_risk = min(100, (d["blocked_roads"] / 10) * 100)

    score = (
        0.30 * severity
        + 0.20 * pop_exposure
        + 0.20 * vulnerability
        + 0.15 * resource_shortage
        + 0.15 * delay_risk
    )
    return clamp(score)


def compute_confidence_score(d: dict) -> float:
    # Data completeness: all fields present = 100
    data_completeness = 90.0
    # Historical similarity based on known disaster types
    known_types = ["flood", "earthquake", "fire", "cyclone", "landslide", "tsunami"]
    historical_similarity = 80.0 if d["disaster_type"].lower() in known_types else 60.0
    agent_agreement = 85.0
    model_certainty = 80.0

    score = (
        0.30 * data_completeness
        + 0.30 * historical_similarity
        + 0.20 * agent_agreement
        + 0.20 * model_certainty
    )
    return clamp(score)


def score_path_a(d: dict, base_risk: float, confidence: float) -> dict:
    """Fast Mass Evacuation"""
    team_ratio = min(1.0, d["available_rescue_teams"] / max(d["required_rescue_teams"], 1))
    road_penalty = d["blocked_roads"] * 5
    hospital_overload = max(0, d["estimated_injured"] - d["hospital_capacity"])
    overload_penalty = min(40, (hospital_overload / max(d["hospital_capacity"], 1)) * 40)

    safety = clamp(55 + team_ratio * 20 - overload_penalty * 0.5)
    speed = clamp(85 - road_penalty)
    resource = clamp(50 - (1 - team_ratio) * 20)
    cost = clamp(40 - (d["budget_level"] == "Low") * 15)
    risk = clamp(base_risk + 5)
    conf = clamp(confidence - 5)

    success = clamp(0.30 * safety + 0.25 * resource + 0.20 * speed + 0.15 * conf + 0.10 * (100 - risk))
    final = clamp(0.35 * safety + 0.25 * resource + 0.20 * speed + 0.10 * cost + 0.10 * conf)

    return {
        "path_id": "A",
        "name": "Fast Mass Evacuation",
        "description": "Evacuate maximum people quickly using all available routes and teams.",
        "safety_score": round(safety, 1),
        "speed_score": round(speed, 1),
        "resource_score": round(resource, 1),
        "cost_score": round(cost, 1),
        "confidence_score": round(conf, 1),
        "risk_score": round(risk, 1),
        "success_probability": round(success, 1),
        "failure_probability": round(100 - success, 1),
        "final_decision_score": round(final, 1),
        "pros": ["Fast response", "Reduces immediate exposure", "Covers large population"],
        "cons": ["Can overload roads and hospitals", "Higher resource pressure", "Less focus on vulnerable groups"],
    }


def score_path_b(d: dict, base_risk: float, confidence: float) -> dict:
    """Prioritized Evacuation + Medical Camp"""
    team_ratio = min(1.0, d["available_rescue_teams"] / max(d["required_rescue_teams"], 1))
    hospital_overload = max(0, d["estimated_injured"] - d["hospital_capacity"])
    medical_bonus = min(20, (hospital_overload / max(d["hospital_capacity"], 1)) * 20)

    safety = clamp(70 + team_ratio * 15 + medical_bonus * 0.5)
    speed = clamp(70 - d["blocked_roads"] * 3)
    resource = clamp(65 - (1 - team_ratio) * 15)
    cost = clamp(50 - (d["budget_level"] == "Low") * 10)
    risk = clamp(base_risk - 10)
    conf = clamp(confidence + 5)

    success = clamp(0.30 * safety + 0.25 * resource + 0.20 * speed + 0.15 * conf + 0.10 * (100 - risk))
    final = clamp(0.35 * safety + 0.25 * resource + 0.20 * speed + 0.10 * cost + 0.10 * conf)

    return {
        "path_id": "B",
        "name": "Prioritized Evacuation + Medical Camp",
        "description": "Evacuate vulnerable and high-risk people first, set up temporary medical camp, use alternate safe routes.",
        "safety_score": round(safety, 1),
        "speed_score": round(speed, 1),
        "resource_score": round(resource, 1),
        "cost_score": round(cost, 1),
        "confidence_score": round(conf, 1),
        "risk_score": round(risk, 1),
        "success_probability": round(success, 1),
        "failure_probability": round(100 - success, 1),
        "final_decision_score": round(final, 1),
        "pros": ["Best safety balance", "Reduces hospital overload", "Protects vulnerable people first"],
        "cons": ["Requires coordination", "Medium to high resource usage", "Slightly slower than Path A"],
    }


def score_path_c(d: dict, base_risk: float, confidence: float) -> dict:
    """Resource-Conservative Delayed Response"""
    severity_penalty = d["severity_level"] * 0.3
    delay_penalty = (10 - d["response_time_limit"]) * 2 if d["response_time_limit"] < 10 else 0

    safety = clamp(45 - severity_penalty * 0.3 - delay_penalty)
    speed = clamp(40 - d["blocked_roads"] * 4)
    resource = clamp(75)
    cost = clamp(80 - (d["budget_level"] == "High") * 10)
    risk = clamp(base_risk + 15)
    conf = clamp(confidence - 15)

    success = clamp(0.30 * safety + 0.25 * resource + 0.20 * speed + 0.15 * conf + 0.10 * (100 - risk))
    final = clamp(0.35 * safety + 0.25 * resource + 0.20 * speed + 0.10 * cost + 0.10 * conf)

    return {
        "path_id": "C",
        "name": "Resource-Conservative Delayed Response",
        "description": "Use fewer teams initially, wait for conditions to stabilize, respond in phases.",
        "safety_score": round(safety, 1),
        "speed_score": round(speed, 1),
        "resource_score": round(resource, 1),
        "cost_score": round(cost, 1),
        "confidence_score": round(conf, 1),
        "risk_score": round(risk, 1),
        "success_probability": round(success, 1),
        "failure_probability": round(100 - success, 1),
        "final_decision_score": round(final, 1),
        "pros": ["Lower cost", "Less immediate resource pressure", "Preserves resources for later phases"],
        "cons": ["Higher casualty risk", "Delayed rescue", "Dangerous in severe disasters"],
    }


def score_all_paths(d: dict) -> list:
    base_risk = compute_risk_score(d)
    confidence = compute_confidence_score(d)
    paths = [
        score_path_a(d, base_risk, confidence),
        score_path_b(d, base_risk, confidence),
        score_path_c(d, base_risk, confidence),
    ]
    # Rank by final_decision_score descending
    sorted_paths = sorted(paths, key=lambda p: p["final_decision_score"], reverse=True)
    for i, p in enumerate(sorted_paths):
        p["rank"] = i + 1
    # Restore original order A, B, C with ranks assigned
    path_map = {p["path_id"]: p for p in sorted_paths}
    return [path_map["A"], path_map["B"], path_map["C"]]
