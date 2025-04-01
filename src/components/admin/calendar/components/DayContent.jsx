import { Box, Typography } from "@mui/material";
import { format, isToday } from "date-fns";
import OrderEventBar from "./OrderEventBar";

export default function DayContent({
  day,
  orders,
  onOrderClick,
  isClosed = false,
}) {
  // Si le jour est fermé, on ne montre pas les commandes
  const displayOrders = !isClosed && orders && orders.length > 0;

  return (
    <Box
      sx={{
        height: "100%",
        opacity: isClosed ? 0.7 : 1,
      }}
    >
      {displayOrders ? (
        orders.map((order, index) => (
          <OrderEventBar
            key={order.id || `order-${index}`}
            order={order}
            onClick={() => onOrderClick(order)}
            currentDate={day}
            disabled={isClosed}
          />
        ))
      ) : isClosed ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pt: 3,
          }}
        >
          <Typography variant="body2" color="error.main" fontStyle="italic">
            Indisponible
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
