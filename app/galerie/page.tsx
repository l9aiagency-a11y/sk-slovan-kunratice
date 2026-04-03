import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase";
import PageHero from "@/components/ui/PageHero";
import EmptyState from "@/components/ui/EmptyState";

export const revalidate = 300;

export const metadata = {
  title: "Fotogalerie | SK Slovan Kunratice",
  description:
    "Fotografie ze zápasů, tréninků a akcí SK Slovan Kunratice. Sledujte živý fotbalový život v Kunraticích.",
  openGraph: {
    title: "Fotogalerie | SK Slovan Kunratice",
    description:
      "Fotografie ze zápasů, tréninků a akcí SK Slovan Kunratice.",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function GaleriePage() {
  const sb = createServerClient();

  const { data: galleries } = await sb
    .from("galleries")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: false });

  return (
    <main>
      <PageHero title="Fotogalerie" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {!galleries || galleries.length === 0 ? (
          <EmptyState message="Zatím nebyly přidány žádné fotogalerie." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => {
              const photos: { url: string; caption?: string }[] =
                Array.isArray(gallery.photos) ? gallery.photos : [];
              const coverPhoto = photos[0];

              return (
                <Link key={gallery.id} href={`/galerie/${gallery.id}`}>
                  <div className="bg-gray-50 border border-gray-300 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors cursor-pointer">
                    {/* Cover image area */}
                    <div className="h-48 bg-gray-200 relative">
                      {coverPhoto ? (
                        <Image
                          src={coverPhoto.url}
                          alt={gallery.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--club-primary)]/20 to-[var(--club-secondary)]/20 flex items-center justify-center">
                          <span className="text-4xl">📷</span>
                        </div>
                      )}
                      {/* Photo count badge */}
                      <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur text-white text-xs rounded-full px-2 py-1">
                        📷 {photos.length} fotek
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="p-4">
                      <h2 className="font-heading font-semibold text-gray-900">
                        {gallery.title}
                      </h2>
                      {gallery.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(gallery.date)}
                        </p>
                      )}
                      {gallery.description && (
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {gallery.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
