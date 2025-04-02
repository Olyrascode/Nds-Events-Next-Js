import { notFound } from "next/navigation";
import { fetchPackBySlug } from "../../../../services/packs.service";
import PackDetailsClient from "../../../packs-complets/[slug]/PackDetailsClient";

// Page pour les packs dans les catégories (e.g., /la-table/packs-complets/[slug])
export default async function CategoryPackDetailsPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  try {
    const { slug } = params;
    console.log(
      `Affichage du pack ${slug} dans la catégorie ${params.category}`
    );

    // Récupérer les données du pack
    const pack = await fetchPackBySlug(slug);

    // Utiliser le même composant client que pour la route /packs-complets/[slug]
    return <PackDetailsClient pack={pack} />;
  } catch (error) {
    console.error("Erreur lors du chargement du pack:", error);
    notFound();
  }
}
