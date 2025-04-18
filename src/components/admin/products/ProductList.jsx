"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Tab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchProducts } from "../../../features/productSlice";
import { fetchPacks } from "@/services/packs.service";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import EditProductDialog from "./EditProductDialog";
import { formatCurrency } from "../../../utils/formatters";

// Ajout de la constante pour l'URL de l'API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// Fonction utilitaire pour corriger les URLs d'images
const fixImageUrl = (url) => {
  if (!url) return ""; // Retourner une chaîne vide si l'URL est manquante
  return url.replace("http://localhost:5000", API_URL);
};

export default function ProductList() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0: Produits individuels, 1: Packs

  // State local pour les packs
  const [packs, setPacks] = useState([]);
  const [packsLoading, setPacksLoading] = useState(false);
  const [packsError, setPacksError] = useState(null);

  useEffect(() => {
    // Charge les produits depuis Redux
    dispatch(fetchProducts());
  }, [dispatch]);

  // useEffect pour charger les packs lorsque l'onglet 1 est sélectionné
  useEffect(() => {
    if (tabValue === 1) {
      setPacksLoading(true);
      fetchPacks()
        .then((data) => {
          setPacks(data);
          setPacksLoading(false);
        })
        .catch((err) => {
          setPacksError(err.message || "Erreur lors du fetch des packs");
          setPacksLoading(false);
        });
    }
  }, [tabValue]);

  // Filtrer les produits en fonction du terme de recherche
  const filteredItems = products.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Séparer les produits individuels
  const productsList = filteredItems.filter(
    (item) => !item.type || item.type !== "pack"
  );

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (item) => {
    if (!item._id) {
      console.error("Produit ID est manquant :", item);
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
        style={{ marginBottom: "16px" }}
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
                        src={fixImageUrl(item.imageUrl)}
                        alt={item.title}
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.price)}
                  </TableCell>
                  <TableCell align="right">{item.stock || "N/A"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(item)}
                    >
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
        <>
          {packsLoading ? (
            <CircularProgress />
          ) : packsError ? (
            <Alert severity="error">{packsError}</Alert>
          ) : (
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
                  {packs.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        {item.imageUrl && (
                          <img
                            src={fixImageUrl(item.imageUrl)}
                            alt={item.title}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell align="right">{item.stock || "N/A"}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(item)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      <EditProductDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        item={selectedItem}
        isPack={tabValue === 1}
        onSuccess={() => {
          if (tabValue === 0) {
            dispatch(fetchProducts());
          } else {
            // Rafraîchir la liste des packs
            setPacksLoading(true);
            fetchPacks()
              .then((data) => {
                setPacks(data);
                setPacksLoading(false);
              })
              .catch((err) => {
                setPacksError(err.message || "Erreur lors du fetch des packs");
                setPacksLoading(false);
              });
          }
        }}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        item={selectedItem}
        isPack={tabValue === 1}
        onSuccess={() => {
          if (tabValue === 0) {
            dispatch(fetchProducts());
          } else {
            setPacksLoading(true);
            fetchPacks()
              .then((data) => {
                setPacks(data);
                setPacksLoading(false);
              })
              .catch((err) => {
                setPacksError(err.message || "Erreur lors du fetch des packs");
                setPacksLoading(false);
              });
          }
        }}
      />
    </Box>
  );
}
