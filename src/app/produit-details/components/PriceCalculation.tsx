import { useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { calculateRentalDays } from "../../../utils/dateUtils";
import { isSaturday, isSunday } from "date-fns";

interface PriceCalculationProps {
  price: number;
  quantity: number;
  startDate: Date;
  endDate: Date;
  selectedOptions: {
    [key: string]: { id: string; name: string; price: number };
  };
  setFinalPrice: (price: number) => void;
  lotSize?: number; // Nouveau prop pour le lot
  category?: string; // Ajout de la catégorie du produit
}

// Fonction utilitaire pour formater le prix avec € à la fin
const formatPriceWithEuroAtEnd = (price: number): string => {
  return `${price.toFixed(2)}€`;
};

export default function PriceCalculation({
  price,
  quantity,
  startDate,
  endDate,
  selectedOptions,
  setFinalPrice,
  lotSize = 1, // Par défaut 1 si non fourni
  category, // Récupération de la catégorie
}: PriceCalculationProps) {
  const days = calculateRentalDays(startDate, endDate);

  // Calcul du supplément des options (par jour)
  let optionPricePerDay = 0;
  if (selectedOptions) {
    Object.values(selectedOptions).forEach((opt) => {
      optionPricePerDay += opt.price;
    });
  }

  // Prix unitaire avec options
  const unitPriceWithOptions = price + optionPricePerDay;

  // Si le produit est vendu en lot, on multiplie par la taille du lot
  const effectiveUnitPrice = unitPriceWithOptions * lotSize;

  // Prix de base pour la quantité choisie (en tenant compte du lot)
  const basePrice = effectiveUnitPrice * quantity;

  // Calcul du prix total (majoration de 15% par jour au-delà de 4 jours)
  let totalPrice = basePrice;

  // Logique de réduction pour "Bornes à selfie"
  if (category) {
    const normalizedCategory = category
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (normalizedCategory === "bornes a selfie") {
      const startDay = startDate.getDay(); // Dimanche = 0, Lundi = 1, ..., Samedi = 6
      const endDay = endDate.getDay();

      // Vérifier que les jours sont bien en semaine (lundi=1, ..., vendredi=5)
      // Et que ce ne sont pas des samedis (6) ou dimanches (0)
      const isWeekdayRental =
        startDay >= 1 &&
        startDay <= 5 &&
        endDay >= 1 &&
        endDay <= 5 &&
        !isSaturday(startDate) &&
        !isSunday(startDate) &&
        !isSaturday(endDate) &&
        !isSunday(endDate);

      if (isWeekdayRental && days >= 1 && days <= 2) {
        totalPrice -= 40 * quantity; // Appliquer la réduction par unité de borne
        totalPrice = Math.max(0, totalPrice); // S'assurer que le prix ne devient pas négatif
      }
    }
  }

  // Majoration pour location longue durée APRÈS la réduction potentielle
  if (days > 4) {
    const extraDays = days - 4;
    totalPrice += basePrice * 0.15 * extraDays;
  }

  // Met à jour le prix total dans un useEffect pour éviter les erreurs de rendu
  useEffect(() => {
    setFinalPrice(totalPrice);
  }, [totalPrice, setFinalPrice]);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Détail du prix
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Prix unitaire (par jour) :</Typography>
        <Typography>{formatPriceWithEuroAtEnd(effectiveUnitPrice)}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Quantité :</Typography>
        <Typography>{quantity}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Nombre total de jours :</Typography>
        <Typography>{days}</Typography>
      </Box>

      {days > 4 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>
            Majoration (+15% par jour au-delà de 4 jours) :
          </Typography>
          <Typography color="error">
            {formatPriceWithEuroAtEnd(totalPrice - basePrice)}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Total :</Typography>
        <Typography variant="h6" color="primary">
          {formatPriceWithEuroAtEnd(totalPrice)}
        </Typography>
      </Box>
    </Box>
  );
}
