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
  Autocomplete,
} from "@mui/material";

// Options pour les catégories de navigation
const NAV_CATEGORIES_OPTIONS = [
  { slug: "la-table", name: "La Table" },
  { slug: "le-mobilier", name: "Le Mobilier" },
  { slug: "decorations", name: "Décorations" },
  { slug: "autres-produits", name: "Autres Produits" },
  { slug: "tentes", name: "Tentes" },
  // TODO: S'assurer que cette liste est exhaustive et correcte
];

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
    associations: initialData.associations || [],
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

  // États pour la gestion d'une nouvelle association
  const [currentCategoryName, setCurrentCategoryName] = useState("");
  const [currentCategoryInputValue, setCurrentCategoryInputValue] =
    useState(""); // Pour la saisie libre dans Autocomplete
  const [currentNavCategorySlug, setCurrentNavCategorySlug] = useState("");

  // Liste des catégories existantes récupérées depuis l'API
  const [categories, setCategories] = useState([]);

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

    const productToSubmit = {
      ...product,
    };

    try {
      await onSubmit(productToSubmit);
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

  const handleAddAssociation = () => {
    if (!currentCategoryName.trim() || !currentNavCategorySlug) {
      // Optionnel: Afficher une erreur à l'utilisateur
      console.warn(
        "Veuillez sélectionner une catégorie et une catégorie de navigation."
      );
      return;
    }
    const newAssociation = {
      categoryName: currentCategoryName.trim(),
      navCategorySlug: currentNavCategorySlug,
    };

    // Vérifier si l'association existe déjà
    const associationExists = product.associations.some(
      (assoc) =>
        assoc.categoryName === newAssociation.categoryName &&
        assoc.navCategorySlug === newAssociation.navCategorySlug
    );

    if (associationExists) {
      // Optionnel: Afficher une erreur à l'utilisateur
      console.warn("Cette association existe déjà.");
      return;
    }

    setProduct((prevProduct) => ({
      ...prevProduct,
      associations: [...prevProduct.associations, newAssociation],
    }));

    // Réinitialiser les champs
    setCurrentCategoryName("");
    setCurrentCategoryInputValue("");
    setCurrentNavCategorySlug("");
  };

  const handleRemoveAssociation = (indexToRemove) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      associations: prevProduct.associations.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
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

      {/* Le champ SKU suivant va être supprimé
      <TextField
        fullWidth
        label="Référence / SKU (optionnel)"
        value={product.stock} 
        onChange={(e) => setProduct({ ...product, stock: e.target.value })}
        margin="normal"
        disabled={loading}
      />
      */}

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
        label="Livraison obligatoire pour ce produit"
        disabled={loading}
      />

      {/* Gestion des Associations Catégorie/Navigation */}
      <Box
        sx={{
          mt: 2,
          mb: 2,
          p: 2,
          border: "1px solid grey",
          borderRadius: "4px",
        }}
      >
        <h3>Associations Catégorie / Catégorie de Navigation</h3>
        {product.associations.map((assoc, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              p: 1,
              border: "1px dashed #ccc",
              borderRadius: "4px",
            }}
          >
            <span>
              {assoc.categoryName} (
              {
                NAV_CATEGORIES_OPTIONS.find(
                  (opt) => opt.slug === assoc.navCategorySlug
                )?.name
              }
              )
            </span>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleRemoveAssociation(index)}
              disabled={loading}
            >
              Supprimer
            </Button>
          </Box>
        ))}

        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end", mt: 2 }}>
          <Autocomplete
            freeSolo
            options={categories.map((cat) => cat.name)} // Supposant que l'API retourne {id, name} ou similaire
            value={currentCategoryName}
            inputValue={currentCategoryInputValue}
            onInputChange={(event, newInputValue) => {
              setCurrentCategoryInputValue(newInputValue);
            }}
            onChange={(event, newValue) => {
              setCurrentCategoryName(newValue || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nom de la catégorie (sous-catégorie)"
                variant="outlined"
                sx={{ flexGrow: 1 }}
                disabled={loading}
              />
            )}
            sx={{ flexGrow: 1 }}
          />

          <FormControl sx={{ minWidth: 200, flexGrow: 1 }}>
            <InputLabel id="nav-category-select-label">
              Catégorie de Navigation Principale
            </InputLabel>
            <Select
              labelId="nav-category-select-label"
              value={currentNavCategorySlug}
              label="Catégorie de Navigation Principale"
              onChange={(e) => setCurrentNavCategorySlug(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="">
                <em>Sélectionner...</em>
              </MenuItem>
              {NAV_CATEGORIES_OPTIONS.map((option) => (
                <MenuItem key={option.slug} value={option.slug}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          onClick={handleAddAssociation}
          sx={{ mt: 1 }}
          disabled={
            loading || !currentCategoryName.trim() || !currentNavCategorySlug
          }
        >
          Ajouter l'association
        </Button>
      </Box>

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
