import Image from "next/image";
import Link from "next/link";
import { MOCK_NEWS, type Article } from "@/lib/mock-data";
import SectionHeader from "@/components/ui/SectionHeader";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
}

const categoryGradients: Record<string, string> = {
  "Muži": "from-[var(--club-primary)] to-[var(--club-secondary)]",
  "Mládež": "from-emerald-600 to-emerald-800",
  "Klub": "from-slate-600 to-slate-800",
};

function ArticleImage({
  article,
  height,
}: {
  article: Article;
  height: string;
}) {
  const gradient = categoryGradients[article.category] || "from-[var(--bg-elevated)] to-[var(--bg-surface)]";

  if (article.coverImage) {
    return (
      <div className={`${height} relative overflow-hidden`}>
        {/* Colored fallback behind the image in case it fails to load */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <span className="text-4xl opacity-30">⚽</span>
        </div>
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* subtle bottom scrim so category badge stays readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
    );
  }
  return (
    <div
      className={`${height} bg-gradient-to-br ${gradient} flex items-center justify-center`}
    >
      <span className="text-4xl opacity-30">⚽</span>
    </div>
  );
}

function LargeArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/novinky/${article.slug}`} className="group block">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden md:col-span-2 hover:border-[var(--club-primary)]/40 transition-colors">
        <ArticleImage article={article} height="h-52" />
        <div className="p-5">
          <div className="flex items-center gap-1">
            <span className="text-[var(--text-muted)] text-xs">{formatDate(article.date)}</span>
            <span className="inline-block text-[10px] uppercase font-semibold text-[var(--club-primary)] bg-[var(--club-primary)]/10 rounded-full px-2 py-0.5 ml-2">
              {article.category}
            </span>
          </div>
          <h3 className="font-heading font-bold text-lg mt-2 text-[var(--text-primary)] group-hover:text-[var(--club-primary)] transition-colors">
            {article.title}
          </h3>
          <p className="text-[var(--text-secondary)] text-sm mt-1 line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}

function SmallArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/novinky/${article.slug}`} className="group block">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--club-primary)]/40 transition-colors">
        <ArticleImage article={article} height="h-36" />
        <div className="p-4">
          <div className="flex items-center gap-1">
            <span className="text-[var(--text-muted)] text-xs">{formatDate(article.date)}</span>
            <span className="inline-block text-[10px] uppercase font-semibold text-[var(--club-primary)] bg-[var(--club-primary)]/10 rounded-full px-2 py-0.5 ml-2">
              {article.category}
            </span>
          </div>
          <h3 className="font-heading font-bold text-base mt-2 text-[var(--text-primary)] group-hover:text-[var(--club-primary)] transition-colors">
            {article.title}
          </h3>
          <p className="text-[var(--text-secondary)] text-sm mt-1 line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </div>
    </Link>
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
        <div className="md:col-span-2">
          <LargeArticleCard article={first} />
        </div>
        <div className="flex flex-col gap-4">
          {sideArticles.map((article) => (
            <SmallArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
