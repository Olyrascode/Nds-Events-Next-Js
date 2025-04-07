"use client";

import Link from "next/link";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  IconButton,
  Avatar,
  Typography,
  Button,
  Box,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useCart } from "../../contexts/CartContext";
import { calculateTotalPrice } from "../../utils/cartUtils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import "./cartDrawer.module.scss";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface OptionValue {
  value?: string;
  price?: number;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, removeFromCart } = useCart();

  const total = cart.length > 0 ? calculateTotalPrice(cart) : 0;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      className="cart-drawer"
    >
      <Box sx={{ width: 350, p: 2 }}>
        <Typography variant="h6" gutterBottom className="cart-drawer__title">
          Panier
        </Typography>

        {cart.length === 0 ? (
          <Typography className="cart-drawer__empty">
            Votre panier est vide
          </Typography>
        ) : (
          <>
            <List className="cart-drawer__list">
              {cart.map((item, index) => (
                <ListItem
                  key={item.cartItemId || index}
                  className="cart-drawer__item"
                  sx={{ flexDirection: "column", alignItems: "stretch", py: 2 }}
                >
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <ListItemAvatar>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <Avatar>{item.title.charAt(0)}</Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.title}
                      secondary={
                        <Box component="div">
                          <Typography variant="body2" component="div">
                            {item.lotSize && item.lotSize > 1 ? (
                              <>
                                Quantité: {item.quantity} lot
                                {item.quantity > 1 ? "s" : ""} (
                                {item.quantity * item.lotSize} unités)
                              </>
                            ) : (
                              <>Quantité: {item.quantity}</>
                            )}
                          </Typography>
                          <Typography variant="body2" component="div">
                            Prix: {item.price}€
                          </Typography>
                          {item.selectedOptions &&
                            Object.entries(item.selectedOptions).map(
                              ([optionName, optionValue]) => {
                                if (
                                  typeof optionValue === "object" &&
                                  optionValue !== null
                                ) {
                                  const typedValue = optionValue as OptionValue;
                                  return (
                                    <Typography
                                      key={optionName}
                                      variant="body2"
                                      component="div"
                                    >
                                      {optionName}: {typedValue.value || ""}
                                      {typedValue.price
                                        ? ` (${typedValue.price}€)`
                                        : ""}
                                    </Typography>
                                  );
                                }
                                return (
                                  <Typography
                                    key={optionName}
                                    variant="body2"
                                    component="div"
                                  >
                                    {optionName}: {String(optionValue)}
                                  </Typography>
                                );
                              }
                            )}
                        </Box>
                      }
                      secondaryTypographyProps={{ component: "div" }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => removeFromCart(item.cartItemId || "")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Box>

                  {item.type === "pack" &&
                    item.products &&
                    item.products.length > 0 && (
                      <Accordion
                        sx={{
                          mt: 1,
                          width: "100%",
                          "&:before": { display: "none" },
                          boxShadow: "none",
                          bgcolor: "background.paper",
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          sx={{ padding: "0 8px" }}
                        >
                          <Typography variant="body2" color="primary">
                            Voir les produits inclus ({item.products.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                          <List sx={{ p: 0 }}>
                            {item.products.map((packProduct, idx) => {
                              // Extraire les données du produit selon la structure de l'objet
                              const productData =
                                "product" in packProduct
                                  ? (packProduct.product as Record<
                                      string,
                                      any
                                    >) || packProduct
                                  : packProduct;

                              const productTitle =
                                productData.title ||
                                productData._id ||
                                "Produit";
                              const productImage = productData.imageUrl || "";
                              const productQuantity = packProduct.quantity || 1;
                              const lotSize = packProduct.lotSize || 1;

                              return (
                                <ListItem
                                  key={idx}
                                  sx={{
                                    py: 1,
                                    pl: 2,
                                    bgcolor: "rgba(0,0,0,0.02)",
                                    borderRadius: 1,
                                    mb: 0.5,
                                  }}
                                >
                                  <ListItemAvatar>
                                    {productImage ? (
                                      <Avatar
                                        src={productImage}
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
                                        Quantité totale:{" "}
                                        {productQuantity * item.quantity}
                                        {lotSize > 1
                                          ? ` (${Math.ceil(
                                              (productQuantity *
                                                item.quantity) /
                                                lotSize
                                            )} lot${
                                              Math.ceil(
                                                (productQuantity *
                                                  item.quantity) /
                                                  lotSize
                                              ) > 1
                                                ? "s"
                                                : ""
                                            })`
                                          : ""}
                                      </Typography>
                                    }
                                  />
                                </ListItem>
                              );
                            })}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    )}
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Période de location:
            </Typography>
            <Typography variant="body2" component="div">
              Du:{" "}
              {cart[0].startDate
                ? format(new Date(cart[0].startDate), "PP", { locale: fr })
                : ""}
            </Typography>
            <Typography variant="body2" gutterBottom component="div">
              Au:{" "}
              {cart[0].endDate
                ? format(new Date(cart[0].endDate), "PP", { locale: fr })
                : ""}
            </Typography>

            <Typography variant="h6" className="cart-drawer__total">
              Total: {total.toFixed(2)}€
            </Typography>

            {total < 49 ? (
              <Button
                variant="contained"
                fullWidth
                disabled
                sx={{ backgroundColor: "#f0f0f0", color: "red !important" }}
                className="cart-drawer__error"
              >
                Votre commande doit être d&apos;un minimum de 49€
              </Button>
            ) : (
              <Button
                variant="contained"
                fullWidth
                component={Link}
                href="/checkout"
                onClick={onClose}
                className="cart-drawer__checkout"
              >
                Paiement
              </Button>
            )}
          </>
        )}
      </Box>
    </Drawer>
  );
}
