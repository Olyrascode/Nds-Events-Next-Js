import { Typography, Box, Divider, Paper } from "@mui/material";
import { formatPrice } from "../../utils/priceUtils";

export default function OrderSummary({ cart, deliveryMethod, shippingFee }) {
  // item.price dans le panier INCLUT DÉJÀ le prix des options sélectionnées.
  const displayItemsTotal = cart.reduce((sum, item) => {
    let linePrice = parseFloat(String(item.price || 0));
    return sum + linePrice;
  }, 0);

  const actualTotal =
    deliveryMethod === "delivery"
      ? shippingFee !== null
        ? displayItemsTotal + shippingFee
        : displayItemsTotal
      : displayItemsTotal;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Résumé de commande
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Total des produits:</Typography>
        <Typography>{formatPrice(displayItemsTotal)}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Frais de livraison:</Typography>
        <Typography>
          {deliveryMethod === "delivery"
            ? shippingFee === null
              ? "Calcul en cours"
              : formatPrice(shippingFee)
            : "Gratuit"}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6">{formatPrice(actualTotal)}</Typography>
      </Box>
    </Paper>
  );
}
