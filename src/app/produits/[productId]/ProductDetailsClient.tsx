// "use client";

// import React, { useState, useEffect, useMemo } from 'react';
// import { useParams } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAvailableStock } from '../../../features/stockSlice';
// import { useCart } from '../../../contexts/CartContext';
// import { fetchProductById } from '../../../services/products.service';
// import { calculateRentalDays } from '../../../utils/dateUtils';
// import { addDays } from 'date-fns';
// import { Typography, Container, Button } from '@mui/material';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { fr } from 'date-fns/locale';
// import { useRentalPeriod } from '../../../contexts/RentalperiodContext';
// import ProductOptions from '../components/ProductOptions';
// import RentalPeriod from '../components/RentalPeriod';
// import QuantitySelector from '../components/QuantitySelector';
// import PriceCalculation from '../components/PriceCalculation';
// import Image from 'next/image';
// import { useAppDispatch } from '../../../hooks/useAppDispatch';
// import './ProductDetails.scss';

// interface ProductOption {
//   id: string;
//   name: string;
//   price: number;
// }

// export interface Product {
//   _id: string;
//   title: string;
//   imageUrl?: string;
//   description: string;
//   price: number;
//   minQuantity?: number;
//   lotSize?: number;
//   options?: ProductOption[];
// }

// type SelectedOptions = {
//   [key: string]: ProductOption;
// };

// interface CartItem {
//   startDate?: Date | null;
//   endDate?: Date | null;
//   id?: string;
// }

// interface RootState {
//   stock: {
//     stockByProduct: { [key: string]: number };
//     loading: boolean;
//   };
// }

// export default function ProductDetails() {
//   const { productId } = useParams() as { productId: string };
//   const { addToCart, setIsCartOpen, cart } = useCart();

//   const dispatch = useAppDispatch();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
//   const { rentalPeriod, setRentalPeriod } = useRentalPeriod()!;
//   const { startDate, endDate } = rentalPeriod;
//   const [finalPrice, setFinalPrice] = useState<number>(0);
//   const [error, setError] = useState<string | null>(null);
//   const [quantityError, setQuantityError] = useState<string>("");

//   // Bloquer le calendrier si un produit est déjà dans le panier (quelle que soient ses dates)
//   const isCalendarDisabled = cart.length > 0;

//   const availableStock = useSelector((state: RootState) => state.stock.stockByProduct[productId]);
//   const stockLoading = useSelector((state: RootState) => state.stock.loading);

//   // Si le produit se loue en lots, on calcule le nombre maximum de lots disponibles
// const maxLotsAvailable =
// product && product.lotSize && product.lotSize > 1
//   ? Math.floor(availableStock / product.lotSize)
//   : availableStock;

//   const handleStartDateChange = (date: Date | null) => {
//     setRentalPeriod({ ...rentalPeriod, startDate: date });
//   };

//   const handleEndDateChange = (date: Date | null) => {
//     setRentalPeriod({ ...rentalPeriod, endDate: date });
//   };

//   useEffect(() => {
//     async function loadProduct() {
//       try {
//         setError(null);
//         const productData = await fetchProductById(productId);
//         setProduct(productData);
//         setQuantity(productData.minQuantity || 1);
//       } catch {
//         setError("Impossible de charger le produit.");
//       }
//     }
//     loadProduct();
//   }, [productId]);

//   // On utilise useMemo pour éviter de recréer des objets Date à chaque rendu
//   const displayedStartDate = useMemo(
//     () =>
//       startDate ||
//       (cart.length > 0 && cart[0].startDate ? new Date(cart[0].startDate) : null),
//     [startDate, cart]
//   );
//   const displayedEndDate = useMemo(
//     () =>
//       endDate ||
//       (cart.length > 0 && cart[0].endDate ? new Date(cart[0].endDate) : null),
//     [endDate, cart]
//   );

//   const effectiveStartDate = displayedStartDate;
//   const effectiveEndDate = displayedEndDate;

//   useEffect(() => {
//     if (productId && effectiveStartDate && effectiveEndDate) {
//       (dispatch as any)(
//         fetchAvailableStock({ productId, startDate: effectiveStartDate, endDate: effectiveEndDate })
//       );
//     }
//   }, [productId, effectiveStartDate, effectiveEndDate, dispatch]);

