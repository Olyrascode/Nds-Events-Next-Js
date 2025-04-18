"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, useMediaQuery } from "@mui/material";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (value: number) => void;
  minQuantity?: number;
  stock?: number;
}

export default function QuantitySelector({
  quantity,
  onChange,
  minQuantity = 1,
  stock = 0,
}: QuantitySelectorProps) {
  // État local pour gérer l'entrée temporaire
  const [inputValue, setInputValue] = useState<string>(quantity.toString());
  const isMobile = useMediaQuery("(max-width:600px)");

  // Synchroniser l'état local avec la prop quantity
  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  // Gestionnaire pour l'entrée temporaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Autoriser temporairement une valeur vide
    setInputValue(newValue);

    // Seulement envoyer la valeur au parent si c'est un nombre valide
    if (newValue !== "") {
      const numericValue = parseInt(newValue, 10);
      if (!isNaN(numericValue)) {
        // Limiter aux valeurs min/max
        let finalValue = numericValue;
        if (numericValue < minQuantity) finalValue = minQuantity;
        if (stock > 0 && numericValue > stock) finalValue = stock;

        onChange(finalValue);
      }
    }
  };

  // Gestionnaire pour lorsque l'utilisateur termine sa saisie
  const handleBlur = () => {
    // Au blur, s'assurer que la valeur est valide
    if (inputValue === "" || isNaN(parseInt(inputValue, 10))) {
      setInputValue(minQuantity.toString());
      onChange(minQuantity);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Quantité
      </Typography>
      <TextField
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        inputProps={{
          min: minQuantity,
          max: stock,
          step: 1,
          inputMode: "numeric",
          style: isMobile ? { fontSize: "16px" } : {}, // Éviter le zoom sur iOS
        }}
        fullWidth
        helperText={`Minimum: ${minQuantity} | Disponible: ${stock}`}
        sx={
          isMobile
            ? {
                "& .MuiInputBase-root": { height: "48px" },
              }
            : {}
        }
      />
    </Box>
  );
}
