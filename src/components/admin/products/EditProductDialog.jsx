// import { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Box,
//   Typography,
//   IconButton,
//   Chip,
//   Alert
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { updateProduct } from '../../../services/products.service';

// export default function EditProductDialog({ open, onClose, product, onSuccess }) {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     price: '',
//     minQuantity: '',
//     stock: '',
//     category: '',
//     options: []
//   });
//   const [newOption, setNewOption] = useState({ name: '', values: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (product) {
//       setFormData({
//         ...product,
//         options: product.options || []
//       });
//     }
//   }, [product]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       await updateProduct(product.id, formData);
//       onSuccess();
//     } catch (err) {
//       setError(err.message || 'Failed to update product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddOption = () => {
//     if (newOption.name && newOption.values) {
//       setFormData(prev => ({
//         ...prev,
//         options: [...prev.options, {
//           name: newOption.name,
//           values: newOption.values.split(',').map(v => v.trim())
//         }]
//       }));
//       setNewOption({ name: '', values: '' });
//     }
//   };

//   const handleRemoveOption = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       options: prev.options.filter((_, i) => i !== index)
//     }));
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Editer le produit</DialogTitle>
//       <DialogContent>
//         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//           {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//           <TextField
//             fullWidth
//             label="Title"
//             value={formData.title}
//             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//             margin="normal"
//             required
//           />

//           <TextField
//             fullWidth
//             label="Description"
//             value={formData.description}
//             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//             margin="normal"
//             multiline
//             rows={4}
//             required
//           />

//           <TextField
//             fullWidth
//             label="Price per Day"
//             type="number"
//             value={formData.price}
//             onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//             margin="normal"
//             required
//             inputProps={{ min: 0, step: "0.01" }}
//           />

//           <FormControl fullWidth margin="normal" required>
//             <InputLabel>Categorie</InputLabel>
//             <Select
//               value={formData.category}
//               label="Category"
//               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//             >
//               <MenuItem value="chairs">Chaise</MenuItem>
//               <MenuItem value="tables">Tables</MenuItem>
//               <MenuItem value="utensils">Utensils</MenuItem>
//               <MenuItem value="decorations">Decorations</MenuItem>
//             </Select>
//           </FormControl>

//           <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Option produit</Typography>
          
//           <Box sx={{ mb: 2 }}>
//             {formData.options.map((option, index) => (
//               <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                 <Chip 
//                   label={`${option.name}: ${option.values.join(', ')}`}
//                   onDelete={() => handleRemoveOption(index)}
//                   sx={{ mr: 1 }}
//                 />
//               </Box>
//             ))}
//           </Box>

//           <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
//             <TextField
//               label="Option Name"
//               value={newOption.name}
//               onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
//               size="small"
//             />
//             <TextField
//               label="Values (comma-separated)"
//               value={newOption.values}
//               onChange={(e) => setNewOption({ ...newOption, values: e.target.value })}
//               size="small"
//               sx={{ flex: 1 }}
//             />
//             <IconButton onClick={handleAddOption} color="primary">
//               <AddIcon />
//             </IconButton>
//           </Box>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Annuler</Button>
//         <Button 
//           onClick={handleSubmit} 
//           variant="contained" 
//           disabled={loading}
//         >
//           {loading ? 'Updating...' : 'Update Product'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// EditProductDialog.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ProductForm from './ProductForm';
import { updateProduct } from '../../../services/products.service';

export default function EditProductDialog({ open, onClose, product, onSuccess }) {
  // Fonction qui sera appelée lors de la soumission du formulaire d'édition
  const handleSubmit = async (formData) => {
    try {
      // On utilise l'id du produit pour effectuer la mise à jour
      await updateProduct(product.id || product._id, formData);
      onSuccess(); // Par exemple, pour rafraîchir la liste des produits
      onClose();   // Ferme la modale
    } catch (err) {
      // Tu peux aussi gérer l'erreur ici ou la remonter dans ProductForm via une prop
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Éditer le produit</DialogTitle>
      <DialogContent>
        {/* Réutilisation du ProductForm avec les données initiales */}

        
        <ProductForm 
          initialData={product}
          onSubmit={handleSubmit}
          submitLabel="Mettre à jour le produit"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
}
