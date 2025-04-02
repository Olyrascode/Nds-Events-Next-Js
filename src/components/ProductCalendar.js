import React, { useState, useEffect } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fr } from "date-fns/locale";
import { getClosedDaysBetweenDates } from "../services/closedDays.service";
import { styled } from "@mui/material/styles";

// Style personnalisé pour les jours du calendrier
const StyledCalendar = styled(DateCalendar)(({ theme }) => ({
  "& .MuiPickersDay-root": {
    "&.sunday": {
      backgroundColor: "#fff9c4", // Jaune clair pour les dimanches
      "&:hover": {
        backgroundColor: "#fff59d", // Jaune un peu plus foncé au hover
      },
    },
    "&.closed-day": {
      backgroundColor: "#ffebee", // Rouge clair pour les jours fermés
      color: theme.palette.error.main,
      "&:hover": {
        backgroundColor: "#ffcdd2", // Rouge un peu plus foncé au hover
      },
    },
    "&.disabled": {
      textDecoration: "line-through",
      color: theme.palette.text.disabled,
    },
  },
}));

const ProductCalendar = ({ onDateSelect, disabledDates = [] }) => {
  const [date, setDate] = useState(null);
  const [closedDays, setClosedDays] = useState([]);

  useEffect(() => {
    const fetchClosedDays = async () => {
      try {
        const today = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(today.getFullYear() + 1);

        const closedDaysData = await getClosedDaysBetweenDates(
          today.toISOString(),
          nextYear.toISOString()
        );
        setClosedDays(closedDaysData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des jours fermés:",
          error
        );
      }
    };

    fetchClosedDays();
  }, []);

  const isDateDisabled = (date) => {
    // Vérifier si la date est dans la liste des dates désactivées
    return disabledDates.some(
      (disabledDate) =>
        new Date(disabledDate).toDateString() === date.toDateString()
    );
  };

  const isClosedDay = (date) => {
    return closedDays.some(
      (closedDay) =>
        new Date(closedDay.date).toDateString() === date.toDateString()
    );
  };

  const isSunday = (date) => {
    return date.getDay() === 0; // 0 représente dimanche
  };

  const handleDateChange = (newDate) => {
    if (!isClosedDay(newDate)) {
      setDate(newDate);
      onDateSelect(newDate);
    }
  };

  const dayOfWeekFormatter = (day) => {
    return day.charAt(0).toUpperCase();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <StyledCalendar
        value={date}
        onChange={handleDateChange}
        dayOfWeekFormatter={dayOfWeekFormatter}
        slots={{
          day: (props) => {
            const isClosed = isClosedDay(props.day);
            const isDaySunday = isSunday(props.day);
            const isDisabled = isDateDisabled(props.day);

            return (
              <div
                onClick={() => !isClosed && props.onClick()}
                className={`MuiPickersDay-root ${isDaySunday ? "sunday" : ""} ${
                  isClosed ? "closed-day" : ""
                } ${isDisabled ? "disabled" : ""}`}
                style={{
                  cursor: isClosed ? "not-allowed" : "pointer",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  margin: "2px",
                }}
              >
                {props.day.getDate()}
              </div>
            );
          },
        }}
        disablePast
      />
    </LocalizationProvider>
  );
};

export default ProductCalendar;
