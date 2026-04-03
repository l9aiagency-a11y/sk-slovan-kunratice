import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import {
  MOCK_TEAMS,
  MOCK_PLAYERS,
  MOCK_STAFF,
  MOCK_RESULTS,
  type Team,
  type Player,
  type Staff,
  type Match,
} from "@/lib/mock-data";
import PageHero from "@/components/ui/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import MatchCard from "@/components/ui/MatchCard";

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

  // Fall back to mock for muzi-a
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

  // Fetch recent matches
  let matches: Match[] = [];
  if (teamId) {
    const { data: matchRows } = await sb
      .from("matches")
      .select("*")
      .eq("team_id", teamId)
      .order("date", { ascending: false })
      .limit(5);

    if (matchRows && matchRows.length > 0) {
      matches = matchRows.map((m) => {
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
      });
    }
  }

  if (matches.length === 0 && slug === "muzi-a") {
    matches = MOCK_RESULTS.slice(0, 5);
  }

  return (
    <main>
      <PageHero title={team.name} subtitle={team.competition} />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-16">
        {/* Soupiska */}
        <section>
          <h2 className="font-heading font-bold text-2xl text-[var(--text-primary)] mb-6">
            Soupiska
          </h2>

          {players.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 relative text-center"
                >
                  {player.number != null && (
                    <span className="absolute top-3 right-3 font-heading font-bold text-sm text-[var(--club-accent)]">
                      #{player.number}
                    </span>
                  )}
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-surface)] mx-auto flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-[var(--text-muted)]">
                      {getInitials(player.first_name, player.last_name)}
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-[var(--text-primary)]">
                    {player.first_name} {player.last_name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
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
            <h2 className="font-heading font-bold text-2xl text-[var(--text-primary)] mb-6">
              Realizační tým
            </h2>
            <div className="space-y-3">
              {staff.map((s) => (
                <div
                  key={s.id}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-5 py-3 flex items-center justify-between"
                >
                  <span className="font-semibold text-[var(--text-primary)]">
                    {s.name}
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">{s.role}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Poslední zápasy */}
        {matches.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-2xl text-[var(--text-primary)] mb-6">
              Poslední zápasy
            </h2>
            <div className="space-y-2">
              {matches.map((match) => (
                <MatchCard key={match.id} {...match} />
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
