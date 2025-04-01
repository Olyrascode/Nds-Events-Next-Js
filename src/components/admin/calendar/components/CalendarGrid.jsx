import { Box, Tooltip, Typography } from "@mui/material";
import { isSameMonth, isToday, format, isSameDay } from "date-fns";
import { DayCell } from "../styles/CalendarStyles";
import DayContent from "./DayContent";
import { getOrdersForDay } from "../utils/calendarUtils";
import { fr } from "date-fns/locale";

export default function CalendarGrid({
  days,
  currentDate,
  orders,
  closedDays = [],
  onOrderClick,
}) {
  // Fonction pour vérifier si un jour est fermé
  const isClosedDay = (date) => {
    if (!closedDays || closedDays.length === 0) return false;
    return closedDays.some((closedDay) => {
      const closedDate = new Date(closedDay.date);
      return isSameDay(closedDate, date);
    });
  };

  // Fonction pour obtenir la raison de fermeture
  const getClosureReason = (date) => {
    if (!closedDays || closedDays.length === 0) return null;
    const closedDay = closedDays.find((day) => {
      const closedDate = new Date(day.date);
      return isSameDay(closedDate, date);
    });
    return closedDay ? closedDay.reason : null;
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      {days.map((day) => {
        const dayOrders = getOrdersForDay(orders, day);
        const isCurrentMonthDay = isSameMonth(day, currentDate);
        const isTodayDay = isToday(day);
        const closed = isClosedDay(day);
        const closureReason = getClosureReason(day);

        return (
          <DayCell
            key={day.toString()}
            isCurrentMonth={isCurrentMonthDay}
            isToday={isTodayDay}
            sx={
              closed
                ? {
                    background: "rgba(244, 67, 54, 0.1)",
                    borderColor: "rgba(244, 67, 54, 0.3)",
                  }
                : {}
            }
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="body2"
                color={closed ? "error" : "text.secondary"}
              >
                {format(day, "d", { locale: fr })}
              </Typography>

              {closed && (
                <Tooltip title={closureReason || "Jour fermé"}>
                  <Typography
                    variant="caption"
                    bgcolor="error.main"
                    color="white"
                    px={1}
                    py={0.2}
                    borderRadius={1}
                  >
                    Fermé
                  </Typography>
                </Tooltip>
              )}
            </Box>

            <DayContent
              day={day}
              orders={dayOrders}
              onOrderClick={onOrderClick}
              isClosed={closed}
            />
          </DayCell>
        );
      })}
    </Box>
  );
}
