import Image from "next/image";
import Button from "@/components/ui/Button";
import CountdownTimer from "@/components/home/CountdownTimer";
import { MOCK_NEXT_MATCH } from "@/lib/mock-data";

interface NextMatchData {
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue: string;
  label: string;
  time: string;
}

interface HeroProps {
  nextMatch?: NextMatchData;
}

const DEFAULT_NEXT_MATCH: NextMatchData = {
  homeTeam: "Kunratice",
  awayTeam: "Aritma B",
  date: MOCK_NEXT_MATCH.date,
  venue: MOCK_NEXT_MATCH.venue,
  label: "Pátek 4. 4.",
  time: "15:00",
};

export default function Hero({ nextMatch }: HeroProps) {
  const NEXT_MATCH = nextMatch || DEFAULT_NEXT_MATCH;
  return (
    <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-28 overflow-hidden rounded-2xl">
      {/* Background field photo */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <Image
          src="/images/hero-bg.jpg"
          alt="Football field background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Light gradient overlay so text stays readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 35%, rgba(255,255,255,0.80) 60%, rgba(255,255,255,0.40) 100%)",
          }}
        />
      </div>

      {/* Faint grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.06,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
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
        <div className="relative">
          {/* Radial glow behind the widget */}
          <div
            className="absolute pointer-events-none blur-3xl"
            style={{
              width: "500px",
              height: "500px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, color-mix(in srgb, var(--club-primary) 8%, transparent), transparent 70%)",
            }}
          />
        <div className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
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
      </div>
      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #FFFFFF)",
        }}
      />

      {/* Club-primary accent line at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] pointer-events-none"
        style={{
          width: "600px",
          background: "linear-gradient(90deg, transparent, var(--club-primary), transparent)",
          opacity: 0.6,
        }}
      />
    </section>
  );
}
