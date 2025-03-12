
import { useState } from 'react';
import { Box } from '@mui/material';
import CalendarView from './calendar/CalendarView';

export default function CalendarTab() {
  return (
    <Box sx={{ height: 'calc(100vh - 200px)' }}>
      <CalendarView />
    </Box>
  );
}
