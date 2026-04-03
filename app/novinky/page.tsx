import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase";
import { MOCK_NEWS, type Article } from "@/lib/mock-data";
import PageHero from "@/components/ui/PageHero";
import FadeIn from "@/components/ui/FadeIn";

export const revalidate = 300;

export const metadata = {
  title: "Novinky | SK Slovan Kunratice",
  description:
    "Nejnovější zprávy, reportáže a aktuality z SK Slovan Kunratice. Sledujte dění v klubu.",
  openGraph: {
    title: "Novinky | SK Slovan Kunratice",
    description:
      "Nejnovější zprávy a aktuality z SK Slovan Kunratice.",
  },
};

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

export default async function NovinkyPage() {
  const sb = createServerClient();

  const { data: articleRows } = await sb
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const articles: Article[] =
    articleRows && articleRows.length > 0
      ? articleRows.map((a) => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt,
          body: a.body,
          date: a.published_at,
          category: a.category,
          coverImage: a.cover_image,
          slug: a.slug,
          author: a.author,
          is_published: a.is_published,
        }))
      : MOCK_NEWS;

  return (
    <main>
      <PageHero title="Novinky" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/novinky/${article.slug}`}>
              <article className="group bg-gray-50 border border-gray-300 rounded-xl overflow-hidden hover:bg-gray-100 hover:border-[var(--club-primary)]/40 transition-colors">
                {article.coverImage ? (
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div
                    className={`h-48 ${categoryGradient(article.category)} flex items-center justify-center`}
                  >
                    <span className="text-4xl opacity-10">⚽</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 text-xs">
                      {formatDate(article.date)}
                    </span>
                    <span className="inline-block text-[10px] uppercase font-semibold text-[var(--club-primary)] bg-[var(--club-primary)]/10 rounded-full px-2 py-0.5 ml-2">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="font-heading font-bold text-lg mt-2 text-gray-900">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-700 line-clamp-2 mt-1">
                    {article.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
        </FadeIn>
      </div>
    </main>
  );
}
