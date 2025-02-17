// "use client";

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Head from 'next/head';
// import { Container, Typography } from '@mui/material';
// import "./_Tentes.scss";
// import ProductCard from '../../components/ProductCard/ProductCard';
// import RentalDialog from '../../components/RentalDialog'; // Assurez-vous que ce composant est correctement importé

// function Tentes() {
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [openRentalDialog, setOpenRentalDialog] = useState(false);
//   const router = useRouter();

//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://82.29.170.25';

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/products`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch products');
//       }
//       const productsData = await response.json();

//       // Filtrer pour ne conserver que les produits du groupe "tentes"
//       const filteredProducts = productsData.filter(
//         product => product.navCategory === 'tentes'
//       );
//       setProducts(filteredProducts);

//       const uniqueCategories = [
//         ...new Set(filteredProducts.map(product => product.category))
//       ];
//       setCategories(uniqueCategories);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   const handleRentClick = (product) => {
//     setSelectedProduct(product);
//     setOpenRentalDialog(true);
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <>
//     <Head>
//     <title>Tentes - Location de tentes de réception | Votre Site</title>
//     <meta
//       name="description"
//       content="Découvrez notre sélection exclusive de tentes de réception alliant style et fonctionnalité pour vos événements. Louez la tente idéale pour créer une ambiance inoubliable."
//     />
//     <meta name="robots" content="index, follow" />
//     {/* Vous pouvez ajouter d'autres balises meta SEO ici */}
//   </Head>
//     <div className='tentesContainer'>
//       <div className='tentesHeader'>
//         <h1>Tentes</h1>
//         <h2>
//           Découvrez notre sélection exclusive de tentes de réception, alliant style et fonctionnalité pour faire de votre événement un succès inoubliable.
//         </h2>
//       </div>

//       <section>
//         <Container>
//           <div className="products__header">
//             <Typography variant="h4" component="h3" className="products__title">
//               Tentes en location
//             </Typography>
//           </div>

//           <div className="products__grid">
//             {products.map((product) => (
//               <ProductCard
//                 key={product._id}
//                 product={product}
//                 onRent={handleRentClick}
//               />
//             ))}
//           </div>

//           {selectedProduct && (
//             <RentalDialog
//               open={openRentalDialog}
//               onClose={() => setOpenRentalDialog(false)}
//               product={selectedProduct}
//             />
//           )}
//         </Container>
//       </section>

//       <section>
//         <div className='choiceContainer'>
//           <div className='choix1'>
//             <h3>Une question ?</h3>
//             <img src="" alt="" />
//             <button>Contactez nous</button>
//           </div>
//           <div className='choix2'>
//             <h3>Vous voulez réserver ?</h3>
//             <img src="" alt="" />
//             <button>Demander un devis</button>
//           </div>
//         </div>
//       </section>

//       <section className='sectionCard'>
//         <h2>Nos produits sur devis</h2>
//         <p>
//           Nos produits en location ne conviennent pas à vos besoins ? Essayez une de nos trois tentes disponibles sur devis
//         </p>
//         <div className='tenteCardContainer'>
//           <div className='tenteCard'>
//             <h4>Tentes de réception</h4>
//             <img src="/img/tentespliantes/tente-de-reception.png" alt="" />
//             <ul>
//               <li>De 24m² à 364m²</li>
//               <li>De 295€ à 2690€</li>
//               <li>De multiples options disponibles</li>
//               <li>Avec ou sans installation</li>
//             </ul>
//             <button onClick={() => router.push('/TentesDeReceptions')}>Voir toutes les tentes de réception</button>
//           </div>
//           <div className='tenteCard'>
//             <h4>Pagodes</h4>
//             <img src="/img/tentespliantes/pagode-de-reception.png" alt="" />
//             <ul>
//               <li>De 16m² à 36m²</li>
//               <li>De 290€ à 360€</li>
//               <li>De multiples options disponibles</li>
//               <li>Avec ou sans installation</li>
//             </ul>
//             <button onClick={() => router.push('/Pagodes')}>Voir toutes les pagodes de réception</button>
//           </div>
//           <div className='tenteCard'>
//             <h4>Tentes pliantes</h4>
//             <img src="/img/tentespliantes/tentes-pliantes.png" alt="" />
//             <ul>
//               <li>De 9m² à 32m²</li>
//               <li>De 65€ à 225€</li>
//               <li>De multiples options disponibles</li>
//               <li>Avec ou sans installation</li>
//             </ul>
//             <button onClick={() => router.push('/TentesPliantes')}>Voir toutes les tentes pliantes</button>
//           </div>
//         </div>
//       </section>
//     </div>
//     </>
//   );
// }

// export default Tentes;
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import { Container, Typography } from '@mui/material';
import "./_Tentes.scss";
import ProductCard from '../../components/ProductCard/ProductCard';
import RentalDialog from '../../components/RentalDialog';

function Tentes() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://82.29.170.25';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await response.json();

        // Filtrer pour ne conserver que les produits du groupe "tentes"
        const filteredProducts = productsData.filter(
          (product: any) => product.navCategory === 'tentes'
        );
        setProducts(filteredProducts);

        const uniqueCategories = [
          ...new Set(filteredProducts.map((product: any) => product.category))
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [API_URL]);

  const handleRentClick = (product: any) => {
    setSelectedProduct(product);
    setOpenRentalDialog(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Head>
        <title>Tentes - Location de tentes de réception | Votre Site</title>
        <meta
          name="description"
          content="Découvrez notre sélection exclusive de tentes de réception alliant style et fonctionnalité pour vos événements. Louez la tente idéale pour créer une ambiance inoubliable."
        />
        <meta name="robots" content="index, follow" />
        {/* Vous pouvez ajouter d'autres balises meta SEO ici */}
      </Head>
      <div className="tentesContainer">
        <div className="tentesHeader">
          <h1>Tentes</h1>
          <h2>
            Découvrez notre sélection exclusive de tentes de réception, alliant style et fonctionnalité pour faire de votre événement un succès inoubliable.
          </h2>
        </div>

        <section>
          <Container>
            <div className="products__header">
              <Typography variant="h4" component="h3" className="products__title">
                Tentes en location
              </Typography>
            </div>

            <div className="products__grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
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
          </Container>
        </section>

        <section>
          <div className="choiceContainer">
            <div className="choix1">
              <h3>Une question ?</h3>
              {/* Remplacer <img> par <Image> avec dimensions */}
           
              <button>Contactez nous</button>
            </div>
            <div className="choix2">
              <h3>Vous voulez réserver ?</h3>
             
              <button>Demander un devis</button>
            </div>
          </div>
        </section>

        <section className="sectionCard">
          <h2>Nos produits sur devis</h2>
          <p>
            Nos produits en location ne conviennent pas à vos besoins ? Essayez une de nos trois tentes disponibles sur devis
          </p>
          <div className="tenteCardContainer">
            <div className="tenteCard">
              <h4>Tentes de réception</h4>
              <Image src="/img/tentespliantes/tente-de-reception.png" alt="Tente de réception" width={300} height={200} />
              <ul>
                <li>De 24m² à 364m²</li>
                <li>De 295€ à 2690€</li>
                <li>De multiples options disponibles</li>
                <li>Avec ou sans installation</li>
              </ul>
              <button onClick={() => router.push('/TentesDeReceptions')}>Voir nos tentes de réception</button>
            </div>
            <div className="tenteCard">
              <h4>Pagodes</h4>
              <Image src="/img/tentespliantes/pagode-de-reception.png" alt="Pagode de réception" width={300} height={200} />
              <ul>
                <li>De 16m² à 36m²</li>
                <li>De 290€ à 360€</li>
                <li>De multiples options disponibles</li>
                <li>Avec ou sans installation</li>
              </ul>
              <button onClick={() => router.push('/Pagodes')}>Voir nos pagodes de réception</button>
            </div>
            <div className="tenteCard">
              <h4>Tentes pliantes</h4>
              <Image src="/img/tentespliantes/tentes-pliantes.png" alt="Tentes pliantes" width={300} height={200} />
              <ul>
                <li>De 9m² à 32m²</li>
                <li>De 65€ à 225€</li>
                <li>De multiples options disponibles</li>
                <li>Avec ou sans installation</li>
              </ul>
              <button onClick={() => router.push('/TentesPliantes')}>Voir nos tentes pliantes</button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Tentes;
