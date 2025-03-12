
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatPrice } from '../../../utils/priceUtils';

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <Dialog open={Boolean(order)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="div">Détail de votre commande</Typography>
        <Typography variant="subtitle2" color="text.secondary">
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
              Du: {format(new Date(order.startDate), 'PPP', { locale: fr })}
            </Typography>
            <Typography>
              Au: {format(new Date(order.endDate), 'PPP', { locale: fr })}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Méthode de réception: {order.deliveryMethod === 'delivery' ? 'Livraison' : 'Retrait'}
            </Typography>
          {/* 🏷 Informations de livraison si la commande est en livraison */}
          {order.deliveryMethod === 'delivery' && order.shippingInfo && (
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
              <Box key={item.id || index} sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{ width: 60, height: 60, objectFit: 'cover' }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantité: {item.quantity} | {formatPrice(item.price)}
                    </Typography>
                    {Array.isArray(item.selectedOptions) &&
                      item.selectedOptions.map((option, idx) => (
                        <Typography key={idx} variant="body2" color="text.secondary">
                          {option.name}: {option.value} ({formatPrice(option.price)})
                        </Typography>
                      ))}
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Grid>

          {/* 🏷 Total */}
          <Grid item xs={12}>
  <Divider sx={{ my: 2 }} />
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
    <Typography variant="body1" mb={1}>
      Prix des produits: {formatPrice(order.total - order.shippingFee)}
    </Typography>
    <Typography variant="body1" mb={1}>
      Frais de livraison: {formatPrice(order.shippingFee)}
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
