// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Box,
//   Typography,
//   Autocomplete,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Avatar,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   // Grid,
//   Divider,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ImageUpload from "../common/ImageUpload/ImageUpload";
// import CarouselImageUpload from "../common/ImageUpload/CarouselImageUpload";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from "../../../features/productSlice";
// import { slugify } from "@/utils/slugify";

// const PackForm = ({ initialData, onSubmit, submitLabel }) => {
//   const dispatch = useDispatch();
//   const products = useSelector((state) => state.products.products);
//   const [categories, setCategories] = useState([]);
//   const [creatingNewCategory, setCreatingNewCategory] = useState(false);
//   const [newCategory, setNewCategory] = useState("");

//   const [pack, setPack] = useState({
//     title: initialData?.title || "",
//     description: initialData?.description || "",
//     products: [],
//     discountPercentage: initialData?.discountPercentage || "0",
//     minRentalDays: initialData?.minRentalDays || "1",
//     minQuantity: initialData?.minQuantity || "1",
//     image: initialData?.image || null,
//     carouselImages: initialData?.carouselImages || Array(6).fill(null),
//     seo: initialData?.seo || {
//       title: "",
//       metaDescription: "",
//     },
//     category: initialData?.category || "",
//     navCategory: initialData?.navCategory || "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     dispatch(fetchProducts());
//     // Charger les catégories existantes
//     fetch(
//       `${
//         process.env.NEXT_PUBLIC_API_URL || "http://api-nds-events.fr"
//       }/api/categories`
//     )
//       .then((res) => res.json())
//       .then((data) => setCategories(data))
//       .catch((err) =>
//         console.error("Erreur lors du chargement des catégories:", err)
//       );
//   }, [dispatch]);

//   useEffect(() => {
//     if (initialData?.products && products.length > 0) {
//       const productsWithDetails = initialData.products
//         .map((packProduct) => {
//           const productDetails = products.find(
//             (p) => p._id === packProduct.product
//           );
//           if (productDetails) {
//             return {
//               ...productDetails,
//               quantity: packProduct.quantity,
//               id: productDetails._id,
//             };
//           }
//           return null;
//         })
//         .filter(Boolean);

//       setPack((prev) => ({
//         ...prev,
//         products: productsWithDetails,
//       }));
//     }
//   }, [initialData?.products, products]);

//   const handleImageChange = (file) => {
//     setPack({ ...pack, image: file });
//   };

//   const handleCarouselImageChange = (file, index) => {
//     const newCarouselImages = [...pack.carouselImages];
//     newCarouselImages[index] = file;
//     setPack({ ...pack, carouselImages: newCarouselImages });
//   };

//   const handleCarouselImageDelete = (index) => {
//     const newCarouselImages = [...pack.carouselImages];
//     newCarouselImages[index] = null;
//     setPack({ ...pack, carouselImages: newCarouselImages });
//   };

//   const handleProductSelect = (event, product) => {
//     if (!product) return;
//     if (pack.products.some((p) => p.id === product._id)) {
//       return;
//     }
//     setPack((prev) => ({
//       ...prev,
//       products: [...prev.products, { ...product, quantity: 1 }],
//     }));
//   };

//   const handleRemoveProduct = (productId) => {
//     setPack((prev) => ({
//       ...prev,
//       products: prev.products.filter((p) => p.id !== productId),
//     }));
//   };

//   const handleQuantityChange = (productId, quantity) => {
//     setPack((prev) => ({
//       ...prev,
//       products: prev.products.map((p) =>
//         p.id === productId ? { ...p, quantity: parseInt(quantity) || 1 } : p
//       ),
//     }));
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Si on crée une nouvelle catégorie, l'envoyer d'abord au backend
//       if (creatingNewCategory && newCategory) {
//         await fetch(
//           `${
//             process.env.NEXT_PUBLIC_API_URL || "http://api-nds-events.fr"
//           }/api/categories`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               name: newCategory,
//               slug: slugify(newCategory),
//             }),
//           }
//         );
//       }

//       // Déterminer la catégorie finale (existante ou nouvelle)
//       const finalCategory = creatingNewCategory ? newCategory : pack.category;

