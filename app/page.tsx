import Hero from "@/components/home/Hero";
import RecentResults from "@/components/home/RecentResults";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-16 py-16">
        <RecentResults />
      </div>
    </main>
  );
}
