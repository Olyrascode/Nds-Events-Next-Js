"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryLinkFilter from "@/components/CategoryFilter/CategoryLinkFilter";
import RentalDialog from "@/components/RentalDialog";
import "@/app/produits/_Products.scss";
import { Product } from "../../type/Product";
import { slugify } from "@/utils/slugify";

// Interface pour les données brutes provenant de l'API
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

interface RawPack {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  minQuantity?: number;
  discountPercentage?: number;
  navCategory: string;
  category: string;
  slug: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

export default function LaTableClient() {
  const { navCategory, category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState<boolean>(false);

  // Si aucune catégorie n'est sélectionnée, affichez tous les produits déjà filtrés par navCategory 'la-table'
  const filteredProducts = category
    ? products.filter((product) => product.category === category)
    : products;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsResponse = await fetch(`${API_URL}/api/products`);
      const packsResponse = await fetch(`${API_URL}/api/packs`);

      if (!productsResponse.ok || !packsResponse.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      const productsData: RawProduct[] = await productsResponse.json();
      const packsData: RawPack[] = await packsResponse.json();

      // Filtrer les produits pour ne garder que ceux de la catégorie "la-table"
      const tableProducts = productsData
        .filter((product: RawProduct) => product.navCategory === "la-table")
        .map((product: RawProduct) => ({
          _id: product._id,
          id: product._id,
          title: product.title,
          name: product.title,
          description: product.description || "",
          imageUrl: product.imageUrl || "",
          price: product.price || 0,
          minQuantity: product.minQuantity || 1,
          discountPercentage: product.discountPercentage || 0,
          navCategory: product.navCategory,
          category: product.category,
          slug: slugify(product.title),
        }));

      // Filtrer les packs pour ne garder que ceux de la catégorie "la-table"
      const tablePacks = packsData
        .filter((pack: RawPack) => pack.navCategory === "la-table")
        .map((pack: RawPack) => ({
          _id: pack._id,
          id: pack._id,
          title: pack.title,
          name: pack.title,
          description: pack.description || "",
          imageUrl: pack.imageUrl || "",
          price: pack.price || 0,
          minQuantity: pack.minQuantity || 1,
          discountPercentage: pack.discountPercentage || 0,
          navCategory: pack.navCategory,
          category: pack.category,
          slug: pack.slug,
          isPack: true,
        }));

      // Combiner les produits et les packs
      const allProducts = [...tableProducts, ...tablePacks];
      setProducts(allProducts);

      const uniqueCategories = [
        ...new Set(allProducts.map((product) => product.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Erreur:", error);
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
            Nos produits pour la table
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            className="product-packs__subtitle"
          >
            Découvrez tous les produits pour vos tables
          </Typography>
        </div>
        <div className="products__section">
          {!category && (
            <div className="products__filters">
              <CategoryLinkFilter
                categories={categories}
                selectedCategory={null}
                navCategory={navCategory ?? "la-table"}
              />
            </div>
          )}
          <div className="products__grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isPack={product.isPack}
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
          table avec différentes gammes, du traditionnel
          &Apos;&Apos;standard&Apos;&Apos; aux produits hauts de gamme pour un
          mariage par exemple, mais aussi des nappes et serviettes en tissus
          blanc. <br />
          <br />
          La vaisselle se loue propre et se rend sale, nous nous occupons du
          lavage et il est inclus dans les prix ! Idem pour les tissus, le
          service de blanchisserie est compris !<br />
          <br /> Une offre au meilleur prix garanti dans la région !
        </p>
      </Container>
      <div className="listIconContainer">
        <div className="listIcon">
          <div className="cardBottom">
            <div className="cardLeft">
              <Image
                src="/img/divers/visa.svg"
                alt="Logo Visa"
                width={48}
                height={32}
                priority
              />
              <p>
                Choisissez vos produits directement en ligne et payez par Carte
                Bancaire ou directement au depot NDS par chèque, virement ou
                espèce
              </p>
            </div>
            <div className="cardRight">
              <Image
                src="/img/divers/truck.svg"
                alt="Icône de livraison"
                width={48}
                height={32}
                priority
              />
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
