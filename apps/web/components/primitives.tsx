import type { ReactNode } from "react";

import { Recommendation } from "@bird/shared";

export function Chip({
  children,
  tone = "muted"
}: {
  children: ReactNode;
  tone?: "accent" | "warning" | "danger" | "muted";
}) {
  return (
    <span className="chip" data-tone={tone}>
      {children}
    </span>
  );
}

export function RecommendationTone(recommendation: Recommendation) {
  switch (recommendation) {
    case "GO":
      return "accent";
    case "GO_WITH_RISK":
      return "warning";
    case "SKIP":
      return "danger";
    default:
      return "muted";
  }
}

export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="score-bar" aria-label={`score ${score}`}>
      <span style={{ width: `${score}%` }} />
    </div>
  );
}

export function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}
