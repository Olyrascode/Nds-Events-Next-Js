// app/layout.tsx (fichier serveur, donc PAS de "use client")
import RootLayoutServer, { metadata } from "./layout.server";
import "./globals.scss";

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <RootLayoutServer>
          {children}
        </RootLayoutServer>
      </body>
    </html>
  );
}
