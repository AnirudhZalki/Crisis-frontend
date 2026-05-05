"""
Deterministic expert agents — no LLM required.
Each agent analyses the disaster input and returns a structured suggestion.
"""


def medical_agent(d: dict) -> dict:
    overload = d["estimated_injured"] - d["hospital_capacity"]
    if overload > 0:
        suggestion = (
            f"Hospital capacity exceeded by {overload} patients. "
            "Set up temporary medical camps immediately and request mutual-aid from nearby hospitals."
        )
        pros = ["Reduces hospital overload", "Faster triage on-site", "Saves critical patients"]
        cons = ["Requires additional medical staff", "Temporary camps need supplies"]
    else:
        suggestion = (
            "Hospital capacity is sufficient. Pre-position medical teams at evacuation points "
            "and monitor for surge."
        )
        pros = ["Hospitals can absorb injured", "Stable medical response"]
        cons = ["Capacity may be strained if situation worsens"]
    return {"agent": "Medical Agent", "suggestion": suggestion, "pros": pros, "cons": cons}


def rescue_agent(d: dict) -> dict:
    shortage = d["required_rescue_teams"] - d["available_rescue_teams"]
    vuln_pct = round((d["vulnerable_population"] / max(d["affected_population"], 1)) * 100, 1)
    if shortage > 0:
        suggestion = (
            f"Rescue team shortage of {shortage} teams detected. "
            f"Prioritize evacuation of vulnerable population ({vuln_pct}% of affected). "
            "Request mutual-aid teams and deploy available teams to highest-risk zones first."
        )
        pros = ["Focuses limited resources on highest need", "Reduces casualties among vulnerable"]
        cons = ["General population evacuation delayed", "Requires clear zone prioritization"]
    else:
        suggestion = (
            f"Sufficient rescue teams available. Deploy teams across all zones. "
            f"Prioritize vulnerable population ({vuln_pct}%) in parallel."
        )
        pros = ["Full coverage possible", "Faster overall evacuation"]
        cons = ["Coordination complexity increases with more teams"]
    return {"agent": "Rescue Agent", "suggestion": suggestion, "pros": pros, "cons": cons}


def transport_agent(d: dict) -> dict:
    if d["blocked_roads"] >= 3:
        suggestion = (
            f"{d['blocked_roads']} roads blocked. Activate alternate evacuation routes immediately. "
            "Deploy route-clearing teams and use watercraft/air assets if available. "
            "Avoid flood-prone low-lying roads."
        )
        pros = ["Prevents evacuation bottlenecks", "Reduces accident risk"]
        cons = ["Alternate routes may be longer", "Requires real-time route monitoring"]
    else:
        suggestion = (
            f"{d['blocked_roads']} road(s) blocked — manageable. "
            "Use primary routes with traffic management. Monitor weather for route changes."
        )
        pros = ["Primary routes mostly usable", "Faster evacuation possible"]
        cons = ["Remaining blockages can cause delays if worsened"]
    return {"agent": "Transport Agent", "suggestion": suggestion, "pros": pros, "cons": cons}


def resource_agent(d: dict) -> dict:
    budget_map = {"Low": 0, "Medium": 1, "High": 2}
    budget_score = budget_map.get(d["budget_level"], 1)
    shortage = max(0, d["required_rescue_teams"] - d["available_rescue_teams"])
    if budget_score == 0 or shortage > 3:
        suggestion = (
            "Resource pressure is HIGH. Prioritize food, water, medicine, and shelter for high-risk zones. "
            "Activate emergency procurement. Seek NGO and government resource support."
        )
        pros = ["Focused allocation maximizes impact", "Prevents waste"]
        cons = ["Some zones may receive delayed supplies", "Procurement takes time"]
    else:
        suggestion = (
            "Resources are adequate. Pre-position supplies at evacuation centers. "
            "Maintain reserve for secondary response phase."
        )
        pros = ["Sufficient supplies for initial response", "Reserve available for escalation"]
        cons = ["Situation may escalate requiring more resources"]
    return {"agent": "Resource Agent", "suggestion": suggestion, "pros": pros, "cons": cons}


def safety_agent(d: dict) -> dict:
    vuln = d["vulnerable_population"]
    severity = d["severity_level"]
    if severity >= 70 or vuln > 3000:
        suggestion = (
            f"HIGH severity ({severity}/100) with {vuln} vulnerable people. "
            "Immediately move elderly, children, injured, and mobility-impaired individuals. "
            "Establish safe zones away from disaster impact area."
        )
        pros = ["Protects highest-risk individuals first", "Reduces preventable casualties"]
        cons = ["Requires dedicated teams for vulnerable groups", "Slows general evacuation slightly"]
    else:
        suggestion = (
            f"Moderate severity ({severity}/100). Conduct orderly evacuation. "
            "Assign dedicated support for vulnerable population."
        )
        pros = ["Controlled evacuation reduces panic", "Manageable safety risk"]
        cons = ["Situation can escalate if severity increases"]
    return {"agent": "Safety Agent", "suggestion": suggestion, "pros": pros, "cons": cons}


def scenario_generator(d: dict) -> tuple:
    dtype = d["disaster_type"]
    loc = d["location"]
    sev = d["severity_level"]
    summary = (
        f"A {dtype} event has been reported in {loc} with severity level {sev}/100. "
        f"Approximately {d['affected_population']:,} people are affected, including "
        f"{d['vulnerable_population']:,} vulnerable individuals. "
        f"{d['available_rescue_teams']} rescue teams are available against a requirement of "
        f"{d['required_rescue_teams']}. "
        f"Hospital capacity is {d['hospital_capacity']} with an estimated {d['estimated_injured']} injured. "
        f"{d['blocked_roads']} road(s) are blocked. "
        f"Weather: {d['weather_condition']}. Response window: {d['response_time_limit']} hours. "
        f"Budget: {d['budget_level']}."
    )
    scenarios = [
        f"{dtype} intensity may worsen — severity could rise to {min(100, sev + 15)}/100 within 2 hours.",
        f"Road blockages may increase from {d['blocked_roads']} to {d['blocked_roads'] + 2} if weather deteriorates.",
        f"Hospital load may reach {d['estimated_injured'] + 200} if secondary injuries occur.",
        f"Rescue delay risk increases if teams are not deployed within {max(1, d['response_time_limit'] - 2)} hours.",
    ]
    return summary, scenarios
