import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Typography,
  TextField,
  Box,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ProductForm from "./ProductForm";
import ImageUpload from "../common/ImageUpload/ImageUpload";
import {
  getProductById,
  updateProduct,
  fetchProducts,
} from "../../../services/products.service";
import { fetchPackById, updatePack } from "../../../services/packs.service";

export default function EditProductDialog({
  open,
  onClose,
  item,
  onSuccess,
  isPack,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("isPack:", isPack);
    console.log("Item reçu:", item);
    if (open && item?._id) {
      setLoading(true);
      setError(null);

      console.log(
        "Fonction appelée:",
        isPack ? "fetchPackById" : "getProductById"
      );

      const fetchData = isPack
        ? fetchPackById(item._id)
        : getProductById(item._id);

      fetchData
        .then((responseData) => {
          setData(responseData);
          setLoading(false);
        })
        .catch((err) => {
          console.error(
            `Erreur lors de la récupération ${
              isPack ? "du pack" : "du produit"
            }:`,
            err
          );
          setError(
            `Erreur lors de la récupération ${
              isPack ? "du pack" : "du produit"
            }`
          );
          setLoading(false);
        });
    }
  }, [open, item, isPack]);

  if (!open) return null;

  const handleSubmit = async (formData) => {
    try {
      if (!item) return;

      if (isPack) {
        await updatePack(item._id, formData);
      } else {
        await updateProduct(item._id, formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(
        isPack
          ? "Erreur lors de la mise à jour du pack:"
          : "Erreur lors de la mise à jour du produit:",
        err
      );
      setError(
        isPack
          ? "Erreur lors de la mise à jour du pack"
          : "Erreur lors de la mise à jour du produit"
      );
    }
  };

  // Composant PackForm pour éditer les packs
  const PackForm = ({ initialData, onSubmit, submitLabel }) => {
    const [pack, setPack] = useState({
      title: initialData?.title || "",
      description: initialData?.description || "",
      products:
        initialData?.products?.map((product) => ({
          ...product,
          id: product._id || product.id,
          imageUrl: product.imageUrl || product.image?.url,
          quantity: product.quantity || 1,
        })) || [],
      discountPercentage: initialData?.discountPercentage || "0",
      minRentalDays: initialData?.minRentalDays || "1",
      minQuantity: initialData?.minQuantity || "1",
      image: initialData?.image || null,
      seo: initialData?.seo || {
        title: "",
        metaDescription: "",
      },
    });
    const [availableProducts, setAvailableProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      loadProducts();
    }, []);

    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        setAvailableProducts(products);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    const handleImageChange = (file) => {
      setPack({ ...pack, image: file });
    };

    const handleProductSelect = (event, product) => {
      if (!product) return;
      if (pack.products.some((p) => p.id === product.id)) {
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
          initialImage={initialData?.image?.url || initialData?.imageUrl}
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
            options={availableProducts}
            getOptionLabel={(option) => option.title}
            onChange={handleProductSelect}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <Box
                  key={key}
                  component="li"
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  {...otherProps}
                >
                  {option.imageUrl && (
                    <Avatar src={option.imageUrl} alt={option.title} />
                  )}
                  <Typography>{option.title}</Typography>
                </Box>
              );
            }}
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
                  <TableRow key={product.id || product._id}>
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
                          handleQuantityChange(
                            product.id || product._id,
                            e.target.value
                          )
                        }
                        inputProps={{ min: 1 }}
                        size="small"
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleRemoveProduct(product.id || product._id)
                        }
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isPack ? "Éditer le pack" : "Éditer le produit"}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : data ? (
          isPack ? (
            <PackForm
              initialData={data}
              onSubmit={handleSubmit}
              submitLabel="Mettre à jour le pack"
            />
          ) : (
            <ProductForm
              initialData={data}
              onSubmit={handleSubmit}
              submitLabel="Mettre à jour le produit"
            />
          )
        ) : (
          <Typography>Aucune donnée à afficher.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
}
