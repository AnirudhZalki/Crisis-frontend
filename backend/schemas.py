from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict


class DisasterInput(BaseModel):
    disaster_type: str = Field(..., example="Flood")
    location: str = Field(..., example="Hubballi - Varur Region")
    latitude: float = Field(default=15.3647, example=15.3647)
    longitude: float = Field(default=75.1240, example=75.1240)
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


class ResourceUpdate(BaseModel):
    role: str
    location: str
    # Medical
    doctors: Optional[int] = None
    ambulances: Optional[int] = None
    hospital_beds: Optional[int] = None
    medical_camps: Optional[int] = None
    first_aid_kits: Optional[int] = None
    blood_units: Optional[int] = None
    # Rescue
    rescue_teams: Optional[int] = None
    boats: Optional[int] = None
    life_jackets: Optional[int] = None
    ropes: Optional[int] = None
    divers: Optional[int] = None
    emergency_vehicles: Optional[int] = None
    # Fire/Safety
    firefighters: Optional[int] = None
    fire_trucks: Optional[int] = None
    safety_teams: Optional[int] = None
    danger_zones: Optional[int] = None
    # NGO
    volunteers: Optional[int] = None
    food_packets: Optional[int] = None
    water_bottles: Optional[int] = None
    clothes: Optional[int] = None
    blankets: Optional[int] = None
    # Transport
    blocked_roads_count: Optional[int] = None
    safe_roads: Optional[int] = None
    damaged_bridges: Optional[int] = None
    available_buses: Optional[int] = None
    route_status: Optional[str] = None


class ShelterUpdate(BaseModel):
    name: str
    location: str
    latitude: float
    longitude: float
    total_capacity: int
    available_capacity: int
    food_available: bool = True
    water_available: bool = True
    medical_support: bool = False
