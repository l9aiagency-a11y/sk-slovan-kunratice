import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SK Slovan Kunratice — Oficiální web fotbalového klubu",
  description:
    "Výsledky, tabulka, soupisky a novinky fotbalového klubu SK Slovan Kunratice. Přijďte nás podpořit!",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsTeam",
  name: "SK Slovan Kunratice",
  sport: "Football",
  url: "https://www.skslovankunratice.cz",
  logo: "/logo.png",
  location: {
    "@type": "Place",
    name: "Kunratice, Praha",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Praha",
      addressRegion: "Kunratice",
      addressCountry: "CZ",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-dark text-primary font-body antialiased">
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
