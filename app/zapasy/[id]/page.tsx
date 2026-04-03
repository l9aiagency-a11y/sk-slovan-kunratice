import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";

export const revalidate = 300;

function formatFullDate(isoDate: string): string {
  const d = new Date(isoDate);
  const days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
  const months = [
    "ledna", "února", "března", "dubna", "května", "června",
    "července", "srpna", "září", "října", "listopadu", "prosince",
  ];
  return `${days[d.getDay()]} ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}, ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function getResultColor(
  homeScore: number | null,
  awayScore: number | null,
  isHome: boolean
): string {
  if (homeScore === null || awayScore === null) return "var(--border)";
  if (homeScore === awayScore) return "var(--draw)";
  const weWon = isHome ? homeScore > awayScore : awayScore > homeScore;
  return weWon ? "var(--win)" : "var(--loss)";
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = createServerClient();
  const { data: match } = await sb
    .from("matches")
    .select("home_team, away_team, home_score, away_score")
    .eq("id", id)
    .single();

  if (!match) return { title: "Zápas | SK Slovan Kunratice" };

  const score =
    match.home_score !== null
      ? `${match.home_score}:${match.away_score}`
      : "vs";
  return {
    title: `${match.home_team} ${score} ${match.away_team} | SK Slovan Kunratice`,
  };
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = createServerClient();

  const { data: m } = await sb
    .from("matches")
    .select("*")
    .eq("id", id)
    .single();

  if (!m) notFound();

  const hasScore = m.home_score !== null && m.away_score !== null;
  const barColor = getResultColor(m.home_score, m.away_score, m.is_home);

  return (
    <main>
      {/* Colored top bar */}
      <div className="w-full h-1" style={{ backgroundColor: barColor }} />

      {/* Hero */}
      <section className="w-full bg-[var(--bg-card)] py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            {/* Home team */}
            <div className="flex-1 text-right">
              <p
                className={`font-heading font-bold text-lg sm:text-2xl uppercase ${
                  m.is_home
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                {m.home_team}
              </p>
            </div>

            {/* Score */}
            <div className="shrink-0">
              {hasScore ? (
                <p className="font-heading font-extrabold text-5xl sm:text-6xl text-[var(--text-primary)] tabular-nums">
                  {m.home_score}
                  <span className="text-[var(--text-muted)] mx-2">:</span>
                  {m.away_score}
                </p>
              ) : (
                <p className="font-heading font-extrabold text-3xl sm:text-4xl text-[var(--text-muted)]">
                  vs
                </p>
              )}
            </div>

            {/* Away team */}
            <div className="flex-1 text-left">
              <p
                className={`font-heading font-bold text-lg sm:text-2xl uppercase ${
                  !m.is_home
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                {m.away_team}
              </p>
            </div>
          </div>

          {/* Match info */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--text-muted)]">
            <span>{formatFullDate(m.date)}</span>
            {m.round && <span>{m.round}</span>}
            <span>{m.competition}</span>
            {m.venue && <span>{m.venue}</span>}
          </div>
        </div>
      </section>

      {/* Content area */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
        {/* Scorers / notes if they exist */}
        {m.scorers && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 mb-6">
            <h3 className="font-heading font-bold text-sm uppercase text-[var(--text-muted)] mb-3">
              Střelci
            </h3>
            <p className="text-[var(--text-primary)] text-sm">{m.scorers}</p>
          </div>
        )}

        {m.lineup && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 mb-6">
            <h3 className="font-heading font-bold text-sm uppercase text-[var(--text-muted)] mb-3">
              Sestava
            </h3>
            <p className="text-[var(--text-primary)] text-sm whitespace-pre-line">
              {m.lineup}
            </p>
          </div>
        )}

        {m.notes && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 mb-6">
            <h3 className="font-heading font-bold text-sm uppercase text-[var(--text-muted)] mb-3">
              Poznámky
            </h3>
            <p className="text-[var(--text-secondary)] text-sm whitespace-pre-line">
              {m.notes}
            </p>
          </div>
        )}

        {/* Back link */}
        <Link
          href="/zapasy"
          className="inline-flex items-center gap-1 text-[var(--club-primary)] text-sm font-medium hover:underline"
        >
          &larr; Zpět na výsledky
        </Link>
      </div>
    </main>
  );
}
