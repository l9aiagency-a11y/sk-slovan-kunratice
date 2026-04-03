import Image from "next/image";
import { StandingRow } from "@/lib/mock-data";
import FormIndicator from "./FormIndicator";

type StandingsTableProps = {
  rows: StandingRow[];
  highlightTeam?: string;
};

export default function StandingsTable({ rows, highlightTeam }: StandingsTableProps) {
  return (
    <div className="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-200">
            <tr>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-gray-500 px-3 py-3 text-left w-8">
                #
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-gray-500 px-3 py-3 text-left">
                Tým
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-gray-500 px-3 py-3 text-center">
                Z
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-gray-500 px-3 py-3 text-center">
                V
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-gray-500 px-3 py-3 text-center">
                R
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-gray-500 px-3 py-3 text-center">
                P
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-gray-500 px-3 py-3 text-center">
                Skóre
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-gray-500 px-3 py-3 text-center">
                B
              </th>
              <th className="font-body font-medium text-[11px] uppercase tracking-wider text-gray-500 px-3 py-3 text-center">
                Forma
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isHighlighted = row.isOwnTeam || row.team === highlightTeam;
              const displayPosition = rows.length > 1 && rows.every(r => r.position === rows[0].position)
                ? index + 1
                : row.position;
              return (
                <tr
                  key={`${displayPosition}-${row.team}`}
                  className={
                    isHighlighted
                      ? "border-t border-gray-200 bg-[var(--club-primary)]/10 border-l-2 border-l-[var(--club-primary)] shadow-[inset_0_0_20px_rgba(27,107,58,0.08)]"
                      : "border-t border-gray-200 hover:bg-gray-100 transition-colors"
                  }
                >
                  <td className="px-3 py-3">
                    <span className="font-heading font-bold text-sm text-gray-900">
                      {displayPosition}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      {row.logoUrl ? (
                        <Image
                          src={row.logoUrl}
                          alt={row.team}
                          width={20}
                          height={20}
                          className="w-5 h-5 object-contain shrink-0"
                          unoptimized
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0" />
                      )}
                      <span className="font-semibold text-sm text-gray-900">
                        {row.team}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm text-gray-700 tabular-nums">
                      {row.played}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm text-gray-700 tabular-nums">
                      {row.won}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm text-gray-700 tabular-nums">
                      {row.drawn}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm text-gray-700 tabular-nums">
                      {row.lost}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm text-gray-700 tabular-nums">
                      {row.goalsFor}:{row.goalsAgainst}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="font-heading font-bold text-sm text-gray-900 tabular-nums">
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
