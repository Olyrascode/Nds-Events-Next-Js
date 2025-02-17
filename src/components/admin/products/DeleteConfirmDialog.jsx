import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { deleteProduct } from '../../../services/products.service';
import { deletePack } from '../../../services/packs.service';

export default function DeleteConfirmDialog({ open, onClose, item, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');
  
      // Vérifie si l'ID est défini avant de procéder à la suppression
      if (!item || !item._id) {
        setError('ID du produit manquant');
        return;
      }
  
      if (item.type === 'pack') {
        await deletePack(item._id);
      } else {
        await deleteProduct(item._id);
      }
  
      onSuccess();
      onClose(); // Ferme la fenêtre après la suppression
    } catch (error) {
      setError(`Échec de la suppression du ${item.type}. Veuillez réessayer.`);
      console.error(`Erreur lors de la suppression du ${item.type}:`, error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || `Erreur inconnue lors de la suppression du ${item.type}`);
      }
    } finally {
      setLoading(false); // Réinitialiser l'état de chargement après l'opération
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
          Etes vous sur de vouloir supprimer "{item.title}"? Cette action est definitive.
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
          {loading ? 'Deleting...' : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}