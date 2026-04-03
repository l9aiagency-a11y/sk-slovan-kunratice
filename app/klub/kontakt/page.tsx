import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/klub/ContactForm";

export const metadata = {
  title: "Kontakt | SK Slovan Kunratice",
};

export default function KontaktPage() {
  return (
    <main>
      <PageHero title="Kontakt" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-heading font-bold text-xl text-[var(--text-primary)] mb-4">
                Kontaktní údaje
              </h2>
              <div className="space-y-4 text-[var(--text-secondary)]">
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">📍</span>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">Adresa</p>
                    <p>Volarská 462/5</p>
                    <p>148 00 Praha 4 – Kunratice</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">📧</span>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">Email</p>
                    <a
                      href="mailto:info@skslovankunratice.cz"
                      className="text-[var(--club-primary)] hover:underline"
                    >
                      info@skslovankunratice.cz
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">📱</span>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">Telefon</p>
                    <a
                      href="tel:+420123456789"
                      className="text-[var(--club-primary)] hover:underline"
                    >
                      +420 123 456 789
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl h-64 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl mb-2">🗺️</p>
                <p className="text-sm text-[var(--text-muted)]">
                  Volarská 462/5, Praha – Kunratice
                </p>
                <a
                  href="https://maps.google.com/?q=Volarská+5,+Praha+Kunratice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--club-primary)] hover:underline mt-2 inline-block"
                >
                  Otevřít v Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact form */}
          <div>
            <h2 className="font-heading font-bold text-xl text-[var(--text-primary)] mb-4">
              Napište nám
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
