export interface Match {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  homeLogo?: string;
  awayLogo?: string;
  isHome: boolean;
  result: "W" | "D" | "L" | null;
  competition: string;
  round?: string;
  venue?: string;
}

export interface StandingRow {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ("W" | "D" | "L")[];
  isOwnTeam: boolean;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  coverImage?: string;
  slug: string;
}

export interface Team {
  name: string;
  slug: string;
  category: "men" | "youth" | "women" | "academy";
  ageGroup?: string;
  competition: string;
}

export interface Sponsor {
  name: string;
  logoUrl?: string;
  tier: "main" | "partner" | "supporter";
  websiteUrl?: string;
}

// ─── Next match ────────────────────────────────────────────────────────────────

export const MOCK_NEXT_MATCH: Partial<Match> & {
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue: string;
  isHome: boolean;
  competition: string;
} = {
  homeTeam: "SK Sl. Kunratice",
  awayTeam: "Aritma Praha B",
  date: "2026-04-04T15:00:00+02:00",
  venue: "Volarská",
  isHome: true,
  competition: "Pražský přebor",
};

// ─── Recent results ────────────────────────────────────────────────────────────

export const MOCK_RESULTS: Match[] = [
  {
    id: "r-18",
    date: "29. 3.",
    homeTeam: "Kbely",
    awayTeam: "SK Sl. Kunratice",
    homeScore: 2,
    awayScore: 2,
    isHome: false,
    result: "D",
    competition: "Pražský přebor",
    round: "18. kolo",
    venue: "Kbely",
  },
  {
    id: "r-17",
    date: "22. 3.",
    homeTeam: "SK Sl. Kunratice",
    awayTeam: "Podolí",
    homeScore: 5,
    awayScore: 0,
    isHome: true,
    result: "W",
    competition: "Pražský přebor",
    round: "17. kolo",
    venue: "Volarská",
  },
  {
    id: "r-16",
    date: "15. 3.",
    homeTeam: "Kolovraty",
    awayTeam: "SK Sl. Kunratice",
    homeScore: 1,
    awayScore: 0,
    isHome: false,
    result: "L",
    competition: "Pražský přebor",
    round: "16. kolo",
    venue: "Kolovraty",
  },
  {
    id: "r-15",
    date: "8. 3.",
    homeTeam: "SK Sl. Kunratice",
    awayTeam: "Hostivař B",
    homeScore: 3,
    awayScore: 1,
    isHome: true,
    result: "W",
    competition: "Pražský přebor",
    round: "15. kolo",
    venue: "Volarská",
  },
];

// ─── Standings ─────────────────────────────────────────────────────────────────

export const MOCK_STANDINGS: StandingRow[] = [
  {
    position: 1,
    team: "Motorlet B",
    played: 18,
    won: 14,
    drawn: 2,
    lost: 2,
    goalsFor: 42,
    goalsAgainst: 12,
    points: 44,
    form: ["W", "W", "W", "D", "W"],
    isOwnTeam: false,
  },
  {
    position: 2,
    team: "Čechie Uhříněves",
    played: 18,
    won: 12,
    drawn: 3,
    lost: 3,
    goalsFor: 38,
    goalsAgainst: 18,
    points: 39,
    form: ["W", "L", "W", "W", "D"],
    isOwnTeam: false,
  },
  {
    position: 3,
    team: "Kbely",
    played: 18,
    won: 11,
    drawn: 4,
    lost: 3,
    goalsFor: 35,
    goalsAgainst: 20,
    points: 37,
    form: ["D", "W", "W", "L", "W"],
    isOwnTeam: false,
  },
  {
    position: 4,
    team: "SK Sl. Kunratice",
    played: 18,
    won: 10,
    drawn: 3,
    lost: 5,
    goalsFor: 33,
    goalsAgainst: 22,
    points: 33,
    form: ["D", "W", "L", "W", "W"],
    isOwnTeam: true,
  },
  {
    position: 5,
    team: "Aritma Praha B",
    played: 18,
    won: 9,
    drawn: 4,
    lost: 5,
    goalsFor: 30,
    goalsAgainst: 25,
    points: 31,
    form: ["L", "W", "D", "W", "L"],
    isOwnTeam: false,
  },
  {
    position: 6,
    team: "Podolí",
    played: 18,
    won: 8,
    drawn: 3,
    lost: 7,
    goalsFor: 25,
    goalsAgainst: 28,
    points: 27,
    form: ["L", "L", "W", "D", "W"],
    isOwnTeam: false,
  },
  {
    position: 7,
    team: "Hostivař B",
    played: 18,
    won: 7,
    drawn: 4,
    lost: 7,
    goalsFor: 24,
    goalsAgainst: 26,
    points: 25,
    form: ["L", "W", "L", "W", "D"],
    isOwnTeam: false,
  },
  {
    position: 8,
    team: "Kolovraty",
    played: 18,
    won: 6,
    drawn: 5,
    lost: 7,
    goalsFor: 22,
    goalsAgainst: 25,
    points: 23,
    form: ["W", "L", "D", "L", "W"],
    isOwnTeam: false,
  },
];

