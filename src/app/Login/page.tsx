"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Link,
  Alert,
} from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const { login, resetPassword } = useAuth();
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError("");
      await login(email, password);
      router.push("/");
    } catch {
      setError("Erreur de connexion");
    }
  };

  const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError("");
      setSuccessMessage("");
      await resetPassword(email);
      setSuccessMessage(
        "Un email de réinitialisation a été envoyé si cette adresse est associée à un compte."
      );
    } catch {
      setError("Erreur lors de la demande de réinitialisation");
    }
  };

  const toggleForm = () => {
    setShowResetForm(!showResetForm);
    setError("");
    setSuccessMessage("");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {showResetForm ? "Réinitialisation du mot de passe" : "Connexion"}
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

        {showResetForm ? (
          <form onSubmit={handleResetSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Envoyer l'email de réinitialisation
            </Button>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link
                component="button"
                variant="body2"
                onClick={toggleForm}
                sx={{ cursor: "pointer" }}
              >
                Retour à la connexion
              </Link>
            </Box>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Se Connecter
            </Button>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link
                component="button"
                variant="body2"
                onClick={toggleForm}
                sx={{ cursor: "pointer" }}
              >
                Mot de passe oublié ?
              </Link>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
}
