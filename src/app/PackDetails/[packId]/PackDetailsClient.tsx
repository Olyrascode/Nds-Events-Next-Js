// // "use client";

// // import { useState, useEffect } from 'react';
// // import { useParams } from 'next/navigation';
// // import { useCart } from '../../../contexts/CartContext';
// // import Image from 'next/image';
// // import { fetchPackById } from '../../../services/packs.service';
// // import { Container, Typography, Paper, Button, Alert } from '@mui/material';
// // import RentalPeriod from '../../produits/components/RentalPeriod';
// // import QuantitySelector from '../../produits/components/QuantitySelector';
// // import PackProducts from '../components/PackProducts';
// // import PriceCalculation from '../components/PriceCalculation';
// // import { LocalizationProvider } from '@mui/x-date-pickers';
// // import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// // import { fr } from 'date-fns/locale';
// // import { addDays } from 'date-fns';
// // import { useRentalPeriod } from '../../../contexts/RentalperiodContext';
// // import '../PackDetails.scss';

// // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-nds-events.fr';

// // // ─── INTERFACES ────────────────────────────────────────────────

// // interface PackProduct {
// //   product: {
// //     _id: string;
// //     title: string;
// //     imageUrl?: string;
// //     price: number; // <-- Ajouté ici
// //   };
// //   quantity: number;
// // }

// // interface Pack {
// //   _id?: string;
// //   name: string;
// //   imageUrl?: string;
// //   products: PackProduct[];
// //   discountPercentage?: number;
// //   minQuantity?: number;
// // }

// // // ─── COMPONENT ────────────────────────────────────────────────

// // export default function PackDetails() {
// //   const { packId } = useParams();

// //   // Use non-null assertions if you're sure the context is provided
// //   const { addToCart, cart } = useCart()!;

// //   const { rentalPeriod, setRentalPeriod } = useRentalPeriod()!;
// //   const { startDate, endDate } = rentalPeriod;

// //   // Type the pack state explicitly
// //   const [pack, setPack] = useState<Pack | null>(null);
// //   const [quantity, setQuantity] = useState<number>(1);
// //   const [finalPrice, setFinalPrice] = useState<number>(0);
// //   const [error, setError] = useState<string | null>(null);
// //   const [productStockAvailability, setProductStockAvailability] = useState<Record<string, number>>({});
// //   const [maxPackQuantity, setMaxPackQuantity] = useState<number | null>(null);

// //   // Annotate date parameters as Date | null
// //   const handleStartDateChange = (date: Date | null) => {
// //     setRentalPeriod({ ...rentalPeriod, startDate: date });
// //   };

// //   const handleEndDateChange = (date: Date | null) => {
// //     setRentalPeriod({ ...rentalPeriod, endDate: date });
// //   };

// //   // Charger les infos du pack
// //   useEffect(() => {
// //     async function loadPack() {
// //       try {
// //         setError(null);
// //         const packData = await fetchPackById(packId);
// //         setPack(packData);
// //         setQuantity(packData.minQuantity || 1);
// //       } catch {
// //         setError("Impossible de charger le pack.");
// //       }
// //     }
// //     loadPack();
// //   }, [packId]);

// //   // Récupérer le stock des produits inclus dans le pack
// //   useEffect(() => {
// //     async function fetchStockForPackProducts() {
// //       if (!pack || !startDate || !endDate) return;

// //       const productStockPromises = pack.products.map(async (packItem: PackProduct) => {
// //         if (!packItem.product || !packItem.product._id) {
// //           console.error(`Produit invalide dans le pack :`, packItem);
// //           return { productId: null, availableStock: 0 };
// //         }
// //         try {
// //           const productId = packItem.product._id;
// //           const startDateStr = encodeURIComponent(startDate.toISOString());
// //           const endDateStr = encodeURIComponent(endDate.toISOString());
// //           const response = await fetch(
// //             `${API_URL}/api/stock/${productId}?startDate=${startDateStr}&endDate=${endDateStr}`,
// //             { cache: 'no-store' }
// //           );

