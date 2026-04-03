import { MOCK_SPONSORS, Sponsor } from "@/lib/mock-data";

const tierClasses: Record<Sponsor["tier"], string> = {
  main: "px-6 py-3 text-sm font-semibold text-[var(--text-primary)] border-[var(--club-primary)]/30",
  partner: "px-5 py-2.5 text-xs font-medium text-[var(--text-secondary)]",
  supporter: "px-4 py-2 text-xs text-[var(--text-muted)]",
};

export default function Sponsors() {
  return (
    <div className="py-12 border-t border-[var(--border)]">
      <p className="text-center text-[var(--text-muted)] text-xs uppercase tracking-widest mb-6">
        Partneři a sponzoři
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {MOCK_SPONSORS.map((sponsor) => (
          <div
            key={sponsor.name}
            className={`bg-[var(--bg-surface)] rounded-lg border border-[var(--border)] transition-all duration-300 hover:border-[var(--club-primary)]/50 hover:bg-[var(--bg-elevated)] flex items-center ${tierClasses[sponsor.tier]}`}
          >
            {sponsor.name}
          </div>
        ))}
      </div>
    </div>
  );
}
