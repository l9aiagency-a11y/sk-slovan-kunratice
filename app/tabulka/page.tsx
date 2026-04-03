import { createServerClient } from "@/lib/supabase";
import { MOCK_STANDINGS } from "@/lib/mock-data";
import type { StandingRow } from "@/lib/mock-data";
import { getTeamLogos, resolveTeamLogo } from "@/lib/team-logos";
import PageHero from "@/components/ui/PageHero";
import CompetitionTabs from "@/components/ui/CompetitionTabs";
import FadeIn from "@/components/ui/FadeIn";

export const revalidate = 300;

export const metadata = {
  title: "Tabulka soutěže | SK Slovan Kunratice",
  description:
    "Aktuální tabulka soutěže pro všechny týmy SK Slovan Kunratice — muži, dorost, žáci.",
  openGraph: {
    title: "Tabulka soutěže | SK Slovan Kunratice",
    description:
      "Aktuální tabulka soutěže pro všechny týmy SK Slovan Kunratice.",
  },
};

/** Preferred display order — muži first, then youth */
const COMPETITION_ORDER = [
  "Pražský přebor mužů",
  "I.B třída sk. B mužů",
  "1.A třída staršího dorostu",
  "1. třída mladšího dorostu",
  "2. třída sk. A starších žáků",
  "1. třída sk. A mladších žáků",
  "2. třída sk. D mladších žáků",
];

export default async function TabulkaPage() {
  const sb = createServerClient();

  const { data: standingsRows } = await sb
    .from("standings")
    .select("*")
    .order("position", { ascending: true });

  if (!standingsRows || standingsRows.length === 0) {
    // Fallback to mock data (single competition)
    return (
      <main>
        <PageHero
          title="Tabulka soutěže"
          subtitle="Veolia Pražská teplárenská přebor mužů"
        />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <FadeIn>
            <CompetitionTabs
              competitions={["Pražský přebor mužů 2025/2026"]}
              standings={{ "Pražský přebor mužů 2025/2026": MOCK_STANDINGS }}
            />
            <p className="text-gray-500 text-xs mt-4 text-center">
              Zdroj: fotbalpraha.cz
            </p>
          </FadeIn>
        </div>
      </main>
    );
  }

  // Load team logos
  const logos = await getTeamLogos();

  // Group by competition
  const grouped: Record<string, StandingRow[]> = {};
  for (const s of standingsRows) {
    const comp = s.competition ?? "Neznámá soutěž";
    if (!grouped[comp]) grouped[comp] = [];
    grouped[comp].push({
      position: s.position,
      team: s.team_name,
      played: s.played,
      won: s.won,
      drawn: s.drawn,
      lost: s.lost,
      goalsFor: s.goals_for,
      goalsAgainst: s.goals_against,
      points: s.points,
      form: Array.isArray(s.form) ? s.form : [],
      isOwnTeam: s.is_own_team,
      logoUrl: resolveTeamLogo(s.team_name, logos) || null,
    });
  }

  // Sort competitions by preferred order
  const competitions = Object.keys(grouped).sort((a, b) => {
    const aIdx = COMPETITION_ORDER.findIndex((name) => a.includes(name));
    const bIdx = COMPETITION_ORDER.findIndex((name) => b.includes(name));
    return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
  });

  return (
    <main>
      <PageHero title="Tabulka soutěže" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <FadeIn>
          <CompetitionTabs
            competitions={competitions}
            standings={grouped}
            showSubtitle
          />

          <p className="text-gray-500 text-xs mt-4 text-center">
            Zdroj: fotbalpraha.cz
          </p>
        </FadeIn>
      </div>
    </main>
  );
}
