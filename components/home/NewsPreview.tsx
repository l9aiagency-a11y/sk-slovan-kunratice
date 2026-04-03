import { MOCK_NEWS, Article } from "@/lib/mock-data";
import SectionHeader from "@/components/ui/SectionHeader";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
}

function LargeArticleCard({ article }: { article: Article }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden md:col-span-2">
      <div className="h-48 bg-[var(--bg-surface)]" />
      <div className="p-5">
        <div className="flex items-center gap-1">
          <span className="text-[var(--text-muted)] text-xs">{formatDate(article.date)}</span>
          <span className="inline-block text-[10px] uppercase font-semibold text-[var(--club-primary)] bg-[var(--club-primary)]/10 rounded-full px-2 py-0.5 ml-2">
            {article.category}
          </span>
        </div>
        <h3 className="font-heading font-bold text-lg mt-2 text-[var(--text-primary)]">
          {article.title}
        </h3>
        <p className="text-[var(--text-secondary)] text-sm mt-1 line-clamp-2">
          {article.excerpt}
        </p>
      </div>
    </div>
  );
}

function SmallArticleCard({ article }: { article: Article }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="h-32 bg-[var(--bg-surface)]" />
      <div className="p-4">
        <div className="flex items-center gap-1">
          <span className="text-[var(--text-muted)] text-xs">{formatDate(article.date)}</span>
          <span className="inline-block text-[10px] uppercase font-semibold text-[var(--club-primary)] bg-[var(--club-primary)]/10 rounded-full px-2 py-0.5 ml-2">
            {article.category}
          </span>
        </div>
        <h3 className="font-heading font-bold text-base mt-2 text-[var(--text-primary)]">
          {article.title}
        </h3>
        <p className="text-[var(--text-secondary)] text-sm mt-1 line-clamp-2">
          {article.excerpt}
        </p>
      </div>
    </div>
  );
}

export default function NewsPreview() {
  const [first, ...rest] = MOCK_NEWS;
  const sideArticles = rest.slice(0, 2);

  return (
    <section>
      <SectionHeader
        title="Novinky"
        linkText="Všechny novinky →"
        href="/novinky"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <LargeArticleCard article={first} />
        {sideArticles.map((article) => (
          <SmallArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
