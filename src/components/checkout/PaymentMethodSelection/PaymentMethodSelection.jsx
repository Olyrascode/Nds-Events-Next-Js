import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";

export default function PaymentMethodSelection({
  paymentMethod,
  setPaymentMethod,
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <FormControl component="fieldset">
        <FormLabel
          component="legend"
          sx={{
            fontWeight: "600",
            fontSize: "1.1rem",
            color: "black !important",
          }}
        >
          Mode de règlement
        </FormLabel>
        <FormLabel sx={{ color: "black !important" }}>
          Attention : Le matériel n'est réservé qu'une fois le règlement
          effectué
        </FormLabel>

        <RadioGroup
          row
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="card"
            control={<Radio />}
            label="Carte bancaire"
          />
          <FormControlLabel
            value="virement"
            control={<Radio />}
            label="Virement"
          />
          <FormControlLabel
            value="especes"
            control={<Radio />}
            label="Espèces"
          />
        </RadioGroup>
      </FormControl>
      {paymentMethod === "virement" && (
        <Typography variant="body2" sx={{ mt: 1, color: "red" }}>
          Attention : Si vous choisissez ce mode de paiement, vous disposerez de
          48 heures pour effectuer votre règlement et le matériel ne sera
          réservé qu'à sa réception. A défaut de paiement passé ce délai, votre
          commande sera automatiquement annulée
        </Typography>
      )}
      {paymentMethod === "especes" && (
        <Typography variant="body2" sx={{ mt: 1, color: "red" }}>
          Attention : Si vous choisissez ce mode de paiement, vous disposerez de
          48 heures pour effectuer votre règlement et le matériel ne sera
          réservé qu'à sa réception. A défaut de paiement passé ce délai, votre
          commande sera automatiquement annulée
        </Typography>
      )}
    </Box>
  );
}
