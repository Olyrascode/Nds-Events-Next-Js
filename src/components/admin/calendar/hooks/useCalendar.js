
import { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { fetchOrdersForMonth } from '../../../../services/orders.service';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [currentDate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const ordersData = await fetchOrdersForMonth(monthStart, monthEnd);
      setOrders(ordersData);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    currentDate,
    setCurrentDate,
    selectedOrder,
    setSelectedOrder,
    orders,
    loading,
    error,
    refresh: loadOrders
  };
}