//   useEffect(() => {
//     if (!product) return;
//     const days = calculateRentalDays(effectiveStartDate, effectiveEndDate);
//     const lotSize = product.lotSize || 1;
//     const optionPrice = Object.values(selectedOptions).reduce((acc, opt) => acc + opt.price, 0);
//     const unitPrice = product.price + optionPrice;
//     const basePrice = unitPrice * quantity * lotSize;
//     let computedFinalPrice = basePrice;
//     if (days > 4) {
//       const extraDays = days - 4;
//       computedFinalPrice += basePrice * 0.15 * extraDays;
//     }
//     setFinalPrice(computedFinalPrice);
//   }, [product, selectedOptions, quantity, effectiveStartDate, effectiveEndDate]);

//   useEffect(() => {
//     if (quantity > availableStock) {
//       setQuantityError("La quantité demandée dépasse le stock disponible.");
//     } else {
//       setQuantityError("");
//     }
//   }, [quantity, availableStock]);

//   const handleQuantityChange = (newQuantity: number) => {
//     setQuantity(newQuantity);
//     // Calculer le nombre total d'unités demandé
//     const totalUnits = newQuantity * (product?.lotSize || 1);

//     // Si le produit se loue en lot, on vérifie que le nombre de lots ne dépasse pas maxLotsAvailable
//     if (product?.lotSize && product.lotSize > 1 && newQuantity > maxLotsAvailable) {
//       setQuantityError(`Vous ne pouvez pas sélectionner plus de ${maxLotsAvailable} lots (soit ${maxLotsAvailable * product.lotSize} unités)`);
//     } else if (totalUnits > availableStock) {
//       setQuantityError(`Stock insuffisant. Vous avez demandé ${totalUnits} unités.`);
//     } else {
//       setQuantityError("");
//     }
//   };

//   const handleAddToCart = () => {
//     if (product?.lotSize && product.lotSize > 1) {
//       // Calcul du nombre maximum de lots disponibles
//       const maxLotsAvailable = Math.floor(availableStock / product.lotSize);
//       if (quantity > maxLotsAvailable) {
//         setError(`La quantité demandée dépasse le stock disponible. Maximum ${maxLotsAvailable} lots disponibles (soit ${maxLotsAvailable * product.lotSize} unités).`);
//         return;
//       }
//     } else {
//       if (quantity > availableStock) {
//         setError("La quantité demandée dépasse le stock disponible.");
//         return;
//       }
//     }

//     if (!product) return;

//     addToCart({
//       id: product._id,
//       title: product.title,
//       price: finalPrice,
//       imageUrl: product.imageUrl,
//       quantity,
//       startDate: effectiveStartDate,
//       endDate: effectiveEndDate,
//       selectedOptions,
//     });
//     setIsCartOpen(true);
//   };

//   const isFormValid =
//     product !== null &&
//     effectiveStartDate !== null &&
//     effectiveEndDate !== null &&
//     quantity > 0 &&
//     quantity <= availableStock &&
//     !quantityError;

//   if (!product) {
//     return <div className="product-details__error">{error || "Produit introuvable."}</div>;
//   }

//   return (
//     <div className='mainContainer'>
//       <Container className="product-details">
//         <div className='product-details__header'>
//           <div className='product-details__text'>
//             <Typography variant="h1">{product.title}</Typography>
//             <Typography variant='h6'>{product.description}</Typography>
//           </div>
//           {product.imageUrl && (
//             <Image
//               src={product.imageUrl}
//               alt={product.title}
//               className="product-details__image"
//               width={500}
//               height={400}
//               style={{ objectFit: "contain" }}
//               unoptimized
//             />
//           )}
//         </div>
//         {product.options?.length ? (
//           <ProductOptions
//             options={product.options}
//             selectedOptions={selectedOptions}
//             onChange={setSelectedOptions}
//           />
//         ) : (
//           <Typography variant="h6">€{product.price} par jour</Typography>
//         )}
// <Typography variant="h6">
//   {Number(product.lotSize) > 1
//     ? `€${(product.price * Number(product.lotSize) * quantity).toFixed(2)} pour ${quantity} ${quantity > 1 ? "lots" : "lot"} de ${product.lotSize} unités`
//     : `€${product.price.toFixed(2)} par unité`}
// </Typography>

