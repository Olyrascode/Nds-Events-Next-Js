// app/Tentes/page.tsx (composant serveur)
import LeMobilier from "@/app/le-mobilier/LeMobilierClient"

export const metadata = {
  title: "Le Mobilier - Tous nos produits de Mobilier| NDS Events",
  description:
    "Découvrez notre sélection exclusive de produits de mobilier pour vos événements.",
};

export default function TentesPage() {
  return <LeMobilier />;
}
