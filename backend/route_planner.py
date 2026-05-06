"""
Route planner for CrisisMind AI.
Uses predefined demo coordinates around Hubballi/Varur region.
No external API required.
"""

DEMO_SHELTERS = [
    {
        "name": "AGM College Shelter",
        "latitude": 15.3618,
        "longitude": 75.1231,
        "total_capacity": 500,
        "available_capacity": 350,
        "food_available": True,
        "water_available": True,
        "medical_support": False,
    },
    {
        "name": "Government School Shelter",
        "latitude": 15.3725,
        "longitude": 75.1372,
        "total_capacity": 800,
        "available_capacity": 600,
        "food_available": True,
        "water_available": True,
        "medical_support": True,
    },
    {
        "name": "Community Hall Shelter",
        "latitude": 15.3516,
        "longitude": 75.1115,
        "total_capacity": 300,
        "available_capacity": 180,
        "food_available": False,
        "water_available": True,
        "medical_support": False,
    },
]

DEMO_ROUTES = [
    {
        "route_id": "A",
        "route_name": "Shortest Flooded Route",
        "route_type": "water_assisted",
        "route_status": "flooded",
        "target_shelter": "AGM College Shelter",
        "target_shelter_lat": 15.3618,
        "target_shelter_lng": 75.1231,
        "distance_km": 3.2,
        "estimated_time_min": 18,
        "required_resources": ["boats", "life_jackets"],
        "coordinates": [
            [15.3647, 75.1240],
            [15.3635, 75.1238],
            [15.3626, 75.1234],
            [15.3618, 75.1231],
        ],
    },
    {
        "route_id": "B",
        "route_name": "Longer Safe Road Route",
        "route_type": "road",
        "route_status": "safe",
        "target_shelter": "Government School Shelter",
        "target_shelter_lat": 15.3725,
        "target_shelter_lng": 75.1372,
        "distance_km": 6.5,
        "estimated_time_min": 35,
        "required_resources": ["buses", "ambulances"],
        "coordinates": [
            [15.3647, 75.1240],
            [15.3662, 75.1280],
            [15.3695, 75.1330],
            [15.3725, 75.1372],
        ],
    },
    {
        "route_id": "C",
        "route_name": "Partially Blocked Rescue Route",
        "route_type": "road",
        "route_status": "partially_blocked",
        "target_shelter": "Community Hall Shelter",
        "target_shelter_lat": 15.3516,
        "target_shelter_lng": 75.1115,
        "distance_km": 4.8,
        "estimated_time_min": 28,
        "required_resources": ["rescue_teams", "emergency_vehicles"],
        "coordinates": [
            [15.3647, 75.1240],
            [15.3600, 75.1200],
            [15.3555, 75.1150],
            [15.3516, 75.1115],
        ],
    },
]


def clamp(v):
    return max(0.0, min(100.0, v))


def _check_resources(required: list, res: dict) -> tuple:
    """Check if required resources are available. Returns (available_count, total, available_list)."""
    rescue = res.get("Rescue Resource Officer", {})
    transport = res.get("Transport Officer", {})
    medical = res.get("Medical Resource Officer", {})

    resource_map = {
        "boats": rescue.get("boats", 0),
        "life_jackets": rescue.get("life_jackets", 0),
        "rescue_teams": rescue.get("rescue_teams", 0),
        "emergency_vehicles": rescue.get("emergency_vehicles", 0),
        "buses": transport.get("available_buses", 0),
        "ambulances": medical.get("ambulances", 0),
    }

    available = []
    missing = []
    for r in required:
        if resource_map.get(r, 0) > 0:
            available.append(f"{r}: {resource_map[r]}")
        else:
            missing.append(r)

    return available, missing


