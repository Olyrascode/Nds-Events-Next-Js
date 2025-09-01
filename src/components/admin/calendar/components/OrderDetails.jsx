import { Typography, Box, Divider } from "@mui/material";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatPrice } from "../../../../utils/priceUtils";

export default function OrderDetails({ order }) {
  const itemPadding = 1.5;
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", mx: -itemPadding }}>
      <Box sx={{ width: { xs: "100%", md: "50%" }, p: itemPadding }}>
        <Typography variant="h6" gutterBottom>
          Customer Information
        </Typography>
        <Typography>
          {order.billingInfo.firstName} {order.billingInfo.lastName}
        </Typography>
        <Typography>{order.billingInfo.email}</Typography>
        <Typography>{order.billingInfo.phone}</Typography>
        <Typography>{order.billingInfo.address}</Typography>
        <Typography>
          {order.billingInfo.city}, {order.billingInfo.zipCode}
        </Typography>
      </Box>

      <Box sx={{ width: { xs: "100%", md: "50%" }, p: itemPadding }}>
        <Typography variant="h6" gutterBottom>
          Période de location
        </Typography>
        <Typography>
          Du: {format(new Date(order.startDate), "PPP", { locale: fr })}
        </Typography>
        <Typography>
          Au: {format(new Date(order.endDate), "PPP", { locale: fr })}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Methode de réception:{" "}
          {order.deliveryMethod === "delivery" ? "Delivery" : "Pickup"}
        </Typography>
      </Box>

      <Box sx={{ width: "100%", p: itemPadding }}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Produit de la commande
        </Typography>
        {order.products.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </Box>

      <Box sx={{ width: "100%", p: itemPadding }}>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">{formatPrice(order.total)}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function OrderItem({ item }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box>
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{ width: 60, height: 60, objectFit: "cover" }}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{item.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            Quantités: {item.quantity} | {formatPrice(item.price)}/day
          </Typography>
          {item.selectedOptions &&
            Object.entries(item.selectedOptions).map(([key, value]) => (
              <Typography key={key} variant="body2" color="text.secondary">
                {key}: {value}
              </Typography>
            ))}
        </Box>
      </Box>
    </Box>
  );
}
