import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { formatPrice } from '../../../utils/priceUtils';

// Définir une interface pour le produit inclus dans un pack
interface PackProduct {
  _id?: string;
  title?: string;
  price?: number;
  imageUrl?: string;
}

// Interface décrivant un élément de pack (l'item dans la liste)
interface PackItem {
  _id?: string;
  quantity?: number;
  product?: PackProduct;
}

// Interface des props du composant
interface PackProductsProps {
  products: PackItem[];
}

export default function PackProducts({ products }: PackProductsProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Produits inclus
      </Typography>
      <List>
        {products.map((packItem) => {
          const p = packItem.product;
          const itemKey = p?._id || packItem._id || Math.random().toString();
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
