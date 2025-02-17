// import { 
//   FormControl, 
//   FormControlLabel, 
//   Radio, 
//   RadioGroup, 
//   Typography, 
//   Box,
//   Paper
// } from '@mui/material';

// const DELIVERY_FEE = 60;

// export default function DeliveryOptions({ value, onChange }) {
//   return (
//     <Paper sx={{ p: 2, mb: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Methode de reception
//       </Typography>
//       <FormControl component="fieldset">
//         <RadioGroup
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         >
//           <FormControlLabel 
//             value="pickup"
//             control={<Radio />}
//             label={
//               <Box>
//                 <Typography variant="subtitle1">Récuperer au depot</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Gratuit
//                 </Typography>
//               </Box>
//             }
//           />
//           <FormControlLabel
//             value="delivery"
//             control={<Radio />}
//             label={
//               <Box>
//                 <Typography variant="subtitle1">Livraison par NDS</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   €{DELIVERY_FEE.toFixed(2)}
//                 </Typography>
//               </Box>
//             }
//           />
//         </RadioGroup>
//       </FormControl>
//     </Paper>
//   );
// }
import { 
  FormControl, 
  FormControlLabel, 
  Radio, 
  RadioGroup, 
  Typography, 
  Box,
  Paper
} from '@mui/material';

const DELIVERY_FEE = 60;

export default function DeliveryOptions({ value, onChange, forceDelivery = false }) {
  // Si forceDelivery est vrai, on force la valeur à "delivery"
  const selectedValue = forceDelivery ? "delivery" : value;
  
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Méthode de réception
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          value={selectedValue}
          onChange={forceDelivery ? () => {} : (e) => onChange(e.target.value)}
        >
          <FormControlLabel 
            value="pickup"
            control={<Radio disabled={forceDelivery} />}
            label={
              <Box>
                <Typography variant="subtitle1">Récupérer au dépôt</Typography>
                <Typography variant="body2" color="text.secondary">
                  Gratuit
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="delivery"
            control={<Radio disabled={forceDelivery} />}
            label={
              <Box>
                <Typography variant="subtitle1">Livraison par NDS</Typography>
                <Typography variant="body2" color="text.secondary">
                  €{DELIVERY_FEE.toFixed(2)}
                </Typography>
              </Box>
            }
          />
        </RadioGroup>
        {forceDelivery && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Livraison obligatoire pour cet article.
          </Typography>
        )}
      </FormControl>
    </Paper>
  );
}
