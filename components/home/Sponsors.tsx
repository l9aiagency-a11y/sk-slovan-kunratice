import Image from "next/image";
import { MOCK_SPONSORS, Sponsor } from "@/lib/mock-data";

// Map sponsor names to their downloaded logo files
const SPONSOR_LOGOS: Record<string, string> = {
  "MČ Kunratice": "/sponsors/mc-kunratice.png",
  "Hlavní město Praha": "/sponsors/prague-logo.png",
  "Pražský fotbalový svaz": "/sponsors/pfs.png",
  "FAČR": "/sponsors/facr.png",
  "Veolia Pražská teplárenská": "/sponsors/pt-veolia.png",
  "Auto Jarov": "/sponsors/auto-jarov.jpg",
  "MŠMT": "/sponsors/msmt.jpg",
};

const tierSize: Record<Sponsor["tier"], { w: number; h: number; containerClass: string }> = {
  main: { w: 120, h: 48, containerClass: "px-6 py-4" },
  partner: { w: 90, h: 36, containerClass: "px-5 py-3" },
  supporter: { w: 70, h: 28, containerClass: "px-4 py-3" },
};

export default function Sponsors() {
  return (
    <div className="py-12 border-t border-[var(--border)]">
      <p className="text-center text-[var(--text-muted)] text-xs uppercase tracking-widest mb-8">
        Partneři a sponzoři
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {MOCK_SPONSORS.map((sponsor) => {
          const logo = SPONSOR_LOGOS[sponsor.name];
          const size = tierSize[sponsor.tier];
          const inner = logo ? (
            <Image
              src={logo}
              alt={sponsor.name}
              width={size.w}
              height={size.h}
              className="object-contain max-h-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
            />
          ) : (
            <span
              className={`text-[var(--text-secondary)] font-medium ${
                sponsor.tier === "main" ? "text-sm" : "text-xs"
              }`}
            >
              {sponsor.name}
            </span>
          );

          const wrapper = (
            <div
              className={`group bg-[var(--bg-surface)] rounded-lg border border-[var(--border)] transition-all duration-300 hover:border-[var(--club-primary)]/50 hover:bg-[var(--bg-elevated)] flex items-center justify-center ${size.containerClass}`}
            >
              {inner}
            </div>
          );

          return sponsor.websiteUrl ? (
            <a
              key={sponsor.name}
              href={sponsor.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={sponsor.name}
            >
              {wrapper}
            </a>
          ) : (
            <div key={sponsor.name}>{wrapper}</div>
          );
        })}
      </div>
    </div>
  );
}
