
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  useTheme
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
  subDays
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { useCalendar } from './hooks/useCalendar';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import OrderDetailsModal from './OrderDetailsModal';


export default function CalendarView() {
  const {
    currentDate,
    setCurrentDate,
    selectedOrder,
    setSelectedOrder,
    orders,
    loading,
    error
  } = useCalendar();

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  // 🔹 Trouver le premier jour à afficher (début de la semaine du 1er du mois)
const firstDayToDisplay = startOfWeek(startOfCurrentMonth, { weekStartsOn: 1 }); // Semaine commence Lundi

// 🔹 Trouver le dernier jour à afficher (fin de la semaine du dernier jour du mois)
const lastDayToDisplay = endOfWeek(endOfCurrentMonth, { weekStartsOn: 1 });

// 🔹 Générer tous les jours pour le calendrier
const days = eachDayOfInterval({
  start: firstDayToDisplay,
  end: lastDayToDisplay,
});

  return (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handlePreviousMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h5" sx={{ flex: 1, textAlign: 'center' }}>
          {format(currentDate, 'MMMM yyyy', { locale: fr })}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <CalendarHeader />
      
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <CalendarGrid
          days={days}
          currentDate={currentDate}
          orders={orders}
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
