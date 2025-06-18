import nodeFetch from "node-fetch";
import { Product } from "../../../type/Product";
import { Container, Typography } from "@mui/material";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryFilterWrapper from "@/components/CategoryFilter/CategoryFilterWrapper";
import "@/app/produits/_Products.scss";
import { slugify } from "@/utils/slugify";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

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
    product: {
      _id: string;
      title: string;
      imageUrl?: string;
      price: number;
    };
    quantity: number;
  }[];
  slug: string;
}

async function fetchProducts(): Promise<Product[]> {
  const res = await nodeFetch(`${API_URL}/api/products`);
  const packsRes = await nodeFetch(`${API_URL}/api/packs`);

  if (!res.ok || !packsRes.ok) {
    throw new Error(
      `Failed to fetch products: ${res.status} ${res.statusText}`
    );
  }

  const productsData = (await res.json()) as RawProduct[];
  const packsData = (await packsRes.json()) as RawPack[];

  const products: Product[] = productsData.map((product: RawProduct) => ({
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
      (pack: RawPack) =>
        // Filtrer les packs qui ont "la-table" dans leurs navCategories
        pack.navCategories && pack.navCategories.includes("la-table")
    )
    .map((pack: RawPack) => ({
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
      slug: pack.slug,
    }));

  return [...products, ...packs];
}

export async function generateStaticParams() {
  const products: Product[] = await fetchProducts();
  const categorySlugs = new Set<string>();

  products.forEach((product) => {
    if (product.associations && product.associations.length > 0) {
      product.associations.forEach((assoc) => {
        if (assoc.navCategorySlug === "la-table" && assoc.categoryName) {
          categorySlugs.add(slugify(assoc.categoryName));
        }
      });
    }
  });

  return Array.from(categorySlugs).map((slug) => ({
    category: slug,
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
  const navCategory = "la-table";
  const decodedCategory = decodeURIComponent(resolvedCategory);

  const products: Product[] = await fetchProducts();

  // Extraction des catégories uniques pour le filtre, spécifiques à "la-table"
  const uniqueCategoryNamesForFilter = new Set<string>();
  products.forEach((product) => {
    if (product.associations) {
      product.associations.forEach((assoc) => {
        if (
          assoc.navCategorySlug === navCategory &&
          assoc.categoryName &&
          assoc.categoryName.toLowerCase() !== "tentes"
        ) {
          uniqueCategoryNamesForFilter.add(assoc.categoryName);
        }
      });
    }
  });
  const categoriesForFilterDisplay = Array.from(uniqueCategoryNamesForFilter);

  // Trouver la catégorie originale correspondant au slug de l'URL parmi celles extraites
  const originalCategory =
    categoriesForFilterDisplay.find(
      (catName) => slugify(catName) === decodedCategory
    ) || decodedCategory; // Fallback au decodedCategory si non trouvé (devrait correspondre grâce à generateStaticParams)

  // Filtrer les produits pour la catégorie sélectionnée
  const filteredProducts = products.filter((product) => {
    if (!product.associations || product.associations.length === 0)
      return false;
    return product.associations.some(
      (assoc) =>
        assoc.navCategorySlug === navCategory &&
        assoc.categoryName &&
        slugify(assoc.categoryName) === decodedCategory
    );
  });

  return (
    <div className="products">
      <div className="products__header">
        <h1>{originalCategory}</h1>
        <p>Découvrez tous les produits dans la catégorie {originalCategory}.</p>
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
              navCategory={navCategory}
            />
          </div>

          <div className="products__grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isPack={product.isPack}
              />
            ))}
          </div>
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
      <div className="listIconContainer">
        <div className="listIcon">
          <div className="cardBottom">
            <div className="cardLeft">
              <Image
                src="/img/divers/visa.svg"
                alt="Paiement par carte bancaire"
                width={50}
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
                alt="Livraison et récupération"
                width={50}
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