//         <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
//           <RentalPeriod
//             startDate={displayedStartDate}
//             endDate={displayedEndDate}
//             onStartDateChange={handleStartDateChange}
//             onEndDateChange={handleEndDateChange}
//             disabled={isCalendarDisabled}
//             minStartDate={addDays(new Date(), 2)}
//           />
//         </LocalizationProvider>
//         {effectiveStartDate && effectiveEndDate && (
//   stockLoading ? (
//     <Typography color="textSecondary" variant="body2">
//       Chargement du stock...
//     </Typography>
//   ) : availableStock !== undefined ? (
//     <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
//       {product.lotSize && product.lotSize > 1
//         ? `Stock disponible : ${maxLotsAvailable} lots (soit ${maxLotsAvailable * product.lotSize} unités)`
//         : `Stock disponible : ${availableStock} unités`
//       }
//     </Typography>
//   ) : null
// )}

//         <QuantitySelector
//           quantity={quantity}
//           onChange={handleQuantityChange}
//           minQuantity={product.minQuantity}
//           stock={availableStock}
//         />
//         {quantityError && (
//           <Typography color="error" variant="body2">
//             {quantityError}
//           </Typography>
//         )}
//         {(product.lotSize && product.lotSize > 1) && (
//           <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
//             <strong>({quantity} lots) {quantity * product.lotSize} unités</strong>
//           </Typography>
//         )}
//         {/* <PriceCalculation
//           price={product.price}
//           quantity={quantity}
//           startDate={effectiveStartDate}
//           endDate={effectiveEndDate}
//           selectedOptions={selectedOptions}
//           setFinalPrice={setFinalPrice}
//         /> */}
//         <PriceCalculation
//   price={product.price}
//   quantity={quantity}
//   startDate={effectiveStartDate}
//   endDate={effectiveEndDate}
//   selectedOptions={selectedOptions}
//   setFinalPrice={setFinalPrice}
//   lotSize={product.lotSize || 1} // Ajout de lotSize
// />

//         <Button
//           className="product-details__add-to-cart"
//           onClick={handleAddToCart}
//           disabled={!isFormValid}
//           variant="contained"
//           color="primary"
//           sx={{ mt: 2 }}
//         >
//           Ajouter au panier
//         </Button>
//       </Container>
//       <div className='listIconContainer'>
//         <div className='listIcon'>
//           <ul>
//             <li>
//               <img src="../../img/divers/calendar-small.svg" alt="" />
//               <p>Les tarifs de base sur notre site sont donnés pour des locations de 1 à 4 jours.</p>
//             </li>
//             <li>
//               <img src="../../img/divers/double-arrow-up.svg" alt="" />
//               <p>Livraisons/Récupérations sur votre événement non disponible le Dimanche</p>
//             </li>
//             <li>
//               <img src="../../img/divers/double-arrow-down.svg" alt="" />
//               <p>Récupérations/Restitutions à nos locaux non disponible le Samedi et Dimanche</p>
//             </li>
//           </ul>
//           <div className='cardBottom'>
//             <div className='cardLeft'>
//               <img src="../../img/divers/visa.svg" alt="" />
//               <p>Choisissez vos produits directement en ligne et payez par Carte Bancaire ou directement au depot NDS par chèque, virement ou espèce</p>
//             </div>
//             <div className='cardRight'>
//               <img src="../../img/divers/truck.svg" alt="" />
//               <p>Divers modes de livraison à votre disposition : Retrait sur place, ou livraison et récupération par nos équipes!</p>
//             </div>
//           </div>
//         </div>
//         <div className='bottomLink'>
//           <p>Pour toutes autres questions, vous pouvez vous référer à nos Conditions Générales de Vente ou notre Foire Aux Questions.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { fetchAvailableStock } from "../../../features/stockSlice";
import { useCart } from "../../../contexts/CartContext";
import { fetchProductById } from "../../../services/products.service";
import { calculateRentalDays } from "../../../utils/dateUtils";
import { addDays } from "date-fns";
import { Typography, Container, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fr } from "date-fns/locale";
import { useRentalPeriod } from "../../../contexts/RentalperiodContext";
import ProductOptions from "../components/ProductOptions";
import RentalPeriod from "../components/RentalPeriod";
import QuantitySelector from "../components/QuantitySelector";
import PriceCalculation from "../components/PriceCalculation";
import Image from "next/image";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import "./ProductDetails.scss";

interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  _id: string;
  title: string;
  imageUrl?: string;
  description: string;
  price: number;
  minQuantity?: number;
  lotSize?: number;
  options?: ProductOption[];
}

type SelectedOptions = {
  [key: string]: ProductOption;
};

interface RootState {
  stock: {
    stockByProduct: { [key: string]: number };
    loading: boolean;
  };
}

