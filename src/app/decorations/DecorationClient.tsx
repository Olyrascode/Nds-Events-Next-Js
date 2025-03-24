"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryLinkFilter from "@/components/CategoryFilter/CategoryLinkFilter";
import RentalDialog from "@/components/RentalDialog";
import "@/app/tous-nos-produits/_Products.scss";
import { Product } from "@/type/Product"; // Assurez-vous que le chemin est correct

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

export default function DecorationsClient() {
  const { navCategory, category } = useParams();

  // Typage explicite
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

      // Filtrer pour ne conserver que les produits du groupe "decorations"
      const filteredProducts = productsData.filter(
        (product: Product) => product.navCategory === "decorations"
      );

      // Ajouter la propriété "id" si elle est manquante (par exemple, id = _id)
      const mappedProducts = filteredProducts.map((product) => ({
        ...product,
        id: product.id || product._id,
      }));

      setProducts(mappedProducts);

      // Créer un tableau de catégories uniques en filtrant les valeurs undefined
      const uniqueCategories = [
        ...new Set(
          mappedProducts
            .map((product: Product) => product.category)
            .filter((cat): cat is string => !!cat)
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
            Nos produits de décorations
          </Typography>
        </div>

        {/* Afficher le filtre par catégorie seulement si aucun paramètre navCategory n'est présent */}
        {!category && (
          <div className="products__filters">
            <CategoryLinkFilter
              categories={categories}
              selectedCategory={selectedCategory}
              navCategory={navCategory ?? "decorations"}
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
      <Container className="bottom-info">
        <button className="button-contacez-nous">
          <a href="/contact">Plus de produits - contactez nous</a>
        </button>
        <p>
          <span>
            Ne perdez plus de temps ou d'argent pour votre décoration de
            mariage! NDS Event's vous propose de louer votre décoration en kits
            complets ou des produits à l'unité, le tout au meilleur prix
            garanti!
          </span>{" "}
          <br />
          <br />
          Votre budget ne permet pas de faire appel aux services d'une
          décoratrice? Louez directement vos déco pour vos salles et tables de
          votre mariage.
          <br />
          <br />
          De la nappe aux noeuds de chaises, en passant par les housses et les
          chemins de tables, louez du matériel de qualité, des vases Martini ou
          tout autre forme de verres ou boules, des fleurs artificielles, des
          rideaux lumineux, arches, guirlandes, etc...
          <br />
          <br /> Une offre au meilleur prix garanti dans la région !
        </p>
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
