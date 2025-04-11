import React from "react";
import ProductDetailsClient from "./ProductDetailsClient";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  // Déballer les paramètres avec React.use()
  const resolvedParams = React.use(params);
  const { productId } = resolvedParams;

  return <ProductDetailsClient productId={productId} />;
}
