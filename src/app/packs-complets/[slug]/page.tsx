// packs-complets/[slug]/page.tsx
import { fetchPackBySlug } from "../../../services/packs.service";
import PackDetailsClient from "./PackDetailsClient";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const pack = await fetchPackBySlug(slug);

    return {
      title: pack.seo?.title || pack.name,
      description: pack.seo?.metaDescription || pack.description,
    };
  } catch {
    return {
      title: "Pack non trouvé",
      description: "Le pack demandé n'existe pas",
    };
  }
}

export default async function PackDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const pack = await fetchPackBySlug(slug);
    return <PackDetailsClient pack={pack} />;
  } catch {
    notFound();
  }
}
