import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/products.service';
import { fetchPacks } from '../services/packs.service';

export function useProductManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [products, packs] = await Promise.all([
        fetchProducts(),
        fetchPacks()
      ]);

      const formattedProducts = products.map(product => ({
        ...product,
        type: 'product'
      }));

      const formattedPacks = packs.map(pack => ({
        ...pack,
        type: 'pack',
        title: pack.name,
        price: calculatePackPrice(pack)
      }));

      setItems([...formattedProducts, ...formattedPacks].sort((a, b) => 
        a.title.localeCompare(b.title)
      ));
    } catch (err) {
      setError('Failed to load items');
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculatePackPrice = (pack) => {
    if (!pack.products) return 0;
    return pack.products.reduce((total, product) => {
      const basePrice = product.price * product.quantity;
      return total + basePrice;
    }, 0) * (1 - (pack.discountPercentage || 0) / 100);
  };

  useEffect(() => {
    loadItems();
  }, []);

  return {
    items,
    loading,
    error,
    refresh: loadItems
  };
}