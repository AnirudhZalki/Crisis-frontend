# LangGraph Workflow

## Graph Type
StateGraph with typed GraphState (TypedDict)

## Node Sequence
```
START
  → validate_input       [Validates & normalizes disaster input]
  → scenario_generator   [Generates scenario summary + crisis variations]
  → medical_agent        [Analyzes hospital capacity & medical needs]
  → rescue_agent         [Analyzes rescue team availability & strategy]
  → transport_agent      [Analyzes blocked roads & evacuation routes]
  → resource_agent       [Analyzes supplies, budget, resource pressure]
  → safety_agent         [Analyzes vulnerable population & safety priorities]
  → decision_path        [Marks decision path generation step]
  → scoring              [Calculates all scores for Paths A, B, C]
  → coordinator          [Ranks paths, selects best by final_decision_score]
  → explainability       [Generates human-readable explanation]
  → persistence          [Saves to SQLite]
  → response             [Formats final API response]
END
```

## State Fields
- input_data, scenario_summary, generated_scenarios
- agent_suggestions, decision_paths, scored_paths
- recommended_path, explanation, workflow_trace, errors

## Decision Paths
| Path | Strategy | Wins When |
|------|----------|-----------|
| A | Fast Mass Evacuation | Low severity, few blockages |
| B | Prioritized Evacuation + Medical Camp | High severity, hospital overload |
| C | Resource-Conservative Delayed Response | Rarely — only very low severity |
