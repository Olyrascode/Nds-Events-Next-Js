import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fr } from "date-fns/locale";
import TextField from "@mui/material/TextField";
import ClosedDaysList from "./ClosedDaysList";
import {
  getAllClosedDays,
  addClosedDay,
  deleteClosedDay,
} from "../../../services/closedDays.service";

export default function ClosedDaysTab() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [reason, setReason] = useState("");
  const [closedDays, setClosedDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchClosedDays = async () => {
    setLoading(true);
    try {
      const data = await getAllClosedDays();
      setClosedDays(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des jours fermés");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClosedDays();
  }, []);

  const handleAddClosedDay = async () => {
    if (!selectedDate) {
      setError("Veuillez sélectionner une date");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const dateToSend = new Date(selectedDate);
      dateToSend.setHours(12, 0, 0, 0);

      await addClosedDay({
        date: dateToSend.toISOString(),
        reason: reason || "Jour fermé",
      });

      await fetchClosedDays();
      setSelectedDate(null);
      setReason("");
      setSuccess("Jour fermé ajouté avec succès");

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError("Erreur lors de l'ajout du jour fermé");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClosedDay = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteClosedDay(id);
      await fetchClosedDays();
      setSuccess("Jour fermé supprimé avec succès");

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError("Erreur lors de la suppression du jour fermé");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Gestion des jours fermés
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Les jours fermés sont bloqués dans tous les calendriers de
          réservation.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <DatePicker
            label="Sélectionner une date"
            value={selectedDate}
            onChange={setSelectedDate}
            format="dd/MM/yyyy"
            disablePast
          />

          <TextField
            label="Motif de fermeture"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Férié, maintenance, etc."
            sx={{ minWidth: 250 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddClosedDay}
            disabled={loading || !selectedDate}
          >
            {loading ? <CircularProgress size={24} /> : "Ajouter un jour fermé"}
          </Button>
        </Box>

        <ClosedDaysList
          closedDays={closedDays}
          onDelete={handleDeleteClosedDay}
          loading={loading}
        />
      </Paper>
    </LocalizationProvider>
  );
}
