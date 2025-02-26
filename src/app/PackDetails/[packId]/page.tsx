import { fetchPackById } from '../../../services/packs.service';
import PackDetails from './PackDetailsClient';

export async function generateMetadata({ params }: { params: { packId: string } }) {
  const pack = await fetchPackById(params.packId);
  return {
    title: pack.seo?.title || pack.name,
    description: pack.seo?.metaDescription || pack.description,
  };
}

export default async function ProductDetailsPage({ params }: { params: { packId: string } }) {
  const pack = await fetchPackById(params.packId);
  return <PackDetails pack={pack} />;
}
