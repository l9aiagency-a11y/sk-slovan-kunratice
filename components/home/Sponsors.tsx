import { MOCK_SPONSORS, Sponsor } from "@/lib/mock-data";

const heightMap: Record<Sponsor["tier"], string> = {
  main: "h-12",
  partner: "h-8",
  supporter: "h-6",
};

export default function Sponsors() {
  return (
    <div className="py-12 border-t border-[var(--border)]">
      <p className="text-center text-[var(--text-muted)] text-xs uppercase tracking-widest mb-6">
        Partneři a sponzoři
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8">
        {MOCK_SPONSORS.map((sponsor) => (
          <div
            key={sponsor.name}
            className={`${heightMap[sponsor.tier]} opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-105 transition-all duration-300 flex items-center`}
          >
            <div className="bg-[var(--bg-surface)] rounded-lg px-4 py-2 text-[var(--text-muted)] text-xs font-medium h-full flex items-center">
              {sponsor.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
