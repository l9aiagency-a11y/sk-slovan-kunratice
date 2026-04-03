type CardProps = {
  children: React.ReactNode;
  highlighted?: boolean;
  className?: string;
};

export default function Card({ children, highlighted = false, className = "" }: CardProps) {
  return (
    <div
      className={`bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-200 ${
        highlighted ? "border-l-2 border-l-[var(--club-primary)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
