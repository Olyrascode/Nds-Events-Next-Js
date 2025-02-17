import { isValid, parseISO } from 'date-fns';

export const validateCartDates = (startDate, endDate) => {
  if (!startDate || !endDate) return false;

  // Handle Date objects
  if (startDate instanceof Date && endDate instanceof Date) {
    return isValid(startDate) && isValid(endDate);
  }

  // Handle ISO strings
  try {
    const parsedStart = parseISO(startDate);
    const parsedEnd = parseISO(endDate);
    return isValid(parsedStart) && isValid(parsedEnd);
  } catch (err) {
    return false;
  }
};

export const parseDates = (startDate, endDate) => {
  if (!startDate || !endDate) {
    throw new Error('Invalid dates');
  }

  const start = startDate instanceof Date ? startDate : parseISO(startDate);
  const end = endDate instanceof Date ? endDate : parseISO(endDate);

  if (!isValid(start) || !isValid(end)) {
    throw new Error('Invalid dates');
  }

  return { start, end };
};