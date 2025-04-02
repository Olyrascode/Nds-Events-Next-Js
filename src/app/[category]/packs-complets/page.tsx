import { redirect } from "next/navigation";

// Page pour les packs dans les catégories (e.g., /la-table/packs-complets)
export default async function CategoryPacksPage({
  params,
}: {
  params: { category: string };
}) {
  // Rediriger vers la page principale des packs et le filtrage se fera côté client
  // basé sur la catégorie extraite de l'URL
  redirect(`/packs-complets?category=${params.category}`);
}
