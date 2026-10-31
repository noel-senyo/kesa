import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { GeistSans } from "geist/font/sans";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { loadCatalog } from "@/lib/catalog";
import { site } from "@/data/site";
import { themeInitScript } from "@/lib/theme";
import "@/styles/globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const catalog = await loadCatalog();

  return (
    <html lang="en" className={`${GeistSans.variable} ${archivo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans">
        <Navbar products={catalog} />
        <main className="mx-auto w-full max-w-[1920px] px-4 pb-24 lg:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
