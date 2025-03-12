// app/Tentes/page.tsx (composant serveur)
import AutresProduitsClient from "./AutresProduitsClient";

export const metadata = {
  title: "Autres Produits, découvrez tous nos autres produits| Votre Site",
  description:
    "Découvrez notre sélection exclusive de produits divers alliant style et fonctionnalité pour vos événements.",
};

export default function TentesPage() {
  return <AutresProduitsClient />;
}
