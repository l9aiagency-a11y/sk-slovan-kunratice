import Image from "next/image";
import Button from "@/components/ui/Button";
import CountdownTimer from "@/components/home/CountdownTimer";
import { MOCK_NEXT_MATCH } from "@/lib/mock-data";

const NEXT_MATCH = {
  homeTeam: "Kunratice",
  awayTeam: "Aritma B",
  date: MOCK_NEXT_MATCH.date,
  venue: MOCK_NEXT_MATCH.venue,
  label: "Pátek 4. 4.",
  time: "15:00",
};

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[70vh] items-center">
        {/* Left — Club identity */}
        <div>
          <span className="inline-block text-[10px] uppercase font-semibold text-[var(--club-primary)] border border-[var(--club-primary)]/30 bg-[var(--club-primary)]/10 rounded-full px-3 py-1 mb-4">
            Pražský přebor · 5. liga
          </span>

          <h1 className="font-heading font-extrabold text-5xl lg:text-7xl uppercase text-[var(--text-primary)] leading-none tracking-tight">
            SK SLOVAN
            <br />
            KUNRATICE
          </h1>

          <p className="text-[var(--text-secondary)] mt-4 max-w-md leading-relaxed">
            Kunratičtí hrají fotbal s příběhem, a to bez ohledu na výsledek.
          </p>

          <div className="mt-6 flex gap-3 flex-wrap">
            <Button variant="primary" href="/zapasy">
              Rozpis zápasů
            </Button>
            <Button variant="secondary" href="/novinky">
              Novinky
            </Button>
          </div>
        </div>

        {/* Right — Next match widget */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
          <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mb-4">
            Příští zápas · {NEXT_MATCH.label}
          </p>

          {/* Teams row */}
          <div className="flex items-center justify-between gap-4">
            {/* Home — Kunratice */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 relative">
                <Image
                  src="/logo.png"
                  alt="SK Slovan Kunratice"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {NEXT_MATCH.homeTeam}
              </span>
            </div>

            {/* VS */}
            <span className="text-2xl font-extrabold text-[var(--text-muted)]">VS</span>

            {/* Away — Aritma B */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-surface)]" />
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {NEXT_MATCH.awayTeam}
              </span>
            </div>
          </div>

          {/* Countdown */}
          <div className="mt-5 flex justify-center">
            <CountdownTimer targetDate={NEXT_MATCH.date} />
          </div>

          {/* Venue */}
          <p className="text-[var(--text-muted)] text-xs text-center mt-3">
            {NEXT_MATCH.label} · {NEXT_MATCH.time} · {NEXT_MATCH.venue}
          </p>
        </div>
      </div>
    </section>
  );
}
