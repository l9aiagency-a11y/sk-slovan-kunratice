import Hero from "@/components/home/Hero";
import RecentResults from "@/components/home/RecentResults";
import StandingsPreview from "@/components/home/StandingsPreview";
import NewsPreview from "@/components/home/NewsPreview";
import YouthSection from "@/components/home/YouthSection";
import Sponsors from "@/components/home/Sponsors";
import FadeIn from "@/components/ui/FadeIn";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-16 py-16">
        <FadeIn>
          <RecentResults />
        </FadeIn>
        <FadeIn>
          <StandingsPreview />
        </FadeIn>
        <FadeIn>
          <NewsPreview />
        </FadeIn>
        <FadeIn>
          <YouthSection />
        </FadeIn>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Sponsors />
      </div>
    </main>
  );
}
