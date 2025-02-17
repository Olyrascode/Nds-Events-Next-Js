
import { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Chip,
  Typography,
  Button,
  Grid,
  Paper,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function OptionsManager({ options, onChange }) {
  const [optionName, setOptionName] = useState('');
  // optionValues deviendra un tableau d'objets : { value, price, deliveryMandatory }
  const [optionValues, setOptionValues] = useState([]);
  const [tempValue, setTempValue] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempDeliveryMandatory, setTempDeliveryMandatory] = useState(false);

  const handleAddValue = () => {
    if (tempValue && tempPrice) {
      setOptionValues([
        ...optionValues,
        {
          value: tempValue,
          price: parseFloat(tempPrice),
          deliveryMandatory: tempDeliveryMandatory
        }
      ]);
      setTempValue('');
      setTempPrice('');
      setTempDeliveryMandatory(false);
    }
  };

  const handleRemoveValue = (index) => {
    setOptionValues(optionValues.filter((_, i) => i !== index));
  };

  const handleSaveOption = () => {
    if (optionName && optionValues.length > 0) {
      // Ici, on sauvegarde l'option avec une structure complète pour les valeurs.
      const newOption = {
        name: optionName,
        values: optionValues // Chaque valeur contient { value, price, deliveryMandatory }
      };
      onChange([...options, newOption]);
      
      // Reset form
      setOptionName('');
      setOptionValues([]);
    }
  };

  const handleRemoveOption = (index) => {
    onChange(options.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
       Options du produit
      </Typography>

      {/* Affichage des options existantes */}
      {options.map((option, optionIndex) => (
        <Paper key={optionIndex} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              {option.name}
            </Typography>
            <IconButton 
              color="error" 
              onClick={() => handleRemoveOption(optionIndex)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {option.values.map((item, index) => (
              <Chip
                key={index}
                label={`${item.value} - €${item.price}€/jours${item.deliveryMandatory ? ' (Livraison obligatoire)' : ''}`}
                onDelete={() => handleRemoveValue(index)}
              />
            ))}
          </Box>
        </Paper>
      ))}

      {/* Ajout d'une nouvelle option */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Ajouter une option
        </Typography>
        
        <TextField
          fullWidth
          label="Nom de l'option"
          value={optionName}
          onChange={(e) => setOptionName(e.target.value)}
          margin="normal"
        />

        {/* Liste des valeurs ajoutées pour cette option */}
        {optionValues.length > 0 && (
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Valeurs ajoutées:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {optionValues.map((item, index) => (
                <Chip
                  key={index}
                  label={`${item.value} - €${item.price}€/jours${item.deliveryMandatory ? ' (Livraison obligatoire)' : ''}`}
                  onDelete={() => handleRemoveValue(index)}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Formulaire pour ajouter une valeur */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Valeur"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label="Prix €/jours"
              type="number"
              value={tempPrice}
              onChange={(e) => setTempPrice(e.target.value)}
              size="small"
              inputProps={{ min: 0, step: "0.01" }}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempDeliveryMandatory}
                  onChange={(e) => setTempDeliveryMandatory(e.target.checked)}
                />
              }
              label="Livraison obligatoire"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={handleAddValue}
              fullWidth
            >
              Ajouter valeur
            </Button>
          </Grid>
        </Grid>

        {optionName && optionValues.length > 0 && (
          <Button
            variant="contained"
            onClick={handleSaveOption}
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            fullWidth
          >
            Sauvegarder l'option
          </Button>
        )}
      </Paper>
    </Box>
  );
}
