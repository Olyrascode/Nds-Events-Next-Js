"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryFilter from "@/components/CategoryFilter/CategoryFilter";
import RentalDialog from "@/components/RentalDialog";
import "./_Products.scss";
import { Product } from "../../type/Product";
import { slugify } from "@/utils/slugify";

interface ApiProduct {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  minQuantity?: number;
  discountPercentage?: number;
  navCategory: string;
  category: string;
  slug?: string;
}

interface ApiPack extends ApiProduct {
  slug: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

export default function Products() {
  const { navCategory } = useParams();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState<boolean>(false);

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      const productsResponse = await fetch(`${API_URL}/api/products`);
      if (!productsResponse.ok) {
        throw new Error("Failed to fetch products");
      }
      const productsData: ApiProduct[] = await productsResponse.json();

      const packsResponse = await fetch(`${API_URL}/api/packs`);
      if (!packsResponse.ok) {
        throw new Error("Failed to fetch packs");
      }
      const packsData: ApiPack[] = await packsResponse.json();

      const formattedProducts: Product[] = productsData
        .filter((product: ApiProduct) => product.category !== "Tentes")
        .map((product: ApiProduct) => ({
          _id: product._id,
          id: product._id,
          title: product.title,
          name: product.title,
          description: product.description || "",
          imageUrl: product.imageUrl
            ? product.imageUrl.replace("http://localhost:5000", API_URL)
            : "",
          price: product.price || 0,
          minQuantity: product.minQuantity || 1,
          discountPercentage: product.discountPercentage || 0,
          navCategory: product.navCategory,
          category: product.category,
          slug: product.slug || slugify(product.title),
          isPack: false,
        }));

      const formattedPacks: Product[] = packsData
        .filter((pack: ApiPack) => pack.category !== "Tentes")
        .map((pack: ApiPack) => ({
          _id: pack._id,
          id: pack._id,
          title: pack.title,
          name: pack.title,
          description: pack.description || "",
          imageUrl: pack.imageUrl
            ? pack.imageUrl.replace("http://localhost:5000", API_URL)
            : "",
          price: pack.price || 0,
          minQuantity: pack.minQuantity || 1,
          discountPercentage: pack.discountPercentage || 0,
          navCategory: pack.navCategory,
          category: pack.category,
          slug: pack.slug,
          isPack: true,
        }));

      const combinedItems = [...formattedProducts, ...formattedPacks];
      setAllProducts(combinedItems);

      const uniqueCategories = [
        ...new Set(combinedItems.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleRentClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenRentalDialog(true);
  };

  let filteredProducts = allProducts;
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
            Découvrez tous les produits et packs NDS disponibles à la location
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
        <div className="products__section">
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
                key={product._id}
                product={product}
                onRent={handleRentClick}
                isPack={product.isPack}
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
        </div>
      </Container>

      <Container className="bottom-info">
        <button className="button-contacez-nous">
          <Link href="/contact">Plus de produits - contactez nous</Link>
        </button>
        <p>
          <span>
            NDS Event&apos;s, spécialiste de la location de matériel
            d&apos;événement en Rhône Alpes (Grenoble, Isère 38) depuis plus de
            10 ans !
          </span>{" "}
          <br />
          <br />
          Dans cette catégorie, vous trouverez à la location, de la vaisselle
          (verres, couverts, assiettes, tasses, etc...), tout l&apos;art de la
          table avec différentes gammes, du traditionnel &quot;standard&quot;
          aux produits hauts de gamme pour un mariage par exemple, mais aussi
          des nappes et serviettes en tissus blanc. <br />
          <br />
          La vaisselle se loue propre et se rend sale, nous nous occupons du
          lavage et il est inclus dans les prix ! Idem pour les tissus, le
          service de blanchisserie est compris !<br />
          <br /> Une offre au meilleur prix garanti dans la région !
        </p>
      </Container>
    </div>
  );
}
