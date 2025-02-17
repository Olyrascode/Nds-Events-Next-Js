
import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { format, addMonths, subMonths } from 'date-fns';

export default function CalendarNavigation({ currentDate, onNavigate }) {
  const handlePreviousMonth = () => {
    onNavigate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onNavigate(addMonths(currentDate, 1));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <IconButton onClick={handlePreviousMonth}>
        <ChevronLeftIcon />
      </IconButton>
      <Typography variant="h5" sx={{ flex: 1, textAlign: 'center' }}>
        {format(currentDate, 'MMMM yyyy')}
      </Typography>
      <IconButton onClick={handleNextMonth}>
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}
