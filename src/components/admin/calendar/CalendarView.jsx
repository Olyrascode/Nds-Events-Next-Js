import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  useTheme,
  Chip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  isSameDay,
  startOfWeek,
  endOfWeek,
  subDays,
} from "date-fns";
import { fr } from "date-fns/locale";
import { useCalendar } from "./hooks/useCalendar";
import CalendarHeader from "./components/CalendarHeader";
import CalendarGrid from "./components/CalendarGrid";
import OrderDetailsModal from "./OrderDetailsModal";
import { getClosedDaysBetweenDates } from "../../../services/closedDays.service";

export default function CalendarView() {
  const {
    currentDate,
    setCurrentDate,
    selectedOrder,
    setSelectedOrder,
    orders,
    loading,
    error,
  } = useCalendar();

  const [closedDays, setClosedDays] = useState([]);
  const [closedDaysLoading, setClosedDaysLoading] = useState(false);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Charger les jours fermés pour le mois en cours
  useEffect(() => {
    const fetchClosedDays = async () => {
      setClosedDaysLoading(true);
      try {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);

        const response = await getClosedDaysBetweenDates(
          format(monthStart, "yyyy-MM-dd"),
          format(monthEnd, "yyyy-MM-dd")
        );

        setClosedDays(response);
      } catch (error) {
        console.error("Erreur lors du chargement des jours fermés:", error);
      } finally {
        setClosedDaysLoading(false);
      }
    };

    fetchClosedDays();
  }, [currentDate]);

  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  // 🔹 Trouver le premier jour à afficher (début de la semaine du 1er du mois)
  const firstDayToDisplay = startOfWeek(startOfCurrentMonth, {
    weekStartsOn: 1,
  }); // Semaine commence Lundi

  // 🔹 Trouver le dernier jour à afficher (fin de la semaine du dernier jour du mois)
  const lastDayToDisplay = endOfWeek(endOfCurrentMonth, { weekStartsOn: 1 });

  // 🔹 Générer tous les jours pour le calendrier
  const days = eachDayOfInterval({
    start: firstDayToDisplay,
    end: lastDayToDisplay,
  });

  return (
    <Paper
      sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={handlePreviousMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h5" sx={{ flex: 1, textAlign: "center" }}>
          {format(currentDate, "MMMM yyyy", { locale: fr })}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
        <Chip
          label={`${closedDays.length} jours fermés ce mois-ci`}
          color="error"
          size="small"
          variant="outlined"
        />
      </Box>

      <CalendarHeader />

      <Box sx={{ flex: 1, overflow: "auto" }}>
        <CalendarGrid
          days={days}
          currentDate={currentDate}
          orders={orders}
          closedDays={closedDays}
          onOrderClick={setSelectedOrder}
        />
      </Box>

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </Paper>
  );
}
