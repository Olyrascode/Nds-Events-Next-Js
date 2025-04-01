import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  Box,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export default function ClosedDaysList({ closedDays, onDelete, loading }) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!closedDays || closedDays.length === 0) {
    return (
      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ my: 4 }}
      >
        Aucun jour fermé enregistré.
      </Typography>
    );
  }

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    try {
      // Convertir la chaîne ISO en objet Date
      const date =
        typeof dateString === "string" ? parseISO(dateString) : dateString;
      // Formater la date
      return format(date, "EEEE dd MMMM yyyy", { locale: fr });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return dateString;
    }
  };

  // Tri des jours fermés du plus récent au plus ancien
  const sortedClosedDays = [...closedDays].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}>
            <TableCell>
              <Typography fontWeight="bold">Date</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">Motif</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">Créé le</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography fontWeight="bold">Actions</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedClosedDays.map((day) => (
            <TableRow key={day._id} hover>
              <TableCell>
                <Typography>{formatDate(day.date)}</Typography>
              </TableCell>
              <TableCell>{day.reason}</TableCell>
              <TableCell>
                {day.createdAt ? formatDate(day.createdAt) : "N/A"}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Supprimer">
                  <IconButton
                    color="error"
                    onClick={() => onDelete(day._id)}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