//       // Filtrer les images null du carrousel
//       const filteredCarouselImages = pack.carouselImages.filter(Boolean);

//       const packToSubmit = {
//         ...pack,
//         category: finalCategory,
//         carouselImages: filteredCarouselImages,
//       };

//       onSubmit(packToSubmit);
//     } catch (error) {
//       console.error("Error submitting pack:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box component="form" onSubmit={handleFormSubmit} sx={{ maxWidth: 800 }}>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h5" gutterBottom>
//           Image principale
//         </Typography>
//         <ImageUpload
//           onChange={handleImageChange}
//           currentImage={initialData?.imageUrl}
//           label="Image principale"
//         />
//       </Box>

//       <Divider sx={{ mb: 3 }} />

//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h5" gutterBottom color="primary">
//           Images du carrousel (jusqu'à 6)
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//           Ajoutez des images supplémentaires pour présenter votre pack sous
//           différents angles
//         </Typography>
//         <Grid container spacing={2}>
//           {Array.from({ length: 6 }).map((_, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <CarouselImageUpload
//                 onChange={(file) => handleCarouselImageChange(file, index)}
//                 currentImage={
//                   typeof pack.carouselImages[index] === "string"
//                     ? pack.carouselImages[index]
//                     : initialData?.carouselImagesUrls?.[index]
//                 }
//                 index={index}
//                 onDelete={() => handleCarouselImageDelete(index)}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       <Divider sx={{ mb: 3 }} />

//       <Typography variant="h5" gutterBottom>
//         Informations du pack
//       </Typography>

//       <TextField
//         fullWidth
//         label="Nom du pack"
//         value={pack.title}
//         onChange={(e) => setPack({ ...pack, title: e.target.value })}
//         margin="normal"
//         error={Boolean(errors.title)}
//         helperText={errors.title}
//       />

//       <TextField
//         fullWidth
//         label="Description"
//         value={pack.description}
//         onChange={(e) => setPack({ ...pack, description: e.target.value })}
//         margin="normal"
//         multiline
//         rows={4}
//         error={Boolean(errors.description)}
//         helperText={errors.description}
//       />

//       {/* Sélection de la catégorie du pack */}
//       <FormControl fullWidth margin="normal" required>
//         <InputLabel>Catégorie du pack</InputLabel>
//         <Select
//           value={creatingNewCategory ? "__new__" : pack.category || ""}
//           label="Catégorie du pack"
//           onChange={(e) => {
//             if (e.target.value === "__new__") {
//               setCreatingNewCategory(true);
//               setPack({ ...pack, category: "" });
//             } else {
//               setCreatingNewCategory(false);
//               setPack({ ...pack, category: e.target.value });
//             }
//           }}
//         >
//           {categories.map((cat) => (
//             <MenuItem key={cat._id || cat.name} value={cat.name}>
//               {cat.name}
//             </MenuItem>
//           ))}
//           <MenuItem value="__new__">Créer une nouvelle catégorie</MenuItem>
//         </Select>
//       </FormControl>
//       {creatingNewCategory && (
//         <TextField
//           fullWidth
//           label="Nouvelle catégorie"
//           value={newCategory}
//           onChange={(e) => setNewCategory(e.target.value)}
//           margin="normal"
//           required
//         />
//       )}

//       {/* Sélection du groupe de menu pour le pack */}
//       <FormControl fullWidth margin="normal" required>
//         <InputLabel>Groupe de menu</InputLabel>
//         <Select
//           value={pack.navCategory || ""}
//           label="Groupe de menu"
//           onChange={(e) => setPack({ ...pack, navCategory: e.target.value })}
//         >
//           <MenuItem value="la-table">La table</MenuItem>
//           <MenuItem value="le-mobilier">Le Mobilier</MenuItem>
//           <MenuItem value="tentes">Tentes</MenuItem>
//           <MenuItem value="decorations">Décorations</MenuItem>
//           <MenuItem value="autres-packs">Autres packs</MenuItem>
//         </Select>
//       </FormControl>

//       <Divider sx={{ my: 3 }} />

