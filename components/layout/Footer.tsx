import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/novinky", label: "Novinky" },
  { href: "/zapasy", label: "Zápasy" },
  { href: "/tabulka", label: "Tabulka" },
  { href: "/tymy", label: "Týmy" },
];

const MORE_LINKS = [
  { href: "/klub", label: "Klub" },
  { href: "/galerie", label: "Galerie" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/prihlaška-mladeze", label: "Přihláška mládeže" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-card)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="flex flex-col gap-3">
            <Image
              src="/logo.png"
              alt="SK Slovan Kunratice"
              width={48}
              height={48}
              className="object-contain"
            />
            <p className="font-heading font-bold text-[var(--text-primary)]">
              SK Slovan Kunratice
            </p>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              Volarská 5, Praha - Kunratice, 148 00
            </p>
          </div>

          {/* Col 2: Navigace */}
          <div>
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mb-3">
              NAVIGACE
            </p>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Více */}
          <div>
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mb-3">
              VÍCE
            </p>
            <ul className="flex flex-col gap-2">
              {MORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Kontakt */}
          <div>
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mb-3">
              KONTAKT
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="tel:+420774897881"
                  className="text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)] transition-colors"
                >
                  774 897 881
                </a>
              </li>
              <li>
                <a
                  href="mailto:skkunratice.fotbal@seznam.cz"
                  className="text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)] transition-colors break-all"
                >
                  skkunratice.fotbal@seznam.cz
                </a>
              </li>
              <li className="mt-1">
                <a
                  href="https://www.facebook.com/fotbalkunratice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)] transition-colors"
                  aria-label="Facebook"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                  <span>Facebook</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border)] mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-[var(--text-muted)] text-xs">
          <span>© SK Slovan Kunratice 2026</span>
          <span>
            Vytvořeno s <span className="text-red-500">❤️</span> L9 AI Studios
          </span>
        </div>
      </div>
    </footer>
  );
}
