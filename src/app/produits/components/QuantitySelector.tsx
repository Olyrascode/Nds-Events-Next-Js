import { Box, Typography, TextField } from "@mui/material";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (value: number) => void;
  minQuantity?: number;
  stock?: number;
}

export default function QuantitySelector({
  quantity,
  onChange,
  minQuantity = 1,
  stock = 0,
}: QuantitySelectorProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Quantité
      </Typography>
      <TextField
        type="number"
        value={quantity}
        onChange={(e) => onChange(parseInt(e.target.value) || 1)}
        inputProps={{
          min: minQuantity,
          max: stock,
          step: 1,
        }}
        fullWidth
        helperText={`Minimum: ${minQuantity} | Disponnible: ${stock}`}
      />
    </Box>
  );
}
