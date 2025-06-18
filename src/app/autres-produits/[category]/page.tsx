import nodeFetch from "node-fetch";
import { Product } from "../../../type/Product";
import { Container, Typography } from "@mui/material";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryFilterWrapper from "@/components/CategoryFilter/CategoryFilterWrapper";
import "@/app/produits/_Products.scss";
import { slugify } from "@/utils/slugify";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// Définition des types bruts pour la réponse API
interface RawProduct {
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
}

interface RawPack extends Omit<RawProduct, "associations"> {
  associations?: Array<{
    categoryName: string;
    navCategorySlug: string;
    _id?: string;
  }>;
  navCategories?: string[]; // Nouveau champ pour les packs
  products: {
    product: { _id: string; title: string; imageUrl?: string; price: number };
    quantity: number;
  }[];
  slug?: string; // Peut exister ou être calculé
}

async function fetchProducts(): Promise<Product[]> {
  const res = await nodeFetch(`${API_URL}/api/products`);
  const packsRes = await nodeFetch(`${API_URL}/api/packs`);

  if (!res.ok || !packsRes.ok) {
    throw new Error(
      `Failed to fetch products: ${res.status} ${res.statusText}`
    );
  }

  const productsData = (await res.json()) as RawProduct[]; // Utiliser RawProduct[]
  const packsData = (await packsRes.json()) as RawPack[]; // Utiliser RawPack[]

  const products: Product[] = productsData.map((product) => ({
    _id: product._id,
    id: product._id,
    title: product.title,
    name: product.title,
    description: product.description || "",
    imageUrl: product.imageUrl || "",
    price: product.price || 0,
    minQuantity: product.minQuantity || 1,
    lotSize: product.lotSize || undefined,
    discountPercentage: product.discountPercentage || 0,
    associations: product.associations || [],
    options: product.options || [],
    carouselImages: product.carouselImages || [],
    deliveryMandatory: product.deliveryMandatory || false,
    slug: slugify(product.title),
  }));

  const packs: Product[] = packsData
    .filter(
      (pack) =>
        // Filtrer les packs qui ont "autres-produits" dans leurs navCategories
        pack.navCategories && pack.navCategories.includes("autres-produits")
    )
    .map((pack) => ({
      _id: pack._id,
      id: pack._id,
      title: pack.title,
      name: pack.title,
      description: pack.description || "",
      imageUrl: pack.imageUrl || "",
      price: pack.price || 0,
      minQuantity: pack.minQuantity || 1,
      lotSize: pack.lotSize || undefined,
      discountPercentage: pack.discountPercentage || 0,
      associations: pack.associations || [],
      options: pack.options || [],
      carouselImages: pack.carouselImages || [],
      deliveryMandatory: pack.deliveryMandatory || false,
      isPack: true,
      products: pack.products,
      slug: pack.slug || slugify(pack.title),
    }));

  return [...products, ...packs];
}

export async function generateStaticParams() {
  const products: Product[] = await fetchProducts();
  const categorySlugs = new Set<string>();

  products.forEach((product) => {
    if (product.associations && product.associations.length > 0) {
      product.associations.forEach((assoc) => {
        if (assoc.navCategorySlug === "autres-produits" && assoc.categoryName) {
          categorySlugs.add(slugify(assoc.categoryName));
        }
      });
    }
  });

  return Array.from(categorySlugs).map((slug) => ({
    category: slug, // Le nom du paramètre doit correspondre au dossier [category]
  }));
}

export async function generateMetadata(context: {
  params: Promise<{ category: string }>;
}) {
  const { category: resolvedCategory } = await context.params;
  const decodedCategory = decodeURIComponent(resolvedCategory);

  return {
    title: `${decodedCategory} | NDS EVENTS`,
    description: `Découvrez tous les produits dans la catégorie ${decodedCategory}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: resolvedCategory } = await params;
  const decodedCategory = decodeURIComponent(resolvedCategory);
  console.log(
    "[CategoryPage] Decoded category from URL params:",
    decodedCategory
  );

  const products: Product[] = await fetchProducts();

  // Extraction des catégories uniques en excluant "Tentes" de la liste principale pour le filtre
  const allCategoryNamesWithOriginals = new Map<string, string>();
  const navCategorySlugForThisPage = "autres-produits"; // Constante pour clarté

  products.forEach((product) => {
    if (product.associations) {
      product.associations.forEach((assoc) => {
        if (
          assoc.navCategorySlug === navCategorySlugForThisPage &&
          assoc.categoryName &&
          assoc.categoryName.toLowerCase() !== "tentes"
        ) {
          allCategoryNamesWithOriginals.set(
            slugify(assoc.categoryName),
            assoc.categoryName
          );
        }
      });
    }
  });
  const categoriesForFilterDisplay = Array.from(
    allCategoryNamesWithOriginals.values()
  );

  // Trouver la catégorie originale correspondant au slug de l'URL
  const originalCategory =
    allCategoryNamesWithOriginals.get(decodedCategory) || decodedCategory;
  console.log(
    "[CategoryPage] Original category name determined:",
    originalCategory
  );

  const filteredProducts = products.filter((product) => {
    if (!product.associations || product.associations.length === 0)
      return false;
    return product.associations.some(
      (assoc) =>
        assoc.navCategorySlug === navCategorySlugForThisPage &&
        assoc.categoryName &&
        slugify(assoc.categoryName) === decodedCategory
    );
  });

  console.log(
    "[CategoryPage] Number of filtered products:",
    filteredProducts.length
  );

  return (
    <div className="products">
      <div className="products__header">
        <h1>{originalCategory || decodedCategory}</h1>
        <p>
          Découvrez tous les produits dans la catégorie{" "}
          {originalCategory || decodedCategory}.
        </p>
        <Typography mt={5}>
          Choisissez vos produits directement en ligne et payez par Carte
          Bancaire, par chèque, par virement et par espèce.
        </Typography>
        <Typography>
          Divers modes de livraison à votre disposition : Retrait sur place, ou
          livraison et récupération par nos équipes!
        </Typography>
      </div>
      <Container>
        <div className="products__section">
          <div className="products__filters">
            <CategoryFilterWrapper
              categories={categoriesForFilterDisplay}
              selectedCategory={originalCategory || null}
              navCategory="autres-produits"
            />
          </div>

          <div className="products__grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
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
