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
interface RawShared {
  // Interface partagée pour les champs communs
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  minQuantity?: number;
  lotSize?: number;
  discountPercentage?: number;
  associations?: Array<{
    categoryName: string;
    navCategorySlug: string;
    _id?: string;
  }>;
  options?: Array<{ name: string; price: number }>;
  carouselImages?: Array<{ url: string; fileName?: string }>;
  deliveryMandatory?: boolean;
  slug?: string; // Slug peut être sur le produit ou le pack
}

interface RawProduct extends RawShared {
  // Champs spécifiques aux produits simples si nécessaire à l'avenir
}

interface RawPack extends RawShared {
  isPack: true; // Marqueur pour identifier les packs
  products: {
    // Champs spécifiques aux packs
    product: {
      _id: string;
      title: string;
      imageUrl?: string;
      price: number;
    };
    quantity: number;
  }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

export default function LaTableClient() {
  const { category: paramCategory } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState<boolean>(false);

  useEffect(() => {
    const doFetchProducts = async () => {
      try {
        const productsResponse = await fetch(`${API_URL}/api/products`);
        const packsResponse = await fetch(`${API_URL}/api/packs`);

        if (!productsResponse.ok) {
          throw new Error(
            `Failed to fetch products: ${productsResponse.status} ${productsResponse.statusText}`
          );
        }
        if (!packsResponse.ok) {
          throw new Error(
            `Failed to fetch packs: ${packsResponse.status} ${packsResponse.statusText}`
          );
        }

        const productsData: RawProduct[] = await productsResponse.json();
        const packsData: RawPack[] = await packsResponse.json();

        const allRawItems: (RawProduct | RawPack)[] = [
          ...productsData,
          ...packsData.map((p) => ({ ...p, isPack: true as const })), // Marquer les packs
        ];

        const convertedItems: Product[] = allRawItems
          .filter(
            (item) =>
              item.associations &&
              item.associations.some(
                (assoc) => assoc.navCategorySlug === "la-table"
              )
          )
          .map((item) => ({
            _id: item._id,
            id: item._id,
            title: item.title,
            name: item.title,
            description: item.description || "",
            imageUrl: item.imageUrl || "",
            price: item.price || 0,
            minQuantity: item.minQuantity || 1,
            lotSize: item.lotSize,
            discountPercentage: item.discountPercentage || 0,
            associations: item.associations || [],
            options: item.options || [],
            carouselImages: item.carouselImages || [],
            deliveryMandatory: item.deliveryMandatory || false,
            slug: item.slug || slugify(item.title),
            isPack: "isPack" in item && item.isPack, // Vérifier si c'est un pack
            products: "products" in item && item.isPack ? item.products : [], // Ajouter les produits du pack
          }));

        setProducts(convertedItems);

        const uniqueCategories = Array.from(
          new Set(
            convertedItems.flatMap((p) =>
              p.associations
                ? p.associations
                    .filter(
                      (assoc) =>
                        assoc.navCategorySlug === "la-table" &&
                        assoc.categoryName
                    )
                    .map((assoc) => assoc.categoryName)
                : []
            )
          )
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Erreur fetching products/packs pour La Table:", error);
      }
    };
    doFetchProducts();
  }, []);

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
          {!paramCategory && (
            <div className="products__filters">
              <CategoryLinkFilter
                categories={categories}
                selectedCategory={null}
                navCategory={"la-table"}
              />
            </div>
          )}
          <div className="products__grid">
            {products.map((product) => (
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
        <Link href="/contact" className="button-contacez-nous">
          Plus de produits - contactez nous
        </Link>
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
