
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Box
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function OrderReview({ cart }) {
  // Calcul du total basé sur les prix enregistrés dans le panier
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Résumé de commande
      </Typography>
      <List>
        {cart.map((item) => (
          <ListItem key={item.id}>
            <ListItemAvatar>
              <Avatar src={item.imageUrl} alt={item.title} />
            </ListItemAvatar>
            <ListItemText
              primary={item.title}
              secondary={
                <Box component="span">
                  <Typography component="span" variant="body2" display="block">
                    Quantité: {item.quantity}
                  </Typography>
                  {item.selectedOptions && Object.entries(item.selectedOptions).map(([key, value]) => (
                    <Typography key={key} component="span" variant="body2" color="text.secondary" display="block">
                      {key}: {value}
                    </Typography>
                  ))}
                </Box>
              }
            />
            <Typography variant="body2">
              ${item.price.toFixed(2)} {/* Utilisation directe du prix total */}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" gutterBottom>
        Période de location:
      </Typography>
      <Typography variant="body2">
        Du: {format(new Date(cart[0].startDate), 'PP', { locale: fr })}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Au: {format(new Date(cart[0].endDate), 'PP', { locale: fr })}
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Total: ${total.toFixed(2)} {/* Total basé sur les prix du panier */}
      </Typography>
    </Box>
  );
}
