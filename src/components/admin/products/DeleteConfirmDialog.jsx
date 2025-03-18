import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { deleteProduct } from "../../../services/products.service";
import { deletePack } from "../../../services/packs.service";

export default function DeleteConfirmDialog({
  open,
  onClose,
  item,
  onSuccess,
  isPack,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      if (!item || !item._id) {
        setError("ID du produit manquant");
        return;
      }

      if (isPack) {
        await deletePack(item._id);
      } else {
        await deleteProduct(item._id);
      }

      onSuccess();
      onClose();
    } catch (error) {
      const itemType = isPack ? "pack" : "produit";
      setError(`Échec de la suppression du ${itemType}. Veuillez réessayer.`);
      console.error(`Erreur lors de la suppression du ${itemType}:`, error);
      if (error.response && error.response.data) {
        setError(
          error.response.data.message ||
            `Erreur inconnue lors de la suppression du ${itemType}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmer la suppression</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography>
          Êtes-vous sûr de vouloir supprimer "{item.title}" ? Cette action est
          définitive.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? "Suppression..." : "Supprimer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
