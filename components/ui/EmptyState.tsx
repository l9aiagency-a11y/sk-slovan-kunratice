import Link from "next/link";

type EmptyStateProps = {
  message: string;
  href?: string;
  linkText?: string;
};

export default function EmptyState({ message, href, linkText }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <p className="text-[var(--text-muted)]">{message}</p>
      {href && linkText && (
        <Link
          href={href}
          className="inline-block mt-4 px-5 py-2 rounded-lg bg-[var(--club-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
