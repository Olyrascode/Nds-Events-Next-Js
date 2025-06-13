import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { createCategory } from "../../../services/categories.service";

export default function CreateCategoryDialog({
  open,
  onClose,
  onCategoryCreated,
}) {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError("Le nom de la catégorie est requis");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newCategory = await createCategory({
        name: categoryName.trim(),
      });

      // Informer le parent que la catégorie a été créée
      onCategoryCreated(newCategory);

      // Réinitialiser et fermer
      setCategoryName("");
      onClose();
    } catch (error) {
      setError(error.message || "Erreur lors de la création de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setCategoryName("");
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la catégorie"
            type="text"
            fullWidth
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            disabled={loading}
            placeholder="Ex: Éclairage, Chauffage, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !categoryName.trim()}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Création..." : "Créer"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
