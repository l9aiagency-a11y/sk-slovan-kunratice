import * as cheerio from 'cheerio';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const BASE_URL = 'https://www.fotbalpraha.cz';

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

// ─── Team-competition mapping ──────────────────────────────────────────────

/**
 * Known competitions for each team on fotbalpraha.cz.
 * The slug is the URL path segment after /souteze/tabulka/ or /souteze/zapasy/.
 */
export interface CompetitionConfig {
  teamSlug: string;       // our DB slug (e.g. "muzi-a")
  competitionId: number;
  slug: string;           // full URL slug (e.g. "647-5-liga-...")
  competitionName: string;
  seasonParam: string;    // e.g. "2025" for 2025/2026 season
}

export const TEAM_COMPETITIONS: CompetitionConfig[] = [
  {
    teamSlug: 'muzi-a',
    competitionId: 647,
    slug: '647-5-liga-veolia-prazska-teplarenska-prebor-muzu',
    competitionName: 'Pražský přebor mužů',
    seasonParam: '2025',
  },
  {
    teamSlug: 'muzi-b',
    competitionId: 652,
    slug: '652-7-liga-a3b-1-b-trida-skupina-b-muzu',
    competitionName: 'I.B třída sk. B mužů',
    seasonParam: '2025',
  },
  {
    teamSlug: 'starsi-dorost',
    competitionId: 660,
    slug: '660-c2a-1-a-trida-starsiho-dorostu',
    competitionName: '1.A třída staršího dorostu',
    seasonParam: '2025',
  },
  {
    teamSlug: 'mladsi-dorost',
    competitionId: 663,
    slug: '663-d2a-1-trida-mladsiho-dorostu',
    competitionName: '1. třída mladšího dorostu',
    seasonParam: '2025',
  },
  {
    teamSlug: 'starsi-zaci',
    competitionId: 670,
    slug: '670-e4a-2-trida-skupina-a-starsich-zaku',
    competitionName: '2. třída sk. A starších žáků',
    seasonParam: '2025',
  },
  {
    teamSlug: 'mladsi-zaci',
    competitionId: 674,
    slug: '674-f2a-1-trida-skupina-a-mladsich-zaku',
    competitionName: '1. třída sk. A mladších žáků',
    seasonParam: '2025',
  },
  {
    teamSlug: 'mladsi-zaci-b',
    competitionId: 679,
    slug: '679-f4d-2-trida-skupina-d-mladsich-zaku',
    competitionName: '2. třída sk. D mladších žáků',
    seasonParam: '2025',
  },
];

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
  logo_url: string | null;
}

export async function scrapeStandings(
  urlOrSlug?: string,
  seasonParam?: string,
): Promise<ScrapedStanding[]> {
  const url = urlOrSlug?.startsWith('http')
    ? urlOrSlug
    : `${BASE_URL}/souteze/tabulka/${urlOrSlug || '647-5-liga-veolia-prazska-teplarenska-prebor-muzu'}?id_season=${seasonParam || '2025'}`;

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
      teamName = teamName.replace(/\s+/g, ' ').trim();

      // Team logo
      const logoImg = teamTd.find('img').attr('src') || $(tds[0]).find('img').attr('src') || null;
      const logoUrl = logoImg
        ? (logoImg.startsWith('http') ? logoImg : `${BASE_URL}${logoImg}`).split('?')[0]
        : null;

      const played = parseInt($(tds[2]).text().trim(), 10) || 0;
      const won = parseInt($(tds[3]).text().trim(), 10) || 0;
      const drawn = parseInt($(tds[4]).text().trim(), 10) || 0;
      const lost = parseInt($(tds[5]).text().trim(), 10) || 0;

      const scoreParts = $(tds[6]).text().trim().split(':');
      const goalsFor = parseInt(scoreParts[0], 10) || 0;
      const goalsAgainst = parseInt(scoreParts[1], 10) || 0;

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
        logo_url: logoUrl,
      });
    });

    console.log(`[scraper] Scraped ${rows.length} standings rows from ${url}`);
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
  urlOrSlug?: string,
  seasonParam?: string,
  competitionName?: string,
): Promise<ScrapedMatch[]> {
  const url = urlOrSlug?.startsWith('http')
    ? urlOrSlug
    : `${BASE_URL}/souteze/zapasy/${urlOrSlug || '647-5-liga-veolia-prazska-teplarenska-prebor-muzu'}?id_season=${seasonParam || '2025'}&id_round=999`;

  const compName = competitionName || 'Pražský přebor';

  try {
    await delay(1500); // polite delay
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
        competition: compName,
        round: null,
      });
    });

    console.log(`[scraper] Scraped ${matches.length} Kunratice matches from ${url}`);
    return matches;
  } catch (err) {
    console.warn('[scraper] Matches scrape failed:', err);
    return [];
  }
}

// ─── Scrape all teams ───────────────────────────────────────────────────────

export interface TeamScrapeResult {
  teamSlug: string;
  competitionName: string;
  standings: ScrapedStanding[];
  matches: ScrapedMatch[];
}

export async function scrapeAllTeams(): Promise<TeamScrapeResult[]> {
  const results: TeamScrapeResult[] = [];

  for (const config of TEAM_COMPETITIONS) {
    console.log(`[scraper] Scraping ${config.teamSlug} — ${config.competitionName}`);

    const standings = await scrapeStandings(config.slug, config.seasonParam);
    const matches = await scrapeMatches(
      config.slug,
      config.seasonParam,
      config.competitionName,
    );

    results.push({
      teamSlug: config.teamSlug,
      competitionName: config.competitionName,
      standings,
      matches,
    });

    // Polite delay between competitions
    await delay(1000);
  }

  return results;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Parse "pá 03.04.2026" + "10:15" into ISO date string.
 */
function parseFotbalDate(
  dateStr: string,
  timeStr: string,
): string | null {
  const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const time = timeStr.trim() || '15:00';
  const [hh, mi] = time.split(':');
  return `${yyyy}-${mm}-${dd}T${(hh || '15').padStart(2, '0')}:${(mi || '00').padStart(2, '0')}:00+02:00`;
}
