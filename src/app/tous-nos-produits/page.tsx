"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryFilter from "@/components/CategoryFilter/CategoryFilter";
import RentalDialog from "@/components/RentalDialog";
import "./_Products.scss";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

export default function Products() {
  // Récupération du paramètre de la route (exemple : /products/nav/la-table)
  const { navCategory } = useParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openRentalDialog, setOpenRentalDialog] = useState(false);

  // Charger les produits au démarrage
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fonction pour récupérer les produits depuis le backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const productsData = await response.json();

      // Exclure les produits de la catégorie "Tentes" (selon votre besoin)
      const filteredProducts = productsData.filter(
        (product) => product.category !== "Tentes"
      );
      setProducts(filteredProducts);

      // Extraire les catégories uniques (sans "Tentes")
      const uniqueCategories = [
        ...new Set(filteredProducts.map((product) => product.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleRentClick = (product) => {
    setSelectedProduct(product);
    setOpenRentalDialog(true);
  };

  // Filtrage des produits :
  // - Si un paramètre navCategory est présent, on filtre sur le champ product.navCategory
  // - Sinon, on filtre avec le filtre par catégorie détaillée sélectionnée
  let filteredProducts = products;
  if (navCategory) {
    filteredProducts = filteredProducts.filter(
      (product) => product.navCategory === navCategory
    );
  } else if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory
    );
  }

  return (
    <div className="products">
      <Container>
        <div className="products__header">
          <Typography variant="h4" component="h1" className="products__title">
            Tous nos produits
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            className="product-packs__subtitle"
          >
            Découvrez tous les produits Nds disponnibles à la location
          </Typography>
          <Typography mt={5}>
            Choisissez vos produits directement en ligne et payez par Carte Bancaire, par chèque, par virement et par espèce.
            </Typography>
            <Typography>
            Divers modes de livraison à votre disposition : Retrait sur place, ou livraison et récupération par nos équipes!
            </Typography>
        </div>

        {/* Afficher le filtre par catégorie seulement si aucun navCategory n'est défini */}
        {!navCategory && (
          <div className="products__filters">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        )}

        <div className="products__grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id || product._id}
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
        <button className="button-contacez-nous"><a href="/contact">Plus de produits - contactez nous</a></button>
        <p>
          <span>NDS Event&apos;s, spécialiste de la location de matériel d&apos;événement en
          Rhône Alpes (Grenoble, Isère 38) depuis plus de 10 ans !</span>  <br/><br/>Dans cette
          catégorie, vous trouverez à la location, de la vaisselle (verres,
          couverts, assiettes, tasses, etc...), tout l&apos;art de la table avec
          différentes gammes, du traditionnel "standard" aux produits hauts de
          gamme pour un mariage par exemple, mais aussi des nappes et serviettes
          en tissus blanc. <br/><br/>La vaisselle se loue propre et se rend sale, nous
          nous occupons du lavage et il est inclus dans les prix ! Idem pour les
          tissus, le service de blanchisserie est compris !<br/><br/> Une offre au
          meilleur prix garanti dans la région !
        </p>
      </Container>
    </div>
  );
}
