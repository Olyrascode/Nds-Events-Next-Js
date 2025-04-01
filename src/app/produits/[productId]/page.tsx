import ProductDetailsClient from "./ProductDetailsClient";

export default function ProductDetailsPage({
  params,
}: {
  params: { productId: string };
}) {
  return <ProductDetailsClient productId={params.productId} />;
}
