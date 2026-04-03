import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
};

export default function SectionHeader({ title, subtitle, href, linkText }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="font-heading font-bold uppercase text-2xl md:text-3xl text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[var(--text-secondary)] text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {href && linkText && (
        <Link
          href={href}
          className="text-[var(--club-primary)] text-sm font-medium hover:underline shrink-0 mt-1"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
