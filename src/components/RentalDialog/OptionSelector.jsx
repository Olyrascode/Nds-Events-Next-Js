import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert
} from '@mui/material';

export default function OptionSelector({ options = [], selectedOptions, onChange }) {
  if (!options || options.length === 0) return null;

  const handleOptionChange = (optionName, value) => {
    onChange({
      ...selectedOptions,
      [optionName]: value
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Select Options
      </Typography>
      {options.map((option, index) => (
        <FormControl key={index} fullWidth margin="normal" size="small">
          <InputLabel>{option.name}</InputLabel>
          <Select
            value={selectedOptions[option.name] || ''}
            label={option.name}
            onChange={(e) => handleOptionChange(option.name, e.target.value)}
            required
          >
            {option.values.map((value, i) => (
              <MenuItem key={i} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Box>
  );
}