import React, { useState, useEffect } from "react";
import { generateInvoicePDF } from "../../../utils/invoiceGenerator";
import DownloadIcon from "@mui/icons-material/Download";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  fetchAllOrders,
  fetchCancelledOrders, // ✅ Ajout de la fonction pour récupérer les commandes rejetées
  deleteOrder,
  deleteCancelledOrder,
  updateOrderStatus,
} from "../../../services/orders.service";

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
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import OrderDetailsModal from "../calendar/OrderDetailsModal";

// ✅ Fonction utilitaire pour traduire le mode de paiement
const getPaymentMethodLabel = (method) => {
  switch (method) {
    case "card":
      return "Carte bancaire";
    case "virement":
      return "Virement";
    case "cheques":
      return "Chèques";
    case "especes":
      return "Espèces";
    default:
      return method;
  }
};

export default function OrdersTab() {
  // États pour commandes actives et rejetées
  const [activeOrders, setActiveOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [tabValue, setTabValue] = useState(0); // 0: actives, 1: rejetées

  useEffect(() => {
    loadActiveOrders();
    loadCancelledOrders();
  }, []);

  useEffect(() => {
    // On peut également appliquer le filtrage local ici si souhaité
  }, [activeOrders, cancelledOrders, searchTerm]);

  const loadActiveOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const ordersData = await fetchAllOrders();
      const formatted = ordersData
        .map((order) => ({
          ...order,
          startDate: order.startDate ? new Date(order.startDate) : null,
          endDate: order.endDate ? new Date(order.endDate) : null,
        }))
        .sort((a, b) => (b.startDate || 0) - (a.startDate || 0));
      setActiveOrders(formatted);
    } catch (err) {
      console.error("Erreur récupération commandes actives:", err);
      setError("Impossible de charger les commandes actives.");
    } finally {
      setLoading(false);
    }
  };

  const loadCancelledOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const ordersData = await fetchCancelledOrders();
      const formatted = ordersData
        .map((order) => ({
          ...order,
          startDate: order.startDate ? new Date(order.startDate) : null,
          endDate: order.endDate ? new Date(order.endDate) : null,
        }))
        .sort((a, b) => (b.cancelledAt || 0) - (a.cancelledAt || 0));
      setCancelledOrders(formatted);
    } catch (err) {
      console.error("Erreur récupération commandes rejetées:", err);
      setError("Impossible de charger les commandes rejetées.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrage des commandes selon le champ de recherche
  const filterOrders = (orders) => {
    if (!searchTerm) return orders;
    const lowerSearch = searchTerm.toLowerCase();
    return orders.filter((order) => {
      const matchesId = order._id.toLowerCase().includes(lowerSearch);
      const firstName = order?.billingInfo?.firstName || "";
      const lastName = order?.billingInfo?.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim().toLowerCase();
      return matchesId || fullName.includes(lowerSearch);
    });
  };

  const handleDownloadInvoice = async (order) => {
    try {
      await generateInvoicePDF(order);
    } catch (error) {
      console.error("Erreur génération facture:", error);
      alert("Impossible de télécharger la facture.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Validated":
        return { backgroundColor: "green", color: "#fff" };
      case "Pending":
        return { backgroundColor: "orange", color: "#fff" };
      case "Rejected":
        return { backgroundColor: "red", color: "#fff" };
      default:
        return {};
    }
  };

  // const handleDelete = async (orderId) => {
  //   if (!orderId) return;
  //   const confirmed = window.confirm("Voulez-vous vraiment supprimer cette commande ?");
  //   if (!confirmed) return;
  //   try {
  //     await deleteOrder(orderId);
  //     // Supprimer la commande de la liste active et rejetée, le cas échéant
  //     setActiveOrders(prev => prev.filter(order => order._id !== orderId));

  //     setCancelledOrders(prev => prev.filter(order => order._id !== orderId));
  //     console.log("🟢 Commande supprimée avec succès !");
  //   } catch (error) {
  //     console.error("🔴 Erreur suppression commande:", error);
  //   }
  // };
  const handleDelete = async (orderId) => {
    if (!orderId) return;
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette commande ?"
    );
    if (!confirmed) return;
    try {
      if (tabValue === 0) {
        // Suppression d'une commande active
        await deleteOrder(orderId);
        setActiveOrders((prev) =>
          prev.filter((order) => order._id !== orderId)
        );
      } else {
        // Suppression d'une commande rejetée
        await deleteCancelledOrder(orderId);
        setCancelledOrders((prev) =>
          prev.filter((order) => order._id !== orderId)
        );
      }
      console.log("🟢 Commande supprimée avec succès !");
    } catch (error) {
      console.error("🔴 Erreur suppression commande:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // Pour les commandes actives, si "Rejected", demander confirmation
    if (tabValue === 0) {
      const order = activeOrders.find((o) => o._id === orderId);
      if (newStatus === "Rejected" && order.orderStatus !== "Rejected") {
        const confirmed = window.confirm(
          "Êtes-vous sûr de refuser la commande ? Une commande refusée sera déplacée et le stock sera réintégré."
        );
        if (!confirmed) return;
      }
    }
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      if (newStatus === "Rejected") {
        // Pour une commande active rejetée, retirer de la liste active et rafraîchir les commandes rejetées
        setActiveOrders((prev) => prev.filter((o) => o._id !== orderId));
        loadCancelledOrders();
      } else {
        setActiveOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? { ...o, orderStatus: updatedOrder.orderStatus }
              : o
          )
        );
      }
      setEditingOrderId(null);
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
      alert("Échec de la mise à jour du statut.");
    }
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  // Sélectionner la liste à afficher en fonction de l'onglet actif
  const ordersToDisplay =
    tabValue === 0 ? filterOrders(activeOrders) : filterOrders(cancelledOrders);

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
        style={{ marginBottom: "16px" }}
      />

      {/* Onglets pour basculer entre commandes actives et rejetées */}
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="Commandes actives" />
        <Tab label="Commandes rejetées" />
      </Tabs>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Commande</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Début</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Mode de paiement</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersToDisplay.map((order) => {
              const firstName = order?.billingInfo?.firstName || "";
              const lastName = order?.billingInfo?.lastName || "";
              const fullName = `${firstName} ${lastName}`.trim();
              const startDate = order.startDate
                ? new Date(order.startDate)
                : null;
              const endDate = order.endDate ? new Date(order.endDate) : null;
              const startString = startDate
                ? format(startDate, "PP", { locale: fr })
                : "";
              const endString = endDate
                ? format(endDate, "PP", { locale: fr })
                : "";
              // Pour les commandes actives, considérer les paiements manuels
              const isManualPayment = order.paymentMethod !== "card";

              return (
                <TableRow
                  key={order._id}
                  hover
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(order)}
                >
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{fullName || "—"}</TableCell>
                  <TableCell>{startString}</TableCell>
                  <TableCell>{endString}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </TableCell>
                  <TableCell
                    style={getStatusStyle(order.orderStatus)}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Pour les commandes actives, activer l'édition si possible
                      if (
                        tabValue === 0 &&
                        order.orderStatus !== "Rejected" &&
                        isManualPayment &&
                        editingOrderId !== order._id
                      ) {
                        setEditingOrderId(order._id);
                      }
                    }}
                  >
                    {tabValue === 0 && isManualPayment ? (
                      editingOrderId === order._id ? (
                        <Select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          onBlur={() => setEditingOrderId(null)}
                          autoFocus
                          size="small"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MenuItem value="confirmé">Validée</MenuItem>
                          <MenuItem value="Pending">En attente</MenuItem>
                          <MenuItem value="Rejected">Rejetée</MenuItem>
                        </Select>
                      ) : (
                        <span>
                          {order.orderStatus === "confirmé"
                            ? "Validée"
                            : order.orderStatus === "Pending"
                            ? "En attente"
                            : order.orderStatus === "Rejected"
                            ? "Rejetée"
                            : order.orderStatus}
                        </span>
                      )
                    ) : (
                      order.orderStatus
                    )}
                  </TableCell>
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
            {ordersToDisplay.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="body2" align="center">
                    Aucune commande trouvée.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <OrderDetailsModal
        open={isModalOpen}
        order={selectedOrder}
        onClose={handleCloseModal}
      />
    </Box>
  );
}
