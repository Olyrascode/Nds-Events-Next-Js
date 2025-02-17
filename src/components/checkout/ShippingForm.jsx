import { Grid, TextField, Typography, Box } from '@mui/material';

export default function ShippingForm({ shippingInfo, setShippingInfo }) {
  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Informations de livraison
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            name="address"
            label="Street Address"
            fullWidth
            value={shippingInfo.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="city"
            label="City"
            fullWidth
            value={shippingInfo.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="zipCode"
            label="Zip Code"
            fullWidth
            value={shippingInfo.zipCode}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}