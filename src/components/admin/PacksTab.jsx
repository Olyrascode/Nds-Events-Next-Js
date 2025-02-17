
import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchProducts } from '../../services/products.service';
import { createPack } from '../../services/packs.service';
import ImageUpload from './common/ImageUpload/ImageUpload';

export default function PacksTab() {
  const [pack, setPack] = useState({
    name: '',
    description: '',
    products: [],
    discountPercentage: '',
    minRentalDays: '',
    image: null
  });
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);

  // Objet d'erreurs champ par champ
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    products: '',
    discountPercentage: '',
    minRentalDays: '',
    image: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const products = await fetchProducts();
      setAvailableProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
      setGlobalError('Failed to load products');
    }
  };

  const handleImageChange = (file) => {
    setPack({ ...pack, image: file });
    // On peut nettoyer l'erreur quand l'utilisateur ajoute une image
    setErrors({ ...errors, image: '' });
  };

  const handleProductSelect = (event, product) => {
    if (!product) return;

    // Vérification si le produit est déjà dans le pack
    if (pack.products.some(p => p.id === product.id)) {
      setGlobalError('This product is already in the pack');
      return;
    }

    setPack(prev => ({
      ...prev,
      products: [...prev.products, { ...product, quantity: 1 }]
    }));
    // Nettoyage de l'erreur si l'utilisateur ajoute enfin un produit
    setErrors((prev) => ({ ...prev, products: '' }));
  };

  const handleRemoveProduct = (productId) => {
    setPack(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId)
    }));
  };

  const handleQuantityChange = (productId, quantity) => {
    setPack(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.id === productId ? { ...p, quantity: parseInt(quantity) || 1 } : p
      )
    }));
  };

  // --- FONCTION DE VALIDATION ---
  const validate = () => {
    const newErrors = { ...errors };

    // Nom
    if (!pack.name.trim()) {
      newErrors.name = 'Le nom du pack est obligatoire.';
    } else {
      newErrors.name = '';
    }

    // Description
    if (!pack.description.trim()) {
      newErrors.description = 'La description est obligatoire.';
    } else {
      newErrors.description = '';
    }

    // Produits
    if (pack.products.length === 0) {
      newErrors.products = 'Ajoutez au moins un produit.';
    } else {
      newErrors.products = '';
    }

    // Discount
    if (pack.discountPercentage === '') {
      newErrors.discountPercentage = 'Le pourcentage de réduction est obligatoire.';
    } else {
      newErrors.discountPercentage = '';
    }

    // Min Rental Days
    if (pack.minRentalDays === '') {
      newErrors.minRentalDays = 'Le minimum de jours de location est obligatoire.';
    } else {
      newErrors.minRentalDays = '';
    }

    // Image
    if (!pack.image) {
      newErrors.image = "L'image est obligatoire.";
    } else {
      newErrors.image = '';
    }

    setErrors(newErrors);

    // Retourne "true" si AUCUNE erreur
    return Object.values(newErrors).every((val) => val === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGlobalError('');

    // Validation avant d'appeler createPack
    const isValid = validate();
    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      await createPack(pack);
      setSuccess(true);

      // Réinitialiser le formulaire
      setPack({
        name: '',
        description: '',
        products: [],
        discountPercentage: '',
        minRentalDays: '',
        image: null
      });
      setErrors({
        name: '',
        description: '',
        products: '',
        discountPercentage: '',
        minRentalDays: '',
        image: ''
      });
    } catch (error) {
      setGlobalError(error.message || 'Failed to create pack');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800 }}>
      <Typography variant="h5" gutterBottom>
        Créer un nouveau pack
      </Typography>

      {/* Erreur globale éventuelle */}
      {globalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {globalError}
        </Alert>
      )}

      {/* Message de succès */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Pack créé avec succès!
        </Alert>
      )}

      {/* Image */}
      <ImageUpload onChange={handleImageChange} />
      {errors.image && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.image}
        </Alert>
      )}

      {/* Nom du pack */}
      <TextField
        fullWidth
        label="Pack Name"
        value={pack.name}
        onChange={(e) => setPack({ ...pack, name: e.target.value })}
        margin="normal"
        error={Boolean(errors.name)}
        helperText={errors.name}
      />

      {/* Description */}
      <TextField
        fullWidth
        label="Description"
        value={pack.description}
        onChange={(e) => setPack({ ...pack, description: e.target.value })}
        margin="normal"
        multiline
        rows={4}
        error={Boolean(errors.description)}
        helperText={errors.description}
      />

      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add Products
        </Typography>
        
        <Autocomplete
          options={availableProducts}
          getOptionLabel={(option) => option.title}
          onChange={handleProductSelect}
          renderOption={(props, option) => (
            <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 2 }} {...props}>
              {option.imageUrl && (
                <Avatar src={option.imageUrl} alt={option.title} />
              )}
              <Typography>{option.title}</Typography>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Products"
              variant="outlined"
              fullWidth
              error={Boolean(errors.products)}
              helperText={errors.products}
            />
          )}
        />
      </Box>

      {pack.products.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price/Day</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pack.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.imageUrl && (
                      <Avatar src={product.imageUrl} alt={product.title} />
                    )}
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">${product.price}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      inputProps={{ min: 1 }}
                      size="small"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TextField
        fullWidth
        label="Discount Percentage"
        type="number"
        value={pack.discountPercentage}
        onChange={(e) => setPack({ ...pack, discountPercentage: e.target.value })}
        margin="normal"
        error={Boolean(errors.discountPercentage)}
        helperText={errors.discountPercentage}
        inputProps={{ min: 0, max: 100 }}
      />

      <TextField
        fullWidth
        label="Quantité minimum par location"
        type="number"
        value={pack.minQuantity}
        onChange={(e) => setPack({ ...pack, minQuantity: e.target.value })}
        margin="normal"
        inputProps={{ min: 1 }}
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Minimum Rental Days"
        type="number"
        value={pack.minRentalDays}
        onChange={(e) => setPack({ ...pack, minRentalDays: e.target.value })}
        margin="normal"
        error={Boolean(errors.minRentalDays)}
        helperText={errors.minRentalDays}
        inputProps={{ min: 1 }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Create Pack'}
      </Button>
    </Box>
  );
}
