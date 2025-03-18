// packs-complets/[slug]/page.tsx
import { fetchPackBySlug } from "../../../services/packs.service";
import PackDetailsClient from "./PackDetailsClient";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const pack = await fetchPackBySlug(params.slug);

    return {
      title: pack.seo?.title || pack.name,
      description: pack.seo?.metaDescription || pack.description,
    };
  } catch (error) {
    return {
      title: "Pack non trouvé",
      description: "Le pack demandé n'existe pas",
    };
  }
}

export default async function PackDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const pack = await fetchPackBySlug(params.slug);
    return <PackDetailsClient pack={pack} />;
  } catch (error) {
    notFound();
  }
}
