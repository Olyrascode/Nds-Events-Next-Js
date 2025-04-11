import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

export interface OptionValue {
  value: string;
  price: number;
  deliveryMandatory: boolean;
}

export interface ProductOption {
  id: string;
  name: string;
  price: number;
  values?: OptionValue[];
}

export interface SelectedOption {
  id: string;
  name: string;
  value?: string;
  price: number;
  deliveryMandatory?: boolean;
}

export interface ProductOptionsProps {
  options: ProductOption[];
  selectedOptions: Record<string, SelectedOption>;
  onChange: (
    callback: (
      prev: Record<string, SelectedOption>
    ) => Record<string, SelectedOption>
  ) => void;
}

export default function ProductOptions({
  options,
  selectedOptions,
  onChange,
}: ProductOptionsProps) {
  const handleOptionChange = (optionName: string, value: string) => {
    const option = options.find((opt) => opt.name === optionName);
    const valueObject = option?.values?.find((v) => v.value === value);
    const price = valueObject ? valueObject.price : option?.price || 0;
    const deliveryMandatory = valueObject
      ? valueObject.deliveryMandatory
      : false;

    onChange((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [optionName]: {
        id: option?.id || "",
        name: optionName,
        value,
        price,
        deliveryMandatory,
      },
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
            value={selectedOptions[option.name]?.value || ""}
            label={option.name}
            onChange={(e) => handleOptionChange(option.name, e.target.value)}
            required
          >
            {option.values?.map((valueObj, index) => (
              <MenuItem key={index} value={valueObj.value}>
                {valueObj.value} | +{valueObj.price}€/jours{" "}
                {valueObj.deliveryMandatory ? "(Livraison obligatoire)" : ""}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Box>
  );
}
