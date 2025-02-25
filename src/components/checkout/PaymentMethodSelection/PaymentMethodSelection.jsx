import { Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';

export default function PaymentMethodSelection({ paymentMethod, setPaymentMethod }) {
  return (
    <Box sx={{ mb: 3 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Mode de paiement</FormLabel>
        <RadioGroup
          row
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel value="card" control={<Radio />} label="Carte bancaire" />
          <FormControlLabel value="virement" control={<Radio />} label="Virement" />
          <FormControlLabel value="cheques" control={<Radio />} label="Chèques" />
          <FormControlLabel value="especes" control={<Radio />} label="Espèces" />
        </RadioGroup>
      </FormControl>
      {paymentMethod === "virement" && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Le paiement par virement nécessite un traitement manuel. Vous recevrez les instructions par email.
        </Typography>
      )}
      {["cheques", "especes"].includes(paymentMethod) && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Les paiements par {paymentMethod} seront traités manuellement. Veuillez consulter les instructions envoyées après votre commande.
        </Typography>
      )}
    </Box>
  );
}
