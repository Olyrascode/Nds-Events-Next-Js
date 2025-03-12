

"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Grid,
  Button,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import { formatPrice } from '@/utils/priceUtils';
import DownloadIcon from '@mui/icons-material/Download';
import { generateInvoicePDF } from '@/utils/invoiceGenerator';

// Define interfaces for your order data
interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

interface ShippingInfo {
  address: string;
  city: string;
  zipCode: string;
}

interface OrderProduct {
  _id: string;
  imageUrl: string;
  title: string;
  quantity: number;
  price: number;
  selectedOptions?: Record<string, string>;
}

interface Order {
  _id: string;
  createdAt: string;
  billingInfo: BillingInfo;
  shippingInfo?: ShippingInfo;
  deliveryMethod: string;
  products: OrderProduct[];
  startDate: string;
  endDate: string;
  total: number;
}

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id'); // Retrieve order ID from URL


  // Define order state with proper type and error state as string | null
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-nds-events.fr';

  useEffect(() => {
    if (orderId) {
      async function fetchOrder() {
        try {
          const response = await fetch(`${API_URL}/api/orders/${orderId}`);
          if (!response.ok) {
            throw new Error("Votre commande n'a pas pu être trouvée.");
          }
          const data = await response.json();
          // Assume data.order is the order object
          setOrder(data.order);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Une erreur est survenue.");
          }
        }
      }
      fetchOrder();
    }
  }, [orderId, API_URL]);

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Chargement de la commande...</Typography>
      </Container>
    );
  }

  // Display order details
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={async () => {
              try {
                await generateInvoicePDF(order);
              } catch (err) {
                if (err instanceof Error) {
                  setError(err.message);
                } else {
                  setError("Failed to generate invoice. Please try again.");
                }
              }
            }}
          >
            Télécharger votre facture
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom color="success.main">
            Commande confirmée!
          </Typography>
          <Typography variant="subtitle1">Commande #{order._id}</Typography>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(order.createdAt), 'PPP')}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Informations de facturation
            </Typography>
            <Typography>
              {order.billingInfo.firstName} {order.billingInfo.lastName}
            </Typography>
            <Typography>{order.billingInfo.email}</Typography>
            <Typography>{order.billingInfo.phone}</Typography>
            <Typography>{order.billingInfo.address}</Typography>
            <Typography>
              {order.billingInfo.city}, {order.billingInfo.zipCode}
            </Typography>
          </Grid>

          {order.deliveryMethod === 'delivery' && order.shippingInfo && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informations de livraison
              </Typography>
              <Typography>{order.shippingInfo.address}</Typography>
              <Typography>
                {order.shippingInfo.city}, {order.shippingInfo.zipCode}
              </Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Détail de votre commande
        </Typography>

        {order.products.map((item: OrderProduct) => (
          <Box key={item._id} sx={{ mb: 2 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
              <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={60}
                  height={60}
                  style={{ objectFit: 'cover' }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="subtitle1">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantité: {item.quantity} | {formatPrice(item.price)}
                </Typography>
                {item.selectedOptions &&
                  Object.entries(item.selectedOptions).map(([key, value]) => (
                    <Typography key={key} variant="body2" color="text.secondary">
                      {key}: {value}
                    </Typography>
                  ))}
              </Grid>
            </Grid>
          </Box>
        ))}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Période de location:</Typography>
          <Typography>
            {format(new Date(order.startDate), 'PP')} - {format(new Date(order.endDate), 'PP')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
  <Typography>Méthode de réception:</Typography>
  <Typography>
    {order.deliveryMethod === 'delivery' ? `Livraison par NDS (${formatPrice(order.shippingFee)})` : 'Récupération au depot NDS'}
  </Typography>
</Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">{formatPrice(order.total)}</Typography>
        </Box>
      </Paper>
    </Container>
  );
}
