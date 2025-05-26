import { useState, useEffect } from "react";
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
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchProducts } from "../../services/products.service";
import { createPack } from "../../services/packs.service";
import ImageUpload from "./common/ImageUpload/ImageUpload";
import CarouselImageUpload from "./common/ImageUpload/CarouselImageUpload";
import { slugify } from "@/utils/slugify";

// Ajout de la constante pour l'URL de l'API et de la fonction fixImageUrl
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

const fixImageUrl = (url) => {
  if (!url) return "";
  return url.replace("http://localhost:5000", API_URL);
};

export default function PacksTab() {
  const [pack, setPack] = useState({
    title: "",
    description: "",
    products: [],
    discountPercentage: "0",
    minRentalDays: "1",
    minQuantity: "1",
    image: null,
    carouselImages: Array(10).fill(null),
    seo: {
      title: "",
      metaDescription: "",
    },
    category: "packs-complets",
    navCategory: "",
  });
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    products: "",
    discountPercentage: "",
    minRentalDays: "",
    image: "",
    navCategory: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const products = await fetchProducts();
      // Corriger les URLs des images des produits
      const correctedProducts = products.map((product) => ({
        ...product,
        imageUrl: fixImageUrl(product.imageUrl),
      }));
      setAvailableProducts(correctedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      setGlobalError("Failed to load products");
    }
  };

  const handleImageChange = (file) => {
    setPack({ ...pack, image: file });
    setErrors({ ...errors, image: "" });
  };

  const handleCarouselImageChange = (file, index) => {
    const newCarouselImages = [...pack.carouselImages];
    newCarouselImages[index] = file;
    setPack({ ...pack, carouselImages: newCarouselImages });
  };

  const handleCarouselImageDelete = (index) => {
    const newCarouselImages = [...pack.carouselImages];
    newCarouselImages[index] = null;
    setPack({ ...pack, carouselImages: newCarouselImages });
  };

  const handleProductSelect = (event, product) => {
    if (!product) return;
    if (pack.products.some((p) => p.id === product.id)) {
      setGlobalError("Ce produit est déjà dans le pack");
      return;
    }

    const enhancedProduct = {
      ...product,
      quantity: 1,
      lotSize: product.lotSize || 1,
      isLotProduct: product.lotSize > 1,
    };

    setPack((prev) => ({
      ...prev,
      products: [...prev.products, enhancedProduct],
    }));
    setErrors((prev) => ({ ...prev, products: "" }));
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

  const validate = () => {
    const newErrors = { ...errors };

    if (!pack.title.trim()) {
      newErrors.title = "Le nom du pack est obligatoire.";
    } else {
      newErrors.title = "";
    }

    if (!pack.description.trim()) {
      newErrors.description = "La description est obligatoire.";
    } else {
      newErrors.description = "";
    }

    if (pack.products.length === 0) {
      newErrors.products = "Ajoutez au moins un produit.";
    } else {
      newErrors.products = "";
    }

    if (pack.discountPercentage === "") {
      newErrors.discountPercentage =
        "Le pourcentage de réduction est obligatoire.";
    } else {
      newErrors.discountPercentage = "";
    }

    if (pack.minRentalDays === "") {
      newErrors.minRentalDays =
        "Le minimum de jours de location est obligatoire.";
    } else {
      newErrors.minRentalDays = "";
    }

    if (!pack.image) {
      newErrors.image = "L'image est obligatoire.";
    } else {
      newErrors.image = "";
    }

    if (!pack.navCategory.trim()) {
      newErrors.navCategory = "Le groupe de menu est obligatoire.";
    } else {
      newErrors.navCategory = "";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((val) => val === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGlobalError("");

    const filteredCarouselImages = pack.carouselImages
      .filter(Boolean)
      .slice(0, 10);

    const productsForSubmit = pack.products.map((product) => ({
      product: product._id,
      quantity: product.quantity,
    }));

    const packToSubmit = {
      ...pack,
      products: productsForSubmit,
      category: "packs-complets",
      carouselImages: filteredCarouselImages,
      slug: slugify(pack.title),
    };

    const isValid = validate();
    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      await createPack(packToSubmit);
      setSuccess(true);
      setPack({
        title: "",
        description: "",
        products: [],
        discountPercentage: "0",
        minRentalDays: "1",
        minQuantity: "1",
        image: null,
        carouselImages: Array(10).fill(null),
        seo: {
          title: "",
          metaDescription: "",
        },
        category: "packs-complets",
        navCategory: "",
      });
      setErrors({
        title: "",
        description: "",
        products: "",
        discountPercentage: "",
        minRentalDays: "",
        image: "",
        navCategory: "",
      });
    } catch (error) {
      setGlobalError(error.message || "Failed to create pack");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800 }}>
      <Typography variant="h5" gutterBottom>
        Créer un nouveau pack
      </Typography>

      {globalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {globalError}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Pack créé avec succès!
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Image principale
        </Typography>
        <ImageUpload onChange={handleImageChange} label="Image principale" />
        {errors.image && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.image}
          </Alert>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Images du carrousel (jusqu'à 10)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ajoutez des images supplémentaires pour présenter votre pack sous
          différents angles
        </Typography>
        <Grid container spacing={2}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CarouselImageUpload
                onChange={(file) => handleCarouselImageChange(file, index)}
                currentImage={pack.carouselImages[index]}
                index={index}
                onDelete={() => handleCarouselImageDelete(index)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        Informations du pack
      </Typography>

      <TextField
        fullWidth
        label="Nom du pack"
        value={pack.title || ""}
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

      <FormControl
        fullWidth
        margin="normal"
        required
        error={Boolean(errors.navCategory)}
      >
        <InputLabel>Groupe de menu</InputLabel>
        <Select
          value={pack.navCategory || ""}
          label="Groupe de menu"
          onChange={(e) => setPack({ ...pack, navCategory: e.target.value })}
        >
          <MenuItem value="la-table">La table</MenuItem>
          <MenuItem value="le-mobilier">Le Mobilier</MenuItem>
          <MenuItem value="tentes">Tentes</MenuItem>
          <MenuItem value="decorations">Décorations</MenuItem>
          <MenuItem value="autres-produits">Autres produits</MenuItem>
          <MenuItem value="packs-complets">Packs Complets</MenuItem>
        </Select>
        {errors.navCategory && (
          <Typography color="error" variant="caption">
            {errors.navCategory}
          </Typography>
        )}
      </FormControl>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Produits inclus dans le pack
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
                <TableCell>Produit</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell align="right">Prix/jour</TableCell>
                <TableCell align="right">Conditionnement</TableCell>
                <TableCell align="right">Quantité (unité)</TableCell>
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
                    {product.lotSize > 1
                      ? `Lot de ${product.lotSize}`
                      : "Unité"}
                  </TableCell>
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
                      helperText={
                        product.isLotProduct
                          ? `(${Math.ceil(
                              product.quantity / product.lotSize
                            )} lot${
                              Math.ceil(product.quantity / product.lotSize) > 1
                                ? "s"
                                : ""
                            })`
                          : ""
                      }
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

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Paramètres du pack
      </Typography>

      <TextField
        fullWidth
        label="Pourcentage de réduction"
        type="number"
        value={pack.discountPercentage || "0"}
        onChange={(e) =>
          setPack({ ...pack, discountPercentage: e.target.value })
        }
        margin="normal"
        error={Boolean(errors.discountPercentage)}
        helperText={errors.discountPercentage}
        inputProps={{ min: 0, max: 100 }}
      />

      <TextField
        fullWidth
        label="Quantité minimum par location"
        type="number"
        value={pack.minQuantity || "1"}
        onChange={(e) => setPack({ ...pack, minQuantity: e.target.value })}
        margin="normal"
        inputProps={{ min: 1 }}
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Nombre minimum de jours de location"
        type="number"
        value={pack.minRentalDays || "1"}
        onChange={(e) => setPack({ ...pack, minRentalDays: e.target.value })}
        margin="normal"
        error={Boolean(errors.minRentalDays)}
        helperText={errors.minRentalDays}
        inputProps={{ min: 1 }}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Référencement SEO
      </Typography>

      <TextField
        fullWidth
        label="Titre SEO"
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
        label="Meta Description SEO"
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
        sx={{ mt: 4, py: 1.5 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Créer le pack"}
      </Button>
    </Box>
  );
}