//       <Box sx={{ mt: 3, mb: 2 }}>
//         <Typography variant="h5" gutterBottom>
//           Produits inclus dans le pack
//         </Typography>

//         <Autocomplete
//           options={products}
//           getOptionLabel={(option) => option.title}
//           onChange={handleProductSelect}
//           renderOption={(props, option) => (
//             <Box
//               component="li"
//               sx={{ display: "flex", alignItems: "center", gap: 2 }}
//               {...props}
//               key={option._id}
//             >
//               {option.imageUrl && (
//                 <Avatar src={option.imageUrl} alt={option.title} />
//               )}
//               <Typography>{option.title}</Typography>
//             </Box>
//           )}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               label="Rechercher des produits"
//               variant="outlined"
//               fullWidth
//             />
//           )}
//         />
//       </Box>

//       {pack.products.length > 0 && (
//         <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Image</TableCell>
//                 <TableCell>Produit</TableCell>
//                 <TableCell>Catégorie</TableCell>
//                 <TableCell align="right">Prix/Jour</TableCell>
//                 <TableCell align="right">Quantité</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {pack.products.map((product) => (
//                 <TableRow key={product.id}>
//                   <TableCell>
//                     {product.imageUrl && (
//                       <Avatar
//                         src={product.imageUrl}
//                         alt={product.title}
//                         sx={{ width: 40, height: 40 }}
//                       />
//                     )}
//                   </TableCell>
//                   <TableCell>{product.title}</TableCell>
//                   <TableCell>{product.category}</TableCell>
//                   <TableCell align="right">${product.price}</TableCell>
//                   <TableCell align="right">
//                     <TextField
//                       type="number"
//                       value={product.quantity}
//                       onChange={(e) =>
//                         handleQuantityChange(product.id, e.target.value)
//                       }
//                       inputProps={{ min: 1 }}
//                       size="small"
//                       sx={{ width: 80 }}
//                     />
//                   </TableCell>
//                   <TableCell align="right">
//                     <IconButton
//                       color="error"
//                       onClick={() => handleRemoveProduct(product.id)}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       <Divider sx={{ my: 3 }} />

//       <Typography variant="h5" gutterBottom>
//         Paramètres du pack
//       </Typography>

//       <TextField
//         fullWidth
//         label="Pourcentage de réduction"
//         type="number"
//         value={pack.discountPercentage}
//         onChange={(e) =>
//           setPack({ ...pack, discountPercentage: e.target.value })
//         }
//         margin="normal"
//         inputProps={{ min: 0, max: 100 }}
//       />

//       <TextField
//         fullWidth
//         label="Quantité minimum par location"
//         type="number"
//         value={pack.minQuantity}
//         onChange={(e) => setPack({ ...pack, minQuantity: e.target.value })}
//         margin="normal"
//         inputProps={{ min: 1 }}
//       />

//       <TextField
//         fullWidth
//         label="Nombre minimum de jours de location"
//         type="number"
//         value={pack.minRentalDays}
//         onChange={(e) => setPack({ ...pack, minRentalDays: e.target.value })}
//         margin="normal"
//         inputProps={{ min: 1 }}
//       />

//       <Divider sx={{ my: 3 }} />

//       <Typography variant="h5" gutterBottom>
//         Référencement SEO
//       </Typography>

//       <TextField
//         fullWidth
//         label="SEO Title"
//         value={pack.seo?.title || ""}
//         onChange={(e) =>
//           setPack({
//             ...pack,
//             seo: { ...pack.seo, title: e.target.value },
//           })
//         }
//         margin="normal"
//       />

//       <TextField
//         fullWidth
//         label="SEO Meta Description"
//         value={pack.seo?.metaDescription || ""}
//         onChange={(e) =>
//           setPack({
//             ...pack,
//             seo: { ...pack.seo, metaDescription: e.target.value },
//           })
//         }
//         margin="normal"
//         multiline
//         rows={2}
//       />

//       <Button
//         type="submit"
//         variant="contained"
//         fullWidth
//         sx={{ mt: 4, mb: 2, py: 1.5 }}
//         disabled={loading}
//       >
//         {submitLabel}
//       </Button>
//     </Box>
//   );
// };

// export default PackForm;
