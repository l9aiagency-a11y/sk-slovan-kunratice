import { MOCK_TEAMS } from "@/lib/mock-data";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

function ageGroupEmoji(ageGroup?: string): string {
  if (!ageGroup) return "⚽";
  const ag = ageGroup.toUpperCase();
  if (ag === "U19" || ag === "U17") return "⚽";
  if (ag === "U15" || ag === "U13") return "🏃";
  return "⭐";
}

export default function YouthSection() {
  const youthTeams = MOCK_TEAMS.filter(
    (t) => t.category === "youth" || t.category === "academy"
  );

  return (
    <section>
      <SectionHeader title="Mládežnický fotbal" />
      <div className="flex gap-3 overflow-x-auto lg:grid lg:grid-cols-4 pb-2 mt-6">
        {youthTeams.map((team) => (
          <div
            key={team.slug}
            className="bg-[var(--bg-card)] border border-[var(--border)] border-t-2 border-t-[var(--club-primary)] rounded-xl p-4 min-w-[200px] shrink-0"
          >
            <p className="font-heading font-semibold text-sm text-[var(--text-primary)]">
              {ageGroupEmoji(team.ageGroup)} {team.name}
            </p>
            {team.ageGroup && (
              <p className="text-[var(--club-accent)] font-semibold text-xs mt-1">{team.ageGroup}</p>
            )}
            <p className="text-[var(--text-secondary)] text-xs mt-0.5">{team.competition}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Button variant="primary" href="/prihlaska">
          Přihlaste své dítě →
        </Button>
      </div>
    </section>
  );
}
