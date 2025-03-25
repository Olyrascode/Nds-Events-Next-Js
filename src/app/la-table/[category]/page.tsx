import nodeFetch from "node-fetch";
import { Product } from "../../../type/Product";
import { Container, Typography } from "@mui/material";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryFilterWrapper from "@/components/CategoryFilter/CategoryFilterWrapper";
import "@/app/tous-nos-produits/_Products.scss";
import { slugify } from "@/utils/slugify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

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

interface RawPack extends RawProduct {
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
    discountPercentage: product.discountPercentage || 0,
    navCategory: product.navCategory,
    category: product.category,
  }));

  const packs: Product[] = packsData.map((pack: RawPack) => ({
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
    isPack: true,
    products: pack.products,
    slug: pack.slug,
  }));

  return [...products, ...packs];
}

export async function generateStaticParams() {
  const products: Product[] = await fetchProducts();
  const paths = products.map((product) => ({
    category: product.category,
  }));

  const uniquePaths = Array.from(
    new Set(paths.map((p) => JSON.stringify(p)))
  ).map((s) => JSON.parse(s));

  return uniquePaths;
}

export async function generateMetadata(context: {
  params: { category: string };
}) {
  const { category } = context.params;
  const navCategory = "la-table";
  const decodedNavCategory = decodeURIComponent(navCategory);
  const decodedCategory = decodeURIComponent(category);

  return {
    title: `${decodedCategory} | NDS EVENTS`,
    description: `Découvrez tous les produits dans la catégorie ${decodedCategory}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const navCategory = "la-table";
  const category = params.category;
  const decodedCategory = decodeURIComponent(category);

  const products: Product[] = await fetchProducts();

  // Extraction des catégories uniques en excluant "Tentes"
  const categories = Array.from(
    new Set(
      products
        .filter(
          (product) =>
            product.navCategory.trim() === navCategory.trim() &&
            product.category !== "Tentes"
        )
        .map((product) => product.category)
    )
  );

  // Trouver la catégorie originale correspondant au slug
  const originalCategory = categories.find(
    (cat) => slugify(cat) === decodedCategory
  );

  // Filtrer les produits pour la catégorie sélectionnée
  const filteredProducts = products.filter(
    (product) =>
      product.navCategory.trim() === navCategory.trim() &&
      product.category.trim() === originalCategory?.trim()
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
              categories={categories}
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
          table avec différentes gammes, du traditionnel "standard" aux produits
          hauts de gamme pour un mariage par exemple, mais aussi des nappes et
          serviettes en tissus blanc. <br />
          <br />
          La vaisselle se loue propre et se rend sale, nous nous occupons du
          lavage et il est inclus dans les prix ! Idem pour les tissus, le
          service de blanchisserie est compris !<br />
          <br /> Une offre au meilleur prix garanti dans la région !
        </p>
        <button className="button-contacez-nous">
          <a href="/contact">Plus de produits - contactez nous</a>
        </button>
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
