import Image from "next/image";
import Link from "next/link";

type MatchCardProps = {
  id?: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | null;
  awayScore?: number | null;
  homeLogo?: string;
  awayLogo?: string;
  isHome: boolean;
  result?: "W" | "D" | "L" | null;
};

const resultBorderMap: Record<string, string> = {
  W: "border-l-[var(--win)]",
  D: "border-l-[var(--draw)]",
  L: "border-l-[var(--loss)]",
};

function TeamLogo({
  logo,
  name,
  isOurs,
}: {
  logo?: string;
  name: string;
  isOurs: boolean;
}) {
  if (logo) {
    return (
      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
        <Image src={logo} alt={name} width={24} height={24} className="object-cover" />
      </div>
    );
  }
  if (isOurs) {
    return (
      <div className="w-6 h-6 rounded-full shrink-0 bg-gradient-to-br from-[var(--club-primary)] to-[var(--club-secondary)]" />
    );
  }
  return <div className="w-6 h-6 rounded-full shrink-0 bg-[var(--bg-surface)]" />;
}

export default function MatchCard({
  id,
  date,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  homeLogo,
  awayLogo,
  isHome,
  result,
}: MatchCardProps) {
  const borderClass = result ? resultBorderMap[result] : "border-l-[var(--border)]";
  const hasScore = homeScore != null && awayScore != null;

  const inner = (
    <div
      className={`bg-[var(--bg-card)] border border-[var(--border)] border-l-[3px] ${borderClass} rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer`}
    >
      {/* Date */}
      <span className="text-[var(--text-muted)] text-xs w-14 shrink-0">{date}</span>

      {/* Home team */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <TeamLogo logo={homeLogo} name={homeTeam} isOurs={isHome} />
        <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
          {homeTeam}
        </span>
      </div>

      {/* Score */}
      <div className="font-heading font-extrabold text-lg tabular-nums min-w-[60px] text-center text-[var(--text-primary)] shrink-0">
        {hasScore ? `${homeScore} : ${awayScore}` : "vs"}
      </div>

      {/* Away team */}
      <div className="flex items-center gap-2 flex-row-reverse flex-1 min-w-0">
        <TeamLogo logo={awayLogo} name={awayTeam} isOurs={!isHome} />
        <span className="text-sm font-semibold text-[var(--text-primary)] truncate text-right">
          {awayTeam}
        </span>
      </div>
    </div>
  );

  if (id) {
    return <Link href={`/zapasy/${id}`}>{inner}</Link>;
  }

  return inner;
}