// //           if (!response.ok) {
// //             const errorText = await response.text();
// //             console.error(
// //               `Erreur récupération stock pour ${packItem.product.title} (status: ${response.status}): ${errorText}`
// //             );
// //             throw new Error(`Erreur récupération stock pour ${packItem.product.title}`);
// //           }

// //           const data = await response.json();
// //           return { productId, availableStock: data.availableStock };
// //         } catch (error) {
// //           console.error(`Erreur récupération stock produit ${packItem.product.title}:`, error);
// //           return { productId: null, availableStock: 0 };
// //         }
// //       });

// //       const stockResults = await Promise.all(productStockPromises);
// //       const stockMap = stockResults.reduce((acc: Record<string, number>, item) => {
// //         if (item.productId) acc[item.productId] = item.availableStock;
// //         return acc;
// //       }, {});

// //       setProductStockAvailability(stockMap);

// //       if (pack?.products) {
// //         const maxPossiblePacks = pack.products.map((packItem: PackProduct) => {
// //           const availableStock = stockMap[packItem.product._id] || 0;
// //           return Math.floor(availableStock / packItem.quantity);
// //         });
// //         setMaxPackQuantity(Math.min(...maxPossiblePacks));
// //       }
// //     }
// //     fetchStockForPackProducts();
// //   }, [pack, startDate, endDate]);

// //   const isFormValid =
// //     pack &&
// //     startDate &&
// //     endDate &&
// //     quantity > 0 &&
// //     maxPackQuantity !== null &&
// //     quantity <= maxPackQuantity &&
// //     !error;

// //   return (
// //     <Container className="pack-details">
// //       <Paper className="pack-details__content">
// //         <Typography variant="h4">{pack?.name}</Typography>
// //         {pack?.imageUrl && (
// //   <Image
// //     src={pack.imageUrl}
// //     alt={pack.name}
// //     width={400} // Spécifiez une largeur
// //     height={300} // Spécifiez une hauteur (ou adaptez selon votre design)
// //     className="pack-details__image"
// //   />
// // )}
// //         <PackProducts products={pack?.products || []} />
// //         <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
// //           <RentalPeriod
// //             startDate={startDate}
// //             endDate={endDate}
// //             onStartDateChange={handleStartDateChange}
// //             onEndDateChange={handleEndDateChange}
// //             disabled={cart.length > 0}
// //             minStartDate={addDays(new Date(), 2)}
// //           />
// //         </LocalizationProvider>
// //         <Typography variant="body2" color="textSecondary">
// //           Nombre maximal de packs disponibles :{" "}
// //           {maxPackQuantity !== null ? maxPackQuantity : "Chargement..."}
// //         </Typography>
// //         <Paper className="pack-details__product-stock">
// //           <Typography variant="h6">Stock des produits du pack</Typography>
// //           {pack?.products.map((packItem: PackProduct) => {
// //             const product = packItem.product;
// //             const productId = product?._id;
// //             const productName = product?.title || "Produit inconnu";
// //             return productId ? (
// //               <Typography key={productId} variant="body2" color="textSecondary">
// //                 {productName}:{" "}
// //                 {productStockAvailability[productId] !== undefined
// //                   ? `${productStockAvailability[productId]} disponibles`
// //                   : "Chargement..."}
// //               </Typography>
// //             ) : (
// //               <Typography key={Math.random()} variant="body2" color="error">
// //                 Produit invalide : Données manquantes
// //               </Typography>
// //             );
// //           })}
// //         </Paper>
// //         <QuantitySelector
// //           quantity={quantity}
// //           onChange={setQuantity}
// //           minQuantity={pack?.minQuantity}
// //           stock={maxPackQuantity}
// //         />
// //         {error && <Alert severity="error">{error}</Alert>}
// //         <PriceCalculation
// //   products={pack?.products || []}
// //   quantity={quantity}
// //   startDate={startDate}
// //   endDate={endDate}
// //   discountPercentage={pack?.discountPercentage || 0}
// //   setFinalPrice={setFinalPrice}
// // />
// //      <Button
// //   variant="contained"
// //   color="primary"
// //   fullWidth
// //   size="large"
// //   onClick={() =>
// //     addToCart({
// //       ...pack!,
// //       id: pack!._id!,
// //       // ajout de la propriété id
// //       title: pack!.name,   // ajout de la propriété title
// //       type: 'pack',
// //       quantity,
// //       startDate,
// //       endDate,
// //       price: finalPrice,
// //     })
// //   }
// //   className="pack-details__add-to-cart"
// //   disabled={!isFormValid}
// // >
// //   Ajouter le pack au panier
// // </Button>

