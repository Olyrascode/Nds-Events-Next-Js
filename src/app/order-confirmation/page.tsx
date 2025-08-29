"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Grid,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { format } from "date-fns";
import { formatPrice } from "@/utils/priceUtils";
import DownloadIcon from "@mui/icons-material/Download";
import { generateInvoicePDF } from "@/utils/invoiceGenerator";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// Fonction utilitaire pour corriger les URLs d'images
const fixImageUrl = (url: string | undefined | null): string => {
  if (!url) return "";

  // Remplacer localhost:5000 par l'API_URL correct
  if (url.includes("localhost:5000")) {
    return url.replace("http://localhost:5000", API_URL);
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const apiURL = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  const imagePath = url.startsWith("/") ? url.slice(1) : url;
  if (!imagePath) return "";
  return `${apiURL}/api/files/${imagePath}`;
};

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

interface OptionValueObject {
  id?: string;
  name?: string;
  value?: string | number;
  price?: number;
  deliveryMandatory?: boolean;
}

interface PackProductDetail {
  _id: string;
  quantity: number;
  product: {
    _id: string;
    title: string;
    imageUrl?: string;
    price: number;
  };
}

interface OrderProduct {
  _id: string;
  imageUrl: string;
  title: string;
  quantity: number;
  price: number;
  selectedOptions?: Record<string, string | OptionValueObject>;
  lotSize?: number;
  type?: "pack" | "product";
  products?: PackProductDetail[]; // Pour les packs, liste des produits inclus
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
  shippingFee?: number;
}

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id"); // Retrieve order ID from URL

  // Define order state with proper type and error state as string | null
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          console.log("Order data fetched:", data.order); // Log pour débugger
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
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" gutterBottom color="success.main">
            Commande confirmée!
          </Typography>
          <Typography variant="subtitle1">Commande #{order._id}</Typography>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(order.createdAt), "PPP")}
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

          {order.deliveryMethod === "delivery" && order.shippingInfo && (
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

        {order.products.map((item: OrderProduct) => {
          // Log pour débugger chaque item
          console.log("Order item:", item);

          return (
            <Box key={item._id} sx={{ mb: 2 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Image
                    src={fixImageUrl(item.imageUrl)}
                    alt={item.title}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover" }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography variant="subtitle1">
                    {item.title}
                    {item.type === "pack" && (
                      <Typography
                        component="span"
                        color="primary"
                        sx={{ ml: 1 }}
                      >
                        (Pack)
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.lotSize && item.lotSize > 1
                      ? `Quantité: ${item.quantity * item.lotSize} articles (${
                          item.quantity
                        } lot(s) de ${item.lotSize})`
                      : `Quantité: ${item.quantity}`}
                    {" | "}Prix total ligne:{" "}
                    {
                      item.type === "pack"
                        ? formatPrice(item.price) // Pour les packs, item.price est déjà le prix total
                        : formatPrice(
                            item.price * item.quantity * (item.lotSize || 1)
                          ) // Pour les produits, calculer le prix total
                    }
                  </Typography>
                  {item.selectedOptions &&
                    Object.entries(item.selectedOptions).map(
                      ([optionKey, optionValue]) => {
                        let displayValue: string | number = "";
                        let optionPriceString = "";

                        if (typeof optionValue === "string") {
                          displayValue = optionValue;
                        } else if (typeof optionValue === "number") {
                          displayValue = optionValue;
                        } else if (
                          typeof optionValue === "object" &&
                          optionValue !== null
                        ) {
                          if (
                            "name" in optionValue &&
                            typeof optionValue.name === "string"
                          ) {
                            displayValue = optionValue.name;
                          } else {
                            displayValue = JSON.stringify(optionValue);
                          }
                          // Vérifier et formater le prix de l'option
                          if (
                            "price" in optionValue &&
                            typeof optionValue.price === "number" &&
                            optionValue.price > 0
                          ) {
                            optionPriceString = ` (+${formatPrice(
                              optionValue.price
                            )})`;
                          }
                        } else {
                          displayValue = String(optionValue);
                        }

                        return (
                          <Typography
                            key={optionKey}
                            variant="body2"
                            color="text.secondary"
                          >
                            {optionKey}: {displayValue}
                            {optionPriceString}
                          </Typography>
                        );
                      }
                    )}

                  {/* Affichage des produits du pack si c'est un pack */}
                  {item.type === "pack" &&
                    item.products &&
                    item.products.length > 0 && (
                      <Box sx={{ mt: 2, ml: 2 }}>
                        <Typography
                          variant="body2"
                          color="primary"
                          gutterBottom
                        >
                          Produits inclus dans le pack :
                        </Typography>
                        <List dense sx={{ py: 0 }}>
                          {item.products.map((packProduct, index) => {
                            // Vérifications de sécurité pour éviter les erreurs
                            // Support des deux formats : ancien (imbriqué) et nouveau (plat)
                            const productData =
                              packProduct?.product || packProduct || {};
                            const productTitle =
                              productData?.title || `Produit ${index + 1}`;
                            const productId = packProduct?._id || index;
                            const productQuantity = packProduct?.quantity || 0;
                            const productImageUrl = productData?.imageUrl;

                            console.log("Pack product data:", packProduct); // Log pour débugger
                            console.log("Original image URL:", productImageUrl); // Log URL originale
                            const fixedImageUrl = fixImageUrl(productImageUrl);
                            console.log("Fixed image URL:", fixedImageUrl); // Log URL corrigée

                            return (
                              <ListItem key={productId} sx={{ py: 0.5, pl: 0 }}>
                                <ListItemAvatar>
                                  {fixedImageUrl ? (
                                    <Avatar
                                      src={fixedImageUrl}
                                      alt={productTitle}
                                      sx={{ width: 32, height: 32 }}
                                    />
                                  ) : (
                                    <Avatar sx={{ width: 32, height: 32 }}>
                                      {productTitle.charAt(0)}
                                    </Avatar>
                                  )}
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography variant="body2">
                                      {productTitle}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Quantité dans le pack: {productQuantity} ×{" "}
                                      {item.quantity} ={" "}
                                      {productQuantity * item.quantity} total
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            );
                          })}
                        </List>
                      </Box>
                    )}
                </Grid>
              </Grid>
            </Box>
          );
        })}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Période de location:</Typography>
          <Typography>
            {format(new Date(order.startDate), "PP")} -{" "}
            {format(new Date(order.endDate), "PP")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Méthode de livraison:</Typography>
          <Typography>
            {order.deliveryMethod === "delivery"
              ? `Livraison par NDS ${
                  typeof order.shippingFee === "number"
                    ? `(${formatPrice(order.shippingFee)})`
                    : "(Frais applicables)"
                }`
              : "Récupération au depot NDS"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">{formatPrice(order.total)}</Typography>
        </Box>
      </Paper>
    </Container>
  );
}
