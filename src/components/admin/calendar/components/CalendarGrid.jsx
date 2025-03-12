
import { Box } from '@mui/material';
import { isSameMonth, isToday, format } from 'date-fns';
import { DayCell } from '../styles/CalendarStyles';
import DayContent from './DayContent';
import { getOrdersForDay } from '../utils/calendarUtils';

export default function CalendarGrid({ days, currentDate, orders, onOrderClick }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {days.map((day) => {
        const dayOrders = getOrdersForDay(orders, day);
        const isCurrentMonthDay = isSameMonth(day, currentDate);
        const isTodayDay = isToday(day);

        return (
          <DayCell
            key={day.toString()}
            isCurrentMonth={isCurrentMonthDay}
            isToday={isTodayDay}
          >
            <DayContent
              day={day}
              orders={dayOrders}
              onOrderClick={onOrderClick}
            />
          </DayCell>
        );
      })}
    </Box>
  );
}
