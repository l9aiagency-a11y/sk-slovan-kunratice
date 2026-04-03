import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase";
import PageHero from "@/components/ui/PageHero";
import GalleryClient from "@/components/galerie/GalleryClient";
import EmptyState from "@/components/ui/EmptyState";

export const revalidate = 300;

type Props = {
  params: Promise<{ id: string }>;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const sb = createServerClient();
  const { data } = await sb.from("galleries").select("title").eq("id", id).single();
  return {
    title: data ? `${data.title} | Galerie | SK Slovan Kunratice` : "Galerie | SK Slovan Kunratice",
  };
}

export default async function GalerieDetailPage({ params }: Props) {
  const { id } = await params;
  const sb = createServerClient();

  const { data: gallery } = await sb
    .from("galleries")
    .select("*")
    .eq("id", id)
    .single();

  if (!gallery) {
    notFound();
  }

  const photos: { url: string; caption?: string }[] =
    Array.isArray(gallery.photos) ? gallery.photos : [];

  const subtitle = gallery.date ? formatDate(gallery.date) : undefined;

  return (
    <main>
      <PageHero title={gallery.title} subtitle={subtitle} />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {photos.length === 0 ? (
          <EmptyState message="Tato galerie zatím neobsahuje žádné fotografie." />
        ) : (
          <GalleryClient photos={photos} />
        )}
      </div>
    </main>
  );
}
