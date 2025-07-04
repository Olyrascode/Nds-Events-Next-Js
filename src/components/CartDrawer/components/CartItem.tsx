import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatPrice } from "../../../utils/priceUtils";

interface CartItemProps {
  item: {
    imageUrl?: string;
    title?: string;
    name?: string;
    quantity: number;
    price: number;
  };
  onRemove: () => void;
}

export default function CartItem({ item, onRemove }: CartItemProps) {
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
            <Typography variant="body2">
              Total: {formatPrice(item.price)}
            </Typography>{" "}
            {/* ✅ Prix final */}
          </>
        }
      />
      <IconButton edge="end" onClick={onRemove} sx={{ alignSelf: "center" }}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}
