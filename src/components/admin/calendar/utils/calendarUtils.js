
import { isSameDay, isWithinInterval } from 'date-fns';

export const getOrdersForDay = (orders = [], date) => {
  if (!orders.length) return [];
  
  return orders.filter(order => {
    // Vérifie si startDate et endDate existent et convertit en Date JavaScript
    const startDate = order.startDate ? new Date(order.startDate) : null;
    const endDate = order.endDate ? new Date(order.endDate) : null;

    return (
      (startDate && isSameDay(startDate, date)) ||
      (endDate && isSameDay(endDate, date)) ||
      (startDate && endDate && isWithinInterval(date, { start: startDate, end: endDate }))
    );
  });
};


export const getEventBarStyle = (isStart, isEnd, theme) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(0.5, 1),
  marginBottom: theme.spacing(0.5),
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  position: 'relative',
  marginLeft: isStart ? 0 : -8,
  marginRight: isEnd ? 0 : -8,
  borderTopLeftRadius: isStart ? 4 : 0,
  borderBottomLeftRadius: isStart ? 4 : 0,
  borderTopRightRadius: isEnd ? 4 : 0,
  borderBottomRightRadius: isEnd ? 4 : 0,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  }
});
