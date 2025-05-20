"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryLinkFilter from "@/components/CategoryFilter/CategoryLinkFilter";
import RentalDialog from "@/components/RentalDialog";
import "@/app/produits/_Products.scss";
import { Product } from "@/type/Product";
import { slugify } from "@/utils/slugify";
import Link from "next/link";

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

export default function AutresProduitsClient() {
  const { category: paramCategory } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState(false);

  useEffect(() => {
    const doFetchProducts = async () => {
      console.log("[AutresProduitsClient] Fetching products and packs...");
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
        console.log("[AutresProduitsClient] Raw productsData:", productsData);
        console.log("[AutresProduitsClient] Raw packsData:", packsData);

        const allRawItems: (RawProduct | RawPack)[] = [
          ...productsData,
          ...packsData.map((p) => ({ ...p, isPack: true as const })),
        ];
        console.log(
          "[AutresProduitsClient] All raw data (products + packs merged):",
          allRawItems
        );

        const convertedItems: Product[] = allRawItems
          .filter(
            (item) =>
              item.associations &&
              item.associations.some(
                (assoc) => assoc.navCategorySlug === "autres-produits"
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
            isPack: "isPack" in item && item.isPack,
            products: "products" in item && item.isPack ? item.products : [],
          }));
        console.log(
          "[AutresProduitsClient] Converted items (after filter and map for 'autres-produits'):",
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
                        assoc.navCategorySlug === "autres-produits" &&
                        assoc.categoryName
                    )
                    .map((assoc) => assoc.categoryName)
                : []
            )
          )
        );
        console.log(
          "[AutresProduitsClient] Unique categories for filter:",
          uniqueCategories
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error(
          "[AutresProduitsClient] Error fetching products/packs pour Autres Produits:",
          error
        );
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
            Nos autres produits et services
          </Typography>
        </div>
        <div className="products__section">
          {!paramCategory && (
            <div className="products__filters">
              <CategoryLinkFilter
                categories={categories}
                selectedCategory={selectedCategory}
                navCategory={"autres-produits"}
              />
            </div>
          )}

          <div className="products__grid">
            {products.length > 0 ? (
              products.map((product: Product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isPack={product.isPack}
                  onRent={handleRentClick}
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
            Ne perdez plus de temps ou d&apos;argent pour votre décoration de
            mariage! NDS Event&apos;s vous propose de louer votre décoration en
            kits complets ou des produits à l&apos;unité, le tout au meilleur
            prix garanti!
          </span>{" "}
          <br />
          <br />
          Votre budget ne permet pas de faire appel aux services d&apos;une
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
