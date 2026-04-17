import type { Impact, Likelihood, RiskLevel } from "@/types/dpia";

// TU/e matrix from Annex 1: rows = likelihood (Very Likely→Negligible), cols = impact (Negligible→Catastrophic)
// Values: 1=Low, 2=Medium, 3=High, 4=Critical
const MATRIX: Record<Likelihood, Record<Impact, RiskLevel>> = {
  "very-likely":   { negligible: "medium", unlikely: "medium", medium: "high",   likely: "critical", catastrophic: "critical" },
  "likely":        { negligible: "low",    unlikely: "medium", medium: "high",   likely: "critical", catastrophic: "critical" },
  "possible":      { negligible: "low",    unlikely: "medium", medium: "high",   likely: "high",     catastrophic: "critical" },
  "unlikely":      { negligible: "low",    unlikely: "low",    medium: "medium", likely: "high",     catastrophic: "high" },
  "negligible":    { negligible: "low",    unlikely: "low",    medium: "medium", likely: "medium",   catastrophic: "high" },
};

export function scoreRisk(impact: Impact, likelihood: Likelihood): RiskLevel {
  return MATRIX[likelihood][impact];
}

export const RISK_COLOR: Record<RiskLevel, string> = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#f97316",
  critical: "#ef4444",
};

export const IMPACT_ORDER: Impact[] = ["negligible", "unlikely", "medium", "likely", "catastrophic"];
export const LIKELIHOOD_ORDER: Likelihood[] = ["negligible", "unlikely", "possible", "likely", "very-likely"];

export const IMPACT_LABEL: Record<Impact, string> = {
  negligible: "Negligible",
  unlikely: "Unlikely",
  medium: "Medium",
  likely: "Likely",
  catastrophic: "Catastrophic",
};
export const LIKELIHOOD_LABEL: Record<Likelihood, string> = {
  negligible: "Negligible",
  unlikely: "Unlikely",
  possible: "Possible",
  likely: "Likely",
  "very-likely": "Very Likely",
};

export function isHighOrCritical(level: RiskLevel): boolean {
  return level === "high" || level === "critical";
}
