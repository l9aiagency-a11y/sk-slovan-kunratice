"use client";

import { useState, useMemo } from "react";
import type { Match } from "@/lib/mock-data";
import MatchCard from "@/components/ui/MatchCard";
import Tabs from "@/components/ui/Tabs";
import ChipFilter from "@/components/ui/ChipFilter";
import EmptyState from "@/components/ui/EmptyState";
import FadeIn from "@/components/ui/FadeIn";

const MATCH_TABS = [
  { label: "Výsledky", value: "results" },
  { label: "Rozpis", value: "schedule" },
];

interface MatchesClientProps {
  matches: Match[];
  initialTeam?: string;
}

export default function MatchesClient({ matches, initialTeam }: MatchesClientProps) {
  const [activeTeam, setActiveTeam] = useState(initialTeam || "all");
  const [activeTab, setActiveTab] = useState("results");

  // Build team filter options from match data
  const teamOptions = useMemo(() => {
    const teams = new Set<string>();
    matches.forEach((m) => {
      if (m.isHome) {
        teams.add(m.awayTeam);
      } else {
        teams.add(m.homeTeam);
      }
    });
    return [
      { label: "Vše", value: "all" },
      ...Array.from(teams)
        .sort()
        .map((t) => ({ label: t, value: t })),
    ];
  }, [matches]);

  const filtered = useMemo(() => {
    let list = matches;

    // Filter by team
    if (activeTeam !== "all") {
      list = list.filter(
        (m) => m.homeTeam === activeTeam || m.awayTeam === activeTeam
      );
    }

    // Filter by tab
    if (activeTab === "results") {
      list = list.filter((m) => m.homeScore !== null);
    } else {
      list = list.filter((m) => m.homeScore === null);
    }

    return list;
  }, [matches, activeTeam, activeTab]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <Tabs tabs={MATCH_TABS} active={activeTab} onChange={setActiveTab} />
        <ChipFilter options={teamOptions} selected={activeTeam} onChange={setActiveTeam} />
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-2">
          {filtered.map((match) => (
            <FadeIn key={match.id}>
              <MatchCard
                id={match.id}
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
            </FadeIn>
          ))}
        </div>
      ) : (
        <EmptyState message="Žádné zápasy k zobrazení." />
      )}
    </div>
  );
}
