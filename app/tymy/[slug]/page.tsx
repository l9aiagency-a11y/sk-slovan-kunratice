import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import {
  MOCK_TEAMS,
  MOCK_PLAYERS,
  MOCK_STAFF,
  type Team,
  type Player,
  type Staff,
  type Match,
  type StandingRow,
} from "@/lib/mock-data";
import { TEAM_COMPETITIONS } from "@/lib/scraper";
import PageHero from "@/components/ui/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import MatchCard from "@/components/ui/MatchCard";
import StandingsTable from "@/components/ui/StandingsTable";

export const revalidate = 300;

const positionLabel: Record<Player["position"], string> = {
  GK: "Brankář",
  DEF: "Obránce",
  MID: "Záložník",
  FWD: "Útočník",
};

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}

function formatMatchDate(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getDate()}. ${d.getMonth() + 1}.`;
}

function computeResult(
  m: { home_score: number | null; away_score: number | null; is_home: boolean },
): "W" | "D" | "L" | null {
  if (m.home_score === null || m.away_score === null) return null;
  if (m.is_home) {
    return m.home_score > m.away_score ? "W" : m.home_score < m.away_score ? "L" : "D";
  }
  return m.away_score > m.home_score ? "W" : m.away_score < m.home_score ? "L" : "D";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = MOCK_TEAMS.find((t) => t.slug === slug);
  return {
    title: team
      ? `${team.name} | SK Slovan Kunratice`
      : "Tým | SK Slovan Kunratice",
  };
}

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sb = createServerClient();

  // Fetch team
  const { data: teamRow } = await sb
    .from("teams")
    .select("*")
    .eq("slug", slug)
    .single();

  let team: Team | null = null;
  let teamId: string | null = null;

  if (teamRow) {
    team = {
      id: teamRow.id,
      name: teamRow.name,
      slug: teamRow.slug,
      category: teamRow.category,
      ageGroup: teamRow.age_group,
      competition: teamRow.competition,
    };
    teamId = teamRow.id;
  } else {
    const mock = MOCK_TEAMS.find((t) => t.slug === slug);
    if (!mock) return notFound();
    team = mock;
  }

  // ── Find competition config for this team ──
  const compConfig = TEAM_COMPETITIONS.find((c) => c.teamSlug === slug);
  const competitionKey = compConfig
    ? `${compConfig.competitionName} 2025/2026`
    : null;

  // ── Fetch standings for this team's competition ──
  let standings: StandingRow[] = [];
  if (competitionKey) {
    const { data: standingsRows } = await sb
      .from("standings")
      .select("*")
      .eq("competition", competitionKey)
      .order("position", { ascending: true });

    if (standingsRows && standingsRows.length > 0) {
      standings = standingsRows.map((s) => ({
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
      }));
    }
  }

  // Fetch players
  let players: Player[] = [];
  if (teamId) {
    const { data: playerRows } = await sb
      .from("players")
      .select("*")
      .eq("team_id", teamId)
      .order("sort_order", { ascending: true });

    if (playerRows && playerRows.length > 0) {
      players = playerRows.map((p) => ({
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        number: p.number,
        position: p.position,
        team_id: p.team_id,
        sort_order: p.sort_order,
      }));
    }
  }

  if (players.length === 0 && slug === "muzi-a") {
    players = MOCK_PLAYERS;
  }

  // Fetch staff
  let staff: Staff[] = [];
  if (teamId) {
    const { data: staffRows } = await sb
      .from("staff")
      .select("*")
      .eq("team_id", teamId);

    if (staffRows && staffRows.length > 0) {
      staff = staffRows.map((s) => ({
        id: s.id,
        name: s.name,
        role: s.role,
        team_id: s.team_id,
      }));
    }
  }

  if (staff.length === 0 && slug === "muzi-a") {
    staff = MOCK_STAFF;
  }

  // ── Fetch ALL matches for this team, sorted by date ──
  let allMatches: Array<{
    id: string;
    date: string;
    home_team: string;
    away_team: string;
    home_score: number | null;
    away_score: number | null;
    is_home: boolean;
    competition: string;
    round: string | null;
    venue: string | null;
  }> = [];

  if (teamId) {
    const { data: matchRows } = await sb
      .from("matches")
      .select("*")
      .eq("team_id", teamId)
      .order("date", { ascending: true });

    if (matchRows && matchRows.length > 0) {
      allMatches = matchRows;
    }
  }

  const now = new Date();

  // Past results (played, most recent first)
  const pastResults: Match[] = allMatches
    .filter((m) => m.home_score !== null && m.away_score !== null)
    .reverse()
    .slice(0, 10)
    .map((m) => ({
      id: m.id,
      date: formatMatchDate(m.date),
      homeTeam: m.home_team,
      awayTeam: m.away_team,
      homeScore: m.home_score,
      awayScore: m.away_score,
      isHome: m.is_home,
      result: computeResult(m),
      competition: m.competition,
      round: m.round || undefined,
      venue: m.venue || undefined,
    }));

  // Upcoming matches (no score yet, soonest first)
  const upcomingMatches: Match[] = allMatches
    .filter(
      (m) =>
        m.home_score === null &&
        m.away_score === null &&
        new Date(m.date) >= now,
    )
    .slice(0, 5)
    .map((m) => ({
      id: m.id,
      date: formatMatchDate(m.date),
      homeTeam: m.home_team,
      awayTeam: m.away_team,
      homeScore: null,
      awayScore: null,
      isHome: m.is_home,
      result: null,
      competition: m.competition,
      round: m.round || undefined,
      venue: m.venue || undefined,
    }));

  return (
    <main>
      <PageHero title={team.name} subtitle={team.competition} />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-16">
        {/* Tabulka soutěže */}
        {standings.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">
              Tabulka soutěže
            </h2>
            <StandingsTable rows={standings} />
            <p className="text-gray-500 text-xs mt-2">
              Zdroj: fotbalpraha.cz
            </p>
          </section>
        )}

        {/* Nadcházející zápasy */}
        {upcomingMatches.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">
              Nadcházející zápasy
            </h2>
            <div className="space-y-2">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
          </section>
        )}

        {/* Poslední výsledky */}
        {pastResults.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">
              Poslední výsledky
            </h2>
            <div className="space-y-2">
              {pastResults.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
          </section>
        )}

        {/* No data state */}
        {standings.length === 0 &&
          pastResults.length === 0 &&
          upcomingMatches.length === 0 &&
          players.length === 0 &&
          staff.length === 0 && (
            <EmptyState message="Data pro tento tým budou brzy k dispozici" />
          )}

        {/* Soupiska */}
        <section>
          <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">
            Soupiska
          </h2>

          {players.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-gray-50 border border-gray-300 rounded-xl p-4 relative text-center"
                >
                  {player.number != null && (
                    <span className="absolute top-3 right-3 font-heading font-bold text-sm text-[var(--club-accent)]">
                      #{player.number}
                    </span>
                  )}
                  <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-gray-500">
                      {getInitials(player.first_name, player.last_name)}
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-gray-900">
                    {player.first_name} {player.last_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {positionLabel[player.position]}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Soupiska bude doplněna" />
          )}
        </section>

        {/* Realizační tým */}
        {staff.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">
              Realizační tým
            </h2>
            <div className="space-y-3">
              {staff.map((s) => (
                <div
                  key={s.id}
                  className="bg-gray-50 border border-gray-300 rounded-xl px-5 py-3 flex items-center justify-between"
                >
                  <span className="font-semibold text-gray-900">
                    {s.name}
                  </span>
                  <span className="text-sm text-gray-500">{s.role}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div>
          <Link
            href="/tymy"
            className="text-sm text-[var(--club-primary)] hover:underline"
          >
            ← Zpět na týmy
          </Link>
        </div>
      </div>
    </main>
  );
}
