
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  IconButton,
  Avatar,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatPrice } from '../../../utils/priceUtils';

export default function CartItem({ item, onRemove }) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={item.imageUrl} alt={item.title || item.name} />
      </ListItemAvatar>
      <ListItemText
        primary={item.title || item.name}
        secondary={
          <>
            <Typography variant="body2">Quantité: {item.quantity}</Typography>
            <Typography variant="body2">Total: {formatPrice(item.price)}</Typography> {/* ✅ Prix final */}
          </>
        }
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={onRemove}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
