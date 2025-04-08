import { Typography, Box } from "@mui/material";
import { format } from "date-fns";
import { calculateRentalDays } from "../../../utils/dateUtils";

interface CartItem {
  startDate: string | Date;
  endDate: string | Date;
}

interface CartSummaryProps {
  cart: CartItem[];
}

export default function CartSummary({ cart }: CartSummaryProps) {
  if (!cart.length) return null;

  const firstItem = cart[0];
  const startDate = new Date(firstItem.startDate);
  const endDate = new Date(firstItem.endDate);
  const days = calculateRentalDays(startDate, endDate);

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Période de location:
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Du: {format(startDate, "PP")}</Typography>
        <Typography variant="body2">Au: {format(endDate, "PP")}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Durée: {days} {days === 1 ? "day" : "days"}
        </Typography>
      </Box>
    </Box>
  );
}
