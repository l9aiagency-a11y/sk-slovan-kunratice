import Hero from "@/components/home/Hero";
import RecentResults from "@/components/home/RecentResults";
import StandingsPreview from "@/components/home/StandingsPreview";
import NewsPreview from "@/components/home/NewsPreview";
import YouthSection from "@/components/home/YouthSection";
import Sponsors from "@/components/home/Sponsors";
import FadeIn from "@/components/ui/FadeIn";
import SectionDivider from "@/components/ui/SectionDivider";
import { createServerClient } from "@/lib/supabase";
import type { Match, StandingRow, Article } from "@/lib/mock-data";

// Revalidate every 5 minutes so data stays fresh
export const revalidate = 300;

function formatMatchDate(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getDate()}. ${d.getMonth() + 1}.`;
}

function formatLabel(isoDate: string): string {
  const d = new Date(isoDate);
  const days = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
  return `${days[d.getDay()]} ${d.getDate()}. ${d.getMonth() + 1}.`;
}

function formatTime(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default async function Home() {
  const sb = createServerClient();

  // ── Fetch next match (upcoming, no score yet) ─────────────────
  const { data: nextMatchRow } = await sb
    .from("matches")
    .select("*")
    .is("home_score", null)
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true })
    .limit(1)
    .single();

  const nextMatch = nextMatchRow
    ? {
        homeTeam: nextMatchRow.is_home
          ? "Kunratice"
          : nextMatchRow.home_team.replace(/SK Sl\.\s*/, "").replace(/SK Slovan\s*/, ""),
        awayTeam: nextMatchRow.is_home
          ? nextMatchRow.away_team.replace(/SK Sl\.\s*/, "").replace(/SK Slovan\s*/, "")
          : "Kunratice",
        date: nextMatchRow.date,
        venue: nextMatchRow.venue || "Volarská",
        label: formatLabel(nextMatchRow.date),
        time: formatTime(nextMatchRow.date),
      }
    : undefined;

  // ── Fetch recent results (matches with scores) ────────────────
  const { data: recentRows } = await sb
    .from("matches")
    .select("*")
    .not("home_score", "is", null)
    .order("date", { ascending: false })
    .limit(4);

  const recentResults: Match[] | undefined =
    recentRows && recentRows.length > 0
      ? recentRows.map((m) => {
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
      : undefined;

  // ── Fetch standings ───────────────────────────────────────────
  const { data: standingsRows } = await sb
    .from("standings")
    .select("*")
    .order("position", { ascending: true })
    .limit(8);

  const standings: StandingRow[] | undefined =
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
      : undefined;

  // ── Fetch articles ────────────────────────────────────────────
  const { data: articleRows } = await sb
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(4);

  const articles: Article[] | undefined =
    articleRows && articleRows.length > 0
      ? articleRows.map((a) => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt || "",
          date: a.published_at || a.created_at,
          category: a.category || "Klub",
          coverImage: a.cover_image_url || undefined,
          slug: a.slug,
        }))
      : undefined;

  return (
    <main>
      {/* Hero */}
      <Hero nextMatch={nextMatch} />

      {/* Results — bg-card */}
      <section className="section-glow-top w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <FadeIn>
            <RecentResults results={recentResults} />
          </FadeIn>
        </div>
      </section>

      <SectionDivider />

      {/* Standings — bg-dark with subtle grid */}
      <section className="relative w-full bg-white py-16 overflow-hidden">
        {/* Very subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.04,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <FadeIn>
            <StandingsPreview standings={standings} />
          </FadeIn>
        </div>
      </section>

      <SectionDivider />

      {/* News — bg-card */}
      <section className="section-glow-top w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <FadeIn>
            <NewsPreview articles={articles} />
          </FadeIn>
        </div>
      </section>

      <SectionDivider />

      {/* Youth — bg-dark */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <FadeIn>
            <YouthSection />
          </FadeIn>
        </div>
      </section>

      {/* Sponsors */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Sponsors />
      </div>
    </main>
  );
}
