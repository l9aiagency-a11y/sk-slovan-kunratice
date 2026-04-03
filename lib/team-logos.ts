import { readFile } from 'fs/promises';
import { join } from 'path';

let cachedLogos: Record<string, string> | null = null;
let cachedNormalized: Record<string, string> | null = null;

const KUNRATICE_LOGO = '/logo.png';

const KUNRATICE_KEYWORDS = ['kunratice', 'sl. kunratice', 'sk slovan'];

function isKunratice(name: string): boolean {
  const lower = name.toLowerCase();
  return KUNRATICE_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Normalize a team name for fuzzy matching:
 * - lowercase
 * - remove surrounding quotes from "B", "A" style suffixes → just B, A
 * - collapse whitespace
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/"\s*([a-z])\s*"/gi, ' $1')   // "B" → B
    .replace(/\s+/g, ' ')
    .trim();
}

export async function getTeamLogos(): Promise<Record<string, string>> {
  if (cachedLogos) return cachedLogos;
  try {
    const filePath = join(process.cwd(), 'public', 'team-logos.json');
    const data = await readFile(filePath, 'utf-8');
    const raw: Record<string, string> = JSON.parse(data);

    // Build normalized lookup
    const normalized: Record<string, string> = {};
    for (const [key, url] of Object.entries(raw)) {
      normalized[normalizeName(key)] = url;
    }
    cachedNormalized = normalized;
    cachedLogos = raw;
    return cachedLogos;
  } catch {
    return {};
  }
}

/**
 * Resolve a logo URL for any team name.
 * - Kunratice teams → /logo.png
 * - Exact match in logos JSON → that URL
 * - Normalized fuzzy match → that URL
 * - No match → undefined
 */
export function resolveTeamLogo(
  teamName: string,
  logos: Record<string, string>,
): string | undefined {
  if (isKunratice(teamName)) return KUNRATICE_LOGO;

  // Exact match
  if (logos[teamName]) return logos[teamName];

  // Normalized fuzzy match
  const norm = normalizeName(teamName);
  if (cachedNormalized && cachedNormalized[norm]) return cachedNormalized[norm];

  // Rebuild normalized cache inline if not cached yet
  const normalized: Record<string, string> = {};
  for (const [key, url] of Object.entries(logos)) {
    normalized[normalizeName(key)] = url;
  }
  return normalized[norm];
}

export function enrichWithLogos<T extends { team: string }>(
  rows: T[],
  logos: Record<string, string>,
): (T & { logoUrl: string | null })[] {
  return rows.map((row) => ({
    ...row,
    logoUrl: resolveTeamLogo(row.team, logos) || null,
  }));
}
