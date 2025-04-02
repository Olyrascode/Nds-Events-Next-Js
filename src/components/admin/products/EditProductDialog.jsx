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
      category: initialData?.category || "",
      navCategory: initialData?.navCategory || "",
      products:
        initialData?.products?.map((item) => {
          // Les données du produit sont imbriquées dans un objet product
          const productData = item.product || {};
          return {
            id: item._id,
            product_id: productData._id,
            title: productData.title || "Sans titre",
            description: productData.description || "",
            price: productData.price || 0,
            imageUrl: productData.imageUrl || "",
            quantity: item.quantity || 1,
            originalItem: item, // Garder l'élément original pour référence
          };
        }) || [],
      discountPercentage: initialData?.discountPercentage || "0",
      minRentalDays: initialData?.minRentalDays || "1",
      minQuantity: initialData?.minQuantity || "1",
      image: initialData?.image || null,
      carouselImages: initialData?.carouselImages || Array(10).fill(null),
      seoTitle: initialData?.seoTitle || "",
      seoMetaDescription: initialData?.seoMetaDescription || "",
    });

    const [availableProducts, setAvailableProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [creatingNewCategory, setCreatingNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    useEffect(() => {
      loadProducts();
      loadCategories();

      // Log pour déboguer les produits chargés
      console.log("Products in pack:", initialData?.products);
    }, []);

    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        setAvailableProducts(products);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    const loadCategories = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr"
          }/api/categories`
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
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

    const handleProductSelect = (event, product) => {
      if (!product) return;

      // Vérifier si le produit est déjà dans le pack
      if (pack.products.some((p) => p.product_id === product._id)) {
        return;
      }

      // Créer un nouvel élément de produit au format attendu
      const newProduct = {
        id: generateUniqueId(), // ID temporaire pour l'interface
        product_id: product._id, // ID du produit pour le backend
        product: product._id, // Ajouter également une propriété 'product' pour compatibilité
        title: product.title || "Sans titre",
        description: product.description || "",
        price: product.price || 0,
        imageUrl: product.imageUrl || "",
        quantity: 1,
      };

      console.log("Ajout du produit au pack:", newProduct);

      setPack((prev) => ({
        ...prev,
        products: [...prev.products, newProduct],
      }));
    };

    // Génère un ID unique pour un nouveau produit
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

      // Vérifier que les champs requis sont remplis
      const newErrors = {};
      if (!pack.title) newErrors.title = "Le titre est requis";
      if (!creatingNewCategory && !pack.category)
        newErrors.category = "La catégorie est requise";
      if (creatingNewCategory && !newCategory)
        newErrors.newCategory = "Le nom de la nouvelle catégorie est requis";
      if (!pack.navCategory)
        newErrors.navCategory = "Le groupe de menu est requis";
      if (pack.products.length === 0)
        newErrors.products = "Ajoutez au moins un produit";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Filtrer les images null du carrousel
      const filteredCarouselImages = pack.carouselImages.filter(Boolean);

      // Déterminer la catégorie finale (existante ou nouvelle)
      const finalCategory = creatingNewCategory ? newCategory : pack.category;

      // Préparer l'objet à soumettre
      const packToSubmit = {
        ...pack,
        category: finalCategory,
        // Format attendu par l'API : { product: id, quantity: number }
        products: pack.products.map((product) => {
          console.log("Préparation produit pour soumission:", product);
          // S'assurer que nous avons le bon ID du produit
          return {
            product: product.product_id, // Utiliser product_id qui contient l'ID réel du produit
            quantity: parseInt(product.quantity) || 1,
          };
        }),
        carouselImages: filteredCarouselImages,
        seo: {
          title: pack.seoTitle || pack.title,
          metaDescription: pack.seoMetaDescription || pack.description,
        },
      };

      console.log("Pack à soumettre:", packToSubmit);
      // Logging des produits formatés pour les déboguer
      console.log("Produits formatés pour API:", packToSubmit.products);

      // Si on crée une nouvelle catégorie, d'abord l'envoyer au backend
      if (creatingNewCategory && newCategory) {
        // On crée la catégorie, puis on soumet le pack
        createNewCategory().then(() => {
          onSubmit(packToSubmit);
        });
      } else {
        // Sinon, on soumet directement le pack
        onSubmit(packToSubmit);
      }
    };

    // Fonction pour créer une nouvelle catégorie
    const createNewCategory = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr"
          }/api/categories`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: newCategory,
              slug: generateSlug(newCategory),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la création de la catégorie");
        }

        return await response.json();
      } catch (error) {
        console.error("Erreur lors de la création de la catégorie:", error);
        throw error;
      }
    };

    return (
      <Box component="form" onSubmit={handleFormSubmit} sx={{ maxWidth: 800 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Image principale
          </Typography>
          <ImageUpload
            onChange={handleImageChange}
            currentImage={initialData?.imageUrl}
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
                  onChange={(file) => handleCarouselImageChange(file, index)}
                  currentImage={initialData?.carouselImages?.[index]?.url}
                  index={index}
                  onDelete={() => handleCarouselImageDelete(index)}
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

        <FormControl
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.category)}
        >
          <InputLabel>Catégorie du pack</InputLabel>
          <Select
            value={creatingNewCategory ? "__new__" : pack.category}
            label="Catégorie du pack"
            onChange={(e) => {
              if (e.target.value === "__new__") {
                setCreatingNewCategory(true);
                setPack({ ...pack, category: "" });
              } else {
                setCreatingNewCategory(false);
                setPack({ ...pack, category: e.target.value });
              }
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id || cat.name} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
            <MenuItem value="__new__">Créer une nouvelle catégorie</MenuItem>
          </Select>
          {errors.category && (
            <Typography color="error" variant="caption">
              {errors.category}
            </Typography>
          )}
        </FormControl>

        {creatingNewCategory && (
          <TextField
            fullWidth
            label="Nouvelle catégorie"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            margin="normal"
            required
            error={Boolean(errors.newCategory)}
            helperText={errors.newCategory}
          />
        )}

        <FormControl
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.navCategory)}
        >
          <InputLabel>Groupe de menu</InputLabel>
          <Select
            value={pack.navCategory}
            label="Groupe de menu"
            onChange={(e) => setPack({ ...pack, navCategory: e.target.value })}
          >
            <MenuItem value="la-table">La table</MenuItem>
            <MenuItem value="le-mobilier">Le Mobilier</MenuItem>
            <MenuItem value="tentes">Tentes</MenuItem>
            <MenuItem value="decorations">Décorations</MenuItem>
            <MenuItem value="autres-produits">Autres produits</MenuItem>
          </Select>
          {errors.navCategory && (
            <Typography color="error" variant="caption">
              {errors.navCategory}
            </Typography>
          )}
        </FormControl>

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
                  <TableCell align="right">Prix</TableCell>
                  <TableCell align="right">Quantité</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pack.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.imageUrl ? (
                        <Avatar
                          src={product.imageUrl}
                          alt={product.title || "Produit"}
                          sx={{ width: 40, height: 40 }}
                        />
                      ) : (
                        <Avatar sx={{ width: 40, height: 40 }}>?</Avatar>
                      )}
                    </TableCell>
                    <TableCell>{product.title || "Sans titre"}</TableCell>
                    <TableCell align="right">
                      {(product.price || 0).toFixed(2)}€
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        value={product.quantity || 1}
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
