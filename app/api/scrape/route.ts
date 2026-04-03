import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { scrapeAndStoreAllTeams } from '@/lib/scrape-all-teams';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  const sb = createServerClient();

  try {
    const results = await scrapeAndStoreAllTeams();

    // Log success
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
