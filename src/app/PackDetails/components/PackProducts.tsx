
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { formatPrice } from '../../../utils/priceUtils';

export default function PackProducts({ products }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Produits inclus
      </Typography>
      <List>
        {products.map((packItem) => {
          const p = packItem.product;      
          
          const itemKey = p?._id || packItem._id;

          // Si `p` n'existe pas, on met des valeurs par défaut
          const title = p?.title || 'Produit inconnu';
          const price = p?.price ?? 0;
          const imageUrl = p?.imageUrl || '';
          const quantity = packItem.quantity || 1;

          return (
            <ListItem key={itemKey}>
              <ListItemAvatar>
                <Avatar src={imageUrl} alt={title} />
              </ListItemAvatar>
              <ListItemText
                primary={title}
                secondary={`Quantité: ${quantity} | ${formatPrice(price)}/jour`}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

