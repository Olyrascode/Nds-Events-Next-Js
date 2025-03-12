// app/Tentes/page.tsx (composant serveur)
import TentesClient from "./TentesClient";

export const metadata = {
  title: "Tentes - Location de tentes de réception | Votre Site",
  description:
    "Découvrez notre sélection exclusive de tentes de réception alliant style et fonctionnalité pour vos événements.",
};

export default function TentesPage() {
  return <TentesClient />;
}
