import { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { fetchProducts } from '../../../services/products.service';
import { fetchPacks } from '../../../services/packs.service';
import ProductsTable from './components/ProductsTable';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import './_ProductsManagement.scss';

export default function ProductsManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

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
        type: 'pack'
      }));

      setItems([...formattedProducts, ...formattedPacks]);
    } catch (error) {
      setError('Failed to load items. Please try again.');
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      await deleteItem(id, type);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="products-management">
      <Container>
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestions produit
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Gestion des produit et des packs
          </Typography>
        </Box>

        <ProductsTable items={items} onDelete={handleDelete} />
      </Container>
    </div>
  );
}