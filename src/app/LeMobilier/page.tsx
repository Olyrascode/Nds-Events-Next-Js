// app/Tentes/page.tsx (composant serveur)
import LeMobilier from "@/app/LeMobilier/LeMobilierClient"

export const metadata = {
  title: "La Table - Tous nos produits pour la table| Votre Site",
  description:
    "Découvrez notre sélection exclusive de produits pour les tables de réception alliant style et fonctionnalité pour vos événements.",
};

export default function TentesPage() {
  return <LeMobilier />;
}
