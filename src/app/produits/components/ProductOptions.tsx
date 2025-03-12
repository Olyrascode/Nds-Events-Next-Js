
// import { useState, useEffect } from 'react';
// import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';

// export default function ProductOptions({ options, selectedOptions, onChange }) {

//   const handleOptionChange = (optionName, value) => {
//     const option = options.find(opt => opt.name === optionName);
//     const valueIndex = option.values.indexOf(value);
//     const price = option.prices[valueIndex];
    
//     onChange((prevSelectedOptions) => ({
//       ...prevSelectedOptions,
//       [optionName]: {
//         name: optionName,
//         value,
//         price
//       }
//     }));
//   };

//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         Option du produit
//       </Typography>
//       {options.map((option) => (
//         <FormControl key={option.name} fullWidth margin="normal">
//           <InputLabel>{option.name}</InputLabel>
//           <Select
//             value={selectedOptions[option.name]?.value || ''}
//             label={option.name}
//             onChange={(e) => handleOptionChange(option.name, e.target.value)}
//             required
//           >
//             {option.values.map((value, index) => (
//               <MenuItem key={index} value={value}>
//                 {value} | +{option.prices[index]}€/jours
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       ))}
//     </Box>
//   );
// }
import { Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

export default function ProductOptions({ options, selectedOptions, onChange }) {

  const handleOptionChange = (optionName, value) => {
    // Récupérer l'option correspondante
    const option = options.find(opt => opt.name === optionName);
    // Chercher l'objet valeur sélectionnée
    const valueObject = option.values.find(v => v.value === value);
    // Si trouvé, on récupère le prix et le flag deliveryMandatory
    const price = valueObject ? valueObject.price : 0;
    const deliveryMandatory = valueObject ? valueObject.deliveryMandatory : false;
    
    onChange((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [optionName]: {
        name: optionName,
        value,
        price,
        deliveryMandatory
      }
    }));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Options du produit
      </Typography>
      {options.map((option) => (
        <FormControl key={option.name} fullWidth margin="normal">
          <InputLabel>{option.name}</InputLabel>
          <Select
            value={selectedOptions[option.name]?.value || ''}
            label={option.name}
            onChange={(e) => handleOptionChange(option.name, e.target.value)}
            required
          >
            {option.values.map((valueObj, index) => (
              <MenuItem key={index} value={valueObj.value}>
                {valueObj.value} | +{valueObj.price}€/jours {valueObj.deliveryMandatory ? '(Livraison obligatoire)' : ''}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Box>
  );
}
