import { useState } from "react";
import CrisisForm from "./components/CrisisForm";
import RecommendationCard from "./components/RecommendationCard";
import WorkflowTrace from "./components/WorkflowTrace";
import DecisionComparison from "./components/DecisionComparison";
import AgentSuggestions from "./components/AgentSuggestions";
import ExplainabilityBox from "./components/ExplainabilityBox";
import History from "./components/History";
import { runSimulation } from "./api";
import "./styles.css";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await runSimulation(data);
      setResult(res);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLoadHistory = (sim) => {
    setResult(sim);
    setError(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">CrisisMind AI</h1>
        <p className="subtitle">LangGraph-Based Multi-Agent Disaster Decision Simulator</p>
        <p className="tagline">Simulate disaster. Compare actions. Predict outcomes. Explain the safest decision.</p>
      </header>

      <main className="main">
        <CrisisForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="card error-card">
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        {result && (
          <>
            <RecommendationCard result={result} />
            <WorkflowTrace trace={result.workflow_trace} />
            <DecisionComparison paths={result.decision_paths} recommended={result.recommended_path} />
            <AgentSuggestions suggestions={result.agent_suggestions} />
            <ExplainabilityBox explanation={result.explanation} scenarios={result.generated_scenarios} />
            <div className="card scenario-card">
              <h2 className="section-title">📋 Scenario Summary</h2>
              <p>{result.scenario_summary}</p>
            </div>
          </>
        )}

        <History onLoad={handleLoadHistory} />
      </main>

      <footer className="footer">
        <p>Built with FastAPI + LangGraph + React | Hack Fusion 2025 | AI/ML Innovation Track</p>
      </footer>
    </div>
  );
}
