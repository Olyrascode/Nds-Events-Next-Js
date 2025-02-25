
// import React, { useState, useEffect } from 'react';
// import { generateInvoicePDF } from '../../../utils/invoiceGenerator';
// import DownloadIcon from '@mui/icons-material/Download';
// import { format } from 'date-fns';
// import { fr } from 'date-fns/locale';
// import { fetchAllOrders, deleteOrder, updateOrderStatus } from '../../../services/orders.service';

// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   IconButton, Typography, Box, CircularProgress, Alert, TextField, Select, MenuItem,
//   colors
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import OrderDetailsModal from '../calendar/OrderDetailsModal';

// export default function OrdersList() {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingOrderId, setEditingOrderId] = useState(null); // ✅ State pour suivre l'édition du statut

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   useEffect(() => {
//     filterOrders();
//   }, [orders, searchTerm]);

//   const loadOrders = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const ordersData = await fetchAllOrders();
//       const formattedOrders = ordersData.map(order => ({
//         ...order,
//         startDate: order.startDate ? new Date(order.startDate) : null,
//         endDate: order.endDate ? new Date(order.endDate) : null,
//       }));
//       formattedOrders.sort((a, b) => (b.startDate || 0) - (a.startDate || 0));
//       setOrders(formattedOrders);
//     } catch (err) {
//       console.error('Erreur récupération commandes:', err);
//       setError("Impossible de charger les commandes.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterOrders = () => {
//     if (!searchTerm) {
//       setFilteredOrders(orders);
//       return;
//     }
//     const lowerSearch = searchTerm.toLowerCase();
//     const newFiltered = orders.filter((order) => {
//       const matchesId = order._id.toLowerCase().includes(lowerSearch);
//       const firstName = order?.billingInfo?.firstName || '';
//       const lastName = order?.billingInfo?.lastName || '';
//       const fullName = `${firstName} ${lastName}`.trim().toLowerCase();
//       const matchesName = fullName.includes(lowerSearch);
//       return matchesId || matchesName;
//     });
//     setFilteredOrders(newFiltered);
//   };

//   const handleDownloadInvoice = async (order) => {
//     try {
//       await generateInvoicePDF(order);
//     } catch (error) {
//       console.error('Erreur génération facture:', error);
//       alert("Impossible de télécharger la facture.");
//     }
//   };

//   const getStatusStyle = (status) => {
//     switch(status) {
//       case 'Validated':
//         return { backgroundColor: 'green' };
//       case 'Pending':
//         return { backgroundColor: 'orange' };
//       case 'Rejected':
//         return { backgroundColor: 'red' };
//       default:
//         return {};
//     }
//   };

//   const handleDelete = async (orderId) => {
//     if (!orderId) return;
//     const confirm = window.confirm("Voulez-vous vraiment supprimer cette commande ?");
//     if (!confirm) return;
//     try {
//       await deleteOrder(orderId);
//       setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
//       console.log("🟢 Commande supprimée avec succès !");
//     } catch (error) {
//       console.error("🔴 Erreur suppression commande:", error);
//     }
//   };

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       const updatedOrder = await updateOrderStatus(orderId, newStatus);
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === orderId ? { ...order, orderStatus: updatedOrder.orderStatus } : order
//         )
//       );
//       setEditingOrderId(null); // ✅ Fermer le mode édition après mise à jour
//     } catch (error) {
//       console.error('Erreur mise à jour statut:', error);
//       alert("Échec de la mise à jour du statut.");
//     }
//   };

//   const handleRowClick = (order) => {
//     // ✅ La modal s'ouvre uniquement si l'utilisateur clique en dehors de la cellule de statut
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedOrder(null);
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Alert severity="error">{error}</Alert>;

//   return (
//     <Box>
//       <Typography variant="h5" gutterBottom>
//         Liste des Commandes
//       </Typography>

//       <TextField
//         label="Rechercher par ID ou Nom du client"
//         variant="outlined"
//         size="small"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         style={{ marginBottom: '16px' }}
//       />

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID Commande</TableCell>
//               <TableCell>Client</TableCell>
//               <TableCell>Début</TableCell>
//               <TableCell>Fin</TableCell>
//               <TableCell>Statut</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredOrders.map((order) => {
//               const firstName = order?.billingInfo?.firstName || '';
//               const lastName = order?.billingInfo?.lastName || '';
//               const fullName = `${firstName} ${lastName}`.trim();

//               const startDate = order.startDate ? new Date(order.startDate) : null;
//               const endDate = order.endDate ? new Date(order.endDate) : null;
//               const startString = startDate ? format(startDate, 'PP', { locale: fr }) : '';
//               const endString = endDate ? format(endDate, 'PP', { locale: fr }) : '';

//               // const isManualPayment = ['check', 'cash', 'bank_transfer'].includes(order.paymentMethod);
//               const isManualPayment = order.paymentMethod !== 'card';

//               return (
//                 <TableRow
//                   key={order._id}
//                   hover
//                   style={{ cursor: 'pointer' }}
//                   onClick={() => handleRowClick(order)}
//                 >
//                   <TableCell>{order._id}</TableCell>
//                   <TableCell>{fullName || '—'}</TableCell>
//                   <TableCell>{startString}</TableCell>
//                   <TableCell>{endString}</TableCell>
//                   {/* ✅ Ajout d'un onClick sur la cellule pour stopper la propagation et activer le dropdown */}
//                   <TableCell 
//                     style={getStatusStyle(order.orderStatus)} 
//                     onClick={(e) => { 
//                       e.stopPropagation(); 
//                       if(isManualPayment && editingOrderId !== order._id) {
//                         setEditingOrderId(order._id);
//                       }
//                     }}
//                   >
//                     {isManualPayment ? (
//                       editingOrderId === order._id ? (
//                         // ✅ Dropdown en mode édition avec stopPropagation
//                         <Select
//                           value={order.orderStatus}
//                           onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                           onBlur={() => setEditingOrderId(null)}
//                           autoFocus
//                           size="small"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <MenuItem value="Validated">Validée</MenuItem>
//                           <MenuItem value="Pending">En attente</MenuItem>
//                           <MenuItem value="Rejected">Rejetée</MenuItem>
//                         </Select>
//                       ) : (
//                         // ✅ Texte cliquable pour lancer l'édition, la propagation est stoppée par la cellule
//                         <span>{order.orderStatus === 'Validated' ? 'Validée' : 
//                                order.orderStatus === 'Pending' ? 'En attente' : 'Rejetée'}</span>
//                       )
//                     ) : (
//                       // Pour les paiements non manuels, affichage statique
//                       order.orderStatus === 'Validated' ? 'Validée' : 
//                       order.orderStatus === 'Pending' ? 'En attente' : 'Rejetée'
//                     )}
//                   </TableCell>
//                   <TableCell align="right" onClick={(e) => e.stopPropagation()}>
//                     <IconButton
//                       color="primary"
//                       onClick={() => handleDownloadInvoice(order)}
//                     >
//                       <DownloadIcon />
//                     </IconButton>
//                     <IconButton
//                       color="error"
//                       onClick={() => handleDelete(order._id)}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//             {filteredOrders.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={6}>
//                   <Typography variant="body2" align="center">
//                     Aucune commande trouvée.
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <OrderDetailsModal
//         open={isModalOpen}
//         order={selectedOrder}
//         onClose={handleCloseModal}
//       />
//     </Box>
//   );
// }
import React, { useState, useEffect } from 'react';
import { generateInvoicePDF } from '../../../utils/invoiceGenerator';
import DownloadIcon from '@mui/icons-material/Download';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { fetchAllOrders, deleteOrder, updateOrderStatus } from '../../../services/orders.service';

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Typography, Box, CircularProgress, Alert, TextField, Select, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import OrderDetailsModal from '../calendar/OrderDetailsModal';

// ✅ Fonction utilitaire pour traduire le mode de paiement
const getPaymentMethodLabel = (method) => {
  switch(method) {
    case 'card':
      return "Carte bancaire";
    case 'virement':
      return "Virement";
    case 'cheques':
      return "Chèques";
    case 'especes':
      return "Espèces";
    default:
      return method;
  }
};

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null); // ✅ State pour suivre l'édition du statut

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
      const ordersData = await fetchAllOrders();
      const formattedOrders = ordersData.map(order => ({
        ...order,
        startDate: order.startDate ? new Date(order.startDate) : null,
        endDate: order.endDate ? new Date(order.endDate) : null,
      }));
      formattedOrders.sort((a, b) => (b.startDate || 0) - (a.startDate || 0));
      setOrders(formattedOrders);
    } catch (err) {
      console.error('Erreur récupération commandes:', err);
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
      console.error('Erreur génération facture:', error);
      alert("Impossible de télécharger la facture.");
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Validated':
        return { backgroundColor: 'green', color: '#fff' };
      case 'Pending':
        return { backgroundColor: 'orange', color: '#fff' };
      case 'Rejected':
        return { backgroundColor: 'red', color: '#fff' };
      default:
        return {};
    }
  };

  const handleDelete = async (orderId) => {
    if (!orderId) return;
    const confirm = window.confirm("Voulez-vous vraiment supprimer cette commande ?");
    if (!confirm) return;
    try {
      await deleteOrder(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      console.log("🟢 Commande supprimée avec succès !");
    } catch (error) {
      console.error("🔴 Erreur suppression commande:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: updatedOrder.orderStatus } : order
        )
      );
      setEditingOrderId(null); // ✅ Fermer le mode édition après mise à jour
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert("Échec de la mise à jour du statut.");
    }
  };

  const handleRowClick = (order) => {
    // ✅ La modal s'ouvre uniquement si l'utilisateur clique en dehors de la cellule de statut
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

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
              {/* ✅ Nouvelle colonne pour le mode de paiement */}
              <TableCell>Mode de paiement</TableCell>
              <TableCell>Statut</TableCell>
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
              const startString = startDate ? format(startDate, 'PP', { locale: fr }) : '';
              const endString = endDate ? format(endDate, 'PP', { locale: fr }) : '';

              // ✅ Les paiements manuels sont ceux qui ne sont pas "card"
              const isManualPayment = order.paymentMethod !== 'card';

              return (
                <TableRow
                  key={order._id}
                  hover
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(order)}
                >
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{fullName || '—'}</TableCell>
                  <TableCell>{startString}</TableCell>
                  <TableCell>{endString}</TableCell>
                  {/* ✅ Affichage du mode de paiement */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </TableCell>
                  {/* ✅ Cellule pour le statut avec gestion du dropdown */}
                  <TableCell 
                    style={getStatusStyle(order.orderStatus)} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if(isManualPayment && editingOrderId !== order._id) {
                        setEditingOrderId(order._id);
                      }
                    }}
                  >
                    {isManualPayment ? (
                      editingOrderId === order._id ? (
                        <Select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          onBlur={() => setEditingOrderId(null)}
                          autoFocus
                          size="small"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MenuItem value="Validated">Validée</MenuItem>
                          <MenuItem value="Pending">En attente</MenuItem>
                          <MenuItem value="Rejected">Rejetée</MenuItem>
                        </Select>
                      ) : (
                        <span>{order.orderStatus === 'Validated' ? 'Validée' : 
                               order.orderStatus === 'Pending' ? 'En attente' : 'Rejetée'}</span>
                      )
                    ) : (
                      order.orderStatus === 'Validated' ? 'Validée' : 
                      order.orderStatus === 'Pending' ? 'En attente' : 'Rejetée'
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
            {filteredOrders.length === 0 && (
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
