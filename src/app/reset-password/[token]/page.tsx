"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Alert,
  Link,
} from "@mui/material";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  const token = params.token as string;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation basique
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";
      const response = await fetch(`${API_URL}/api/auth/validate-reset-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      setSuccess(true);
      // Redirection vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push("/Login");
      }, 3000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la réinitialisation du mot de passe";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Réinitialisation du mot de passe
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Votre mot de passe a été réinitialisé avec succès! Vous allez être
            redirigé vers la page de connexion.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nouveau mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Confirmer le mot de passe"
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
              {loading
                ? "Réinitialisation en cours..."
                : "Réinitialiser le mot de passe"}
            </Button>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link href="/Login" sx={{ cursor: "pointer" }}>
                Retour à la connexion
              </Link>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
}
