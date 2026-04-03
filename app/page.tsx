import Hero from "@/components/home/Hero";
import RecentResults from "@/components/home/RecentResults";
import StandingsPreview from "@/components/home/StandingsPreview";
import NewsPreview from "@/components/home/NewsPreview";
import YouthSection from "@/components/home/YouthSection";
import Sponsors from "@/components/home/Sponsors";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-16 py-16">
        <RecentResults />
        <StandingsPreview />
        <NewsPreview />
        <YouthSection />
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <Sponsors />
      </div>
    </main>
  );
}
