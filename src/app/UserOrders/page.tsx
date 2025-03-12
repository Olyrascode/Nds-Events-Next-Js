// "use client";
// import { useState, useEffect, useRef } from 'react';
// import { jsPDF } from 'jspdf';
// import {
//   Container,
//   Paper,
//   Typography,
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   CircularProgress,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
// } from '@mui/material';
// import { format } from 'date-fns';
// import { useAuth } from '../../contexts/AuthContext';
// import { fetchUserOrders } from '../../services/orders.service';
// import { formatPrice } from '../../utils/priceUtils';
// import DownloadIcon from '@mui/icons-material/Download';
// import { generateInvoicePDF } from '../../utils/invoiceGenerator';

// // Define interfaces for your data
// interface Product {
//   _id?: string;
//   id?: string;
//   reference?: string;
//   title: string;
//   quantity: number;
//   price: number;
// }

// interface BillingInfo {
//   firstName: string;
//   lastName: string;
//   address: string;
//   zipCode: string;
//   city: string;
// }

// interface Order {
//   _id?: string;
//   id?: string;
//   createdAt: string; // or Date if you prefer
//   products: Product[];
//   total: number;
//   status: string;
//   subTotal: number;
//   taxRate: number;
//   taxAmount: number;
//   billingInfo: BillingInfo;
// }

// export default function UserOrders() {
//   // Type your state hooks
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { currentUser } = useAuth();
//   const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   // Provide an initial value for useRef
//   const invoiceRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     loadOrders();
//   }, [currentUser]);

//   const loadOrders = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       // Assuming currentUser has either id or _id as a string
//       const userOrders = await fetchUserOrders(currentUser.id || currentUser._id);
//       // TypeScript now knows orders is an array of Order objects
//       setOrders(
//         userOrders.sort((a: Order, b: Order) => {
//           // If createdAt is a string, convert to Date first
//           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//         })
//       );
//     } catch (err) {
//       setError('Failed to load orders. Please try again.');
//       console.error('Error loading orders:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Type the parameter as Order
//   const handleDownloadInvoice = async (order: Order) => {
//     if (!order) {
//       console.error('No order provided for invoice generation.');
//       return;
//     }

//     try {
//       await generateInvoicePDF(order); // Call your invoiceGenerator
//     } catch (err) {
//       console.error('Failed to generate invoice:', err);
//       setError('Impossible de générer la facture. Veuillez réessayer.');
//     }
//   };

//   const handleOpenInvoiceModal = (order: Order) => {
//     setSelectedOrder(order);
//     setOpenInvoiceModal(true);
//   };

//   const handleCloseInvoiceModal = () => {
//     setSelectedOrder(null);
//     setOpenInvoiceModal(false);
//   };

