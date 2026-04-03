import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { TEAM_COMPETITIONS } from '@/lib/scraper';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const BASE_URL = 'https://www.fotbalpraha.cz';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

export async function GET() {
  const logoMap: Record<string, string> = {};

  for (const config of TEAM_COMPETITIONS) {
    const url = `${BASE_URL}/souteze/tabulka/${config.slug}?id_season=${config.seasonParam}`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      const html = await res.text();
      const $ = cheerio.load(html);

      $('tbody tr').each((_, tr) => {
        const tds = $(tr).find('td');
        if (tds.length < 2) return;

        const teamTd = $(tds[1]);
        let teamName =
          teamTd.find('span.middle').text().trim() ||
          teamTd.find('span.long').text().trim() ||
          teamTd.text().trim();
        teamName = teamName.replace(/\s+/g, ' ').trim();

        const img = teamTd.find('img').attr('src');
        if (img && teamName) {
          const fullUrl = img.startsWith('http') ? img : `${BASE_URL}${img}`;
          logoMap[teamName] = fullUrl.split('?')[0];
        }
      });

      // Polite delay
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.warn(`[scrape-logos] Failed ${config.slug}:`, err);
    }
  }

  // Write to public directory
  const filePath = join(process.cwd(), 'public', 'team-logos.json');
  await writeFile(filePath, JSON.stringify(logoMap, null, 2));

  return NextResponse.json({
    status: 'ok',
    teams: Object.keys(logoMap).length,
    logos: logoMap,
  });
}
