"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import { Container, Typography } from "@mui/material";
import "./_Tentes.scss";
import ProductCard from "@/components/ProductCard/ProductCard";
import RentalDialog from "@/components/RentalDialog";

interface Product {
  _id: string;
  navCategory?: string; // Ancien système
  category?: string;
  title: string;
  imageUrl?: string;
  associations?: Array<{
    categoryName: string;
    navCategorySlug: string;
    _id?: string;
  }>; // Nouveau système
}

export default function Tentes() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState<boolean>(false);
  const router = useRouter();
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const productsData: Product[] = await response.json();

        // 🔍 DEBUG: Log pour analyser tous les produits
        console.log(
          "🔍 [DEBUG TENTES] Tous les produits reçus:",
          productsData.length
        );

        // Rechercher les produits de tentes avec l'ancien ET le nouveau système
        const filteredProducts = productsData.filter((product) => {
          // Ancien système : navCategory
          const hasOldNavCategory = product.navCategory === "tentes";

          // Nouveau système : associations avec navCategorySlug = "tentes"
          const hasNewNavCategory = product.associations?.some(
            (assoc) => assoc.navCategorySlug === "tentes"
          );

          // Chercher aussi par nom de catégorie
          const hasTentCategory = product.associations?.some((assoc) =>
            assoc.categoryName?.toLowerCase().includes("tente")
          );

          const isValidTent =
            hasOldNavCategory || hasNewNavCategory || hasTentCategory;

          // Log pour debug
          if (product.title?.toLowerCase().includes("tente")) {
            console.log(`🔍 [DEBUG] Produit: "${product.title}"`);
            console.log(`   - navCategory: ${product.navCategory}`);
            console.log(`   - associations:`, product.associations);
            console.log(`   - hasOldNavCategory: ${hasOldNavCategory}`);
            console.log(`   - hasNewNavCategory: ${hasNewNavCategory}`);
            console.log(`   - hasTentCategory: ${hasTentCategory}`);
            console.log(`   - isValidTent: ${isValidTent}`);
            console.log("---");
          }

          return isValidTent;
        });

        console.log(
          `✅ [DEBUG TENTES] Produits de tentes trouvés: ${filteredProducts.length}`
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [API_URL]);

  const handleRentClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenRentalDialog(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Head>
        <title>Tentes - Location de tentes de réception | Votre Site</title>
        <meta
          name="description"
          content="Découvrez notre sélection exclusive de tentes de réception alliant style et fonctionnalité pour vos événements. Louez la tente idéale pour créer une ambiance inoubliable."
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="tentesContainer">
        <div className="tentesHeader">
          <h1>Tentes</h1>
          <h2>
            Découvrez notre sélection exclusive de tentes de réception, alliant
            style et fonctionnalité pour faire de votre événement un succès
            inoubliable.
          </h2>
        </div>
        <section>
          <Container>
            <div className="products__header">
              <Typography
                variant="h4"
                component="h3"
                className="products__title"
              >
                Tentes en location
              </Typography>
            </div>
            <div className="products__grid">
              {products.map((product) => (
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
        </section>
        <section>
          <div className="choiceContainer">
            <div className="choix1">
              <h3>Une question ?</h3>
              <button>
                <a href="/contact">Contactez nous</a>
              </button>
            </div>
            <div className="choix2">
              <h3>Quelle dimension pour ma tente de réception?</h3>
              <button>Demander un devis</button>
            </div>
          </div>
        </section>
        <section className="sectionCard">
          <h2>Nos produits sur devis</h2>
          <p>
            Nos produits en location ne conviennent pas à vos besoins ? Essayez
            une de nos trois tentes disponibles sur devis
          </p>
          <div className="tenteCardContainer">
            <div className="tenteCard">
              <h4>Tentes de réception</h4>
              <Image
                src="/img/tentespliantes/tente-de-reception.png"
                alt="Tente de réception"
                width={300}
                height={200}
              />
              <ul>
                <li>De 24m² à 364m²</li>
                <li>De 295€ à 2690€</li>
                <li>De multiples options disponibles</li>
                <li>Avec ou sans installation</li>
              </ul>
              <button onClick={() => router.push("/tentes-de-receptions")}>
                Voir nos tentes de réception
              </button>
            </div>
            <div className="tenteCard">
              <h4>Pagodes</h4>
              <Image
                src="/img/tentespliantes/pagode-de-reception.png"
                alt="Pagode de réception"
                width={300}
                height={200}
              />
              <ul>
                <li>De 16m² à 36m²</li>
                <li>De 290€ à 360€</li>
                <li>De multiples options disponibles</li>
                <li>Avec ou sans installation</li>
              </ul>
              <button onClick={() => router.push("/pagodes")}>
                Voir nos pagodes de réception
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
