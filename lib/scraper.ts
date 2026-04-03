import * as cheerio from 'cheerio';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const STANDINGS_URL =
  'https://www.fotbalpraha.cz/souteze/tabulka/647-5-liga-veolia-prazska-teplarenska-prebor-muzu?id_season=2025';

const MATCHES_URL =
  'https://www.fotbalpraha.cz/souteze/zapasy/647-5-liga-veolia-prazska-teplarenska-prebor-muzu?id_season=2025';

const OWN_TEAM_KEYWORDS = ['kunratice', 'sl. kunratice', 'sk slovan kunratice'];

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!res.ok) throw new Error(`Fetch ${url} returned ${res.status}`);
  return res.text();
}

// ─── Standings ──────────────────────────────────────────────────────────────

export interface ScrapedStanding {
  position: number;
  team_name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  points: number;
  is_own_team: boolean;
}

export async function scrapeStandings(
  url: string = STANDINGS_URL,
): Promise<ScrapedStanding[]> {
  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);
    const rows: ScrapedStanding[] = [];

    $('tbody tr').each((_, tr) => {
      const tds = $(tr).find('td');
      if (tds.length < 8) return;

      const posText = $(tds[0]).text().trim().replace('.', '');
      const position = parseInt(posText, 10);
      if (isNaN(position)) return;

      // Team name — use .middle span for cleaner name
      const teamTd = $(tds[1]);
      let teamName =
        teamTd.find('span.middle').text().trim() ||
        teamTd.find('span.long').text().trim() ||
        teamTd.text().trim();
      // Clean up extra whitespace and quotes
      teamName = teamName.replace(/\s+/g, ' ').trim();

      const played = parseInt($(tds[2]).text().trim(), 10) || 0;
      const won = parseInt($(tds[3]).text().trim(), 10) || 0;
      const drawn = parseInt($(tds[4]).text().trim(), 10) || 0;
      const lost = parseInt($(tds[5]).text().trim(), 10) || 0;

      // Score column: "47:19"
      const scoreParts = $(tds[6]).text().trim().split(':');
      const goalsFor = parseInt(scoreParts[0], 10) || 0;
      const goalsAgainst = parseInt(scoreParts[1], 10) || 0;

      // Points — the column with class "selected" or index 7
      const points = parseInt($(tds[7]).text().trim(), 10) || 0;

      const isOwnTeam = OWN_TEAM_KEYWORDS.some((kw) =>
        teamName.toLowerCase().includes(kw),
      );

      rows.push({
        position,
        team_name: teamName,
        played,
        won,
        drawn,
        lost,
        goals_for: goalsFor,
        goals_against: goalsAgainst,
        points,
        is_own_team: isOwnTeam,
      });
    });

    console.log(`[scraper] Scraped ${rows.length} standings rows`);
    return rows;
  } catch (err) {
    console.warn('[scraper] Standings scrape failed:', err);
    return [];
  }
}

// ─── Matches ────────────────────────────────────────────────────────────────

export interface ScrapedMatch {
  date: string; // ISO string
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  is_home: boolean;
  competition: string;
  round: string | null;
}

export async function scrapeMatches(
  url: string = MATCHES_URL,
): Promise<ScrapedMatch[]> {
  try {
    await delay(2000); // polite delay
    const html = await fetchPage(url);
    const $ = cheerio.load(html);
    const matches: ScrapedMatch[] = [];

    $('tbody tr').each((_, tr) => {
      const tds = $(tr).find('td');
      if (tds.length < 7) return;

      // Date: "pá 03.04.2026"
      const dateText = $(tds[1]).text().trim();
      const timeText = $(tds[2]).text().trim();
      const isoDate = parseFotbalDate(dateText, timeText);
      if (!isoDate) return;

      // Home team
      const homeTeamTd = $(tds[4]);
      const homeTeam =
        homeTeamTd.find('span.middle').text().trim() ||
        homeTeamTd.find('span.long').text().trim() ||
        homeTeamTd.text().trim();

      // Score: "2:1" or "-:-"
      const scoreTd = $(tds[5]);
      const scoreText = scoreTd.find('a').text().trim();
      let homeScore: number | null = null;
      let awayScore: number | null = null;
      if (scoreText && scoreText !== '-:-') {
        const parts = scoreText.split(':');
        homeScore = parseInt(parts[0], 10);
        awayScore = parseInt(parts[1], 10);
        if (isNaN(homeScore)) homeScore = null;
        if (isNaN(awayScore)) awayScore = null;
      }

      // Away team
      const awayTeamTd = $(tds[6]);
      const awayTeam =
        awayTeamTd.find('span.middle').text().trim() ||
        awayTeamTd.find('span.long').text().trim() ||
        awayTeamTd.text().trim();

      // Is Kunratice playing?
      const homeLower = homeTeam.toLowerCase();
      const awayLower = awayTeam.toLowerCase();
      const isKunraticeHome = OWN_TEAM_KEYWORDS.some((kw) =>
        homeLower.includes(kw),
      );
      const isKunraticeAway = OWN_TEAM_KEYWORDS.some((kw) =>
        awayLower.includes(kw),
      );
      if (!isKunraticeHome && !isKunraticeAway) return;

      matches.push({
        date: isoDate,
        home_team: homeTeam.replace(/\s+/g, ' ').trim(),
        away_team: awayTeam.replace(/\s+/g, ' ').trim(),
        home_score: homeScore,
        away_score: awayScore,
        is_home: isKunraticeHome,
        competition: 'Pražský přebor',
        round: null,
      });
    });

    console.log(`[scraper] Scraped ${matches.length} Kunratice matches`);
    return matches;
  } catch (err) {
    console.warn('[scraper] Matches scrape failed:', err);
    return [];
  }
}

/**
 * Parse "pá 03.04.2026" + "10:15" into ISO date string.
 */
function parseFotbalDate(
  dateStr: string,
  timeStr: string,
): string | null {
  // "pá 03.04.2026" → extract DD.MM.YYYY
  const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const time = timeStr.trim() || '15:00';
  const [hh, mi] = time.split(':');
  return `${yyyy}-${mm}-${dd}T${(hh || '15').padStart(2, '0')}:${(mi || '00').padStart(2, '0')}:00+02:00`;
}