//   if (loading) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
//         <CircularProgress />
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Alert severity="error">{error}</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Paper sx={{ p: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Mes commandes
//         </Typography>

//         {orders.length === 0 ? (
//           <Alert severity="info">Vous n'avez pas encore de commande.</Alert>
//         ) : (
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Commande #</TableCell>
//                   <TableCell>Date</TableCell>
//                   <TableCell>Produits</TableCell>
//                   <TableCell>Total</TableCell>
//                   <TableCell>Statut</TableCell>
//                   <TableCell align="right">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {orders.map((order) => (
//                   <TableRow key={order._id || order.id}>
//                     <TableCell>{order._id || order.id}</TableCell>
//                     <TableCell>{format(new Date(order.createdAt), 'PP')}</TableCell>
//                     <TableCell>{order.products.length} Produit</TableCell>
//                     <TableCell>{formatPrice(order.total)}</TableCell>
//                     <TableCell>{order.status}</TableCell>
//                     <TableCell align="right">
//                       <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
//                         <Button onClick={() => handleOpenInvoiceModal(order)} size="small">
//                           Voir
//                         </Button>
//                         <Button
//                           startIcon={<DownloadIcon />}
//                           onClick={() => handleDownloadInvoice(order)}
//                           size="small"
//                         >
//                           Télécharger la facture
//                         </Button>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Paper>

//       {/* Modal pour afficher la facture */}
//       <Dialog open={openInvoiceModal} onClose={handleCloseInvoiceModal} maxWidth="md" fullWidth>
//         <DialogTitle>
//           Facture pour la commande #{selectedOrder?.id || selectedOrder?._id}
//         </DialogTitle>
//         <DialogContent dividers>
//           {selectedOrder && (
//             <Box sx={{ p: 3 }}>
//               {/* En-tête : logo et informations principales */}
//               <Box
//                 sx={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   mb: 3,
//                 }}
//               >
//                 <Box>
//                   <Typography variant="h6">NDS Event's</Typography>
//                   <Typography variant="body2">8 Avenue Victor Hugo, 38130 Échirolles</Typography>
//                   <Typography variant="body2">Tél : 04-80-80-98-51</Typography>
//                   <Typography variant="body2">contact@nds-events.fr</Typography>
//                 </Box>
//                 <Box>
//                   <img
//                     src="../../img/divers/nds-events-logo.png"
//                     alt="Logo"
//                     style={{ height: 80 }}
//                   />
//                 </Box>
//               </Box>

//               {/* Informations client */}
//               <Box sx={{ mb: 3 }}>
//                 <Typography variant="h6">À l'attention de :</Typography>
//                 <Typography variant="body2">
//                   {`${selectedOrder.billingInfo.firstName} ${selectedOrder.billingInfo.lastName}`}
//                 </Typography>
//                 <Typography variant="body2">{selectedOrder.billingInfo.address}</Typography>
//                 <Typography variant="body2">
//                   {`${selectedOrder.billingInfo.zipCode} ${selectedOrder.billingInfo.city}`}
//                 </Typography>
//                 <Typography variant="body2">
//                   Date de la facture : {format(new Date(selectedOrder.createdAt), 'PP')}
//                 </Typography>
//               </Box>

//               {/* Tableau des produits */}
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 Détails des produits
//               </Typography>
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Réf. article</TableCell>
//                       <TableCell>Description</TableCell>
//                       <TableCell>Qté</TableCell>
//                       <TableCell>PU HT</TableCell>
//                       <TableCell>Mtt HT</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {selectedOrder.products.map((item: Product) => (
//                       <TableRow key={item._id || item.id}>
//                         <TableCell>{item.reference || 'N/A'}</TableCell>
//                         <TableCell>{item.title}</TableCell>
//                         <TableCell>{item.quantity}</TableCell>
//                         <TableCell>{formatPrice(item.price)}</TableCell>
//                         <TableCell>{formatPrice(item.price * item.quantity)}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               {/* Totaux */}
//               <Box sx={{ mt: 3 }}>
//                 <Typography variant="body1">
//                   Sous-total HT : {formatPrice(selectedOrder.subTotal)}
//                 </Typography>
//                 <Typography variant="body1">
//                   TVA ({selectedOrder.taxRate}%) : {formatPrice(selectedOrder.taxAmount)}
//                 </Typography>
//                 <Typography variant="body1" fontWeight="bold">
//                   Total TTC : {formatPrice(selectedOrder.total)}
//                 </Typography>
//               </Box>

//               {/* Note finale */}
//               <Box sx={{ mt: 3, fontSize: '0.9rem', color: 'gray' }}>
//                 <Typography>
//                   Les ventes sont conclues avec réserve de propriété. Le transfert de propriété n'intervient qu'après paiement complet.
//                 </Typography>
//                 <Typography>
//                   En cas de retard de paiement, des pénalités de retard seront appliquées selon l'article L 441-6 du Code de commerce.
//                 </Typography>
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Container>
//   );
// }

"use client";
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserOrders } from '../../services/orders.service';
import { formatPrice } from '../../utils/priceUtils';
import DownloadIcon from '@mui/icons-material/Download';
import { generateInvoicePDF } from '../../utils/invoiceGenerator';
import Image from 'next/image';

interface Product {
  _id?: string;
  id?: string;
  reference?: string;
  title: string;
  quantity: number;
  price: number;
}

interface BillingInfo {
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string;
  city: string;
}

interface Order {
  _id?: string;
  id?: string;
  createdAt: string;
  products: Product[];
  total: number;
  status: string;
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  billingInfo: BillingInfo;
}

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        // Utilisez non-null assertion pour currentUser
        const userOrders = await fetchUserOrders(currentUser!._id || currentUser!.id);
        setOrders(
          userOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        );
      } catch (err) {
        setError('Failed to load orders. Please try again.');
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [currentUser]);

  const handleDownloadInvoice = async (order: Order) => {
    if (!order) {
      console.error('No order provided for invoice generation.');
      return;
    }
    try {
      await generateInvoicePDF(order);
    } catch (err) {
      console.error('Failed to generate invoice:', err);
      setError('Impossible de générer la facture. Veuillez réessayer.');
    }
  };

  const handleOpenInvoiceModal = (order: Order) => {
    setSelectedOrder(order);
    setOpenInvoiceModal(true);
  };

  const handleCloseInvoiceModal = () => {
    setSelectedOrder(null);
    setOpenInvoiceModal(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mes commandes
        </Typography>
        {orders.length === 0 ? (
          <Alert severity="info">Vous n&apos;avez pas encore de commande.</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Commande #</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Produits</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id || order.id}>
                    <TableCell>{order._id || order.id}</TableCell>
                    <TableCell>{format(new Date(order.createdAt), 'PP')}</TableCell>
                    <TableCell>{order.products.length} Produit</TableCell>
                    <TableCell>{formatPrice(order.total)}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button onClick={() => handleOpenInvoiceModal(order)} size="small">
                          Voir
                        </Button>
                        <Button
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadInvoice(order)}
                          size="small"
                        >
                          Télécharger la facture
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <Dialog open={openInvoiceModal} onClose={handleCloseInvoiceModal} maxWidth="md" fullWidth>
        <DialogTitle>
          Facture pour la commande #{selectedOrder?.id || selectedOrder?._id}
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6">NDS Event&apos;s</Typography>
                  <Typography variant="body2">
                    8 Avenue Victor Hugo, 38130 Échirolles
                  </Typography>
                  <Typography variant="body2">Tél : 04-80-80-98-51</Typography>
                  <Typography variant="body2">contact@nds-events.fr</Typography>
                </Box>
                <Box>
                  <Image
                    src="/img/divers/nds-events-logo.png"
                    alt="Logo"
                    width={160}
                    height={80}
                  />
                </Box>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6">À l&apos;attention de :</Typography>
                <Typography variant="body2">
                  {`${selectedOrder.billingInfo.firstName} ${selectedOrder.billingInfo.lastName}`}
                </Typography>
                <Typography variant="body2">{selectedOrder.billingInfo.address}</Typography>
                <Typography variant="body2">
                  {`${selectedOrder.billingInfo.zipCode} ${selectedOrder.billingInfo.city}`}
                </Typography>
                <Typography variant="body2">
                  Date de la facture : {format(new Date(selectedOrder.createdAt), 'PP')}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Détails des produits
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Réf. article</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Qté</TableCell>
                      <TableCell>PU HT</TableCell>
                      <TableCell>Mtt HT</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.products.map((item: Product) => (
                      <TableRow key={item._id || item.id}>
                        <TableCell>{item.reference || 'N/A'}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatPrice(item.price)}</TableCell>
                        <TableCell>{formatPrice(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1">
                  Sous-total HT : {formatPrice(selectedOrder.subTotal)}
                </Typography>
                <Typography variant="body1">
                  TVA ({selectedOrder.taxRate}%): {formatPrice(selectedOrder.taxAmount)}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  Total TTC : {formatPrice(selectedOrder.total)}
                </Typography>
              </Box>
              <Box sx={{ mt: 3, fontSize: '0.9rem', color: 'gray' }}>
                <Typography>
                  Les ventes sont conclues avec réserve de propriété. Le transfert de propriété n&apos;intervient qu&apos;après paiement complet.
                </Typography>
                <Typography>
                  En cas de retard de paiement, des pénalités de retard seront appliquées selon l&apos;article L 441-6 du Code de commerce.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
