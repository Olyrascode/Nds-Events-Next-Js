import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import {
  DatePicker as MuiDatePicker,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { addDays, isSunday, format, isSameDay } from "date-fns";
import { styled } from "@mui/material/styles";
import { getClosedDaysBetweenDates } from "../../../services/closedDays.service";

// Style personnalisé pour les jours fermés - tout le jour en rouge
const StyledClosedDay = styled(PickersDay)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.contrastText,
  width: "100%", // S'assurer que le jour prend toute la largeur
  "&:hover": {
    backgroundColor: theme.palette.error.main,
  },
  "&.MuiPickersDay-root": {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
    borderRadius: "4px", // Un rectangle plutôt qu'un cercle
    opacity: 1,
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
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
const DatePicker =
  MuiDatePicker as React.ComponentType<ExtendedDatePickerProps>;

interface RentalPeriodProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (newDate: Date | null) => void;
  onEndDateChange: (newDate: Date | null) => void;
  minStartDate: Date;
  disabled?: boolean;
}

// Définir une interface pour les jours fermés
interface ClosedDay {
  _id: string;
  date: string;
  reason: string;
  createdAt: string;
  createdBy: string;
}

export default function RentalPeriod({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minStartDate,
  disabled = false,
}: RentalPeriodProps) {
  const [closedDays, setClosedDays] = useState<Date[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Charger les jours fermés pour les 6 prochains mois
  useEffect(() => {
    const fetchClosedDays = async () => {
      setLoading(true);
      try {
        const startDate = new Date();
        const endDate = addDays(startDate, 180); // 6 mois à l'avance

        const response = await getClosedDaysBetweenDates(
          format(startDate, "yyyy-MM-dd"),
          format(endDate, "yyyy-MM-dd")
        );

        // Convertir les dates en objets Date
        const closedDatesArray = response.map(
          (day: ClosedDay) => new Date(day.date)
        );
        setClosedDays(closedDatesArray);
      } catch (error) {
        console.error("Erreur lors du chargement des jours fermés:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClosedDays();
  }, []);

  // Fonction pour vérifier si un jour est fermé (dimanche ou jour fermé par l'admin)
  const isClosedDay = (date: Date): boolean => {
    // Vérifier si c'est un dimanche
    if (isSunday(date)) return true;

    // Vérifier si c'est un jour fermé par l'admin
    return closedDays.some((closedDate) => isSameDay(closedDate, date));
  };

  // Personnaliser le rendu des jours pour styliser les jours fermés
  const renderDay = (
    day: Date,
    selectedDates: (Date | null)[],
    pickersDayProps: PickersDayProps<Date>
  ): React.ReactElement => {
    if (isClosedDay(day)) {
      return <StyledClosedDay {...pickersDayProps} />;
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
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Date de début */}
        <DatePicker
          label="Début de location"
          value={startDate}
          onChange={handleStartDateChange}
          minDate={minStartDate}
          shouldDisableDate={isClosedDay}
          renderDay={renderDay} // Prop customisée
          disabled={disabled || loading}
          slotProps={{
            textField: {
              fullWidth: true,
              onClick: (e) => {
                const target = e.currentTarget.querySelector("button");
                if (target && !disabled && !loading) {
                  target.click();
                }
              },
            },
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
          shouldDisableDate={isClosedDay}
          renderDay={renderDay}
          disabled={!startDate || disabled || loading}
          slotProps={{
            textField: {
              fullWidth: true,
              onClick: (e) => {
                const target = e.currentTarget.querySelector("button");
                if (target && !(!startDate || disabled || loading)) {
                  target.click();
                }
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
