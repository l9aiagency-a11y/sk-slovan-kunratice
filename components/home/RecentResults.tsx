"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import MatchCard from "@/components/ui/MatchCard";
import { Match, MOCK_RESULTS } from "@/lib/mock-data";

const TEAM_OPTIONS = [
  { label: "Muži A", value: "muzi-a" },
  { label: "Muži B", value: "muzi-b" },
];

interface RecentResultsProps {
  results?: Match[];
}

export default function RecentResults({ results: propResults }: RecentResultsProps) {
  const [activeTeam, setActiveTeam] = useState("muzi-a");

  const dataSource = propResults && propResults.length > 0 ? propResults : MOCK_RESULTS;
  // For now only Muži A data exists
  const results = activeTeam === "muzi-a" ? dataSource : [];

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <SectionHeader
          title="Poslední výsledky"
          linkText="Všechny výsledky →"
          href="/zapasy"
        />
      </div>

      {/* Team switcher */}
      <div className="flex gap-2 mb-4">
        {TEAM_OPTIONS.map((team) => (
          <button
            key={team.value}
            onClick={() => setActiveTeam(team.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold font-heading uppercase tracking-wide transition-colors ${
              activeTeam === team.value
                ? "bg-[var(--club-primary)] text-white"
                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            }`}
          >
            {team.label}
          </button>
        ))}
      </div>

      {/* Match list */}
      {results.length > 0 ? (
        <div className="flex flex-col gap-2">
          {results.map((match) => (
            <MatchCard
              key={match.id}
              date={match.date}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              homeScore={match.homeScore}
              awayScore={match.awayScore}
              homeLogo={match.homeLogo}
              awayLogo={match.awayLogo}
              isHome={match.isHome}
              result={match.result}
            />
          ))}
        </div>
      ) : (
        <p className="text-[var(--text-muted)] text-sm py-8 text-center">
          Žádné výsledky k dispozici.
        </p>
      )}
    </div>
  );
}
