

// import { useEffect } from 'react';
// import { Box, Typography, Divider } from '@mui/material';
// import { calculateRentalDays } from '../../../utils/dateUtils';
// import { formatPrice } from '../../../utils/priceUtils';

// export default function PriceCalculation({
//   price,          // Prix de base du produit
//   quantity,       // Quantité choisie
//   startDate, 
//   endDate, 
//   selectedOptions,
//   setFinalPrice // Options sélectionnées (avec prix supplémentaire)
// }) {
//   const days = calculateRentalDays(startDate, endDate);

//   // Somme des prix des options sélectionnées
//   let optionPricePerDay = 0;
//   if (selectedOptions) {
//     Object.values(selectedOptions).forEach(opt => {
//       optionPricePerDay += opt.price;
//     });
//   }

//   // Prix unitaire total par produit (inclut options)
//   const unitPriceWithOptions = price + optionPricePerDay;

//   // Prix total pour la quantité choisie
//   const basePrice = unitPriceWithOptions * quantity;

//   // Prix de location pour les 1 à 4 premiers jours (fixe)
//   let totalPrice = basePrice;

//   // Ajout des 15% par jour supplémentaire au-delà de 4 jours
//   if (days > 4) {
//     const extraDays = days - 4;
//     totalPrice += basePrice * 0.15 * extraDays;
//   }

//     // ✅ Met à jour le prix total DANS UN `useEffect` pour éviter l'erreur de React
//     useEffect(() => {
//       setFinalPrice(totalPrice);
//     }, [totalPrice, setFinalPrice]);

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Détail du prix
//       </Typography>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Prix unitaire (par jour) :</Typography>
//         <Typography>{formatPrice(unitPriceWithOptions)}</Typography>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Quantité :</Typography>
//         <Typography>{quantity}</Typography>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Nombre total de jours :</Typography>
//         <Typography>{days}</Typography>
//       </Box>

//       {days > 4 && (
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//           <Typography>Majoration (+15% par jour au-delà de 4 jours) :</Typography>
//           <Typography color="error">{formatPrice(totalPrice - unitPriceWithOptions * quantity)}€</Typography>
//         </Box>
//       )}


//       <Divider sx={{ my: 2 }} />

//       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Typography variant="h6">Total :</Typography>
//         <Typography variant="h6" color="primary">
//           {formatPrice(totalPrice)}
//         </Typography>
//       </Box>
//     </Box>
//   );
// }
import { useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { calculateRentalDays } from '../../../utils/dateUtils';
import { formatPrice } from '../../../utils/priceUtils';

interface PriceCalculationProps {
  price: number;
  quantity: number;
  startDate: Date;
  endDate: Date;
  selectedOptions: { [key: string]: { id: string; name: string; price: number } };
  setFinalPrice: (price: number) => void;
  lotSize?: number; // Nouveau prop pour le lot
}

export default function PriceCalculation({
  price,
  quantity,
  startDate,
  endDate,
  selectedOptions,
  setFinalPrice,
  lotSize = 1, // Par défaut 1 si non fourni
}: PriceCalculationProps) {
  const days = calculateRentalDays(startDate, endDate);

  // Calcul du supplément des options (par jour)
  let optionPricePerDay = 0;
  if (selectedOptions) {
    Object.values(selectedOptions).forEach(opt => {
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Prix unitaire (par jour) :</Typography>
        <Typography>{formatPrice(effectiveUnitPrice)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Quantité :</Typography>
        <Typography>{quantity}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Nombre total de jours :</Typography>
        <Typography>{days}</Typography>
      </Box>

      {days > 4 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Majoration (+15% par jour au-delà de 4 jours) :</Typography>
          <Typography color="error">
            {formatPrice(totalPrice - basePrice)}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Total :</Typography>
        <Typography variant="h6" color="primary">
          {formatPrice(totalPrice)}
        </Typography>
      </Box>
    </Box>
  );
}