export default function ProductDetails() {
  const { productId } = useParams() as { productId: string };
  const { addToCart, setIsCartOpen, cart } = useCart();

  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const { rentalPeriod, setRentalPeriod } = useRentalPeriod()!;
  const { startDate, endDate } = rentalPeriod;
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [quantityError, setQuantityError] = useState<string>("");

  // Bloquer le calendrier si un produit est déjà dans le panier (quelle que soient ses dates)
  const isCalendarDisabled = cart.length > 0;

  const availableStock = useSelector(
    (state: RootState) => state.stock.stockByProduct[productId]
  );
  const stockLoading = useSelector((state: RootState) => state.stock.loading);

  // Calcul du nombre maximum de lots disponibles si le produit se loue en lots
  const maxLotsAvailable =
    product && product.lotSize && product.lotSize > 1
      ? Math.floor(availableStock / product.lotSize)
      : availableStock;

  const handleStartDateChange = (date: Date | null) => {
    setRentalPeriod({ ...rentalPeriod, startDate: date });
  };

  const handleEndDateChange = (date: Date | null) => {
    setRentalPeriod({ ...rentalPeriod, endDate: date });
  };

  useEffect(() => {
    async function loadProduct() {
      try {
        setError(null);
        const productData = await fetchProductById(productId);
        setProduct(productData);
        setQuantity(productData.minQuantity || 1);
      } catch {
        setError("Impossible de charger le produit.");
      }
    }
    loadProduct();
  }, [productId]);

  // On utilise useMemo pour éviter de recréer des objets Date à chaque rendu
  const displayedStartDate = useMemo(
    () =>
      startDate ||
      (cart.length > 0 && cart[0].startDate
        ? new Date(cart[0].startDate)
        : null),
    [startDate, cart]
  );
  const displayedEndDate = useMemo(
    () =>
      endDate ||
      (cart.length > 0 && cart[0].endDate ? new Date(cart[0].endDate) : null),
    [endDate, cart]
  );

  const effectiveStartDate = displayedStartDate;
  const effectiveEndDate = displayedEndDate;

  useEffect(() => {
    if (productId && effectiveStartDate && effectiveEndDate) {
      (dispatch as any)(
        fetchAvailableStock({
          productId,
          startDate: effectiveStartDate,
          endDate: effectiveEndDate,
        })
      );
    }
  }, [productId, effectiveStartDate, effectiveEndDate, dispatch]);

  useEffect(() => {
    if (!product) return;
    const days = calculateRentalDays(effectiveStartDate, effectiveEndDate);
    const lotSize = product.lotSize || 1;
    const optionPrice = Object.values(selectedOptions).reduce(
      (acc, opt) => acc + opt.price,
      0
    );
    const unitPrice = product.price + optionPrice;
    const basePrice = unitPrice * quantity * lotSize;
    let computedFinalPrice = basePrice;
    if (days > 4) {
      const extraDays = days - 4;
      computedFinalPrice += basePrice * 0.15 * extraDays;
    }
    setFinalPrice(computedFinalPrice);
  }, [
    product,
    selectedOptions,
    quantity,
    effectiveStartDate,
    effectiveEndDate,
  ]);

  // Validation de la quantité en tenant compte du lot
  useEffect(() => {
    if (product) {
      if (product.lotSize && product.lotSize > 1) {
        const maxLots = Math.floor(availableStock / product.lotSize);
        if (quantity > maxLots) {
          setQuantityError(
            `Vous ne pouvez pas sélectionner plus de ${maxLots} lots (soit ${
              maxLots * product.lotSize
            } unités).`
          );
        } else {
          setQuantityError("");
        }
      } else {
        if (quantity > availableStock) {
          setQuantityError(
            `Stock insuffisant. Vous avez demandé ${quantity} unités.`
          );
        } else {
          setQuantityError("");
        }
      }
    }
  }, [quantity, availableStock, product]);

  // On simplifie le changement de quantité ici
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (product?.lotSize && product.lotSize > 1) {
      const maxLots = Math.floor(availableStock / product.lotSize);
      if (quantity > maxLots) {
        setError(
          `La quantité demandée dépasse le stock disponible. Maximum ${maxLots} lots disponibles (soit ${
            maxLots * product.lotSize
          } unités).`
        );
        return;
      }
    } else {
      if (quantity > availableStock) {
        setError("La quantité demandée dépasse le stock disponible.");
        return;
      }
    }

    if (!product) return;

    // Réinitialiser l'erreur et ajouter au panier
    setError("");
    addToCart({
      id: product._id,
      title: product.title,
      price: finalPrice,
      imageUrl: product.imageUrl,
      quantity,
      startDate: effectiveStartDate,
      endDate: effectiveEndDate,
      selectedOptions,
    });
    setIsCartOpen(true);
  };

  // La validité du formulaire tient compte du type de produit (lot ou non)
  const isFormValid =
    product !== null &&
    effectiveStartDate !== null &&
    effectiveEndDate !== null &&
    quantity > 0 &&
    (product?.lotSize && product.lotSize > 1
      ? quantity <= Math.floor(availableStock / product.lotSize)
      : quantity <= availableStock) &&
    !quantityError;

  if (!product) {
    return (
      <div className="product-details__error">
        {error || "Produit introuvable."}
      </div>
    );
  }

  return (
    <div className="mainContainer">
      <Container className="product-details">
        <div className="product-details__header">
          <div className="product-details__text">
            <Typography variant="h1">{product.title}</Typography>
            <Typography variant="h6">{product.description}</Typography>
          </div>
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.title}
              className="product-details__image"
              width={500}
              height={400}
              style={{ objectFit: "contain" }}
              unoptimized
            />
          )}
        </div>
        {product.options?.length ? (
          <ProductOptions
            options={product.options}
            selectedOptions={selectedOptions}
            onChange={setSelectedOptions}
          />
        ) : (
          <Typography variant="h6">€{product.price} par jour</Typography>
        )}
        <Typography variant="h6">
          {Number(product.lotSize) > 1
            ? `€${(product.price * Number(product.lotSize) * quantity).toFixed(
                2
              )} pour ${quantity} ${quantity > 1 ? "lots" : "lot"} de ${
                product.lotSize
              } unités`
            : `€${product.price.toFixed(2)} par unité`}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
          <RentalPeriod
            startDate={displayedStartDate}
            endDate={displayedEndDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            disabled={isCalendarDisabled}
            minStartDate={addDays(new Date(), 2)}
          />
        </LocalizationProvider>
        {effectiveStartDate &&
          effectiveEndDate &&
          (stockLoading ? (
            <Typography color="textSecondary" variant="body2">
              Chargement du stock...
            </Typography>
          ) : availableStock !== undefined ? (
            <Typography
              color="textSecondary"
              variant="body2"
              sx={{ mt: 1 }}
              fontWeight={600}
              fontSize={18}
            >
              {product.lotSize && product.lotSize > 1
                ? `Stock disponible : ${maxLotsAvailable} lots (soit ${
                    maxLotsAvailable * product.lotSize
                  } unités)`
                : `Stock disponible : ${availableStock} unités`}
            </Typography>
          ) : null)}
        {product.lotSize && product.lotSize > 1 && (
          <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
            <strong>
              ({quantity} lots) {quantity * product.lotSize} unités
            </strong>
          </Typography>
        )}

        <QuantitySelector
          quantity={quantity}
          onChange={handleQuantityChange}
          minQuantity={product.minQuantity}
          stock={availableStock}
        />

        {quantityError && (
          <Typography color="error" variant="body2">
            {quantityError}
          </Typography>
        )}

        <PriceCalculation
          price={product.price}
          quantity={quantity}
          startDate={effectiveStartDate}
          endDate={effectiveEndDate}
          selectedOptions={selectedOptions}
          setFinalPrice={setFinalPrice}
          lotSize={product.lotSize || 1}
        />
        <Button
          className="product-details__add-to-cart"
          onClick={handleAddToCart}
          disabled={!isFormValid}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Ajouter au panier
        </Button>
      </Container>
      <div className="listIconContainer">
        <div className="listIcon">
          <ul>
            <li>
              <img src="../../img/divers/calendar-small.svg" alt="" />
              <p>
                Les tarifs de base sur notre site sont donnés pour des locations
                de 1 à 4 jours.
              </p>
            </li>
            <li>
              <img src="../../img/divers/double-arrow-up.svg" alt="" />
              <p>
                Livraisons/Récupérations sur votre événement non disponible le
                Dimanche
              </p>
            </li>
            <li>
              <img src="../../img/divers/double-arrow-down.svg" alt="" />
              <p>
                Récupérations/Restitutions à nos locaux non disponible le Samedi
                et Dimanche
              </p>
            </li>
          </ul>
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
