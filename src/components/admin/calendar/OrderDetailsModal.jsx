import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatPrice } from "../../../utils/priceUtils";

// Fonction utilitaire pour corriger les URLs d'images
const fixImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (imageUrl.includes("localhost:5000")) {
    return imageUrl.replace("localhost:5000", "api-nds-events.fr");
  }
  return imageUrl;
};

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <Dialog open={Boolean(order)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography component="div" variant="h6">
          Détail de votre commande
        </Typography>
        <Typography component="p" variant="subtitle2" color="text.secondary">
          ID de Commande : {order._id}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* 🏷 Infos client */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Informations du client
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
          </Grid>

          {/* 🏷 Période de location et méthode de réception */}
          <Grid item xs={12} md={6}>
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
              Méthode de réception:{" "}
              {order.deliveryMethod === "delivery" ? "Livraison" : "Retrait"}
            </Typography>
            {/* 🏷 Informations de livraison si la commande est en livraison */}
            {order.deliveryMethod === "delivery" && order.shippingInfo && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Informations de livraison
                </Typography>
                <Typography>{order.shippingInfo.address}</Typography>
                <Typography>
                  {order.shippingInfo.city}, {order.shippingInfo.zipCode}
                </Typography>
              </Grid>
            )}
          </Grid>

          {/* 🏷 Produits commandés */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Produits de votre commande
            </Typography>
            {order.products.map((item, index) => (
              <Box key={item.id || index} sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <img
                      src={fixImageUrl(item.imageUrl)}
                      alt={item.title}
                      style={{ width: 60, height: 60, objectFit: "cover" }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1">
                      {item.title}
                      {item.type === "pack" && (
                        <Typography
                          component="span"
                          color="primary"
                          sx={{ ml: 1, fontWeight: "bold" }}
                        >
                          (Pack)
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantité: {item.quantity} | {formatPrice(item.price)}
                    </Typography>
                    {Array.isArray(item.selectedOptions) &&
                      item.selectedOptions.map((option, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          color="text.secondary"
                        >
                          {option.name}: {option.value} (
                          {formatPrice(option.price)})
                        </Typography>
                      ))}
                  </Grid>
                </Grid>

                {/* Affichage des produits inclus dans le pack */}
                {item.type === "pack" &&
                  item.products &&
                  item.products.length > 0 && (
                    <Box
                      sx={{
                        mt: 2,
                        ml: 4,
                        p: 2,
                        backgroundColor: "#f5f5f5",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="primary"
                        gutterBottom
                        sx={{ fontWeight: "bold" }}
                      >
                        Produits inclus dans ce pack :
                      </Typography>
                      {item.products.map((packProduct, packIdx) => {
                        // Gestion de la structure de données (ancien vs nouveau format)
                        const product = packProduct.product || packProduct;
                        const quantityInPack = packProduct.quantity || 1;
                        const totalQuantity = quantityInPack * item.quantity;

                        return (
                          <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            key={packIdx}
                            sx={{ mb: 1 }}
                          >
                            <Grid item>
                              <img
                                src={fixImageUrl(product.imageUrl)}
                                alt={product.title}
                                style={{
                                  width: 30,
                                  height: 30,
                                  objectFit: "cover",
                                }}
                              />
                            </Grid>
                            <Grid item xs>
                              <Typography variant="body2">
                                {product.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Quantité par pack: {quantityInPack} | Total:{" "}
                                {totalQuantity} |{" "}
                                {formatPrice(product.price || 0)}/jour
                              </Typography>
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Box>
                  )}
              </Box>
            ))}
          </Grid>

          {/* 🏷 Total */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Typography variant="body1" mb={1}>
                Prix des produits:{" "}
                {formatPrice(order.total - (order.shippingFee || 0))}
              </Typography>
              <Typography variant="body1" mb={1}>
                Frais de livraison: {formatPrice(order.shippingFee || 0)}
              </Typography>
              <Typography variant="h6">
                Total: {formatPrice(order.total)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
