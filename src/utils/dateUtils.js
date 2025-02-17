
import { isWithinInterval, differenceInDays } from 'date-fns';

export const calculateRentalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return differenceInDays(end, start) + 1;
};

export const isProductAvailable = (product, startDate, endDate, quantity) => {
  const reservations = product.reservations || [];
  const requestedInterval = {
    start: new Date(startDate),
    end: new Date(endDate)
  };

  const reservedQuantity = reservations.reduce((total, reservation) => {
    if (isWithinInterval(requestedInterval.start, {
      start: new Date(reservation.startDate),
      end: new Date(reservation.endDate)
    }) || isWithinInterval(requestedInterval.end, {
      start: new Date(reservation.startDate),
      end: new Date(reservation.endDate)
    })) {
      return total + reservation.quantity;
    }
    return total;
  }, 0);

  return (product.stock - reservedQuantity) >= quantity;
};

export const isPackAvailable = (pack, startDate, endDate, quantity) => {
  return pack.products.every(item => 
    isProductAvailable(item.product, startDate, endDate, item.quantity * quantity)
  );
};
