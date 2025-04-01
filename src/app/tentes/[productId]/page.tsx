import React from "react";
import ProductDetailsClient from "../../produits/[productId]/ProductDetailsClient";

export default function TentesProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  // Déballer les paramètres avec React.use()
  const resolvedParams = React.use(params);
  const { productId } = resolvedParams;

  return <ProductDetailsClient productId={productId} />;
}
