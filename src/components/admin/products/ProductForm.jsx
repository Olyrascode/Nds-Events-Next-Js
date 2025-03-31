import { useState, useEffect } from "react";
import OptionsManager from "./OptionsManager";
import ImageUpload from "../common/ImageUpload/ImageUpload";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";

export default function ProductForm({
  initialData = {},
  onSubmit,
  submitLabel = "Créer le produit",
  loading = false,
}) {
  const [product, setProduct] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    price: initialData.price || "",
    minQuantity: initialData.minQuantity || "",
    stock: initialData.stock || "",
    // Pour la catégorie détaillée (ex. "Tables", "Chaises", etc.)
    category: initialData.category || "",
    // Pour le groupe de menu (ex. "la-table", "mobilier", etc.)
    navCategory: initialData.navCategory || "",
    lotSize: initialData.lotSize || "",
    image: null,
    carouselImages: initialData.carouselImages || Array(3).fill(null),
    options: initialData.options || [],
    deliveryMandatory: initialData.deliveryMandatory || false,
    seo: {
      title: (initialData.seo && initialData.seo.title) || "",
      metaDescription:
        (initialData.seo && initialData.seo.metaDescription) || "",
    },
  });
  const [error, setError] = useState("");

  // Liste des catégories existantes récupérées depuis l'API
  const [categories, setCategories] = useState([]);
  // État pour savoir si on crée une nouvelle catégorie
  const [creatingNewCategory, setCreatingNewCategory] = useState(false);
  // Valeur saisie pour la nouvelle catégorie
  const [newCategory, setNewCategory] = useState("");

  // Chargement des catégories existantes au montage du composant
  useEffect(() => {
    fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "https://82.29.170.25"
      }/api/categories`
    )
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) =>
        console.error("Erreur lors du fetch des catégories:", err)
      );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Détermine la catégorie à enregistrer :
    // Si l'utilisateur a choisi de créer une nouvelle catégorie,
    // on utilisera la valeur saisie dans newCategory.
    const finalCategory = creatingNewCategory ? newCategory : product.category;

    const productToSubmit = {
      ...product,
      category: finalCategory,
    };

    try {
      await onSubmit(productToSubmit);
      // Optionnel : si on vient de créer une nouvelle catégorie, l'ajouter dans la liste (et l'envoyer au backend)
      if (creatingNewCategory && newCategory) {
        fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "https://82.29.170.25"
          }/api/categories`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newCategory }),
          }
        )
          .then((res) => res.json())
          .then((cat) => {
            setCategories((prev) => [...prev, cat]);
          })
          .catch((err) => console.error(err));
      }

      // Réinitialisation du formulaire avec carouselImages
      setProduct({
        title: "",
        description: "",
        price: "",
        minQuantity: "",
        stock: "",
        category: "",
        navCategory: "",
        lotSize: "",
        image: null,
        carouselImages: Array(3).fill(null), // Réinitialisation explicite
        options: [],
        deliveryMandatory: false,
        seo: {
          title: "",
          metaDescription: "",
        },
      });
      setNewCategory("");
      setCreatingNewCategory(false);
    } catch (error) {
      setError(error.message || "Erreur lors de la création du produit");
    }
  };

  const handleImageChange = (file) => {
    setProduct({ ...product, image: file });
  };
  // Ajouter cette fonction pour gérer les images du carrousel
  const handleCarouselImageChange = (file, index) => {
    setProduct((prev) => {
      const newCarouselImages = [...prev.carouselImages];
      if (file === null) {
        // Si file est null, on supprime l'image à cet index
        newCarouselImages[index] = null;
      } else {
        // Sinon, on met à jour l'image à cet index
        newCarouselImages[index] = file;
      }
      return { ...prev, carouselImages: newCarouselImages };
    });
  };

  const handleOptionsChange = (newOptions) => {
    setProduct({ ...product, options: newOptions });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Exemple de champs pour le titre et la description */}
      <ImageUpload
        onChange={handleImageChange}
        currentImage={initialData.imageUrl}
      />
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 2,
          flexDirection: { xs: "column", sm: "row" }, // En colonne sur mobile, en ligne sur desktop
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              width: { xs: "100%", sm: "auto" }, // Pleine largeur sur mobile
            }}
          >
            <ImageUpload
              onChange={(file) => handleCarouselImageChange(file, index)}
              currentImage={product.carouselImages?.[index]?.url || null}
              label={`Image ${index + 1} du carrousel`}
              onDelete={() => handleCarouselImageChange(null, index)}
              isCarousel={true}
            />
          </Box>
        ))}
      </Box>
      <TextField
        fullWidth
        label="Titre"
        value={product.title}
        onChange={(e) => setProduct({ ...product, title: e.target.value })}
        margin="normal"
        required
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Description"
        value={product.description}
        onChange={(e) =>
          setProduct({ ...product, description: e.target.value })
        }
        margin="normal"
        multiline
        rows={4}
        required
        disabled={loading}
      />

      {/* … autres champs (prix, stock, etc.) … */}
      <TextField
        fullWidth
        label="Prix par jours"
        type="number"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        margin="normal"
        required
        inputProps={{ min: 0, step: "0.01" }}
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Quantité minimum par location"
        type="number"
        value={product.minQuantity}
        onChange={(e) =>
          setProduct({ ...product, minQuantity: e.target.value })
        }
        margin="normal"
        required
        inputProps={{ min: 1 }}
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Quantité par lot (optionnel)"
        type="number"
        value={product.lotSize || ""}
        onChange={(e) => setProduct({ ...product, lotSize: e.target.value })}
        margin="normal"
        inputProps={{ min: 1 }}
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Stock disponible"
        type="number"
        value={product.stock}
        onChange={(e) => setProduct({ ...product, stock: e.target.value })}
        margin="normal"
        required
        inputProps={{ min: 0 }}
        disabled={loading}
      />

      {/* Champ pour choisir la catégorie détaillée */}
      <FormControl fullWidth margin="normal" required disabled={loading}>
        <InputLabel>Catégorie du produit</InputLabel>
        <Select
          value={creatingNewCategory ? "__new__" : product.category}
          label="Catégorie du produit"
          onChange={(e) => {
            if (e.target.value === "__new__") {
              // On passe en mode création d'une nouvelle catégorie
              setCreatingNewCategory(true);
              setProduct({ ...product, category: "" });
            } else {
              setCreatingNewCategory(false);
              setProduct({ ...product, category: e.target.value });
            }
          }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat.name}>
              {cat.name}
            </MenuItem>
          ))}
          <MenuItem value="__new__">Créer une nouvelle catégorie</MenuItem>
        </Select>
      </FormControl>

      {/* Afficher le champ de saisie pour la nouvelle catégorie si besoin */}
      {creatingNewCategory && (
        <TextField
          fullWidth
          label="Nouvelle catégorie"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          margin="normal"
          required
          disabled={loading}
        />
      )}

      {/* Champ pour choisir le groupe de menu (options fixes) */}
      <FormControl fullWidth margin="normal" required disabled={loading}>
        <InputLabel>Groupe de menu</InputLabel>
        <Select
          value={product.navCategory}
          label="Groupe de menu"
          onChange={(e) =>
            setProduct({ ...product, navCategory: e.target.value })
          }
        >
          <MenuItem value="la-table">La table</MenuItem>
          <MenuItem value="le-mobilier">Le Mobilier</MenuItem>
          <MenuItem value="tentes">Tentes</MenuItem>
          <MenuItem value="decorations">Décorations</MenuItem>
          <MenuItem value="autres-produits">Autres produits</MenuItem>
        </Select>
      </FormControl>

      <OptionsManager
        options={product.options}
        onChange={handleOptionsChange}
        disabled={loading}
      />

      {/* Nouvelle case pour Livraison obligatoire */}
      <FormControlLabel
        control={
          <Checkbox
            checked={product.deliveryMandatory}
            onChange={(e) =>
              setProduct({ ...product, deliveryMandatory: e.target.checked })
            }
            disabled={loading}
          />
        }
        label="Livraison obligatoire"
        sx={{ mt: 2 }}
      />

      {/* Champs SEO */}
      <Box sx={{ mt: 3, mb: 2 }}>
        <TextField
          fullWidth
          label="SEO Title"
          value={product.seo.title}
          onChange={(e) =>
            setProduct({
              ...product,
              seo: { ...product.seo, title: e.target.value },
            })
          }
          margin="normal"
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Meta Description"
          value={product.seo.metaDescription}
          onChange={(e) =>
            setProduct({
              ...product,
              seo: { ...product.seo, metaDescription: e.target.value },
            })
          }
          margin="normal"
          multiline
          rows={2}
          disabled={loading}
        />
      </Box>

      {/* Bouton de soumission */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : submitLabel}
      </Button>
    </Box>
  );
}
