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
  logoUrl?: string | null;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  body?: string;
  date: string;
  category: string;
  coverImage?: string;
  slug: string;
  author?: string;
  is_published?: boolean;
}

export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  number?: number;
  position: "GK" | "DEF" | "MID" | "FWD";
  team_id?: string;
  sort_order?: number;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  team_id?: string;
}

export interface Team {
  id?: string;
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
    coverImage: "/images/match-01.jpg",
    excerpt:
      "Domácí výkon soboty patřil jednoznačně Kunraticím. Pět branek ve třech čtvrtinách zápasu potvrdilo aktuální formu mužů A a posunulo je na čtvrté místo tabulky Pražského přeboru.",
    body: `# Kunratice deklasovaly Podolí 5:0

Domácí výkon soboty patřil jednoznačně Kunraticím. Pět branek ve třech čtvrtinách zápasu potvrdilo aktuální formu mužů A a posunulo je na čtvrté místo tabulky Pražského přeboru.

## Průběh zápasu

Od prvních minut bylo jasné, že Kunratice přišly na hřiště s jasným cílem. Už v 8. minutě otevřel skóre kapitán Novák přesnou hlavičkou po rohovém kopu.

Podolí se snažilo odpovědět, ale obrana Kunratic stála pevně. Ve 25. minutě zvýšil na 2:0 Dvořák po krásné kombinaci přes levou stranu.

## Druhý poločas

Do druhé půle vstoupily Kunratice stejně aktivně. Tři branky v rozmezí 55.–72. minuty definitivně rozhodly o osudu zápasu.

**Branky:** Novák 8', Dvořák 25', Svoboda 55', Procházka 63', Jelínek 72'

**Sestava:** Král – Marek, Veselý, Černý, Horák – Dvořák, Kučera, Novák (C) – Svoboda, Procházka, Jelínek`,
    date: "2026-03-22",
    category: "Muži",
    author: "Redakce SK Slovan",
    slug: "kunratice-deklasovaly-podoli-5-0",
    is_published: true,
  },
  {
    id: "news-2",
    title: "Jarní příprava: nové posily v kádru",
    coverImage: "/images/match-atmosphere.jpg",
    excerpt:
      "Vedení klubu potvrdilo příchod dvou nových hráčů před jarní částí sezony. Kádr mužů A se rozšíří o ofenzivní zálohu a zkušeného stopera z pražské I. A třídy.",
    body: `# Jarní příprava: nové posily v kádru

Vedení klubu potvrdilo příchod dvou nových hráčů před jarní částí sezony.

## Nové tváře

Kádr mužů A se rozšíří o **ofenzivní zálohu Tomáše Fialu** z FK Admira Praha a **zkušeného stopera Martina Beneše** z SK Újezd, který má za sebou několik sezon v pražské I. A třídě.

> „Oba hráči výborně zapadnou do naší herní koncepce. Tomáš přinese kreativitu do středu hřiště a Martin zkušenosti do obrany," říká trenér Ladislav Kohout.

## Přípravné zápasy

V rámci zimní přípravy odehrály Kunratice čtyři přátelské zápasy se smíšenou bilancí 2-1-1.`,
    date: "2026-02-15",
    category: "Klub",
    author: "Redakce SK Slovan",
    slug: "jarni-priprava-nove-posily-v-kadru",
    is_published: true,
  },
  {
    id: "news-3",
    title: "Mládežnický turnaj O pohár starosty",
    coverImage: "/images/youth-training.jpg",
    excerpt:
      "Tradičního turnaje O pohár starosty MČ Kunratice se letos zúčastnilo osm mládežnických týmů. Naši žáci U13 postoupili do finále a obsadili skvělé druhé místo.",
    body: `# Mládežnický turnaj O pohár starosty

Tradičního turnaje O pohár starosty MČ Kunratice se letos zúčastnilo osm mládežnických týmů z celé Prahy.

## Výsledky našich týmů

Naši žáci **U13** postoupili do finále a obsadili skvělé **druhé místo**. Ve finále podlehli domácímu celku FK Meteor Praha až po penaltovém rozstřelu.

Kategorie U11 obsadila čtvrté místo po prohře v souboji o bronz.

## Poděkování

Děkujeme všem rodičům a dobrovolníkům, kteří pomohli s organizací turnaje!`,
    date: "2026-03-01",
    category: "Mládež",
    author: "Vedení mládeže",
    slug: "mladeznicke-turnaj-o-pohar-starosty",
    is_published: true,
  },
  {
    id: "news-4",
    title: "Výroční valná hromada klubu",
    coverImage: "/images/field.jpg",
    excerpt:
      "Na výroční valné hromadě SK Slovan Kunratice byl schválen rozpočet na rok 2026, zvoleno nové vedení a představeny plány rozšíření mládežnické akademie o kategorie U5 a U7.",
    body: `# Výroční valná hromada klubu

Na výroční valné hromadě SK Slovan Kunratice byl schválen rozpočet na rok 2026.

## Hlavní body

- Schválen rozpočet na rok 2026
- Zvoleno nové vedení klubu
- Představeny plány rozšíření mládežnické akademie o kategorie **U5** a **U7**
- Diskuze o rekonstrukci šaten a zázemí

## Nové vedení

Předsedou klubu byl opětovně zvolen **Ing. Pavel Kovář**, místopředsedou se stal **Josef Malý**.`,
    date: "2026-01-10",
    category: "Klub",
    author: "Vedení klubu",
    slug: "vyrocni-valna-hromada-klubu",
    is_published: true,
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

// ─── Players (Muži A mock roster) ────────────────────────────────────────────

export const MOCK_PLAYERS: Player[] = [
  { id: "p1", first_name: "Jan", last_name: "Král", number: 1, position: "GK", sort_order: 1 },
  { id: "p2", first_name: "Tomáš", last_name: "Marek", number: 2, position: "DEF", sort_order: 2 },
  { id: "p3", first_name: "Petr", last_name: "Veselý", number: 3, position: "DEF", sort_order: 3 },
  { id: "p4", first_name: "Martin", last_name: "Černý", number: 4, position: "DEF", sort_order: 4 },
  { id: "p5", first_name: "Lukáš", last_name: "Horák", number: 5, position: "DEF", sort_order: 5 },
  { id: "p6", first_name: "Jakub", last_name: "Dvořák", number: 6, position: "MID", sort_order: 6 },
  { id: "p7", first_name: "Filip", last_name: "Kučera", number: 7, position: "MID", sort_order: 7 },
  { id: "p8", first_name: "David", last_name: "Novák", number: 8, position: "MID", sort_order: 8 },
  { id: "p9", first_name: "Ondřej", last_name: "Svoboda", number: 9, position: "FWD", sort_order: 9 },
  { id: "p10", first_name: "Adam", last_name: "Procházka", number: 10, position: "FWD", sort_order: 10 },
  { id: "p11", first_name: "Matěj", last_name: "Jelínek", number: 11, position: "FWD", sort_order: 11 },
  { id: "p12", first_name: "Vojtěch", last_name: "Šťastný", number: 12, position: "GK", sort_order: 12 },
  { id: "p13", first_name: "Radek", last_name: "Fiala", number: 14, position: "MID", sort_order: 13 },
  { id: "p14", first_name: "Jiří", last_name: "Beneš", number: 15, position: "DEF", sort_order: 14 },
];

// ─── Staff ────────────────────────────────────────────────────────────────────

export const MOCK_STAFF: Staff[] = [
  { id: "s1", name: "Ladislav Kohout", role: "Hlavní trenér" },
  { id: "s2", name: "Karel Vrána", role: "Asistent trenéra" },
  { id: "s3", name: "Petr Sedláček", role: "Trenér brankářů" },
];
