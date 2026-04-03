import { createServerClient } from './supabase';
import {
  scrapeAllTeams,
  TEAM_COMPETITIONS,
  type TeamScrapeResult,
} from './scraper';

/**
 * Scrape standings + matches for all known Kunratice teams
 * and upsert into Supabase.
 */
export async function scrapeAndStoreAllTeams() {
  const sb = createServerClient();
  const log: Record<string, string | number> = {};

  // 1. Scrape all competitions
  const results = await scrapeAllTeams();

  // 2. Get team IDs from DB
  const { data: teamRows } = await sb
    .from('teams')
    .select('id, slug, competition');
  const teamMap = new Map(
    (teamRows || []).map((t) => [t.slug, { id: t.id, competition: t.competition }]),
  );

  // 3. Update each team's competition name in DB if needed
  for (const config of TEAM_COMPETITIONS) {
    const team = teamMap.get(config.teamSlug);
    if (team && team.competition !== config.competitionName) {
      await sb
        .from('teams')
        .update({ competition: config.competitionName })
        .eq('id', team.id);
      console.log(
        `[scrape-all] Updated ${config.teamSlug} competition to "${config.competitionName}"`,
      );
    }
  }

  // 4. Store standings and matches for each team
  for (const result of results) {
    const team = teamMap.get(result.teamSlug);
    const teamId = team?.id ?? null;
    const competitionKey = `${result.competitionName} 2025/2026`;

    // ── Standings ──
    if (result.standings.length > 0) {
      // Delete existing standings for this competition
      await sb
        .from('standings')
        .delete()
        .eq('competition', competitionKey);

      // Compute form (last 5 results) for each team from scraped matches
      const teamFormMap = new Map<string, ('W' | 'D' | 'L')[]>();
      if (result.matches.length > 0) {
        // Sort matches by date descending
        const sortedMatches = [...result.matches].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        for (const m of sortedMatches) {
          if (m.home_score === null || m.away_score === null) continue;
          const teamKey = m.is_home ? m.home_team : m.away_team;
          const existing = teamFormMap.get(teamKey) || [];
          if (existing.length >= 5) continue;
          const ownScore = m.is_home ? m.home_score : m.away_score;
          const oppScore = m.is_home ? m.away_score : m.home_score;
          existing.push(ownScore > oppScore ? 'W' : ownScore < oppScore ? 'L' : 'D');
          teamFormMap.set(teamKey, existing);
        }
      }

      const { error } = await sb.from('standings').insert(
        result.standings.map((s) => ({
          ...s,
          competition: competitionKey,
          form: teamFormMap.get(s.team_name) || [],
        })),
      );
      if (error) {
        console.error(
          `[scrape-all] standings insert for ${result.teamSlug}:`,
          error.message,
        );
        log[`standings_${result.teamSlug}`] = `error: ${error.message}`;
      } else {
        log[`standings_${result.teamSlug}`] = result.standings.length;
      }
    } else {
      log[`standings_${result.teamSlug}`] = 'skipped (empty)';
    }

    // ── Matches ──
    if (result.matches.length > 0 && teamId) {
      // Delete old matches for this team
      await sb.from('matches').delete().eq('team_id', teamId);

      const { error } = await sb.from('matches').insert(
        result.matches.map((m) => ({
          ...m,
          team_id: teamId,
        })),
      );
      if (error) {
        console.error(
          `[scrape-all] matches insert for ${result.teamSlug}:`,
          error.message,
        );
        log[`matches_${result.teamSlug}`] = `error: ${error.message}`;
      } else {
        log[`matches_${result.teamSlug}`] = result.matches.length;
      }
    } else {
      log[`matches_${result.teamSlug}`] =
        result.matches.length === 0
          ? 'skipped (empty)'
          : 'skipped (no team_id)';
    }
  }

  console.log('[scrape-all] Complete:', log);
  return log;
}
