import { StandingRow } from "@/lib/mock-data";
import FormIndicator from "./FormIndicator";

type StandingsTableProps = {
  rows: StandingRow[];
  highlightTeam?: string;
};

export default function StandingsTable({ rows, highlightTeam }: StandingsTableProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-[var(--bg-surface)]">
            <tr>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-3 text-left w-8">
                #
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-3 text-left">
                Tým
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-3 text-center">
                Z
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-3 text-center">
                V
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-3 text-center">
                R
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-3 text-center">
                P
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-3 text-center">
                Skóre
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-3 text-center">
                B
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-[var(--text-muted)] px-3 py-3 text-center">
                Forma
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isHighlighted = row.isOwnTeam || row.team === highlightTeam;
              return (
                <tr
                  key={row.position}
                  className={
                    isHighlighted
                      ? "border-t border-[var(--border)]/50 bg-[var(--club-primary)]/10 border-l-2 border-l-[var(--club-primary)] shadow-[inset_0_0_20px_rgba(27,107,58,0.08)]"
                      : "border-t border-[var(--border)]/50 hover:bg-[var(--bg-elevated)] transition-colors"
                  }
                >
                  <td className="px-3 py-3">
                    <span className="font-heading font-bold text-sm text-[var(--text-primary)]">
                      {row.position}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-semibold text-sm text-[var(--text-primary)]">
                      {row.team}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm text-[var(--text-secondary)] tabular-nums">
                      {row.played}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm text-[var(--text-secondary)] tabular-nums">
                      {row.won}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm text-[var(--text-secondary)] tabular-nums">
                      {row.drawn}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm text-[var(--text-secondary)] tabular-nums">
                      {row.lost}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm text-[var(--text-secondary)] tabular-nums">
                      {row.goalsFor}:{row.goalsAgainst}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="font-heading font-bold text-sm text-[var(--text-primary)] tabular-nums">
                      {row.points}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-center">
                      <FormIndicator form={row.form} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
