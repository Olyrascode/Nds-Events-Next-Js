
import { Typography } from '@mui/material';
import { isSameDay } from 'date-fns';
import { EventBar } from '../styles/CalendarStyles';

export default function OrderEventBar({ order, onClick, currentDate }) {
  const startDate = order.startDate ? new Date(order.startDate) : null;
  const endDate = order.endDate ? new Date(order.endDate) : null;
  
  const isStart = isSameDay(startDate, currentDate);
  const isEnd = isSameDay(endDate, currentDate);

  return (
    <EventBar
      sx={{ borderRadius: isStart ? 4 : 0, marginRight: isEnd ? 0 : -8 }}
      onClick={onClick}
    >
      <Typography variant="caption" noWrap>
        {`${order.billingInfo.firstName} ${order.billingInfo.lastName}`}
      </Typography>
    </EventBar>
  );
}
