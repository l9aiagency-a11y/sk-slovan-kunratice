import { MOCK_NEWS, type Article } from "@/lib/mock-data";
import SectionHeader from "@/components/ui/SectionHeader";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
}

function categoryGradient(category: string): string {
  const lower = category.toLowerCase();
  if (lower === "muži") return "bg-gradient-to-br from-[var(--club-primary)]/20 to-[var(--bg-surface)]";
  if (lower === "klub") return "bg-gradient-to-br from-[var(--club-secondary)]/20 to-[var(--bg-surface)]";
  if (lower === "mládež") return "bg-gradient-to-br from-[var(--club-accent)]/20 to-[var(--bg-surface)]";
  return "bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-surface)]";
}

function ImagePlaceholder({ category, height }: { category: string; height: string }) {
  return (
    <div className={`${height} ${categoryGradient(category)} flex items-center justify-center text-4xl opacity-10`}>
      ⚽
    </div>
  );
}

function LargeArticleCard({ article }: { article: Article }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden md:col-span-2">
      <ImagePlaceholder category={article.category} height="h-48" />
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
      <ImagePlaceholder category={article.category} height="h-32" />
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

interface NewsPreviewProps {
  articles?: Article[];
}

export default function NewsPreview({ articles }: NewsPreviewProps) {
  const data = articles && articles.length > 0 ? articles : MOCK_NEWS;
  const [first, ...rest] = data;
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
