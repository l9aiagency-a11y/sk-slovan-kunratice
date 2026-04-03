import { createServerClient } from "@/lib/supabase";
import { MOCK_SPONSORS, type Sponsor } from "@/lib/mock-data";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "O klubu | SK Slovan Kunratice",
  description:
    "Informace o SK Slovan Kunratice — historie, areál, partneři a sponzoři. Tradiční pražský fotbalový klub v Kunraticích.",
  openGraph: {
    title: "O klubu | SK Slovan Kunratice",
    description:
      "Informace o SK Slovan Kunratice — historie, areál a partneři klubu.",
  },
};

const tierClasses: Record<Sponsor["tier"], string> = {
  main: "px-6 py-3 text-sm font-semibold text-gray-900 border-[var(--club-primary)]/30",
  partner: "px-5 py-2.5 text-xs font-medium text-gray-700",
  supporter: "px-4 py-2 text-xs text-gray-500",
};

const tierLabels: Record<Sponsor["tier"], string> = {
  main: "Hlavní partneři",
  partner: "Partneři",
  supporter: "Podporovatelé",
};

export default async function KlubPage() {
  const sb = createServerClient();

  const { data: sponsorRows } = await sb
    .from("sponsors")
    .select("*")
    .order("tier", { ascending: true });

  const sponsors: Sponsor[] =
    sponsorRows && sponsorRows.length > 0
      ? sponsorRows.map((s) => ({
          name: s.name,
          logoUrl: s.logo_url,
          tier: s.tier,
          websiteUrl: s.website_url,
        }))
      : MOCK_SPONSORS;

  const tiers: Sponsor["tier"][] = ["main", "partner", "supporter"];

  return (
    <main>
      <PageHero
        title="O klubu"
        subtitle="SK Slovan Kunratice — fotbal s příběhem"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-16">
        {/* O nás */}
        <section>
          <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">
            O nás
          </h2>
          <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 lg:p-8 space-y-4 text-gray-700 leading-relaxed">
            <p>
              SK Slovan Kunratice je tradiční pražský fotbalový klub s dlouhou
              historií sahající do první poloviny 20. století. Klub sídlí v
              městské části Praha-Kunratice a domácí zápasy hraje na hřišti ve
              Volarské ulici.
            </p>
            <p>
              Mužský A-tým aktuálně působí v Pražském přeboru (6. nejvyšší
              soutěž) a pravidelně se pohybuje v horní polovině tabulky. Kromě
              mužů A a B má klub rozsáhlou mládežnickou akademii s týmy od
              kategorie U5 (školička) až po dorost U19.
            </p>
            <p>
              Naší prioritou je výchova mladých hráčů v kvalitním prostředí,
              budování komunity kolem fotbalu v Kunraticích a dlouhodobý rozvoj
              klubu jak po sportovní, tak po infrastrukturní stránce.
            </p>
          </div>
        </section>

        {/* Kde nás najdete */}
        <section>
          <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">
            Kde nás najdete
          </h2>
          <div className="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
            <div className="bg-gray-200 h-64 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl mb-2">📍</p>
                <p className="font-heading font-semibold text-gray-900">
                  Sportovní areál Volarská
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Volarská 462/5, 148 00 Praha 4 – Kunratice
                </p>
              </div>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Zastávka bus 165, 203 — Kunratice, Volarská
                </p>
              </div>
              <Button
                href="https://maps.google.com/?q=Volarská+5,+Praha+Kunratice"
                variant="secondary"
                className="text-xs"
              >
                Otevřít mapu
              </Button>
            </div>
          </div>
        </section>

        {/* Sponzoři */}
        <section>
          <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">
            Partneři a sponzoři
          </h2>
          <div className="space-y-8">
            {tiers.map((tier) => {
              const tierSponsors = sponsors.filter((s) => s.tier === tier);
              if (tierSponsors.length === 0) return null;
              return (
                <div key={tier}>
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                    {tierLabels[tier]}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {tierSponsors.map((sponsor) => {
                      const inner = (
                        <div
                          className={`bg-gray-200 rounded-lg border border-gray-300 transition-all duration-300 hover:border-purple-300 hover:bg-gray-100 flex items-center ${tierClasses[tier]}`}
                        >
                          {sponsor.name}
                        </div>
                      );
                      if (sponsor.websiteUrl) {
                        return (
                          <a
                            key={sponsor.name}
                            href={sponsor.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {inner}
                          </a>
                        );
                      }
                      return <div key={sponsor.name}>{inner}</div>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Button href="/klub/kontakt">Kontaktujte nás</Button>
        </div>
      </div>
    </main>
  );
}
