type PageHeroProps = {
  title: string;
  subtitle?: string;
};

export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="w-full bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <h1 className="font-heading font-extrabold text-4xl lg:text-5xl uppercase text-gray-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-700 mt-2 text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
