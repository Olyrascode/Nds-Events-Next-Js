"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryLinkFilter from "@/components/CategoryFilter/CategoryLinkFilter";
import RentalDialog from "@/components/RentalDialog";
import "@/app/tous-nos-produits/_Products.scss";
import { Product } from "../../type/Product";

// Interface pour le produit brut provenant de l'API
interface RawProduct {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  minQuantity?: number;
  discountPercentage?: number;
  navCategory: string;
  category: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

interface LeMobilierClientProps {
  selectedCategory?: string | null;
}

export default function LeMobilierClient({
  selectedCategory = null,
}: LeMobilierClientProps) {
  // On récupère à la fois navCategory et category (si présent dans l'URL)
  const { navCategory, category } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const productsData: RawProduct[] = await response.json();

      // On ne conserve que les produits du groupe "le-mobilier"
      const convertedProducts: Product[] = productsData
        .filter((product: RawProduct) => product.navCategory === "le-mobilier")
        .map((product: RawProduct) => ({
          _id: product._id,
          id: product._id, // On assigne _id à id
          title: product.title,
          name: product.title,
          description: product.description || "",
          imageUrl: product.imageUrl || "",
          price: product.price || 0,
          minQuantity: product.minQuantity || 1,
          discountPercentage: product.discountPercentage || 0,
          navCategory: product.navCategory,
          category: product.category,
        }));
      setProducts(convertedProducts);

      const uniqueCategories = [
        ...new Set(convertedProducts.map((product) => product.category)),
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

  // Exemple d'une redirection si besoin (pour un clic sur une catégorie via un callback)
  const handleCategoryClick = (cat: string) => {
    router.push(`/${navCategory ?? "le-mobilier"}/${cat}`);
  };

  return (
    <div className="products">
      <Container>
        <div className="products__header">
          <Typography variant="h4" component="h1" className="products__title">
            Nos produits pour le mobilier
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            className="product-packs__subtitle"
          >
            Découvrez tous les produits pour le mobilier
          </Typography>
          <Typography mt={5}>
            Choisissez vos produits directement en ligne et payez par Carte
            Bancaire, par chèque, par virement et par espèce.
          </Typography>
          <Typography>
            Divers modes de livraison à votre disposition : Retrait sur place,
            ou livraison et récupération par nos équipes!
          </Typography>
        </div>

        {/* Affichage du filtre par catégorie uniquement sur la page principale
            de la navCategory (si aucun sous-paramètre "category" n'est présent) */}
        {!category && (
          <div className="products__filters">
            <CategoryLinkFilter
              categories={categories}
              selectedCategory={selectedCategory}
              navCategory={navCategory ?? "le-mobilier"}
            />
          </div>
        )}

        <div className="products__grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
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
            NDS Event&apos;s, spécialiste de la location de matériel
            d&apos;événement en Rhône Alpes (Grenoble, Isère 38) depuis plus de
            10 ans !
          </span>{" "}
          <br />
          <br />
          Dans cette catégorie, vous trouverez à la location, tout le mobilier
          de réception, des tables, des chaises, des mange debout, du mobilier
          lumineux, des canapés gonflables chesterfield, et même les housses en
          lycra blanches ! <br />
          <br />
          Découvrez aussi les parasols blanc et les tentes pliantes barnum pour
          vos événements, mariages et autres!
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