// ─── News articles ─────────────────────────────────────────────────────────────

export const MOCK_NEWS: Article[] = [
  {
    id: "news-1",
    title: "Kunratice deklasovaly Podolí 5:0",
    excerpt:
      "Domácí výkon soboty patřil jednoznačně Kunraticím. Pět branek ve třech čtvrtinách zápasu potvrdilo aktuální formu mužů A a posunulo je na čtvrté místo tabulky Pražského přeboru.",
    date: "2026-03-22",
    category: "Muži",
    slug: "kunratice-deklasovaly-podoli-5-0",
  },
  {
    id: "news-2",
    title: "Jarní příprava: nové posily v kádru",
    excerpt:
      "Vedení klubu potvrdilo příchod dvou nových hráčů před jarní částí sezony. Kádr mužů A se rozšíří o ofenzivní zálohu a zkušeného stopera z pražské I. A třídy.",
    date: "2026-02-15",
    category: "Klub",
    slug: "jarni-priprava-nove-posily-v-kadru",
  },
  {
    id: "news-3",
    title: "Mládežnický turnaj O pohár starosty",
    excerpt:
      "Tradičního turnaje O pohár starosty MČ Kunratice se letos zúčastnilo osm mládežnických týmů. Naši žáci U13 postoupili do finále a obsadili skvělé druhé místo.",
    date: "2026-03-01",
    category: "Mládež",
    slug: "mladeznicke-turnaj-o-pohar-starosty",
  },
  {
    id: "news-4",
    title: "Výroční valná hromada klubu",
    excerpt:
      "Na výroční valné hromadě SK Slovan Kunratice byl schválen rozpočet na rok 2026, zvoleno nové vedení a představeny plány rozšíření mládežnické akademie o kategorie U5 a U7.",
    date: "2026-01-10",
    category: "Klub",
    slug: "vyrocni-valna-hromada-klubu",
  },
];

// ─── Teams ─────────────────────────────────────────────────────────────────────

export const MOCK_TEAMS: Team[] = [
  { name: "Muži A", slug: "muzi-a", category: "men", ageGroup: "Dospělí", competition: "Pražský přebor" },
  { name: "Muži B", slug: "muzi-b", category: "men", ageGroup: "Dospělí", competition: "I.B třída" },
  { name: "Starší dorost", slug: "starsi-dorost", category: "youth", ageGroup: "U19", competition: "Dorostenecká liga" },
  { name: "Mladší dorost", slug: "mladsi-dorost", category: "youth", ageGroup: "U17", competition: "Dorostenecká liga" },
  { name: "Starší žáci", slug: "starsi-zaci", category: "youth", ageGroup: "U15", competition: "Žákovská liga" },
  { name: "Mladší žáci", slug: "mladsi-zaci", category: "youth", ageGroup: "U13", competition: "Žákovská liga" },
  { name: "Mladší žáci B", slug: "mladsi-zaci-b", category: "youth", ageGroup: "U13", competition: "Žákovská liga" },
  { name: "Starší přípravka", slug: "starsi-pripravka", category: "academy", ageGroup: "U11", competition: "Přípravky" },
  { name: "Mladší přípravka", slug: "mladsi-pripravka", category: "academy", ageGroup: "U9", competition: "Přípravky" },
  { name: "Předpřípravka", slug: "predpripravka", category: "academy", ageGroup: "U7", competition: "Přípravky" },
  { name: "Školička", slug: "skolicky", category: "academy", ageGroup: "U5", competition: "Školička fotbalu" },
  { name: "Ženy", slug: "zeny", category: "women", ageGroup: "Dospělé", competition: "Pražský přebor žen" },
];

// ─── Sponsors ──────────────────────────────────────────────────────────────────

export const MOCK_SPONSORS: Sponsor[] = [
  { name: "MČ Kunratice", tier: "main", websiteUrl: "https://www.kunratice.cz" },
  { name: "Hlavní město Praha", tier: "main", websiteUrl: "https://www.praha.eu" },
  { name: "Pražský fotbalový svaz", tier: "partner", websiteUrl: "https://www.prazskyfs.cz" },
  { name: "FAČR", tier: "partner", websiteUrl: "https://www.fotbal.cz" },
  { name: "Veolia Pražská teplárenská", tier: "partner" },
  { name: "Auto Jarov", tier: "partner" },
  { name: "MŠMT", tier: "supporter", websiteUrl: "https://www.msmt.cz" },
  { name: "NSA", tier: "supporter", websiteUrl: "https://www.olympic.cz/nsa" },
];
