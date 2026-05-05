from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import DisasterInput, SimulationResponse, SimulationHistoryItem
from simulator import run_simulation
from database import init_db, get_all_simulations, get_simulation_by_id

app = FastAPI(title="CrisisMind AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


@app.get("/")
def health_check():
    return {"message": "CrisisMind AI LangGraph backend is running"}


@app.post("/simulate")
def simulate(data: DisasterInput):
    try:
        result = run_simulation(data.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history")
def history():
    return get_all_simulations()


@app.get("/simulation/{simulation_id}")
def get_simulation(simulation_id: str):
    result = get_simulation_by_id(simulation_id)
    if not result:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return result
