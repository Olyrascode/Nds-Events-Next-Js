import { Box, Typography, TextField } from '@mui/material';

export default function QuantitySelector({ quantity, onChange, minQuantity, stock }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Quantité
      </Typography>
      <TextField
        type="number"
        value={quantity}
        onChange={(e) => onChange(parseInt(e.target.value))}
        inputProps={{
          min: minQuantity,
          max: stock,
          step: 1
        }}
        fullWidth
        helperText={`Minimum: ${minQuantity} | Disponnible: ${stock}`}
      />
    </Box>
  );
}