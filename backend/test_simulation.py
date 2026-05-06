import json
from simulator import run_simulation

data = {
    "disaster_type": "Flood",
    "location": "Zone A",
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
    "budget_level": "Medium",
}

result = run_simulation(data)
print("Simulation ID:", result["simulation_id"])
print("Recommended Path:", result["recommended_path"])
print("Risk Level:", result["risk_level"])
print("Workflow Trace:", result["workflow_trace"])
print("\nDecision Scores:")
for p in result["decision_paths"]:
    print(f"  Path {p['path_id']}: {p['name']} — Final Score: {p['final_decision_score']} | Rank: #{p['rank']}")
print("\nExplanation preview:", result["explanation"][:200])