// //       </Paper>
// //     </Container>
// //   );
// // }
// "use client";

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { useCart } from '../../../contexts/CartContext';
// import Image from 'next/image';
// import { fetchPackBySlug } from '../../../services/packs.service';
// import { Container, Typography, Paper, Button, Alert } from '@mui/material';
// import RentalPeriod from '../../produits/components/RentalPeriod';
// import QuantitySelector from '../../produits/components/QuantitySelector';
// import PackProducts from '../components/PackProducts';
// import PriceCalculation from '../components/PriceCalculation';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { fr } from 'date-fns/locale';
// import { addDays } from 'date-fns';
// import { useRentalPeriod } from '../../../contexts/RentalperiodContext';
// import '../PackDetails.scss';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-nds-events.fr';

// // ─── INTERFACES ────────────────────────────────────────────────

// interface PackProduct {
//   product: {
//     _id: string;
//     title: string;
//     imageUrl?: string;
//     price: number;
//   };
//   quantity: number;
// }

// interface Pack {
//   _id?: string;
//   name: string;
//   imageUrl?: string;
//   products: PackProduct[];
//   discountPercentage?: number;
//   minQuantity?: number;
// }

// // ─── COMPONENT ────────────────────────────────────────────────

// export default function PackDetails() {
//   // Utilisez le paramètre "slug" car la route est définie comme /packs-complets/[slug]
//   const { slug } = useParams();

//   // Use non-null assertions if you're sure the context is provided
//   const { addToCart, cart } = useCart()!;

//   const { rentalPeriod, setRentalPeriod } = useRentalPeriod()!;
//   const { startDate, endDate } = rentalPeriod;

//   const [pack, setPack] = useState<Pack | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [finalPrice, setFinalPrice] = useState<number>(0);
//   const [error, setError] = useState<string | null>(null);
//   const [productStockAvailability, setProductStockAvailability] = useState<Record<string, number>>({});
//   const [maxPackQuantity, setMaxPackQuantity] = useState<number | null>(null);

//   const handleStartDateChange = (date: Date | null) => {
//     setRentalPeriod({ ...rentalPeriod, startDate: date });
//   };

//   const handleEndDateChange = (date: Date | null) => {
//     setRentalPeriod({ ...rentalPeriod, endDate: date });
//   };

//   // Charger les infos du pack par slug
//   useEffect(() => {
//     async function loadPack() {
//       try {
//         setError(null);
//         const packData = await fetchPackBySlug(slug);
//         setPack(packData);
//         setQuantity(packData.minQuantity || 1);
//       } catch {
//         setError("Impossible de charger le pack.");
//       }
//     }
//     loadPack();
//   }, [slug]);

//   // Récupérer le stock des produits inclus dans le pack
//   useEffect(() => {
//     async function fetchStockForPackProducts() {
//       if (!pack || !startDate || !endDate) return;

//       const productStockPromises = pack.products.map(async (packItem: PackProduct) => {
//         if (!packItem.product || !packItem.product._id) {
//           console.error(`Produit invalide dans le pack :`, packItem);
//           return { productId: null, availableStock: 0 };
//         }
//         try {
//           const productId = packItem.product._id;
//           const startDateStr = encodeURIComponent(startDate.toISOString());
//           const endDateStr = encodeURIComponent(endDate.toISOString());
//           const response = await fetch(
//             `${API_URL}/api/stock/${productId}?startDate=${startDateStr}&endDate=${endDateStr}`,
//             { cache: 'no-store' }
//           );

