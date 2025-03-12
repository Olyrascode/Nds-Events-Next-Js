import { useState } from 'react';
import { Grid, TextField, Typography, Box, Button, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const calculateDeliveryFees = (distanceAllerKm) => {
  const ratePerKm = 0.60; // Tarif TTC par km
  const forfaitAgglomeration = 60; // Forfait pour les livraisons ≤ 25km
  const totalDistance = distanceAllerKm * 4; // Aller-retour livraison + récupération

  if (distanceAllerKm <= 25) {
    return forfaitAgglomeration;
  } else {
    // 🔧 On facture les km excédentaires au tarif par km, en plus du forfait de 60 €
    return (totalDistance - (25 * 4)) * ratePerKm + forfaitAgglomeration;
  }
};

export default function ShippingForm({ shippingInfo, setShippingInfo, shippingFee, setShippingFee }) {
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
    // 🔧 Réinitialiser les frais si l'utilisateur modifie l'adresse
    setShippingFee(null);
  };

  const calculateFees = async () => {
    // 🔧 Construction de l'adresse de destination à partir du formulaire
    const destination = `${shippingInfo.address}, ${shippingInfo.zipCode} ${shippingInfo.city}`;
    // 🔧 Adresse de ton local
    const origin = "8 Avenue Victor Hugo - 38130 Échirolles, France.";

    try {
      // 🔧 Utilisation de la variable d'environnement pour l'URL du back-end
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const url = `${apiUrl}/api/distance?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
      const response = await fetch(url);
      const data = await response.json();

      // 🔧 Vérification robuste de la structure de la réponse
      if (
        data.rows &&
        Array.isArray(data.rows) &&
        data.rows.length > 0 &&
        data.rows[0].elements &&
        Array.isArray(data.rows[0].elements) &&
        data.rows[0].elements.length > 0 &&
        data.rows[0].elements[0].status === "OK"
      ) {
        // La distance renvoyée est en mètres, on convertit en km
        const distanceKm = data.rows[0].elements[0].distance.value / 1000;
        setDistance(distanceKm);
        const fee = calculateDeliveryFees(distanceKm);
        // 🔧 Met à jour le frais de livraison dans le parent
        setShippingFee(fee);
        setError('');
      } else {
        console.error("Réponse inattendue de l'API :", data);
        setError("Impossible de calculer la distance. Réponse inattendue de l'API.");
        setShippingFee(null);
        setDistance(null);
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des données.");
    }
  };

  // 🔧 Vérifie si tous les champs requis sont remplis
  const isAddressComplete = shippingInfo.address && shippingInfo.city && shippingInfo.zipCode;

  return (
    <Box>
        <Box mb={3}>
        <Typography variant="h5" mb={2}>
            Livraison par NDS
          </Typography>
      <Tooltip 
        arrow // 🔧 Ajoute une flèche sur le tooltip
        placement="top" // 🔧 Positionne le tooltip au-dessus de l'élément
        title={
          <>
            <Typography variant="subtitle1">
              Toutes nos livraisons sont calculées depuis l'entrepôt NDS.
            </Typography>
            <Typography variant="subtitle1">
              Nos prix incluent un trajet de livraison et un trajet de récupération.
            </Typography>
          </>
        }
      >
          <Typography variant="subtitle1">
              Forfait agglomération (25 km maximum) : 50€ HT (60€ TTC).
            </Typography>
            <Typography variant="subtitle1">
              Au-delà de 25 km : 2,40 € TTC (2€ HT) par km.
            </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <InfoIcon fontSize="small" sx={{ mr: 1 }} /> {/* 🔧 Icône d'info dans un rond */}
          <Typography variant="h7">
            Détail des tarifs de livraison
          </Typography>
        </Box>

      </Tooltip>
      <Typography variant="h5" mt={2}>
            Coordonnées de livraison
          </Typography>
    </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            name="address"
            label="Street Address"
            fullWidth
            value={shippingInfo.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="city"
            label="City"
            fullWidth
            value={shippingInfo.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="zipCode"
            label="Zip Code"
            fullWidth
            value={shippingInfo.zipCode}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      
      <Box mt={2}>
        <Button 
          variant="contained" 
          onClick={calculateFees} 
          disabled={!isAddressComplete} // 🔧 Bouton désactivé si les champs sont incomplets
        >
          Calculer les frais de livraison
        </Button>
      </Box>
      
      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
      
      {shippingFee !== null && (
        <Box mt={2}>
          <Typography variant="subtitle1">
            Distance calculée : {distance ? distance.toFixed(2) : '--'} km
          </Typography>
          <Typography variant="subtitle1">
            Frais de livraison : {shippingFee.toFixed(2)} € TTC
          </Typography>
        </Box>
      )}
    </Box>
  );
}
