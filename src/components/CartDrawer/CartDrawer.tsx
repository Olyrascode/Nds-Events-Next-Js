"use client";

import Link from 'next/link';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
  Box,
  Divider,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../../contexts/CartContext';
import { calculateTotalPrice } from '../../utils/cartUtils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './cartDrawer.module.scss';

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart } = useCart();

  const total = cart.length > 0 
    ? calculateTotalPrice(cart, cart[0].startDate, cart[0].endDate)
    : 0;

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      className="cart-drawer"
    >
      <Box sx={{ width: 350, p: 2 }}>
        <Typography variant="h6" gutterBottom className="cart-drawer__title">
          Panier
        </Typography>

        {cart.length === 0 ? (
          <Typography className="cart-drawer__empty">
            Votre panier est vide
          </Typography>
        ) : (
          <>
            <List className="cart-drawer__list">
              {cart.map((item, index) => (
                <ListItem key={item.id || index} className="cart-drawer__item">
                  <ListItemAvatar>
                    <Avatar src={item.imageUrl} alt={item.title} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.title}
                    secondary={
                      <Box component="div">
                        <Typography variant="body2" component="div">
                          Quantité: {item.quantity}
                        </Typography>
                        <Typography variant="body2" component="div">
                          ${item.price}/jour
                        </Typography>
                        {item.selectedOptions &&
                          Object.entries(item.selectedOptions).map(([optionName, optionValue]) => (
                            <Typography key={optionName} variant="body2" component="div">
                              {optionName}: {typeof optionValue === 'string' ? optionValue : optionValue.value}
                              {optionValue.price ? ` (${optionValue.price}€)` : ''}
                            </Typography>
                          ))
                        }
                      </Box>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Période de location:
            </Typography>
            <Typography variant="body2" component="div">
              Du: {format(new Date(cart[0].startDate), 'PP', { locale: fr })}
            </Typography>
            <Typography variant="body2" gutterBottom component="div">
              Au: {format(new Date(cart[0].endDate), 'PP', { locale: fr })}
            </Typography>

            <Typography variant="h6" className="cart-drawer__total">
              Total: {total.toFixed(2)}€
            </Typography>

            <Button
  variant="contained"
  fullWidth
  component={Link}
  href="/checkout"
  onClick={onClose}
  className="cart-drawer__checkout"
>
  Paiement
</Button>

          </>
        )}
      </Box>
    </Drawer>
  );
}
