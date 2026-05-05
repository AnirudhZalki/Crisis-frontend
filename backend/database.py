import sqlite3
import json
from datetime import datetime

DB_PATH = "crisismind.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS simulations (
            id TEXT PRIMARY KEY,
            disaster_type TEXT,
            location TEXT,
            recommended_path TEXT,
            final_score REAL,
            risk_level TEXT,
            full_result TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()


def save_simulation(sim_id: str, result: dict):
    best = next((p for p in result["decision_paths"] if p["path_id"] == result["recommended_path"]), {})
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT OR REPLACE INTO simulations VALUES (?,?,?,?,?,?,?,?)",
        (
            sim_id,
            result["disaster_type"],
            result["location"],
            result["recommended_path"],
            best.get("final_decision_score", 0),
            result.get("risk_level", "Unknown"),
            json.dumps(result),
            result["created_at"],
        ),
    )
    conn.commit()
    conn.close()


def get_all_simulations() -> list:
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT id, disaster_type, location, recommended_path, final_score, risk_level, created_at "
        "FROM simulations ORDER BY created_at DESC LIMIT 50"
    ).fetchall()
    conn.close()
    return [
        {
            "simulation_id": r[0],
            "disaster_type": r[1],
            "location": r[2],
            "recommended_path": r[3],
            "final_score": r[4],
            "risk_level": r[5],
            "created_at": r[6],
        }
        for r in rows
    ]


def get_simulation_by_id(sim_id: str) -> dict | None:
    conn = sqlite3.connect(DB_PATH)
    row = conn.execute("SELECT full_result FROM simulations WHERE id=?", (sim_id,)).fetchone()
    conn.close()
    return json.loads(row[0]) if row else None
