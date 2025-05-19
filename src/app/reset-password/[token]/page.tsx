"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext"; // Ajustez le chemin si nécessaire
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams(); // Pour récupérer le token de l'URL
  const { performPasswordReset } = useAuth(); // Nous ajouterons cette fonction à AuthContext

  useEffect(() => {
    if (params?.token) {
      if (Array.isArray(params.token)) {
        setToken(params.token[0]);
      } else {
        setToken(params.token);
      }
    }
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Le nouveau mot de passe doit comporter au moins 6 caractères.");
      return;
    }
    if (!token) {
      setError("Token de réinitialisation manquant ou invalide.");
      return;
    }

    setLoading(true);
    try {
      await performPasswordReset(token, newPassword);
      setSuccessMessage(
        "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter."
      );
      setTimeout(() => {
        router.push("/Login");
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(
          err.message || "Erreur lors de la réinitialisation du mot de passe."
        );
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token && !params?.token) {
    // Gérer le cas où le token n'est pas encore disponible ou manquant initialement
    // Pourrait afficher un loader ou un message, ou rediriger
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!token && params?.token) {
    // Token dans params mais pas encore dans l'état, attente useEffect
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>Chargement des informations...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Réinitialiser votre mot de passe
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Confirmer le nouveau mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}
