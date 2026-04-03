type CardProps = {
  children: React.ReactNode;
  highlighted?: boolean;
  className?: string;
};

export default function Card({ children, highlighted = false, className = "" }: CardProps) {
  return (
    <div
      className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-elevated)] transition-colors duration-200 ${
        highlighted ? "border-l-2 border-l-[var(--club-primary)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
