
// // EditProductDialog.jsx
// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Alert, Typography  } from '@mui/material';
// import ProductForm from './ProductForm';
// import { getProductById, updateProduct } from '../../../services/products.service';

// export default function EditProductDialog({ open, onClose, productId, onSuccess }) {
//   const [productData, setProductData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Récupérer les infos du produit depuis la base de données
//   useEffect(() => {
//     if (open && productId) {
//       console.log("EditProductDialog - productId:", productId); // <-- Debug
//       setLoading(true);
//       getProductById(productId)
//         .then((data) => {
//           console.log("Produit récupéré:", data); // <-- Debug
//           setProductData(data);
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error("Erreur lors de la récupération du produit:", err);
//           setError("Erreur lors de la récupération du produit");
//           setLoading(false);
//         });
//     }
//   }, [open, productId]);
  

//   const handleSubmit = async (formData) => {
//     try {
//       await updateProduct(productId, formData);
//       onSuccess(); // rafraîchit la liste, par exemple
    
//       onClose();   // ferme la modal
//     } catch (err) {
//       console.error("Erreur lors de la mise à jour du produit :", err);
//       setError("Erreur lors de la mise à jour du produit");
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Éditer le produit</DialogTitle>
//       <DialogContent>
//         {loading ? (
//           <CircularProgress />
//         ) : error ? (
//           <Alert severity="error">{error}</Alert>
//         ) : productData ? (
//           <ProductForm 
//             initialData={productData}
//             onSubmit={handleSubmit}
//             submitLabel="Mettre à jour le produit"
//           />
//         ) : (
//           <Typography>Aucune donnée à afficher.</Typography>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Annuler</Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// EditProductDialog.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Alert, Typography } from '@mui/material';
import ProductForm from './ProductForm';
import { getProductById, updateProduct } from '../../../services/products.service';

export default function EditProductDialog({ open, onClose, item, onSuccess }) {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lorsque la modal s'ouvre et que l'objet "item" est fourni, on récupère le produit depuis la BDD via son ID
  useEffect(() => {
    if (open && item && item._id) {
      setLoading(true);
      getProductById(item._id)
        .then((data) => {
          console.log("Produit récupéré:", data); // pour débogage
          setProductData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération du produit:", err);
          setError("Erreur lors de la récupération du produit");
          setLoading(false);
        });
    }
  }, [open, item]);

  const handleSubmit = async (formData) => {
    try {
      await updateProduct(item._id, formData);
      onSuccess(); // Par exemple, rafraîchir la liste des produits
      onClose();   // Fermer la modal
    } catch (err) {
      console.error("Erreur lors de la mise à jour du produit :", err);
      setError("Erreur lors de la mise à jour du produit");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Éditer le produit</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : productData ? (
          <ProductForm 
            initialData={productData}
            onSubmit={handleSubmit}
            submitLabel="Mettre à jour le produit"
          />
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
