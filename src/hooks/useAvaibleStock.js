import { useState, useEffect } from 'react';
import { getAvailableStock } from '../services/stock.service';

export const useAvailableStock = (productId, startDate, endDate) => {
  const [availableStock, setAvailableStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStock = async () => {
      try {
        setLoading(true);
        setError(null);
        const stock = await getAvailableStock(productId, startDate, endDate);
        setAvailableStock(stock);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId && startDate && endDate) {
      loadStock();
    }
  }, [productId, startDate, endDate]);

  return { availableStock, loading, error };
};

// To use this in your product pages, simply import the useAvailableStock hook:
// const { availableStock, loading } = useAvailableStock(productId, startDate, endDate);
