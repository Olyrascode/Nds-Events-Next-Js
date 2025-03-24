"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryLinkFilter from "@/components/CategoryFilter/CategoryLinkFilter";
import RentalDialog from "@/components/RentalDialog";
import "@/app/tous-nos-produits/_Products.scss";
import { Product } from "@/type/Product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

export default function AutresProduitsClient() {
  const { navCategory, category } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const productsData: Product[] = await response.json();
      const filteredProducts = productsData.filter(
        (product: Product) => product.navCategory === "autres-produits"
      );
      setProducts(filteredProducts);
      const uniqueCategories = [
        ...new Set(
          filteredProducts.map((product: Product) => product.category || "")
        ),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleRentClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenRentalDialog(true);
  };

  return (
    <div className="products">
      <Container>
        <div className="products__header">
          <Typography variant="h4" component="h1" className="products__title">
            Nos produits autres produits
          </Typography>
        </div>

        {!category && (
          <div className="products__filters">
            <CategoryLinkFilter
              categories={categories}
              selectedCategory={selectedCategory}
              navCategory={navCategory ?? "autres-produits"}
            />
          </div>
        )}

        <div className="products__grid">
          {products.map((product: Product) => (
            <ProductCard
              key={product._id}
              product={product}
              onRent={handleRentClick}
            />
          ))}
        </div>

        {selectedProduct && (
          <RentalDialog
            open={openRentalDialog}
            onClose={() => setOpenRentalDialog(false)}
            product={selectedProduct}
          />
        )}
      </Container>
      <div className="listIconContainer">
        <div className="listIcon">
          <div className="cardBottom">
            <div className="cardLeft">
              <img src="../../img/divers/visa.svg" alt="" />
              <p>
                Choisissez vos produits directement en ligne et payez par Carte
                Bancaire ou directement au depot NDS par chèque, virement ou
                espèce
              </p>
            </div>
            <div className="cardRight">
              <img src="../../img/divers/truck.svg" alt="" />
              <p>
                Divers modes de livraison à votre disposition : Retrait sur
                place, ou livraison et récupération par nos équipes!
              </p>
            </div>
          </div>
        </div>
        <div className="bottomLink">
          <p>
            Pour toutes autres questions, vous pouvez vous référer à nos
            Conditions Générales de Vente ou notre Foire Aux Questions.
          </p>
        </div>
      </div>
    </div>
  );
}
