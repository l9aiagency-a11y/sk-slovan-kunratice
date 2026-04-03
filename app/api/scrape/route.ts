import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { scrapeStandings, scrapeMatches } from '@/lib/scraper';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET() {
  const sb = createServerClient();
  const results: Record<string, number | string> = {};

  try {
    // ── Standings ──────────────────────────────────────────────────
    const standings = await scrapeStandings();
    if (standings.length > 0) {
      // Replace all standings for this competition
      await sb
        .from('standings')
        .delete()
        .eq('competition', 'Pražský přebor 2025/2026');

      const { error } = await sb.from('standings').insert(
        standings.map((s) => ({
          ...s,
          competition: 'Pražský přebor 2025/2026',
          form: [],
        })),
      );
      if (error) throw new Error(`standings insert: ${error.message}`);
      results.standings = standings.length;
    } else {
      results.standings = 'skipped (empty)';
    }

    // ── Matches ───────────────────────────────────────────────────
    const matches = await scrapeMatches();
    if (matches.length > 0) {
      // Get Muži A team_id
      const { data: teamData } = await sb
        .from('teams')
        .select('id')
        .eq('slug', 'muzi-a')
        .single();
      const teamId = teamData?.id ?? null;

      // Upsert matches: delete old ones for Muži A, then insert fresh
      if (teamId) {
        await sb.from('matches').delete().eq('team_id', teamId);
      }

      const { error } = await sb.from('matches').insert(
        matches.map((m) => ({
          ...m,
          team_id: teamId,
        })),
      );
      if (error) throw new Error(`matches insert: ${error.message}`);
      results.matches = matches.length;
    } else {
      results.matches = 'skipped (empty)';
    }

    // ── Log success ────────────────────────────────────────────────
    await sb.from('admin_logs').insert({
      action: 'scrape',
      status: 'success',
      details: JSON.stringify(results),
    });

    return NextResponse.json({ success: true, ...results });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    // Log failure
    await sb.from('admin_logs').insert({
      action: 'scrape',
      status: 'error',
      details: message,
    });

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
