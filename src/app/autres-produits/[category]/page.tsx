// import nodeFetch from 'node-fetch';
// import { Product } from '../../../type/Product';
// import ProductCard from '@/components/ProductCard/ProductCard';
// import "@/app/tous-nos-produits/_Products.scss";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-nds-events.fr';

// async function fetchProducts(): Promise<Product[]> {
//   const res = await nodeFetch(`${API_URL}/api/products`);
//   if (!res.ok) {
//     throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
//   }
//   const productsData = await res.json();

//   const products: Product[] = productsData.map((product: any) => ({
//     _id: product._id,
//     id: product._id,
//     title: product.title,
//     name: product.title,
//     description: product.description || '',
//     imageUrl: product.imageUrl || '',
//     price: product.price || 0,
//     minQuantity: product.minQuantity || 1,
//     discountPercentage: product.discountPercentage || 0,
//     navCategory: product.navCategory,
//     category: product.category,
//   }));

//   return products;
// }

// export async function generateStaticParams() {
//   const products: Product[] = await fetchProducts();
//   const paths = products.map((product) => ({
//     // Ici, nous n'avons qu'un paramètre "category" car "le-mobilier" est fixe.
//     category: product.category,
//   }));

//   const uniquePaths = Array.from(new Set(paths.map((p) => JSON.stringify(p)))).map((s) =>
//     JSON.parse(s)
//   );

//   return uniquePaths;
// }

// export async function generateMetadata({ params }: { params: { category: string } }) {
//   // Puisque le dossier parent est "le-mobilier", on le définit ici.
//   const navCategory = "autres-produits";
//   const category = params.category;
//   const decodedNavCategory = decodeURIComponent(navCategory);
//   const decodedCategory = decodeURIComponent(category);

//   return {
//     title: `${decodedCategory} | NDS EVENTS`,
//     description: `Découvrez tous les produits dans la catégorie ${decodedCategory}.`,
//   };
// }

// export default async function CategoryPage({ params }: { params: { category: string } }) {
//   // On définit navCategory manuellement car il n'est pas présent dans params.
//   const navCategory = "autres-produits";
//   const category = params.category;
//   const decodedNavCategory = decodeURIComponent(navCategory);
//   const decodedCategory = decodeURIComponent(category);

//   const products: Product[] = await fetchProducts();

//   const filteredProducts = products.filter(
//     (product) =>
//       product.navCategory.trim() === decodedNavCategory.trim() &&
//       product.category.trim() === decodedCategory.trim()
//   );

//   return (
//     <div className="products">
//             <div className='products__header'>

//       <h1>{decodedCategory}</h1>
//       <p>Découvrez tous les produits dans la catégorie {decodedCategory}.</p>
//             </div>
//       <div className="products__grid">
//         {filteredProducts.map((product) => (
//           <ProductCard key={product._id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// }
import nodeFetch from "node-fetch";
import { Product } from "../../../type/Product";
import { Container, Typography } from "@mui/material";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryFilterWrapper from "@/components/CategoryFilter/CategoryFilterWrapper";
import "@/app/tous-nos-produits/_Products.scss";
import { slugify } from "@/utils/slugify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

async function fetchProducts(): Promise<Product[]> {
  const res = await nodeFetch(`${API_URL}/api/products`);
  const packsRes = await nodeFetch(`${API_URL}/api/packs`);

  if (!res.ok || !packsRes.ok) {
    throw new Error(
      `Failed to fetch products: ${res.status} ${res.statusText}`
    );
  }

  const productsData = await res.json();
  const packsData = await packsRes.json();

  const products: Product[] = productsData.map((product: any) => ({
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

  const packs: Product[] = packsData.map((pack: any) => ({
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
  const navCategory = "autres-produits";
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
  const navCategory = "autres-produits";
  const category = params.category;
  const decodedNavCategory = decodeURIComponent(navCategory);
  const decodedCategory = decodeURIComponent(category);

  const products: Product[] = await fetchProducts();

  // Extraction des catégories uniques en excluant "Tentes"
  const categories = Array.from(
    new Set(
      products
        .filter(
          (product) =>
            product.navCategory.trim() === decodedNavCategory.trim() &&
            product.category !== "Tentes"
        )
        .map((product) => product.category)
    )
  );

  // Trouver la catégorie originale correspondant au slug
  const originalCategory = categories.find(
    (cat) => slugify(cat) === decodedCategory
  );

  const filteredProducts = products.filter(
    (product) =>
      product.navCategory.trim() === decodedNavCategory.trim() &&
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
              navCategory={decodedNavCategory}
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
        <button className="button-contacez-nous">
          <a href="/contact">Plus de produits - contactez nous</a>
        </button>
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
