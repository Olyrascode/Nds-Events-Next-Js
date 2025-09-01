import {
  Grid,
  TextField,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function BillingForm({
  billingInfo,
  setBillingInfo,
  shippingInfo,
  deliveryMethod,
}) {
  const [useSameAsShipping, setUseSameAsShipping] = useState(false);

  const handleChange = (e) => {
    // Si la case "même adresse" est cochée et que c'est un champ d'adresse, ne pas modifier
    if (
      useSameAsShipping &&
      ["address", "city", "zipCode"].includes(e.target.name)
    ) {
      return; // Empêcher la modification des champs synchronisés
    }

    setBillingInfo({
      ...billingInfo,
      [e.target.name]: e.target.value,
    });

    // Si l'utilisateur modifie un autre champ (prénom, nom, etc.), ne pas décocher la case
    // La case ne se décoche que si on essaie de modifier les champs d'adresse
  };

  const handleCheckboxChange = (e) => {
    setUseSameAsShipping(e.target.checked);
    if (e.target.checked && shippingInfo) {
      setBillingInfo({
        ...billingInfo, // Conserver prénom, nom, email, téléphone
        address: shippingInfo.address || "",
        city: shippingInfo.city || "",
        zipCode: shippingInfo.zipCode || "",
      });
    }
  };

  // Mettre à jour les champs de facturation si la case est cochée et que shippingInfo change
  useEffect(() => {
    if (useSameAsShipping && shippingInfo) {
      setBillingInfo((prevBillingInfo) => ({
        ...prevBillingInfo, // Conserver prénom, nom, email, téléphone déjà saisis
        address: shippingInfo.address || "",
        city: shippingInfo.city || "",
        zipCode: shippingInfo.zipCode || "",
      }));
    }
  }, [shippingInfo, useSameAsShipping, setBillingInfo]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Informations de facturation
      </Typography>

      {deliveryMethod === "delivery" && (
        <FormControlLabel
          control={
            <Checkbox
              checked={useSameAsShipping}
              onChange={handleCheckboxChange}
              name="useSameAsShipping"
              color="primary"
            />
          }
          label="Mon adresse de facturation est la même que mon adresse de livraison"
          sx={{ mb: 2 }}
        />
      )}

      <Grid
        container
        spacing={3}
        sx={{ mt: deliveryMethod === "delivery" ? 1 : 0 }}
      >
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="firstName"
            label="Prénom"
            fullWidth
            value={billingInfo.firstName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="lastName"
            label="Nom"
            fullWidth
            value={billingInfo.lastName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="email"
            label="Email"
            fullWidth
            type="email"
            value={billingInfo.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="phone"
            label="Téléphone"
            fullWidth
            value={billingInfo.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            name="address"
            label="Adresse de facturation"
            fullWidth
            value={billingInfo.address}
            onChange={handleChange}
            disabled={useSameAsShipping}
            helperText={
              useSameAsShipping ? "Synchronisé avec l'adresse de livraison" : ""
            }
            sx={
              useSameAsShipping
                ? {
                    "& .MuiInputBase-input": {
                      backgroundColor: "#f5f5f5",
                      color: "#666",
                    },
                  }
                : {}
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="city"
            label="Ville"
            fullWidth
            value={billingInfo.city}
            onChange={handleChange}
            disabled={useSameAsShipping}
            helperText={
              useSameAsShipping ? "Synchronisé avec l'adresse de livraison" : ""
            }
            sx={
              useSameAsShipping
                ? {
                    "& .MuiInputBase-input": {
                      backgroundColor: "#f5f5f5",
                      color: "#666",
                    },
                  }
                : {}
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="zipCode"
            label="Code postal"
            fullWidth
            value={billingInfo.zipCode}
            onChange={handleChange}
            disabled={useSameAsShipping}
            helperText={
              useSameAsShipping ? "Synchronisé avec l'adresse de livraison" : ""
            }
            sx={
              useSameAsShipping
                ? {
                    "& .MuiInputBase-input": {
                      backgroundColor: "#f5f5f5",
                      color: "#666",
                    },
                  }
                : {}
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
}
