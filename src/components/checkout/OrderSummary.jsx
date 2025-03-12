
// import { Typography, Box, Divider, Paper } from '@mui/material';
// import { calculateOrderTotal, formatPrice } from '../../utils/priceUtils';

// export default function OrderSummary({ cart, deliveryMethod, shippingFee }) {
//   const { itemsTotal, deliveryFee, total } = calculateOrderTotal(cart, deliveryMethod);
//   // 🔧 Si la livraison est sélectionnée et que le frais kilométrique a été calculé, on le prend en compte
//   const actualDeliveryFee =
//     deliveryMethod === 'delivery' && shippingFee !== null ? shippingFee : deliveryFee;
//   const actualTotal =
//     deliveryMethod === 'delivery' && shippingFee !== null ? itemsTotal + shippingFee : total;

//   return (
//     <Paper sx={{ p: 2, mb: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Résumé de commande
//       </Typography>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Total des produits:</Typography>
//         <Typography>{formatPrice(itemsTotal)}</Typography>
//       </Box>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//         <Typography>Frais de livraison:</Typography>
//         <Typography>
//           {deliveryMethod === 'delivery'
//             ? (shippingFee === null ? "Calcul en cours" : formatPrice(actualDeliveryFee))
//             : 'Gratuit'}
//         </Typography>
//       </Box>

//       <Divider sx={{ my: 2 }} />

//       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Typography variant="h6">Total:</Typography>
//         <Typography variant="h6">{formatPrice(actualTotal)}</Typography>
//       </Box>
//     </Paper>
//   );
// }
import { Typography, Box, Divider, Paper } from '@mui/material';
import { calculateOrderTotal, formatPrice } from '../../utils/priceUtils';

export default function OrderSummary({ cart, deliveryMethod, shippingFee }) {
  // On suppose que calculateOrderTotal renvoie uniquement le total des produits ici
  const { itemsTotal } = calculateOrderTotal(cart, deliveryMethod);
  
  // Si la livraison est sélectionnée, on utilise shippingFee s'il est calculé, sinon on ne l'ajoute pas
  const actualTotal =
    deliveryMethod === 'delivery'
      ? (shippingFee !== null ? itemsTotal + shippingFee : itemsTotal)
      : itemsTotal;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Résumé de commande
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Total des produits:</Typography>
        <Typography>{formatPrice(itemsTotal)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Frais de livraison:</Typography>
        <Typography>
          {deliveryMethod === 'delivery'
            ? (shippingFee === null ? "Calcul en cours" : formatPrice(shippingFee))
            : 'Gratuit'}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6">{formatPrice(actualTotal)}</Typography>
      </Box>
    </Paper>
  );
}
