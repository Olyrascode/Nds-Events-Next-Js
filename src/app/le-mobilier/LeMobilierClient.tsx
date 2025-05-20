"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryLinkFilter from "@/components/CategoryFilter/CategoryLinkFilter";
import RentalDialog from "@/components/RentalDialog";
import "@/app/produits/_Products.scss";
import { Product } from "../../type/Product";
import { slugify } from "@/utils/slugify";
import Link from "next/link";

// Interfaces pour les données brutes provenant de l'API
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

interface LeMobilierClientProps {
  selectedCategory?: string | null;
}

export default function LeMobilierClient({
  selectedCategory = null,
}: LeMobilierClientProps) {
  const { category } = useParams();
  const router = useRouter(); // 'router' is assigned a value but never used - Linter

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState<boolean>(false);

  useEffect(() => {
    const doFetchProducts = async () => {
      console.log("[LeMobilierClient] Fetching products and packs...");
      try {
        const productResponse = await fetch(`${API_URL}/api/products`);
        const packResponse = await fetch(`${API_URL}/api/packs`);

        if (!productResponse.ok) {
          throw new Error(
            `Failed to fetch products: ${productResponse.status} ${productResponse.statusText}`
          );
        }
        if (!packResponse.ok) {
          throw new Error(
            `Failed to fetch packs: ${packResponse.status} ${packResponse.statusText}`
          );
        }

        const productsData: RawProduct[] = await productResponse.json();
        const packsData: RawPack[] = await packResponse.json();
        console.log("[LeMobilierClient] Raw productsData:", productsData);
        console.log("[LeMobilierClient] Raw packsData:", packsData);

        const allRawData: (RawProduct | RawPack)[] = [
          ...productsData,
          ...packsData.map((p) => ({ ...p, isPack: true as const })),
        ];
        console.log(
          "[LeMobilierClient] All raw data (products + packs merged):",
          allRawData
        );

        const convertedItems: Product[] = allRawData
          .filter(
            (item) =>
              item.associations &&
              item.associations.some(
                (assoc) => assoc.navCategorySlug === "le-mobilier"
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
            isPack: "isPack" in item && item.isPack,
            products: "products" in item && item.isPack ? item.products : [],
            slug: item.slug || slugify(item.title),
          }));
        console.log(
          "[LeMobilierClient] Converted items (after filter and map for 'le-mobilier'):",
          convertedItems
        );
        setProducts(convertedItems);

        const uniqueCategories = Array.from(
          new Set(
            convertedItems.flatMap((p) =>
              p.associations
                ? p.associations
                    .filter(
                      (assoc) =>
                        assoc.navCategorySlug === "le-mobilier" && // Filtre par navCategorySlug pour les catégories aussi
                        assoc.categoryName
                    )
                    .map((assoc) => assoc.categoryName)
                : []
            )
          )
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products or packs:", error);
      }
    };

    doFetchProducts();
  }, []); // useEffect dépendances vides pour charger une seule fois

  const handleRentClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenRentalDialog(true);
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
        <div className="products__section">
          {/* Affichage du filtre par catégorie uniquement sur la page principale
            de la navCategory (si aucun sous-paramètre "category" n'est présent) */}
          {!category && (
            <div className="products__filters">
              <CategoryLinkFilter
                categories={categories}
                selectedCategory={selectedCategory}
                navCategory="le-mobilier"
              />
            </div>
          )}

          <div className="products__grid">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onRent={handleRentClick}
                  isPack={product.isPack}
                />
              ))
            ) : (
              <Typography>
                Aucun produit trouvé pour cette catégorie.
              </Typography>
            )}
          </div>

          {selectedProduct && (
            <RentalDialog
              open={openRentalDialog}
              onClose={() => setOpenRentalDialog(false)}
              product={selectedProduct}
              isPack={selectedProduct.isPack}
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
