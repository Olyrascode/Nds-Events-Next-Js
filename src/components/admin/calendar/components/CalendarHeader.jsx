
import { Box, Typography } from '@mui/material';
import { HeaderCell } from '../styles/CalendarStyles';

export default function CalendarHeader() {
  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  return (
    <Box sx={{ display: 'flex' }}>
      {weekDays.map(day => (
        <HeaderCell key={day}>
          <Typography variant="subtitle2" fontWeight="bold">
            {day}
          </Typography>
        </HeaderCell>
      ))}
    </Box>
  );
}
