import { StandingRow, MOCK_STANDINGS } from "@/lib/mock-data";
import SectionHeader from "@/components/ui/SectionHeader";
import StandingsTable from "@/components/ui/StandingsTable";

interface StandingsPreviewProps {
  standings?: StandingRow[];
}

export default function StandingsPreview({ standings }: StandingsPreviewProps) {
  const rows = standings && standings.length > 0 ? standings : MOCK_STANDINGS;

  return (
    <section>
      <SectionHeader
        title="Tabulka soutěže"
        linkText="Celá tabulka →"
        href="/tabulka"
      />
      <div className="mt-6">
        <StandingsTable rows={rows} />
      </div>
      <p className="text-[var(--text-muted)] text-[11px] mt-2">
        Zdroj: fotbalpraha.cz
      </p>
    </section>
  );
}
