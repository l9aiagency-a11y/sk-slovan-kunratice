import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import { getTeamLogos, resolveTeamLogo } from "@/lib/team-logos";

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

  const logos = await getTeamLogos();
  const homeLogo = resolveTeamLogo(m.home_team, logos);
  const awayLogo = resolveTeamLogo(m.away_team, logos);

  const hasScore = m.home_score !== null && m.away_score !== null;
  const barColor = getResultColor(m.home_score, m.away_score, m.is_home);

  return (
    <main>
      {/* Colored top bar */}
      <div className="w-full h-1" style={{ backgroundColor: barColor }} />

      {/* Hero */}
      <section className="w-full bg-gray-50 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            {/* Home team */}
            <div className="flex-1 flex flex-col items-end gap-2">
              {homeLogo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={homeLogo}
                  alt={m.home_team}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200" />
              )}
              <p
                className={`font-heading font-bold text-lg sm:text-2xl uppercase ${
                  m.is_home
                    ? "text-gray-900"
                    : "text-gray-700"
                }`}
              >
                {m.home_team}
              </p>
            </div>

            {/* Score */}
            <div className="shrink-0">
              {hasScore ? (
                <p className="font-heading font-extrabold text-5xl sm:text-6xl text-gray-900 tabular-nums">
                  {m.home_score}
                  <span className="text-gray-500 mx-2">:</span>
                  {m.away_score}
                </p>
              ) : (
                <p className="font-heading font-extrabold text-3xl sm:text-4xl text-gray-500">
                  vs
                </p>
              )}
            </div>

            {/* Away team */}
            <div className="flex-1 flex flex-col items-start gap-2">
              {awayLogo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={awayLogo}
                  alt={m.away_team}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200" />
              )}
              <p
                className={`font-heading font-bold text-lg sm:text-2xl uppercase ${
                  !m.is_home
                    ? "text-gray-900"
                    : "text-gray-700"
                }`}
              >
                {m.away_team}
              </p>
            </div>
          </div>

          {/* Match info */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
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
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 mb-6">
            <h3 className="font-heading font-bold text-sm uppercase text-gray-500 mb-3">
              Střelci
            </h3>
            <p className="text-gray-900 text-sm">{m.scorers}</p>
          </div>
        )}

        {m.lineup && (
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 mb-6">
            <h3 className="font-heading font-bold text-sm uppercase text-gray-500 mb-3">
              Sestava
            </h3>
            <p className="text-gray-900 text-sm whitespace-pre-line">
              {m.lineup}
            </p>
          </div>
        )}

        {m.notes && (
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 mb-6">
            <h3 className="font-heading font-bold text-sm uppercase text-gray-500 mb-3">
              Poznámky
            </h3>
            <p className="text-gray-700 text-sm whitespace-pre-line">
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
