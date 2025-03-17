// import { fetchPackById } from '../../../services/packs.service';
// import PackDetails from './PackDetailsClient';

// export async function generateMetadata({ params }: { params: { packId: string } }) {
//   const pack = await fetchPackById(params.packId);
//   return {
//     title: pack.seo?.title || pack.name,
//     description: pack.seo?.metaDescription || pack.description,
//   };
// }

// export default async function ProductDetailsPage({ params }: { params: { packId: string } }) {
//   const pack = await fetchPackById(params.packId);
//   return <PackDetails pack={pack} />;
// }
// app/packs-complets/[slug]/page.tsx
import { fetchPackBySlug } from '../../../services/packs.service';
import PackDetails from '../../PackDetails/[packId]/PackDetailsClient';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const pack = await fetchPackBySlug(params.slug);
  return {
    title: pack.seo?.title || pack.name,
    description: pack.seo?.metaDescription || pack.description,
  };
}

export default async function PackDetailsPage({ params }: { params: { slug: string } }) {
  const pack = await fetchPackBySlug(params.slug);
  return <PackDetails pack={pack} />;
}
