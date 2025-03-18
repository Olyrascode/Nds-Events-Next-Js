import React, { useState, useEffect } from "react";
import {
  TextField,
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
  Avatar,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageUpload from "../common/ImageUpload/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../features/productSlice";

const PackForm = ({ initialData, onSubmit, submitLabel }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);

  const [pack, setPack] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    products: [],
    discountPercentage: initialData?.discountPercentage || "0",
    minRentalDays: initialData?.minRentalDays || "1",
    minQuantity: initialData?.minQuantity || "1",
    image: initialData?.image || null,
    seo: initialData?.seo || {
      title: "",
      metaDescription: "",
    },
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (initialData?.products && products.length > 0) {
      const productsWithDetails = initialData.products
        .map((packProduct) => {
          const productDetails = products.find(
            (p) => p._id === packProduct.product
          );
          if (productDetails) {
            return {
              ...productDetails,
              quantity: packProduct.quantity,
              id: productDetails._id,
            };
          }
          return null;
        })
        .filter(Boolean);

      setPack((prev) => ({
        ...prev,
        products: productsWithDetails,
      }));
    }
  }, [initialData?.products, products]);

  const handleImageChange = (file) => {
    setPack({ ...pack, image: file });
  };

  const handleProductSelect = (event, product) => {
    if (!product) return;
    if (pack.products.some((p) => p.id === product._id)) {
      return;
    }
    setPack((prev) => ({
      ...prev,
      products: [...prev.products, { ...product, quantity: 1 }],
    }));
  };

  const handleRemoveProduct = (productId) => {
    setPack((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
  };

  const handleQuantityChange = (productId, quantity) => {
    setPack((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, quantity: parseInt(quantity) || 1 } : p
      ),
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(pack);
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ maxWidth: 800 }}>
      <ImageUpload
        onChange={handleImageChange}
        initialImage={initialData?.imageUrl}
      />

      <TextField
        fullWidth
        label="Nom du pack"
        value={pack.title}
        onChange={(e) => setPack({ ...pack, title: e.target.value })}
        margin="normal"
        error={Boolean(errors.title)}
        helperText={errors.title}
      />

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
          Ajouter des produits
        </Typography>

        <Autocomplete
          options={products}
          getOptionLabel={(option) => option.title}
          onChange={handleProductSelect}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
              {...props}
              key={option._id}
            >
              {option.imageUrl && (
                <Avatar src={option.imageUrl} alt={option.title} />
              )}
              <Typography>{option.title}</Typography>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Rechercher des produits"
              variant="outlined"
              fullWidth
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
                <TableCell>Produit</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell align="right">Prix/Jour</TableCell>
                <TableCell align="right">Quantité</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pack.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.imageUrl && (
                      <Avatar
                        src={product.imageUrl}
                        alt={product.title}
                        sx={{ width: 40, height: 40 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">${product.price}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleQuantityChange(product.id, e.target.value)
                      }
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
        label="Pourcentage de réduction"
        type="number"
        value={pack.discountPercentage}
        onChange={(e) =>
          setPack({ ...pack, discountPercentage: e.target.value })
        }
        margin="normal"
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
      />

      <TextField
        fullWidth
        label="Nombre minimum de jours de location"
        type="number"
        value={pack.minRentalDays}
        onChange={(e) => setPack({ ...pack, minRentalDays: e.target.value })}
        margin="normal"
        inputProps={{ min: 1 }}
      />

      <TextField
        fullWidth
        label="SEO Title"
        value={pack.seo?.title || ""}
        onChange={(e) =>
          setPack({
            ...pack,
            seo: { ...pack.seo, title: e.target.value },
          })
        }
        margin="normal"
      />

      <TextField
        fullWidth
        label="SEO Meta Description"
        value={pack.seo?.metaDescription || ""}
        onChange={(e) =>
          setPack({
            ...pack,
            seo: { ...pack.seo, metaDescription: e.target.value },
          })
        }
        margin="normal"
        multiline
        rows={2}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {submitLabel}
      </Button>
    </Box>
  );
};

export default PackForm;
