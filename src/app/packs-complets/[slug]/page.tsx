// packs-complets/[slug]/page.tsx
import { fetchPackBySlug } from '../../../services/packs.service';
import PackDetailsClient from './PackDetailsClient';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const pack = await fetchPackBySlug(resolvedParams.slug);
  
  // Si le paramètre ressemble à un ObjectId (24 caractères) et que le pack possède un slug, rediriger
  if (resolvedParams.slug.length === 24 && pack.slug) {
    redirect(`/packs-complets/${pack.slug}`);
  }
  
  return {
    title: pack.seo?.title || pack.name,
    description: pack.seo?.metaDescription || pack.description,
  };
}

export default async function PackDetailsPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const pack = await fetchPackBySlug(resolvedParams.slug);
  
  if (resolvedParams.slug.length === 24 && pack.slug) {
    redirect(`/packs-complets/${pack.slug}`);
  }
  
  return <PackDetailsClient pack={pack} />;
}
