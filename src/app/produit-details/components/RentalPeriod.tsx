"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import {
  DatePicker as MuiDatePicker,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { addDays, isSunday, format, isSameDay, isSaturday } from "date-fns";
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
  disableWeekends?: boolean;
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
  disableWeekends = false,
}: RentalPeriodProps) {
  const [closedDays, setClosedDays] = useState<Date[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Références pour suivre l'état des pickers
  const startDateOpened = useRef<boolean>(false);
  const endDateOpened = useRef<boolean>(false);

  // Détection de l'appareil mobile
  const isMobile = useMediaQuery("(max-width:600px)");

  // Assure que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
  // ou si les week-ends sont désactivés et que c'est un samedi
  const isDayDisabled = (date: Date): boolean => {
    // Vérifier si c'est un dimanche
    if (isSunday(date)) return true;

    // Si disableWeekends est true, vérifier si c'est un samedi
    if (disableWeekends && isSaturday(date)) return true;

    // Vérifier si c'est un jour fermé par l'admin
    return closedDays.some((closedDate) => isSameDay(closedDate, date));
  };

  // Personnaliser le rendu des jours pour styliser les jours fermés
  const renderDay = (
    day: Date,
    selectedDates: (Date | null)[],
    pickersDayProps: PickersDayProps<Date>
  ): React.ReactElement => {
    if (isDayDisabled(day)) {
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

  // Solution spécifique pour les mobiles
  const getDatePickerProps = (isStartDate: boolean) => {
    const commonProps = {
      renderDay,
      shouldDisableDate: isDayDisabled,
      onOpen: () => {
        if (isStartDate) {
          startDateOpened.current = true;
        } else {
          endDateOpened.current = true;
        }
      },
      onClose: () => {
        if (isStartDate) {
          startDateOpened.current = false;
        } else {
          endDateOpened.current = false;
        }
      },
    };

    // Props spécifiques pour mobile et desktop
    if (isMobile) {
      return {
        ...commonProps,
        // Pour les appareils mobiles, rendre le champ plus grand pour être plus facile à toucher
        slotProps: {
          textField: {
            fullWidth: true,
            sx: {
              "& .MuiInputBase-root": {
                height: "48px",
                fontSize: "16px", // Évite le zoom automatique sur iOS
              },
            },
            // Assurer que le focus sur le champ, mais seulement la première fois
            onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
              const isOpened = isStartDate
                ? startDateOpened.current
                : endDateOpened.current;

              // N'ouvrir que si ce n'est pas déjà ouvert
              if (!isOpened) {
                const target = e.currentTarget.querySelector("button");
                if (target) {
                  target.click();
                }
              }
            },
            // Forcer le champ à utiliser l'attribut inputmode numérique pour les claviers mobiles
            inputProps: {
              inputMode: "numeric" as const, // Correction du type
            },
          },
          // Améliorer la taille des touches du calendrier sur mobile
          day: {
            sx: {
              padding: "8px",
              margin: "2px",
            },
          },
        },
      };
    }

    return {
      ...commonProps,
      slotProps: {
        textField: {
          fullWidth: true,
          onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.currentTarget.querySelector("button");
            if (target && !disabled && !loading) {
              target.click();
            }
          },
        },
      },
    };
  };

  // Ne pas rendre le composant côté serveur
  if (!isMounted) {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sélectionner votre jour de début et votre jour de fin de location
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box
            sx={{
              width: "100%",
              height: "56px",
              bgcolor: "#f5f5f5",
              borderRadius: "4px",
            }}
          />
          <Box
            sx={{
              width: "100%",
              height: "56px",
              bgcolor: "#f5f5f5",
              borderRadius: "4px",
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Sélectionner votre jour de début et votre jour de fin de location
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Date de début */}
        <DatePicker
          label="Début de location"
          value={startDate}
          onChange={handleStartDateChange}
          minDate={minStartDate}
          disabled={disabled || loading}
          {...getDatePickerProps(true)}
        />

        {/* Date de fin */}
        <DatePicker
          label="Fin de location"
          value={endDate}
          onChange={(date: Date | null) => {
            if (!disabled) onEndDateChange(date);
          }}
          minDate={startDate ? addDays(startDate, 1) : undefined}
          disabled={!startDate || disabled || loading}
          {...getDatePickerProps(false)}
        />
      </Box>
    </Box>
  );
}
