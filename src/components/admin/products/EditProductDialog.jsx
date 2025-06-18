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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Grid,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ProductForm from "./ProductForm";
import ImageUpload from "../common/ImageUpload/ImageUpload";
import CarouselImageUpload from "../common/ImageUpload/CarouselImageUpload";
import {
  getProductById,
  updateProduct,
  fetchProducts,
} from "../../../services/products.service";
import { fetchPackById, updatePack } from "../../../services/packs.service";

// Ajout de la constante pour l'URL de l'API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// Fonction utilitaire pour corriger les URLs d'images
const fixImageUrl = (url) => {
  if (!url) return ""; // Retourner une chaîne vide si l'URL est manquante
  return url.replace("http://localhost:5000", API_URL);
};

// Fonction utilitaire pour générer un slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[éèêë]/g, "e")
    .replace(/[àâä]/g, "a")
    .replace(/[ùûü]/g, "u")
    .replace(/[ôö]/g, "o")
    .replace(/[îï]/g, "i")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

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
          // Corriger les URLs des images avant de définir les données
          if (responseData.imageUrl) {
            responseData.imageUrl = fixImageUrl(responseData.imageUrl);
          }
          if (
            responseData.carouselImages &&
            responseData.carouselImages.length > 0
          ) {
            responseData.carouselImages = responseData.carouselImages.map(
              (img) => ({
                ...img,
                url: fixImageUrl(img.url),
              })
            );
          }
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
      category: "packs-complets",
      navCategories: initialData?.navCategories || [],
      products: [],
      discountPercentage: initialData?.discountPercentage || "0",
      minRentalDays: initialData?.minRentalDays || "1",
      minQuantity: initialData?.minQuantity || "1",
      image: initialData?.image || null,
      imageUrl: fixImageUrl(initialData?.imageUrl || ""),
      carouselImages:
        initialData?.carouselImages?.map((img) => fixImageUrl(img?.url)) ||
        Array(10).fill(null),
      seoTitle: initialData?.seoTitle || "",
      seoMetaDescription: initialData?.seoMetaDescription || "",
    });

    // Log pour l'image principale du pack
    console.log("[PackForm] Initial Data for Pack Image:", initialData);
    console.log(
      "[PackForm] Initial Pack State imageUrl (for main image):",
      pack.imageUrl
    );

    const [availableProducts, setAvailableProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
      loadProducts();
    }, []);

    useEffect(() => {
      if (initialData?.products && availableProducts.length > 0) {
        const populatedProducts = initialData.products
          .map((itemInPack) => {
            const productId =
              typeof itemInPack.product === "string"
                ? itemInPack.product
                : itemInPack.product?._id;
            const fullProductDetails = availableProducts.find(
              (p) => p._id === productId
            );

            // Log pour les détails du produit et son image
            console.log(
              "[PackForm] Populating product in pack - Full details from availableProducts:",
              fullProductDetails
            );

            if (fullProductDetails) {
              console.log(
                "[PackForm] Product image URL from fullProductDetails:",
                fullProductDetails.imageUrl
              );
              const fixedImgUrl = fixImageUrl(fullProductDetails.imageUrl);
              console.log(
                "[PackForm] Fixed product image URL for pack table:",
                fixedImgUrl
              );
              return {
                id: itemInPack._id,
                product_id: fullProductDetails._id,
                title: fullProductDetails.title,
                imageUrl: fixedImgUrl, // Utiliser l'URL corrigée
                price: fullProductDetails.price,
                category: fullProductDetails.category,
                quantity: itemInPack.quantity || 1,
              };
            }
            const productData =
              typeof itemInPack.product === "object" ? itemInPack.product : {};
            return {
              id: itemInPack._id,
              product_id: productId || "unknown",
              title: productData.title || "Produit inconnu",
              imageUrl: fixImageUrl(productData.imageUrl),
              price: productData.price || 0,
              category: productData.category || "Inconnue",
              quantity: itemInPack.quantity || 1,
            };
          })
          .filter((p) => p.product_id !== "unknown");

        setPack((prevPack) => ({ ...prevPack, products: populatedProducts }));
      } else if (initialData?.products) {
        const basicProducts = initialData.products.map((itemInPack) => {
          const productRef = itemInPack.product;
          const productId =
            typeof productRef === "string" ? productRef : productRef?._id;
          return {
            id: itemInPack._id,
            product_id: productId,
            title:
              typeof productRef === "object" && productRef.title
                ? productRef.title
                : "Chargement...",
            imageUrl: fixImageUrl(
              typeof productRef === "object" ? productRef.imageUrl : ""
            ),
            price:
              typeof productRef === "object" && productRef.price
                ? productRef.price
                : 0,
            category:
              typeof productRef === "object" && productRef.category
                ? productRef.category
                : "...",
            quantity: itemInPack.quantity || 1,
          };
        });
        setPack((prevPack) => ({ ...prevPack, products: basicProducts }));
      }
    }, [initialData, availableProducts]);

    const loadProducts = async () => {
      try {
        const productsData = await fetchProducts();
        const correctedProducts = productsData.map((p) => ({
          ...p,
          imageUrl: fixImageUrl(p.imageUrl),
        }));
        setAvailableProducts(correctedProducts);
      } catch (error) {
        console.error("Error loading products for PackForm:", error);
      }
    };

    const handleImageChange = (file) => {
      setPack({ ...pack, image: file });
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

    const handleProductSelect = (event, productToAdd) => {
      if (!productToAdd) return;

      if (pack.products.some((p) => p.product_id === productToAdd._id)) {
        console.warn("Produit déjà dans le pack:", productToAdd.title);
        return;
      }

      const newProductInPack = {
        id: generateUniqueId(),
        product_id: productToAdd._id,
        title: productToAdd.title,
        imageUrl: productToAdd.imageUrl,
        price: productToAdd.price,
        category: productToAdd.category,
        quantity: 1,
      };

      setPack((prev) => ({
        ...prev,
        products: [...prev.products, newProductInPack],
      }));
      setErrors((prev) => ({ ...prev, products: "" }));
    };

    const generateUniqueId = () => {
      return (
        "temp_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
      );
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
      setFormLoading(true);

      const newErrors = {};
      if (!pack.title) newErrors.title = "Le titre est requis";
      if (!pack.navCategories || pack.navCategories.length === 0)
        newErrors.navCategories = "Au moins un groupe de menu est requis";
      if (pack.products.length === 0)
        newErrors.products = "Ajoutez au moins un produit";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setFormLoading(false);
        return;
      }

      const filteredCarouselImages = pack.carouselImages.filter(Boolean);

      const packToSubmit = {
        ...pack,
        category: "packs-complets",
        products: pack.products.map((p) => {
          return {
            product: p.product_id,
            quantity: parseInt(p.quantity) || 1,
          };
        }),
        carouselImages: filteredCarouselImages,
        seo: {
          title: pack.seoTitle || pack.title,
          metaDescription: pack.seoMetaDescription || pack.description,
        },
      };

      console.log("Pack à soumettre:", packToSubmit);
      console.log("Produits formatés pour API:", packToSubmit.products);

      onSubmit(packToSubmit);
      setFormLoading(false);
    };

    return (
      <Box component="form" onSubmit={handleFormSubmit} sx={{ maxWidth: 800 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Image principale
          </Typography>
          <ImageUpload
            currentImage={pack.imageUrl}
            onChange={handleImageChange}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
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
                  currentImage={pack.carouselImages[index]}
                  onChange={(file) => handleCarouselImageChange(file, index)}
                  onDelete={() => handleCarouselImageDelete(index)}
                  index={index}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Informations du pack
        </Typography>

        <TextField
          fullWidth
          label="Nom du pack"
          value={pack.title}
          onChange={(e) => setPack({ ...pack, title: e.target.value })}
          margin="normal"
          required
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

        <Autocomplete
          multiple
          fullWidth
          options={[
            { value: "la-table", label: "La table" },
            { value: "le-mobilier", label: "Le Mobilier" },
            { value: "tentes", label: "Tentes" },
            { value: "decorations", label: "Décorations" },
            { value: "autres-produits", label: "Autres produits" },
          ]}
          getOptionLabel={(option) => option.label}
          value={pack.navCategories.map((cat) => ({
            value: cat,
            label:
              cat === "la-table"
                ? "La table"
                : cat === "le-mobilier"
                ? "Le Mobilier"
                : cat === "tentes"
                ? "Tentes"
                : cat === "decorations"
                ? "Décorations"
                : cat === "autres-produits"
                ? "Autres produits"
                : cat,
          }))}
          onChange={(event, newValue) => {
            setPack({
              ...pack,
              navCategories: newValue.map((option) => option.value),
            });
            setErrors({ ...errors, navCategories: "" });
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...chipProps } = getTagProps({ index });
              return (
                <Chip
                  key={option.value}
                  variant="outlined"
                  label={option.label}
                  {...chipProps}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Groupes de menu *"
              placeholder="Sélectionnez les catégories de navigation"
              error={Boolean(errors.navCategories)}
              helperText={
                errors.navCategories ||
                "Sélectionnez dans quelles catégories de navigation ce pack apparaîtra"
              }
              margin="normal"
            />
          )}
        />

        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Produits inclus dans le pack
          </Typography>
          <Autocomplete
            options={availableProducts.filter(
              (option) =>
                !pack.products.some((p) => p.product_id === option._id)
            )}
            getOptionLabel={(option) => option.title || ""}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={handleProductSelect}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <Box
                  key={option._id}
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
                label="Rechercher et ajouter des produits"
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
                  <TableCell align="right">Quantité</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pack.products.map((p) => (
                  <TableRow key={p.id || p.product_id}>
                    <TableCell>
                      {p.imageUrl && <Avatar src={p.imageUrl} alt={p.title} />}
                    </TableCell>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell align="right">
                      {p.price ? `${p.price.toFixed(2)}€` : "N/A"}
                    </TableCell>
                    <TableCell align="right">{"Unité"}</TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        value={p.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            p.id || p.product_id,
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
                          handleRemoveProduct(p.id || p.product_id)
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

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Paramètres du pack
        </Typography>

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

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Référencement SEO
        </Typography>

        <TextField
          fullWidth
          label="Titre SEO"
          value={pack.seoTitle || ""}
          onChange={(e) =>
            setPack({
              ...pack,
              seoTitle: e.target.value,
            })
          }
          margin="normal"
        />

        <TextField
          fullWidth
          label="Meta Description SEO"
          value={pack.seoMetaDescription || ""}
          onChange={(e) =>
            setPack({
              ...pack,
              seoMetaDescription: e.target.value,
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
          disabled={formLoading}
        >
          {formLoading ? <CircularProgress size={24} /> : submitLabel}
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
