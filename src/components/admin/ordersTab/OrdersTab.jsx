
import React, { useState, useEffect } from 'react';
import { generateInvoicePDF } from '../../../utils/invoiceGenerator';
import DownloadIcon from '@mui/icons-material/Download';
import { format } from 'date-fns'; // Importer 'format' depuis date-fns
import { fr } from 'date-fns/locale';
import { fetchAllOrders, deleteOrder } from '../../../services/orders.service';

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
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import OrderDetailsModal from '../calendar/OrderDetailsModal';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pour la modale
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

 
  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const ordersData = await fetchAllOrders(); // Récupère les commandes depuis MongoDB
  
      // Vérifie et convertit les dates en objets Date JavaScript
      const formattedOrders = ordersData.map(order => ({
        ...order,
        startDate: order.startDate ? new Date(order.startDate) : null,
        endDate: order.endDate ? new Date(order.endDate) : null,
      }));
  
      // Trie les commandes par date de début (du plus récent au plus ancien)
      formattedOrders.sort((a, b) => (b.startDate || 0) - (a.startDate || 0));
  
      setOrders(formattedOrders);
    } catch (err) {
      console.error('Erreur lors de la récupération des commandes :', err);
      setError("Impossible de charger les commandes.");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (!searchTerm) {
      setFilteredOrders(orders);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const newFiltered = orders.filter((order) => {
      const matchesId = order._id.toLowerCase().includes(lowerSearch);

      const firstName = order?.billingInfo?.firstName || '';
      const lastName = order?.billingInfo?.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim().toLowerCase();
      const matchesName = fullName.includes(lowerSearch);

      return matchesId || matchesName;
    });

    setFilteredOrders(newFiltered);
  };

  const handleDownloadInvoice = async (order) => {
    try {
      await generateInvoicePDF(order);
    } catch (error) {
      console.error('Erreur lors de la génération de la facture :', error);
      alert("Impossible de télécharger la facture. Veuillez réessayer.");
    }
  };

  // Demander confirmation avant de supprimer
  const handleDelete = async (orderId) => {
    if (!orderId) {
        console.error("❌ Erreur : l'ID de la commande est indéfini !");
        return;
    }

    const confirm = window.confirm("Voulez-vous vraiment supprimer cette commande ?");
    if (!confirm) return; // L'utilisateur a annulé

    try {
        await deleteOrder(orderId);

        // Met à jour immédiatement l'état des commandes sans rafraîchir la page
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));

        console.log("🟢 Commande supprimée avec succès !");
    } catch (error) {
        console.error("🔴 Erreur lors de la suppression de la commande :", error);
    }
};

  
  
  

  // Ouvrir la modale avec l'ordre sélectionné
  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Fermer la modale
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Liste des Commandes
      </Typography>

      <TextField
        label="Rechercher par ID ou Nom du client"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '16px' }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Commande</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Début</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredOrders.map((order) => {
              const firstName = order?.billingInfo?.firstName || '';
              const lastName = order?.billingInfo?.lastName || '';
              const fullName = `${firstName} ${lastName}`.trim();

              const startDate = order.startDate ? new Date(order.startDate) : null;
              const endDate = order.endDate ? new Date(order.endDate) : null;
              

              const startString = startDate
                ? format(new Date(startDate), 'PP', { locale: fr }) // Formatte la date sans l'heure
                : '';
              const endString = endDate
                ? format(new Date(endDate), 'PP', { locale: fr }) // Formatte la date sans l'heure
                : '';

              return (
                <TableRow
                  key={order._id}
                  hover
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(order)} // <= Clique sur la ligne
                >
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{fullName || '—'}</TableCell>
                  <TableCell>{startString}</TableCell>
                  <TableCell>{endString}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      color="primary"
                      onClick={() => handleDownloadInvoice(order)}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(order._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body2" align="center">
                    Aucune commande trouvée.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* La modale d'affichage des détails */}
      <OrderDetailsModal
        open={isModalOpen}
        order={selectedOrder}
        onClose={handleCloseModal}
      />
    </Box>
  );
}
