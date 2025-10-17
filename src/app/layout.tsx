import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoDocs AI - Documentation Automatique pour Développeurs",
  description: "Générez automatiquement une documentation technique à jour pour vos projets GitHub. Gagnez du temps et améliorez la qualité de votre code.",
  keywords: ["documentation", "AI", "GitHub", "développement", "automatisation"],
  authors: [{ name: "AutoDocs AI" }],
  openGraph: {
    title: "AutoDocs AI - Documentation Automatique",
    description: "Documentation technique générée automatiquement par IA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}