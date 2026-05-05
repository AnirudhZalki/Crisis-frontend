const BASE = "http://127.0.0.1:8000";

export async function runSimulation(data) {
  const res = await fetch(`${BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchHistory() {
  const res = await fetch(`${BASE}/history`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchSimulation(id) {
  const res = await fetch(`${BASE}/simulation/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
