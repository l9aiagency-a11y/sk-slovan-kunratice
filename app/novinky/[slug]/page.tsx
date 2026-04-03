import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase";
import { MOCK_NEWS, type Article } from "@/lib/mock-data";
import PageHero from "@/components/ui/PageHero";
import ArticleBody from "@/components/novinky/ArticleBody";
import ShareButtons from "@/components/novinky/ShareButtons";

export const revalidate = 300;

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function categoryGradient(category: string): string {
  const lower = category.toLowerCase();
  if (lower === "muži")
    return "bg-gradient-to-br from-[var(--club-primary)]/20 to-[var(--bg-surface)]";
  if (lower === "klub")
    return "bg-gradient-to-br from-[var(--club-secondary)]/20 to-[var(--bg-surface)]";
  if (lower === "mládež")
    return "bg-gradient-to-br from-[var(--club-accent)]/20 to-[var(--bg-surface)]";
  return "bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-surface)]";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = MOCK_NEWS.find((a) => a.slug === slug);
  return {
    title: article
      ? `${article.title} | SK Slovan Kunratice`
      : "Novinka | SK Slovan Kunratice",
    description: article?.excerpt,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sb = createServerClient();

  const { data: articleRow } = await sb
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  let article: Article | null = null;

  if (articleRow) {
    article = {
      id: articleRow.id,
      title: articleRow.title,
      excerpt: articleRow.excerpt,
      body: articleRow.body,
      date: articleRow.published_at,
      category: articleRow.category,
      coverImage: articleRow.cover_image,
      slug: articleRow.slug,
      author: articleRow.author,
      is_published: articleRow.is_published,
    };
  } else {
    const mock = MOCK_NEWS.find((a) => a.slug === slug);
    if (!mock) return notFound();
    article = mock;
  }

  if (!article) return notFound();

  return (
    <main>
      <PageHero title={article.title} />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Meta info */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm text-[var(--text-muted)]">
            {formatDate(article.date)}
          </span>
          <span className="inline-block text-[10px] uppercase font-semibold text-[var(--club-primary)] bg-[var(--club-primary)]/10 rounded-full px-2 py-0.5">
            {article.category}
          </span>
          {article.author && (
            <span className="text-sm text-[var(--text-muted)]">
              &middot; {article.author}
            </span>
          )}
        </div>

        {/* Cover image / placeholder */}
        {article.coverImage ? (
          <div className="rounded-xl overflow-hidden mb-10 relative h-72 md:h-96">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        ) : (
          <div
            className={`h-64 rounded-xl ${categoryGradient(article.category)} flex items-center justify-center mb-10`}
          >
            <span className="text-6xl opacity-10">⚽</span>
          </div>
        )}

        {/* Article body */}
        {article.body ? (
          <ArticleBody content={article.body} />
        ) : (
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {/* Share + navigation */}
        <div className="border-t border-[var(--border)] mt-12 pt-8 flex items-center justify-between">
          <Link
            href="/novinky"
            className="text-sm text-[var(--club-primary)] hover:underline"
          >
            ← Zpět na novinky
          </Link>
          <ShareButtons slug={article.slug} title={article.title} />
        </div>
      </div>
    </main>
  );
}
