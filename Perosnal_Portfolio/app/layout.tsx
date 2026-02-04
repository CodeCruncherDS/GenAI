import "./globals.css";
import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getSiteData } from "@/lib/content-loader";

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body"
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteData();
  return {
    title: `${site.name} | ${site.title}`,
    description: site.summary
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteData();

  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-sand-100">
          <SiteHeader name={site.name} title={site.title} nav={site.nav} />
          <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">{children}</main>
          <SiteFooter summary={site.summary} note={site.footerNote} />
        </div>
      </body>
    </html>
  );
}
