
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Typography,
//   Box,
//   Chip,
//   CircularProgress,
//   Alert,
//   TextField
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { fetchProducts } from '../../../features/productSlice';
// import DeleteConfirmDialog from './DeleteConfirmDialog';
// import EditProductDialog from './EditProductDialog';
// import { formatCurrency } from '../../../utils/formatters';

// export default function ProductList() {
//   const dispatch = useDispatch();
//   const { products, loading, error } = useSelector((state) => state.products);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

//   useEffect(() => {
//     dispatch(fetchProducts()); // Charge les produits depuis Redux
//   }, [dispatch]);

//   const filteredItems = products.filter((item) =>
//     item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.category?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleEditClick = (item) => {
//     setSelectedItem(item);
//     setIsEditDialogOpen(true);
//   };

//   const handleDeleteClick = (item) => {
//     if (!item._id) {
//       console.error('Produit ID est manquant :', item);
//       return;
//     }
//     setSelectedItem(item);
//     setIsDeleteDialogOpen(true);
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Alert severity="error">{error}</Alert>;

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom>
//         Liste des Produits
//       </Typography>

//       <TextField
//         label="Rechercher un produit"
//         variant="outlined"
//         size="small"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         fullWidth
//         style={{ marginBottom: '16px' }}
//       />

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Image</TableCell>
//               <TableCell>Nom</TableCell>
//               <TableCell>Catégorie</TableCell>
//               <TableCell align="right">Prix</TableCell>
//               <TableCell align="right">Stock</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredItems.map((item) => (
//               <TableRow key={item._id}>
//                 <TableCell>
//                   {item.imageUrl && (
//                     <img
//                       src={item.imageUrl}
//                       alt={item.title}
//                       style={{ width: 50, height: 50, objectFit: 'cover' }}
//                     />
//                   )}
//                 </TableCell>
//                 <TableCell>{item.title}</TableCell>
//                 <TableCell>{item.category}</TableCell>
//                 <TableCell align="right">{formatCurrency(item.price)}</TableCell>
//                 <TableCell align="right">{item.stock || 'N/A'}</TableCell>
//                 <TableCell align="right">
//                   <IconButton color="primary" onClick={() => handleEditClick(item)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton color="error" onClick={() => handleDeleteClick(item)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* <EditProductDialog
//         open={isEditDialogOpen}
//         onClose={() => setIsEditDialogOpen(false)}
//         item={selectedItem}
//       /> */}
//       <EditProductDialog
//   open={isEditDialogOpen}
//   onClose={() => setIsEditDialogOpen(false)}
//   item={selectedItem}
//   onSuccess={() => dispatch(fetchProducts())}
// />


//       <DeleteConfirmDialog
//         open={isDeleteDialogOpen}
//         onClose={() => setIsDeleteDialogOpen(false)}
//         item={selectedItem}
//         onSuccess={() => dispatch(fetchProducts())}  
//       />
//     </Box>
//   );
// }
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchProducts } from '../../../features/productSlice';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import EditProductDialog from './EditProductDialog';
import { formatCurrency } from '../../../utils/formatters';

export default function ProductList() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0: Produits individuels, 1: Packs

  useEffect(() => {
    dispatch(fetchProducts()); // Charge les produits depuis Redux
  }, [dispatch]);

  // Filtrer les produits en fonction du terme de recherche
  const filteredItems = products.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Séparer les produits individuels et les packs
  const productsList = filteredItems.filter(item => !item.type || item.type !== 'pack');
  const packsList = filteredItems.filter(item => item.type === 'pack');

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (item) => {
    if (!item._id) {
      console.error('Produit ID est manquant :', item);
      return;
    }
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Liste des Produits
      </Typography>

      <TextField
        label="Rechercher un produit"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        style={{ marginBottom: '16px' }}
      />

      {/* Onglets pour basculer entre Produits individuels et Packs */}
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="Produits individuels" />
        <Tab label="Packs de produits" />
      </Tabs>

      {tabValue === 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell align="right">Prix</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsList.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                  <TableCell align="right">{item.stock || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleEditClick(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(item)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell align="right">Prix</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packsList.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                  <TableCell align="right">{item.stock || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleEditClick(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(item)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <EditProductDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        item={selectedItem}
        onSuccess={() => dispatch(fetchProducts())}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        item={selectedItem}
        onSuccess={() => dispatch(fetchProducts())}
      />
    </Box>
  );
}