def score_routes(d: dict, res: dict) -> list:
    """Score all demo routes and select the best feasible one."""
    scored = []

    for route in DEMO_ROUTES:
        available_res, missing_res = _check_resources(route["required_resources"], res)
        status = route["route_status"]

        # Route Safety Score
        if status == "safe":
            safety = 90.0
        elif status == "flooded":
            # Flooded but feasible if boats+life_jackets available
            safety = 70.0 if not missing_res else 30.0
        elif status == "partially_blocked":
            safety = 55.0 if not missing_res else 40.0
        else:
            safety = 50.0

        # Travel Feasibility
        if status == "safe":
            feasibility = 95.0
        elif status == "flooded":
            feasibility = 75.0 if not missing_res else 20.0
        elif status == "partially_blocked":
            feasibility = 60.0 if not missing_res else 35.0
        else:
            feasibility = 50.0

        # Resource Compatibility
        resource_compat = 100.0 if not missing_res else max(20.0, 100.0 - len(missing_res) * 30)

        # Distance Score (shorter = better, max 10km reference)
        distance_score = clamp(100 - (route["distance_km"] / 10) * 100)

        # Time Score (faster = better, max 60min reference)
        time_score = clamp(100 - (route["estimated_time_min"] / 60) * 100)

        # Shelter capacity check
        shelter = next((s for s in DEMO_SHELTERS if s["name"] == route["target_shelter"]), None)
        shelter_cap = shelter["available_capacity"] if shelter else 0
        if shelter_cap < 100:
            safety *= 0.7
            feasibility *= 0.7

        route_score = clamp(
            0.35 * safety
            + 0.25 * feasibility
            + 0.20 * resource_compat
            + 0.10 * distance_score
            + 0.10 * time_score
        )

        # Build explanation
        if status == "flooded" and not missing_res:
            explanation = (
                f"Route {route['route_id']} selected: Shortest route is flooded but boat-assisted "
                f"evacuation is feasible with available {', '.join(available_res)}. "
                f"Target: {route['target_shelter']} ({shelter_cap} spaces available)."
            )
        elif status == "flooded" and missing_res:
            explanation = (
                f"Route {route['route_id']} not recommended: Flooded and required resources "
                f"({', '.join(missing_res)}) are unavailable. Use a safer road route."
            )
        elif status == "safe":
            explanation = (
                f"Route {route['route_id']}: Safe road route to {route['target_shelter']}. "
                f"Longer ({route['distance_km']} km) but fully passable. "
                f"Resources available: {', '.join(available_res) if available_res else 'standard vehicles'}."
            )
        elif status == "partially_blocked":
            if not missing_res:
                explanation = (
                    f"Route {route['route_id']}: Partially blocked but passable with "
                    f"{', '.join(available_res)}. Moderate risk."
                )
            else:
                explanation = (
                    f"Route {route['route_id']}: Partially blocked and missing resources "
                    f"({', '.join(missing_res)}). High risk."
                )
        else:
            explanation = f"Route {route['route_id']}: Standard route to {route['target_shelter']}."

        scored.append({
            **route,
            "available_resources": available_res,
            "missing_resources": missing_res,
            "route_safety_score": round(safety, 1),
            "travel_feasibility": round(feasibility, 1),
            "resource_compatibility": round(resource_compat, 1),
            "distance_score": round(distance_score, 1),
            "time_score": round(time_score, 1),
            "route_score": round(route_score, 1),
            "shelter_capacity": shelter_cap,
            "selected": False,
            "explanation": explanation,
        })

    # Select best route
    best = max(scored, key=lambda r: r["route_score"])
    best["selected"] = True

    # Final explanation for selected route
    if best["route_status"] == "flooded" and not best["missing_resources"]:
        best["explanation"] = (
            f"Route {best['route_id']} -- '{best['route_name']}' is SELECTED. "
            f"Although flooded, boat-assisted evacuation is feasible with available resources. "
            f"Distance: {best['distance_km']} km, Time: {best['estimated_time_min']} min. "
            f"Target shelter: {best['target_shelter']} ({best['shelter_capacity']} spaces available). "
            f"Route Score: {best['route_score']}/100."
        )
    elif best["route_status"] == "safe":
        best["explanation"] = (
            f"Route {best['route_id']} -- '{best['route_name']}' is SELECTED as the safest feasible route. "
            f"Distance: {best['distance_km']} km, Time: {best['estimated_time_min']} min. "
            f"Target shelter: {best['target_shelter']} ({best['shelter_capacity']} spaces available). "
            f"Route Score: {best['route_score']}/100."
        )
    else:
        best["explanation"] = (
            f"Route {best['route_id']} -- '{best['route_name']}' is SELECTED as the best available option. "
            f"Distance: {best['distance_km']} km, Time: {best['estimated_time_min']} min. "
            f"Route Score: {best['route_score']}/100."
        )

    return scored
