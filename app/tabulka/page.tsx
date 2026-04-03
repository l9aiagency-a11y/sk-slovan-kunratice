import { createServerClient } from "@/lib/supabase";
import { MOCK_STANDINGS } from "@/lib/mock-data";
import type { StandingRow } from "@/lib/mock-data";
import PageHero from "@/components/ui/PageHero";
import StandingsTable from "@/components/ui/StandingsTable";

export const revalidate = 300;

export const metadata = {
  title: "Tabulka | SK Slovan Kunratice",
};

export default async function TabulkaPage() {
  const sb = createServerClient();

  const { data: standingsRows } = await sb
    .from("standings")
    .select("*")
    .order("position", { ascending: true });

  const standings: StandingRow[] =
    standingsRows && standingsRows.length > 0
      ? standingsRows.map((s) => ({
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
        }))
      : MOCK_STANDINGS;

  return (
    <main>
      <PageHero
        title="Tabulka soutěže"
        subtitle="Veolia Pražská teplárenská přebor mužů"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <StandingsTable rows={standings} />

        <p className="text-gray-500 text-xs mt-4 text-center">
          Zdroj: fotbalpraha.cz
        </p>
      </div>
    </main>
  );
}
