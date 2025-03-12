import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createProduct } from '../../services/products.service';
import {
  Box,
  Typography,
  Alert,
} from '@mui/material';
import ProductForm from './products/ProductForm';

export default function ProductsTab() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (productData) => {
    if (!currentUser?.isAdmin) {
      setError('Vous devez etre administrateur pour créer un produit');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createProduct(productData);
      setSuccess(true);
    } catch (error) {
      setError(error.message || 'erreur pendant la création du produit');
      console.error('Erreur lors de la creation du produit:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h5" gutterBottom>
        Créer un nouveau produit
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Product créer avec succes!
        </Alert>
      )}

      <ProductForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Box>
  );
}