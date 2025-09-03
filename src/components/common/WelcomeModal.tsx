"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const WelcomeModal = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // Vérifier si la modal a déjà été affichée dans cette session
    const hasSeenWelcome = sessionStorage.getItem("welcomeModalShown");

    if (!hasSeenWelcome) {
      // Délai de 1 seconde pour que la page se charge complètement
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    // Marquer que la modal a été vue dans cette session
    sessionStorage.setItem("welcomeModalShown", "true");
  };

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "90%" : "600px",
    maxWidth: "90vw",
    maxHeight: "90vh",
    overflow: "auto",
    bgcolor: "black",
    border: "3px solid white",
    borderRadius: 10,
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="welcome-modal-title"
      aria-describedby="welcome-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="welcome-modal-title"
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#ff6226",
            textAlign: "center",
            mb: 3,
          }}
        >
          Bienvenue sur la boutique NDS Event&apos;s de location de matériel de
          réception !
        </Typography>

        <Divider sx={{ mb: 3, bgcolor: "white" }} />

        <Typography
          id="welcome-modal-description"
          variant="body1"
          sx={{ mb: 2, lineHeight: 1.6, color: "white" }}
        >
          Vous pouvez y commander tous les produits pour votre événement,
          vaisselle, mobilier, tentes, etc...
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 2, lineHeight: 1.6, color: "white" }}
        >
          Les tarifs de base indiqués sur notre site sont donnés pour des
          locations de 1 à 4 jours.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 2,
            lineHeight: 1.6,
            fontWeight: "600",
            color: "#ff6226",
          }}
        >
          Le minimum de commande est de 49 € TTC de location (hors frais de
          livraison éventuels).
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 2, lineHeight: 1.6, color: "white" }}
        >
          Pour toute commande, veuillez la passer directement en ligne en
          sélectionnant vos produits et leurs options ainsi que les dates de
          location, puis précisez si vous souhaitez une livraison ou récupérer
          le matériel à nos locaux (vous pouvez retrouver cette option en
          dernière étape de commande).
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 3,
            lineHeight: 1.6,
            fontWeight: "600",
            color: "#ff6226",
          }}
        >
          Le matériel n&apos;est réservé et les commandes validées qu&apos;une
          fois le paiement reçu.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 3,
            lineHeight: 1.6,
            fontStyle: "italic",
            color: "white",
          }}
        >
          Pour toute autre question, vous pouvez vous référer à nos Conditions
          Générales de Vente ou notre FOIRE AUX QUESTIONS.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleClose}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "600",
              bgcolor: "#ff6226",
              color: "white",
              "&:hover": {
                bgcolor: "white",
                color: "black",
              },
            }}
          >
            Commencer mes achats
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default WelcomeModal;
