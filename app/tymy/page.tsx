import Link from "next/link";
import { createServerClient } from "@/lib/supabase";
import { MOCK_TEAMS, type Team } from "@/lib/mock-data";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import FadeIn from "@/components/ui/FadeIn";

export const revalidate = 300;

export const metadata = {
  title: "Naše týmy | SK Slovan Kunratice",
  description:
    "Přehled všech týmů SK Slovan Kunratice — muži A, muži B, dorost, žáci a mládežnická akademie od U5 po U19.",
  openGraph: {
    title: "Naše týmy | SK Slovan Kunratice",
    description:
      "Přehled všech týmů SK Slovan Kunratice — muži, dorost, žáci a mládežnická akademie.",
  },
};

const categoryBadge: Record<Team["category"], { label: string; color: string }> = {
  men: { label: "Muži", color: "bg-[var(--club-primary)]/15 text-[var(--club-primary)]" },
  youth: { label: "Mládež", color: "bg-[var(--club-accent)]/15 text-[var(--club-accent)]" },
  women: { label: "Ženy", color: "bg-purple-500/15 text-purple-400" },
  academy: { label: "Akademie", color: "bg-[var(--club-secondary)]/15 text-[var(--club-secondary)]" },
};

export default async function TymyPage() {
  const sb = createServerClient();

  const { data: teamRows } = await sb
    .from("teams")
    .select("*")
    .order("sort_order", { ascending: true });

  const teams: Team[] =
    teamRows && teamRows.length > 0
      ? teamRows.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          category: t.category,
          ageGroup: t.age_group,
          competition: t.competition,
        }))
      : MOCK_TEAMS;

  return (
    <main>
      <PageHero title="Naše týmy" subtitle="12 týmů od mužů po školičku" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => {
            const badge = categoryBadge[team.category];
            return (
              <Link key={team.slug} href={`/tymy/${team.slug}`}>
                <Card className="p-5 relative">
                  <span
                    className={`absolute top-4 right-4 text-[10px] uppercase font-semibold rounded-full px-2 py-0.5 ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                  <h2 className="font-heading font-semibold text-lg text-gray-900">
                    {team.name}
                  </h2>
                  {team.ageGroup && (
                    <p className="text-sm text-[var(--club-accent)] mt-1">{team.ageGroup}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">{team.competition}</p>
                </Card>
              </Link>
            );
          })}
        </div>
        </FadeIn>
      </div>
    </main>
  );
}
