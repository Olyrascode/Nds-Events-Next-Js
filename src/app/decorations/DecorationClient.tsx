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
import { Product } from "@/type/Product";
import { slugify } from "@/utils/slugify"; // Ajout de slugify

// Définition des types bruts pour la réponse API
interface RawShared {
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
  slug?: string;
}

interface RawProduct extends RawShared {}

interface RawPack extends RawShared {
  isPack: true;
  navCategories?: string[]; // Ajout du champ navCategories pour les packs
  products: {
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

export default function DecorationsClient() {
  // Pour la page /decorations, category de useParams sera undefined.
  const { category: paramCategory } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState(false);

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
          ...packsData.map((p) => ({ ...p, isPack: true as const })),
        ];

        const convertedItems: Product[] = allRawItems
          .filter((item) => {
            // Pour les produits : utiliser associations
            if (item.associations) {
              return item.associations.some(
                (assoc) => assoc.navCategorySlug === "decorations"
              );
            }
            // Pour les packs : utiliser navCategories
            if ("navCategories" in item && Array.isArray(item.navCategories)) {
              return item.navCategories.includes("decorations");
            }
            return false;
          })
          .map((item) => ({
            _id: item._id,
            id: item._id, // Assurer que id est présent
            title: item.title,
            name: item.title, // Assurer que name est présent
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
            slug: item.slug || slugify(item.title), // slugify ajouté
            isPack: "isPack" in item && item.isPack,
            products: "products" in item && item.isPack ? item.products : [],
          }));

        setProducts(convertedItems);

        const uniqueCategories = Array.from(
          new Set(
            convertedItems.flatMap((p) =>
              p.associations
                ? p.associations
                    .filter(
                      (assoc) =>
                        assoc.navCategorySlug === "decorations" &&
                        assoc.categoryName // Filtre pour 'decorations'
                    )
                    .map((assoc) => assoc.categoryName)
                : []
            )
          )
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products/packs pour Decorations:", error);
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
            Nos produits de décorations
          </Typography>
        </div>
        <div className="products__section">
          {!paramCategory && (
            <div className="products__filters">
              <CategoryLinkFilter
                categories={categories}
                selectedCategory={null}
                navCategory={"decorations"} // navCategory fixe
              />
            </div>
          )}

          <div className="products__grid">
            {products.map((product: Product) => (
              <ProductCard
                key={product._id} // Utiliser _id ou id, en s'assurant de sa présence
                product={product}
                isPack={product.isPack} // Passer isPack
                onRent={handleRentClick}
              />
            ))}
          </div>

          {selectedProduct && (
            <RentalDialog
              open={openRentalDialog}
              onClose={() => setOpenRentalDialog(false)}
              product={selectedProduct}
              isPack={selectedProduct.isPack} // Passer isPack au dialog
            />
          )}
        </div>
      </Container>
      <Container className="bottom-info">
        {/* Remplacer button par Link */}
        <Link href="/contact" className="button-contacez-nous">
          Plus de produits - contactez nous
        </Link>
        <p>
          <span>
            Ne perdez plus de temps ou d&Apos;argent pour votre décoration de
            mariage! NDS Event&Apos;s vous propose de louer votre décoration en
            kits complets ou des produits à l&Apos;unité, le tout au meilleur
            prix garanti!
          </span>{" "}
          <br />
          <br />
          Votre budget ne permet pas de faire appel aux services d&Apos;une
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