//           if (!response.ok) {
//             const errorText = await response.text();
//             console.error(
//               `Erreur récupération stock pour ${packItem.product.title} (status: ${response.status}): ${errorText}`
//             );
//             throw new Error(`Erreur récupération stock pour ${packItem.product.title}`);
//           }

//           const data = await response.json();
//           return { productId, availableStock: data.availableStock };
//         } catch (error) {
//           console.error(`Erreur récupération stock produit ${packItem.product.title}:`, error);
//           return { productId: null, availableStock: 0 };
//         }
//       });

//       const stockResults = await Promise.all(productStockPromises);
//       const stockMap = stockResults.reduce((acc: Record<string, number>, item) => {
//         if (item.productId) acc[item.productId] = item.availableStock;
//         return acc;
//       }, {});

//       setProductStockAvailability(stockMap);

//       if (pack?.products) {
//         const maxPossiblePacks = pack.products.map((packItem: PackProduct) => {
//           const availableStock = stockMap[packItem.product._id] || 0;
//           return Math.floor(availableStock / packItem.quantity);
//         });
//         setMaxPackQuantity(Math.min(...maxPossiblePacks));
//       }
//     }
//     fetchStockForPackProducts();
//   }, [pack, startDate, endDate]);

//   const isFormValid =
//     pack &&
//     startDate &&
//     endDate &&
//     quantity > 0 &&
//     maxPackQuantity !== null &&
//     quantity <= maxPackQuantity &&
//     !error;

//   return (
//     <Container className="pack-details">
//       <Paper className="pack-details__content">
//         <Typography variant="h4">{pack?.name}</Typography>
//         {pack?.imageUrl && (
//           <Image
//             src={pack.imageUrl}
//             alt={pack.name}
//             width={400}
//             height={300}
//             className="pack-details__image"
//           />
//         )}
//         <PackProducts products={pack?.products || []} />
//         <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
//           <RentalPeriod
//             startDate={startDate}
//             endDate={endDate}
//             onStartDateChange={handleStartDateChange}
//             onEndDateChange={handleEndDateChange}
//             disabled={cart.length > 0}
//             minStartDate={addDays(new Date(), 2)}
//           />
//         </LocalizationProvider>
//         <Typography variant="body2" color="textSecondary">
//           Nombre maximal de packs disponibles :{" "}
//           {maxPackQuantity !== null ? maxPackQuantity : "Chargement..."}
//         </Typography>
//         <Paper className="pack-details__product-stock">
//           <Typography variant="h6">Stock des produits du pack</Typography>
//           {pack?.products.map((packItem: PackProduct) => {
//             const product = packItem.product;
//             const productId = product?._id;
//             const productName = product?.title || "Produit inconnu";
//             return productId ? (
//               <Typography key={productId} variant="body2" color="textSecondary">
//                 {productName}:{" "}
//                 {productStockAvailability[productId] !== undefined
//                   ? `${productStockAvailability[productId]} disponibles`
//                   : "Chargement..."}
//               </Typography>
//             ) : (
//               <Typography key={Math.random()} variant="body2" color="error">
//                 Produit invalide : Données manquantes
//               </Typography>
//             );
//           })}
//         </Paper>
//         <QuantitySelector
//           quantity={quantity}
//           onChange={setQuantity}
//           minQuantity={pack?.minQuantity}
//           stock={maxPackQuantity}
//         />
//         {error && <Alert severity="error">{error}</Alert>}
//         <PriceCalculation
//           products={pack?.products || []}
//           quantity={quantity}
//           startDate={startDate}
//           endDate={endDate}
//           discountPercentage={pack?.discountPercentage || 0}
//           setFinalPrice={setFinalPrice}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           size="large"
//           onClick={() =>
//             addToCart({
//               ...pack!,
//               id: pack!._id!,
//               title: pack!.name,
//               type: 'pack',
//               quantity,
//               startDate,
//               endDate,
//               price: finalPrice,
//             })
//           }
//           className="pack-details__add-to-cart"
//           disabled={!isFormValid}
//         >
//           Ajouter le pack au panier
//         </Button>
//       </Paper>
//     </Container>
//   );
// }
