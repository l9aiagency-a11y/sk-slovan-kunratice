import Hero from "@/components/home/Hero";
import RecentResults from "@/components/home/RecentResults";
import StandingsPreview from "@/components/home/StandingsPreview";
import NewsPreview from "@/components/home/NewsPreview";
import YouthSection from "@/components/home/YouthSection";
import Sponsors from "@/components/home/Sponsors";
import FadeIn from "@/components/ui/FadeIn";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <Hero />

      {/* Results — bg-card */}
      <section className="section-glow-top w-full bg-[var(--bg-card)] py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <FadeIn>
            <RecentResults />
          </FadeIn>
        </div>
      </section>

      <SectionDivider />

      {/* Standings — bg-dark with subtle grid */}
      <section className="relative w-full bg-[var(--bg-dark)] py-16 overflow-hidden">
        {/* Very subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.02,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <FadeIn>
            <StandingsPreview />
          </FadeIn>
        </div>
      </section>

      <SectionDivider />

      {/* News — bg-card */}
      <section className="section-glow-top w-full bg-[var(--bg-card)] py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <FadeIn>
            <NewsPreview />
          </FadeIn>
        </div>
      </section>

      <SectionDivider />

      {/* Youth — bg-dark */}
      <section className="w-full bg-[var(--bg-dark)] py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <FadeIn>
            <YouthSection />
          </FadeIn>
        </div>
      </section>

      {/* Sponsors */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Sponsors />
      </div>
    </main>
  );
}
