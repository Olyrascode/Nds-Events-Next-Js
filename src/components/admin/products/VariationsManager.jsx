import { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Button,
  Grid,
  Paper,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageUpload from "../common/ImageUpload/ImageUpload";

export default function VariationsManager({
  variations,
  onChange,
  disabled = false,
}) {
  const [variationName, setVariationName] = useState("");
  const [variationPrice, setVariationPrice] = useState("");
  const [variationStock, setVariationStock] = useState("");
  const [variationImage, setVariationImage] = useState(null);

  const handleAddVariation = () => {
    if (!variationName.trim() || !variationPrice || !variationStock) {
      return;
    }

    const newVariation = {
      name: variationName.trim(),
      price: parseFloat(variationPrice),
      stock: parseInt(variationStock),
      image: variationImage,
      imageUrl: "", // Sera défini après upload
      imageFileName: "", // Sera défini après upload
    };

    onChange([...variations, newVariation]);

    // Reset form
    setVariationName("");
    setVariationPrice("");
    setVariationStock("");
    setVariationImage(null);
  };

  const handleRemoveVariation = (index) => {
    onChange(variations.filter((_, i) => i !== index));
  };

  const handleImageChange = (file) => {
    setVariationImage(file);
  };

  const handleVariationImageChange = (file, index) => {
    const updatedVariations = [...variations];
    updatedVariations[index].image = file;
    onChange(updatedVariations);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Variations du produit
      </Typography>

      {/* Affichage des variations existantes */}
      {variations.map((variation, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              {variation.name}
            </Typography>
            <IconButton
              color="error"
              onClick={() => handleRemoveVariation(index)}
              disabled={disabled}
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <ImageUpload
                onChange={(file) => handleVariationImageChange(file, index)}
                currentImage={variation.imageUrl}
                label={`Image de la variation ${variation.name}`}
                disabled={disabled}
                isSmall={true}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Prix:</strong> {variation.price.toFixed(2)} €/jour
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Stock:</strong> {variation.stock} unités
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}

      {/* Ajout d'une nouvelle variation */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Ajouter une variation
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom de la variation"
              value={variationName}
              onChange={(e) => setVariationName(e.target.value)}
              margin="normal"
              required
              disabled={disabled}
              helperText="Ex: Couleur rouge, Taille L, etc."
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Prix (€/jour)"
              type="number"
              value={variationPrice}
              onChange={(e) => setVariationPrice(e.target.value)}
              margin="normal"
              required
              disabled={disabled}
              inputProps={{ min: 0, step: "0.01" }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Stock"
              type="number"
              value={variationStock}
              onChange={(e) => setVariationStock(e.target.value)}
              margin="normal"
              required
              disabled={disabled}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ImageUpload
              onChange={handleImageChange}
              label="Image de la variation"
              disabled={disabled}
              isSmall={true}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "end" }}>
            <Button
              variant="contained"
              onClick={handleAddVariation}
              startIcon={<AddIcon />}
              disabled={
                disabled ||
                !variationName.trim() ||
                !variationPrice ||
                !variationStock
              }
              fullWidth
              sx={{ mb: 1 }}
            >
              Ajouter la variation
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {variations.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Aucune variation ajoutée. Ajoutez des variations pour offrir
          différentes options de ce produit (couleurs, tailles, styles, etc.).
        </Alert>
      )}
    </Box>
  );
}
