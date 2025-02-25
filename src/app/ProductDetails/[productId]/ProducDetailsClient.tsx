"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAvailableStock } from '../../../features/stockSlice';
import { useCart } from '../../../contexts/CartContext';
import { fetchProductById } from '../../../services/products.service';
import { calculateRentalDays } from '../../../utils/dateUtils';
import { addDays } from 'date-fns';
import { Typography, Container, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { useRentalPeriod } from '../../../contexts/RentalperiodContext';
import ProductOptions from '../components/ProductOptions';
import RentalPeriod from '../components/RentalPeriod';
import QuantitySelector from '../components/QuantitySelector';
import PriceCalculation from '../components/PriceCalculation';
import Image from 'next/image';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import './ProductDetails.scss';

interface ProductOption {
  id: string;
  name: string;
  price: number;
}

interface Product {
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

interface CartItem {
  startDate?: Date | null;
  endDate?: Date | null;
}

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

  const isCalendarDisabled = cart.some((item: CartItem) => item.startDate && item.endDate);
  const availableStock = useSelector((state: RootState) => state.stock.stockByProduct[productId]);
  const stockLoading = useSelector((state: RootState) => state.stock.loading);

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

  useEffect(() => {
    if (productId && startDate && endDate) {
      (dispatch as any)(fetchAvailableStock({ productId, startDate, endDate }));
    }
  }, [productId, startDate, endDate, dispatch]);
  

  useEffect(() => {
    if (!product) return;
    const days = calculateRentalDays(startDate, endDate);
    const lotSize = product.lotSize || 1;
    const optionPrice = Object.values(selectedOptions).reduce((acc, opt) => acc + opt.price, 0);
    const unitPrice = product.price + optionPrice;
    const basePrice = unitPrice * quantity * lotSize;
    let computedFinalPrice = basePrice;
    if (days > 4) {
      const extraDays = days - 4;
      computedFinalPrice += basePrice * 0.15 * extraDays;
    }
    setFinalPrice(computedFinalPrice);
  }, [product, selectedOptions, quantity, startDate, endDate]);

  useEffect(() => {
    if (quantity > availableStock) {
      setQuantityError("La quantité demandée dépasse le stock disponible.");
    } else {
      setQuantityError("");
    }
  }, [quantity, availableStock]);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    const totalUnits = newQuantity * (product?.lotSize || 1);
    if (totalUnits > availableStock) {
      setQuantityError(`Stock insuffisant. Vous avez demandé ${totalUnits} unités.`);
    } else {
      setQuantityError("");
    }
  };

  const handleAddToCart = () => {
    if (quantity > availableStock) {
      setError("La quantité demandée dépasse le stock disponible.");
      return;
    }
    if (!product) return;
    addToCart({
      id: product._id,
      title: product.title,
      price: finalPrice,
      quantity,
      startDate,
      endDate,
    });
    setIsCartOpen(true);
  };

  const isFormValid =
    product !== null &&
    startDate !== null &&
    endDate !== null &&
    quantity > 0 &&
    quantity <= availableStock &&
    !quantityError;

  if (!product) {
    return <div className="product-details__error">{error || "Produit introuvable."}</div>;
  }

  return (
    <div className='mainContainer'>

   
    <Container className="product-details">
        <div className='product-details__header'>
        <div className='product-details__text'>
      <Typography variant="h1">{product.title}</Typography>
      <Typography variant='h6'>{product.description}</Typography>
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
        €{(product.price * (product.lotSize || 1)).toFixed(2)} par lot de {product.lotSize || 1} unités
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <RentalPeriod
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          disabled={isCalendarDisabled}
          minStartDate={addDays(new Date(), 2)}
        />
      </LocalizationProvider>
      {startDate && endDate && (
        stockLoading ? (
          <Typography color="textSecondary" variant="body2">
            Chargement du stock...
          </Typography>
        ) : availableStock !== undefined ? (
          <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
            Stock disponible : <strong>{availableStock}</strong>
          </Typography>
        ) : null
      )}
      <QuantitySelector
        quantity={quantity}
        onChange={handleQuantityChange}
        minQuantity={product.minQuantity}
        stock={availableStock}
      />
      {product.lotSize && product.lotSize > 1 && (
        <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
          Vous avez sélectionné <strong>{quantity * product.lotSize}</strong> unités ({quantity} lots).
        </Typography>
      )}
      {quantityError && (
        <Typography color="error" variant="body2">
          {quantityError}
        </Typography>
      )}
      <PriceCalculation
        price={product.price}
        quantity={quantity}
        startDate={startDate}
        endDate={endDate}
        selectedOptions={selectedOptions}
        setFinalPrice={setFinalPrice}
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
      <div className='listIconContainer'>
        <div className='listIcon'>
        <ul>
          <li>
            <img src="../../img/divers/calendar-small.svg" alt="" />
            <p>Les tarifs de base sur notre site sont donnés pour des locations de 1 à 4 jours.</p>
          </li>
          <li>
            <img src="../../img/divers/double-arrow-up.svg" alt="" />
            <p>Livraisons/Récupérations sur votre événement non disponible le Dimanche</p>
          </li>
          <li>
           <img src="../../img/divers/double-arrow-down.svg" alt="" />
            <p>Récupérations/Restitutions à nos locaux non disponible le Samedi et Dimanche</p>
            </li>
        </ul>
        <div className='cardBottom'>
          <div className='cardLeft'>
            <img src="../../img/divers/visa.svg" alt="" />
            <p>Choisissez vos produits directement en ligne et payez par Carte Bancaire ou directement au depot NDS par chèque, virement ou espèce</p>
          </div>
          <div className='cardRight'>
            <img src="../../img/divers/truck.svg" alt="" />
            <p>Divers modes de livraison à votre disposition : Retrait sur place, ou livraison et récupération par nos équipes!</p>
          </div>
        </div>
        </div>
        <div className='bottomLink'>
        <p>Pour toutes autres questions, vous pouvez vous référer à nos Conditions Générales de Vente ou notre Foire Aux Questions.</p>
        </div>
      </div>
    </div>
  );
}
