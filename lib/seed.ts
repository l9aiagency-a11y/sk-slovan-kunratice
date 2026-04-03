import { createServerClient } from './supabase';
import {
  MOCK_TEAMS,
  MOCK_SPONSORS,
  MOCK_STANDINGS,
  MOCK_RESULTS,
  MOCK_NEWS,
  MOCK_NEXT_MATCH,
} from './mock-data';

export async function seed() {
  const sb = createServerClient();
  const log: string[] = [];

  // 1. Club settings — delete existing, then insert fresh
  await sb.from('club_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: clubErr } = await sb.from('club_settings').insert({
    name: 'SK Slovan Kunratice',
    logo_url: '/logo.png',
    primary_color: '#1B6B3A',
    secondary_color: '#2563EB',
    accent_color: '#F5A623',
    address: 'Volarská 5, Praha - Kunratice, 148 00',
    phone: '774 897 881',
    email: 'skkunratice.fotbal@seznam.cz',
    facebook_url: 'https://www.facebook.com/fotbalkunratice',
    motto: '"druhý nejznámější fotbalový balet"',
    tagline: 'Kunratičtí hrají fotbal s příběhem, a to bez ohledu na výsledek.',
  });
  if (clubErr) throw new Error(`club_settings: ${clubErr.message}`);
  log.push('club_settings: 1 row');

  // 2. Teams
  const teamRows = MOCK_TEAMS.map((t, i) => ({
    name: t.name,
    slug: t.slug,
    category: t.category,
    age_group: t.ageGroup || null,
    competition: t.competition,
    sort_order: i,
    is_active: true,
  }));
  const { error: teamsErr } = await sb
    .from('teams')
    .upsert(teamRows, { onConflict: 'slug' });
  if (teamsErr) throw new Error(`teams: ${teamsErr.message}`);
  log.push(`teams: ${teamRows.length} rows`);

  // 3. Sponsors
  const sponsorRows = MOCK_SPONSORS.map((s, i) => ({
    name: s.name,
    tier: s.tier,
    website_url: s.websiteUrl || null,
    sort_order: i,
    is_active: true,
  }));
  await sb.from('sponsors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: sponsErr } = await sb.from('sponsors').insert(sponsorRows);
  if (sponsErr) throw new Error(`sponsors: ${sponsErr.message}`);
  log.push(`sponsors: ${sponsorRows.length} rows`);

  // 4. Standings
  const standingRows = MOCK_STANDINGS.map((s) => ({
    competition: 'Pražský přebor 2025/2026',
    team_name: s.team,
    position: s.position,
    played: s.played,
    won: s.won,
    drawn: s.drawn,
    lost: s.lost,
    goals_for: s.goalsFor,
    goals_against: s.goalsAgainst,
    points: s.points,
    form: s.form,
    is_own_team: s.isOwnTeam,
  }));
  // Delete old standings first, then insert fresh
  await sb.from('standings').delete().eq('competition', 'Pražský přebor 2025/2026');
  const { error: standErr } = await sb.from('standings').insert(standingRows);
  if (standErr) throw new Error(`standings: ${standErr.message}`);
  log.push(`standings: ${standingRows.length} rows`);

  // 5. Get Muži A team id
  const { data: muziA } = await sb
    .from('teams')
    .select('id')
    .eq('slug', 'muzi-a')
    .single();
  const teamId = muziA?.id ?? null;

  // 6. Matches — recent results
  const matchRows = MOCK_RESULTS.map((m) => ({
    team_id: teamId,
    date: parseCzechDate(m.date, m.id),
    home_team: m.homeTeam,
    away_team: m.awayTeam,
    home_score: m.homeScore,
    away_score: m.awayScore,
    is_home: m.isHome,
    competition: m.competition,
    round: m.round || null,
    venue: m.venue || null,
  }));
  // Delete old matches for the team before re-inserting
  if (teamId) {
    await sb.from('matches').delete().eq('team_id', teamId);
  }
  const { error: matchErr } = await sb.from('matches').insert(matchRows);
  if (matchErr) throw new Error(`matches: ${matchErr.message}`);
  log.push(`matches (results): ${matchRows.length} rows`);

  // 7. Upcoming match
  const { error: nextErr } = await sb.from('matches').insert({
    team_id: teamId,
    date: MOCK_NEXT_MATCH.date,
    home_team: MOCK_NEXT_MATCH.homeTeam,
    away_team: MOCK_NEXT_MATCH.awayTeam,
    home_score: null,
    away_score: null,
    is_home: MOCK_NEXT_MATCH.isHome,
    competition: MOCK_NEXT_MATCH.competition,
    venue: MOCK_NEXT_MATCH.venue,
  });
  if (nextErr) throw new Error(`matches (next): ${nextErr.message}`);
  log.push('matches (upcoming): 1 row');

  // 8. Articles
  const articleRows = MOCK_NEWS.map((a) => ({
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    body: a.excerpt, // use excerpt as body placeholder
    category: a.category,
    is_published: true,
    published_at: a.date,
  }));
  // Upsert by slug
  const { error: artErr } = await sb
    .from('articles')
    .upsert(articleRows, { onConflict: 'slug' });
  if (artErr) throw new Error(`articles: ${artErr.message}`);
  log.push(`articles: ${articleRows.length} rows`);

  console.log('Seed completed:', log.join(', '));
  return log;
}

/**
 * Parse Czech date shorthand like "29. 3." into ISO date for 2026.
 * Falls back to a reasonable date if parsing fails.
 */
function parseCzechDate(dateStr: string, id: string): string {
  // "29. 3." -> day=29, month=3
  const match = dateStr.match(/(\d+)\.\s*(\d+)\./);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    return `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T14:00:00+02:00`;
  }
  // If already ISO-ish, return as-is
  if (dateStr.includes('-')) return dateStr;
  // Fallback
  return '2026-03-01T14:00:00+02:00';
}
