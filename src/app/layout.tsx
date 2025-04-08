// app/layout.tsx (fichier serveur, donc PAS de "use client")
import RootLayoutServer, { metadata } from "./layout.server";
import { Montserrat } from "next/font/google";
import "./globals.scss";

export { metadata };

// Configuration de la police avec next/font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={montserrat.variable}>
      <head>
        {/* Préchargement de l'image d'arrière-plan du Hero Banner (LCP) */}
        <link
          rel="preload"
          href="/img/home/evenementielle.jpg"
          as="image"
          type="image/jpeg"
          fetchPriority="high"
        />
        {/* Préchargement du logo dans le Hero Banner */}
        <link
          rel="preload"
          href="/img/home/logoHomePage.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
      </head>
      <body>
        <RootLayoutServer>{children}</RootLayoutServer>
      </body>
    </html>
  );
}
