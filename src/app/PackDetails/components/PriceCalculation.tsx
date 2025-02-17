
// import { useEffect } from 'react';
// import { Box, Typography, Divider } from '@mui/material';
// import { calculateRentalDays } from '../../../utils/dateUtils';
// import { formatPrice } from '../../../utils/priceUtils';

// export default function PriceCalculation({ 
//   products, 
//   quantity,          // Nombre de packs 
//   startDate, 
//   endDate, 
//   discountPercentage,
//   setFinalPrice  // ✅ Ajout de la fonction pour transmettre le prix au panier
// }) {
//   // 1. Calcul du nombre de jours
//   const days = calculateRentalDays(startDate, endDate);

//   // 2. Calcul du prix de base du pack 
//   const basePackPrice = products.reduce((acc, packItem) => {
//     const unitPrice = packItem.product?.price ?? 0; 
//     const itemQty = packItem.quantity ?? 1;
//     return acc + (unitPrice * itemQty);
//   }, 0) * (quantity ?? 1);

//   // 3. Prix de base pour 1 à 4 jours (fixe)
//   let totalPrice = basePackPrice;

//   // 4. Ajout des 15% par jour supplémentaire à partir du 5ème jour
//   if (days > 4) {
//     const extraDays = days - 4;
//     totalPrice += basePackPrice * 0.15 * extraDays;
//   }

//   // 5. Calcul de la remise du pack
//   const discount = (totalPrice * (discountPercentage ?? 0)) / 100;
//   const finalPrice = totalPrice - discount;

//   // ✅ Met à jour `finalPrice` dans `PackDetails.jsx` après le rendu
//   useEffect(() => {
//     setFinalPrice(finalPrice);
//   }, [finalPrice, setFinalPrice]);

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Détail du prix du pack
//       </Typography>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Prix total du pack (1 à 4 jours) :</Typography>
//         <Typography>{formatPrice(basePackPrice)}</Typography>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Nombre total de jours :</Typography>
//         <Typography>{days}</Typography>
//       </Box>

//       {days > 4 && (
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//           <Typography>Majoration (+15% par jour au-delà de 4 jours) :</Typography>
//           <Typography color="error">{formatPrice(totalPrice - basePackPrice)}</Typography>
//         </Box>
//       )}

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Remise du pack ({discountPercentage}%) :</Typography>
//         <Typography color="success.main">-{formatPrice(discount)}</Typography>
//       </Box>

//       <Divider sx={{ my: 2 }} />

//       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Typography variant="h6">Total :</Typography>
//         <Typography variant="h6" color="primary">
//           {formatPrice(finalPrice)}
//         </Typography>
//       </Box>
//     </Box>
//   );
// }
"use client";

import { useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { calculateRentalDays } from '../../../utils/dateUtils';
import { formatPrice } from '../../../utils/priceUtils';

// Définition d'une interface pour un élément inclus dans un pack
interface PackItem {
  quantity?: number;
  product?: {
    price?: number;
  };
}

// Interface des props attendues par le composant PriceCalculation
interface PriceCalculationProps {
  products: PackItem[];
  quantity: number; // Nombre de packs
  startDate: Date | null;
  endDate: Date | null;
  discountPercentage: number;
  setFinalPrice: (price: number) => void;
}

export default function PriceCalculation({
  products,
  quantity,
  startDate,
  endDate,
  discountPercentage,
  setFinalPrice,
}: PriceCalculationProps) {
  // 1. Calcul du nombre de jours
  const days = calculateRentalDays(startDate, endDate);

  // 2. Calcul du prix de base du pack (on suppose que le prix de chaque item est déjà calculé)
  const basePackPrice = products.reduce((acc, packItem) => {
    const unitPrice = packItem.product?.price ?? 0;
    const itemQty = packItem.quantity ?? 1;
    return acc + unitPrice * itemQty;
  }, 0) * quantity;

  // 3. Prix de base pour 1 à 4 jours (fixe)
  let totalPrice = basePackPrice;

  // 4. Majoration de 15% par jour supplémentaire après 4 jours
  if (days > 4) {
    const extraDays = days - 4;
    totalPrice += basePackPrice * 0.15 * extraDays;
  }

  // 5. Calcul de la remise
  const discount = (totalPrice * discountPercentage) / 100;
  const finalPrice = totalPrice - discount;

  // Met à jour le prix final dans le composant parent
  useEffect(() => {
    setFinalPrice(finalPrice);
  }, [finalPrice, setFinalPrice]);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Détail du prix du pack
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Prix total du pack (1 à 4 jours) :</Typography>
        <Typography>{formatPrice(basePackPrice)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Nombre total de jours :</Typography>
        <Typography>{days}</Typography>
      </Box>

      {days > 4 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Majoration (+15% par jour au-delà de 4 jours) :</Typography>
          <Typography color="error">{formatPrice(totalPrice - basePackPrice)}</Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Remise du pack ({discountPercentage}%) :</Typography>
        <Typography color="success.main">-{formatPrice(discount)}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Total :</Typography>
        <Typography variant="h6" color="primary">
          {formatPrice(finalPrice)}
        </Typography>
      </Box>
    </Box>
  );
}
