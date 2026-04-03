import { MOCK_STANDINGS } from "@/lib/mock-data";
import SectionHeader from "@/components/ui/SectionHeader";
import StandingsTable from "@/components/ui/StandingsTable";

export default function StandingsPreview() {
  return (
    <section>
      <SectionHeader
        title="Tabulka soutěže"
        linkText="Celá tabulka →"
        href="/tabulka"
      />
      <div className="mt-6">
        <StandingsTable rows={MOCK_STANDINGS} />
      </div>
      <p className="text-[var(--text-muted)] text-[11px] mt-2">
        Zdroj: fotbalpraha.cz
      </p>
    </section>
  );
}
