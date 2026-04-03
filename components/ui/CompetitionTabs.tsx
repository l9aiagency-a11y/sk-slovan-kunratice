"use client";

import { useState } from "react";
import type { StandingRow } from "@/lib/mock-data";
import Tabs from "./Tabs";
import StandingsTable from "./StandingsTable";

type CompetitionTabsProps = {
  competitions: string[];
  standings: Record<string, StandingRow[]>;
};

export default function CompetitionTabs({
  competitions,
  standings,
}: CompetitionTabsProps) {
  const [active, setActive] = useState(competitions[0] ?? "");

  const tabs = competitions.map((c) => ({
    value: c,
    label: c.replace(/ 2025\/2026$/, ""),
  }));

  const rows = standings[active] ?? [];

  return (
    <div>
      {competitions.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Tabs tabs={tabs} active={active} onChange={setActive} />
        </div>
      )}
      <StandingsTable rows={rows} />
    </div>
  );
}
