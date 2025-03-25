import { Grid, TextField, Typography, Box } from "@mui/material";

export default function BillingForm({ billingInfo, setBillingInfo }) {
  const handleChange = (e) => {
    setBillingInfo({
      ...billingInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Informations de facturation
      </Typography>

      <Grid container spacing={3}>
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
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="zipCode"
            label="ZCode postal"
            fullWidth
            value={billingInfo.zipCode}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
