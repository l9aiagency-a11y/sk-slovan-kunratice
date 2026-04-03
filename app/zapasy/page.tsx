import { createServerClient } from "@/lib/supabase";
import { MOCK_RESULTS } from "@/lib/mock-data";
import type { Match } from "@/lib/mock-data";
import PageHero from "@/components/ui/PageHero";
import MatchesClient from "@/components/zapasy/MatchesClient";
import FadeIn from "@/components/ui/FadeIn";

export const revalidate = 300;

export const metadata = {
  title: "Zápasy a výsledky | SK Slovan Kunratice",
  description:
    "Výsledky, program a přehled zápasů všech týmů SK Slovan Kunratice. Sledujte výkony mužů i mládeže.",
  openGraph: {
    title: "Zápasy a výsledky | SK Slovan Kunratice",
    description:
      "Výsledky, program a přehled zápasů všech týmů SK Slovan Kunratice.",
  },
};

function formatMatchDate(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getDate()}. ${d.getMonth() + 1}.`;
}

export default async function ZapasyPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  const { team } = await searchParams;
  const sb = createServerClient();

  const { data: matchRows } = await sb
    .from("matches")
    .select("*")
    .order("date", { ascending: false });

  const matches: Match[] =
    matchRows && matchRows.length > 0
      ? matchRows.map((m) => {
          let result: "W" | "D" | "L" | null = null;
          if (m.home_score !== null && m.away_score !== null) {
            if (m.is_home) {
              result =
                m.home_score > m.away_score
                  ? "W"
                  : m.home_score < m.away_score
                    ? "L"
                    : "D";
            } else {
              result =
                m.away_score > m.home_score
                  ? "W"
                  : m.away_score < m.home_score
                    ? "L"
                    : "D";
            }
          }
          return {
            id: m.id,
            date: formatMatchDate(m.date),
            homeTeam: m.home_team,
            awayTeam: m.away_team,
            homeScore: m.home_score,
            awayScore: m.away_score,
            isHome: m.is_home,
            result,
            competition: m.competition,
            round: m.round || undefined,
            venue: m.venue || undefined,
          };
        })
      : MOCK_RESULTS;

  return (
    <main>
      <PageHero title="Zápasy & výsledky" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <FadeIn>
          <MatchesClient matches={matches} initialTeam={team} />
        </FadeIn>
      </div>
    </main>
  );
}
