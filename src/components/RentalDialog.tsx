"use client";

import React, { useState } from "react";
import { useCart, CartItem } from "../contexts/CartContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addDays } from "date-fns";
import { isProductAvailable, isPackAvailable } from "../utils/dateUtils";

interface Product {
  id: string;
  title: string;
  price: number;
  minQuantity: number;
  type?: "pack" | "product";
  // Ajoutez d'autres champs si nécessaire (imageUrl, etc.)
}

interface RentalDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}

export default function RentalDialog({
  open,
  onClose,
  product,
}: RentalDialogProps) {
  // Récupération du contexte
  const cartContext = useCart();
  if (!cartContext) {
    throw new Error("CartContext is not provided");
  }
  const { addToCart } = cartContext;

  // État local pour les dates, la quantité, et l'erreur
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(addDays(new Date(), 1));
  const [quantity, setQuantity] = useState<number>(product.minQuantity);
  const [error, setError] = useState<string>("");

  /**
   * Lorsque l'utilisateur soumet le formulaire
   */
  const handleSubmit = () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }
    if (endDate <= startDate) {
      setError("End date must be after start date");
      return;
    }
    if (quantity < product.minQuantity) {
      setError(`Minimum quantity required is ${product.minQuantity}`);
      return;
    }

    // Vérifier la disponibilité selon le type
    const available =
      product.type === "pack"
        ? isPackAvailable(product, startDate, endDate, quantity)
        : isProductAvailable(product, startDate, endDate, quantity);

    if (!available) {
      setError("Product is not available for the selected dates and quantity");
      return;
    }

    // Construire l'objet CartItem
    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      startDate: startDate,
      endDate: endDate,
      type: product.type,
      // Ajoutez d'autres champs si nécessaire
    };

    // Appel à addToCart
    addToCart(cartItem);
    onClose();
  };

  /**
   * Gestion des changements de date
   */
  const handleStartDateChange = (newDate: Date | null) => {
    if (!newDate) return;
    setStartDate(newDate);
    if (endDate && endDate <= newDate) {
      setEndDate(addDays(newDate, 1));
    }
    setError("");
  };

  const handleEndDateChange = (newDate: Date | null) => {
    if (!newDate) return;
    setEndDate(newDate);
    setError("");
  };

  /**
   * Gestion du changement de quantité
   */
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQuantity(value);
    setError("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rent {product.title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              minDate={new Date()}
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              minDate={startDate ? addDays(startDate, 1) : new Date()}
              slotProps={{
                textField: { fullWidth: true },
              }}
            />
          </LocalizationProvider>

          <TextField
            fullWidth
            type="number"
            label="Quantity"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{
              min: product.minQuantity,
              step: 1,
            }}
            helperText={`Minimum quantity: ${product.minQuantity}`}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
}
