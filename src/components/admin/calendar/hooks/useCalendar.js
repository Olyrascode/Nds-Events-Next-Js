
import { useState, useEffect, useCallback } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { fetchOrdersForMonth } from '../../../../services/orders.service';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const ordersData = await fetchOrdersForMonth(monthStart, monthEnd);
      setOrders(ordersData);
    } catch {
      setError('Failed to load orders');
      console.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return {
    currentDate,
    setCurrentDate,
    selectedOrder,
    setSelectedOrder,
    orders,
    loading,
    error,
    refresh: loadOrders,
  };
}
