
import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  DatePicker as MuiDatePicker,
  PickersDay,
  PickersDayProps,
} from '@mui/x-date-pickers';
import { addDays, isSunday } from 'date-fns';
import { styled } from '@mui/material/styles';

// Style personnalisé pour les dimanches
const StyledSundayDay = styled(PickersDay)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.contrastText,
  borderRadius: '50%',
  '&:hover': {
    backgroundColor: theme.palette.error.main,
  },
}));

// Étendre le type du DatePicker pour autoriser la prop renderDay
interface ExtendedDatePickerProps
  extends React.ComponentProps<typeof MuiDatePicker> {
  renderDay?: (
    day: Date,
    selectedDates: (Date | null)[],
    pickersDayProps: PickersDayProps<Date>
  ) => React.ReactElement;
}

// Utiliser le type étendu sans recourir à "any"
const DatePicker = MuiDatePicker as React.ComponentType<ExtendedDatePickerProps>;

interface RentalPeriodProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (newDate: Date | null) => void;
  onEndDateChange: (newDate: Date | null) => void;
  minStartDate: Date;
  disabled?: boolean;
}

export default function RentalPeriod({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minStartDate,
  disabled = false,
}: RentalPeriodProps) {
  // Fonction pour désactiver les dimanches
  const disableSundays = (date: Date): boolean => isSunday(date);

  // Personnaliser le rendu des jours pour styliser les dimanches
  const renderDay = (
    day: Date,
    selectedDates: (Date | null)[],
    pickersDayProps: PickersDayProps<Date>
  ): React.ReactElement => {
    if (isSunday(day)) {
      return <StyledSundayDay {...pickersDayProps} />;
    }
    return <PickersDay {...pickersDayProps} />;
  };

  const handleStartDateChange = (newDate: Date | null): void => {
    if (!disabled) {
      onStartDateChange(newDate);
      // Réinitialiser la date de fin si la nouvelle date de début est supérieure ou égale à l'ancienne date de fin
      if (endDate && newDate && newDate >= endDate) {
        onEndDateChange(null);
      }
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Période de location
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Date de début */}
        <DatePicker
          label="Début de location"
          value={startDate}
          onChange={handleStartDateChange}
          minDate={minStartDate}
          shouldDisableDate={disableSundays}
          renderDay={renderDay} // Prop customisée
          disabled={disabled}
          slotProps={{
            textField: { fullWidth: true },
          }}
        />

        {/* Date de fin */}
        <DatePicker
          label="Fin de location"
          value={endDate}
          onChange={(date: Date | null) => {
            if (!disabled) onEndDateChange(date);
          }}
          minDate={startDate ? addDays(startDate, 1) : undefined}
          shouldDisableDate={disableSundays}
          renderDay={renderDay}
          disabled={!startDate || disabled}
          slotProps={{
            textField: { fullWidth: true },
          }}
        />
      </Box>
    </Box>
  );
}
