import React, { useState, useEffect } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getClosedDaysBetweenDates } from "../services/closedDays.service";

const ProductCalendar = ({ onDateSelect, disabledDates = [] }) => {
  const [date, setDate] = useState(new Date());
  const [closedDays, setClosedDays] = useState([]);

  // Fonction utilitaire pour normaliser les dates
  const normalizeDateToLocalMidnight = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(12, 0, 0, 0);
    return normalizedDate;
  };

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
        setClosedDays(
          closedDaysData.map((day) => ({
            ...day,
            date: normalizeDateToLocalMidnight(day.date),
          }))
        );
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des jours fermés:",
          error
        );
      }
    };

    fetchClosedDays();
  }, []);

  const tileDisabled = ({ date }) => {
    const normalizedTileDate = normalizeDateToLocalMidnight(date);

    // Vérifier si la date est dans la liste des jours fermés
    const isClosed = closedDays.some(
      (closedDay) =>
        normalizeDateToLocalMidnight(closedDay.date).getTime() ===
        normalizedTileDate.getTime()
    );

    // Vérifier si la date est dans la liste des dates désactivées
    const isDisabled = disabledDates.some(
      (disabledDate) =>
        normalizeDateToLocalMidnight(new Date(disabledDate)).getTime() ===
        normalizedTileDate.getTime()
    );

    return isClosed || isDisabled;
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onDateSelect(newDate);
  };

  return (
    <div className="product-calendar">
      <Calendar
        onChange={handleDateChange}
        value={date}
        minDate={new Date()}
        tileDisabled={tileDisabled}
        locale="fr-FR"
        className="react-calendar"
      />
    </div>
  );
};

export default ProductCalendar;
