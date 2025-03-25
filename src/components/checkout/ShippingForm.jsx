import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Button,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const calculateDeliveryFees = (distanceAllerKm) => {
  const ratePerKm = 0.6; // Tarif TTC par km
  const forfaitAgglomeration = 60; // Forfait pour les livraisons ≤ 25km
  const totalDistance = distanceAllerKm * 4; // Aller-retour livraison + récupération

  if (distanceAllerKm <= 25) {
    return forfaitAgglomeration;
  } else {
    // 🔧 On facture les km excédentaires au tarif par km, en plus du forfait de 60 €
    return (totalDistance - 25 * 4) * ratePerKm + forfaitAgglomeration;
  }
};

// Fonction globale pour charger l'API Google Maps
const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    // Si l'API est déjà chargée, on résout immédiatement
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    // Si le script est déjà en cours de chargement, on attend
    if (window.googleMapsLoading) {
      window.googleMapsLoading.then(resolve).catch(reject);
      return;
    }

    // Création de la promesse de chargement
    window.googleMapsLoading = new Promise((resolveLoading, rejectLoading) => {
      // Création du callback global
      window.initGoogleMaps = () => {
        if (window.google && window.google.maps) {
          resolveLoading(window.google.maps);
        } else {
          rejectLoading(
            new Error("L'API Google Maps n'a pas été chargée correctement")
          );
        }
      };

      // Création et ajout du script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      script.onerror = () =>
        rejectLoading(
          new Error("Erreur lors du chargement de l'API Google Maps")
        );
      document.head.appendChild(script);
    });

    // Utilisation de la promesse de chargement
    window.googleMapsLoading.then(resolve).catch(reject);
  });
};

export default function ShippingForm({
  shippingInfo,
  setShippingInfo,
  shippingFee,
  setShippingFee,
}) {
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeGoogleMaps = async () => {
      try {
        await loadGoogleMapsScript();
        if (mounted) {
          setIsGoogleMapsLoaded(true);
        }
      } catch (err) {
        console.error("Erreur lors du chargement de l'API Google Maps:", err);
        if (mounted) {
          setError(
            "Erreur lors du chargement de l'API Google Maps. Veuillez rafraîchir la page."
          );
        }
      }
    };

    initializeGoogleMaps();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
    // 🔧 Réinitialiser les frais si l'utilisateur modifie l'adresse
    setShippingFee(null);
  };

  const handleAddressChange = (event) => {
    const value = event.target.value;
    setShippingInfo({
      ...shippingInfo,
      address: value,
    });
    setShippingFee(null);

    if (!isGoogleMapsLoaded) {
      setError(
        "L'API Google Maps n'est pas encore chargée. Veuillez patienter."
      );
      return;
    }

    if (value.length > 2) {
      setIsLoading(true);
      try {
        const service = new window.google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          {
            input: value,
            componentRestrictions: { country: "fr" },
          },
          (predictions, status) => {
            setIsLoading(false);
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setAddressSuggestions(
                predictions.map((prediction) => ({
                  label: prediction.description,
                  value: prediction.place_id,
                }))
              );
            } else {
              setAddressSuggestions([]);
            }
          }
        );
      } catch (err) {
        console.error("Erreur lors de l'autocomplétion :", err);
        setError("Erreur lors de la recherche d'adresse");
        setIsLoading(false);
      }
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleAddressSelect = async (event, newValue) => {
    if (!isGoogleMapsLoaded) {
      setError(
        "L'API Google Maps n'est pas encore chargée. Veuillez patienter."
      );
      return;
    }

    if (newValue) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ placeId: newValue.value }, (results, status) => {
          if (status === "OK") {
            const addressComponents = results[0].address_components;
            const streetNumber =
              addressComponents.find((component) =>
                component.types.includes("street_number")
              )?.long_name || "";
            const route =
              addressComponents.find((component) =>
                component.types.includes("route")
              )?.long_name || "";
            const city =
              addressComponents.find((component) =>
                component.types.includes("locality")
              )?.long_name || "";
            const postalCode =
              addressComponents.find((component) =>
                component.types.includes("postal_code")
              )?.long_name || "";

            setShippingInfo({
              ...shippingInfo,
              address: `${streetNumber} ${route}`,
              city: city,
              zipCode: postalCode,
            });
            setAddressSuggestions([]);
          } else {
            setError("Impossible de récupérer les détails de l'adresse");
          }
        });
      } catch (err) {
        console.error("Erreur lors de la géocodification :", err);
        setError("Erreur lors de la récupération des détails de l'adresse");
      }
    }
  };

  const calculateFees = async () => {
    // 🔧 Construction de l'adresse de destination à partir du formulaire
    const destination = `${shippingInfo.address}, ${shippingInfo.zipCode} ${shippingInfo.city}`;
    // 🔧 Adresse de ton local
    const origin = "8 Avenue Victor Hugo - 38130 Échirolles, France.";

    try {
      // 🔧 Utilisation de la variable d'environnement pour l'URL du back-end
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const url = `${apiUrl}/api/distance?origin=${encodeURIComponent(
        origin
      )}&destination=${encodeURIComponent(destination)}`;
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
        setError("");
      } else {
        console.error("Réponse inattendue de l'API :", data);
        setError(
          "Impossible de calculer la distance. Réponse inattendue de l'API."
        );
        setShippingFee(null);
        setDistance(null);
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des données.");
    }
  };

  // 🔧 Vérifie si tous les champs requis sont remplis
  const isAddressComplete =
    shippingInfo.address && shippingInfo.city && shippingInfo.zipCode;

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
                Nos prix incluent un trajet de livraison et un trajet de
                récupération.
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
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <InfoIcon fontSize="small" sx={{ mr: 1 }} />{" "}
            {/* 🔧 Icône d'info dans un rond */}
            <Typography variant="h7">Détail des tarifs de livraison</Typography>
          </Box>
        </Tooltip>
        <Typography variant="h5" mt={2}>
          Coordonnées de livraison
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            freeSolo
            options={addressSuggestions}
            loading={isLoading}
            value={shippingInfo.address}
            onChange={handleAddressSelect}
            disabled={!isGoogleMapsLoaded}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                name="address"
                label="Adresse"
                fullWidth
                onChange={handleAddressChange}
                placeholder={
                  isGoogleMapsLoaded
                    ? "Commencez à taper votre adresse..."
                    : "Chargement de l'API Google Maps..."
                }
                error={!isGoogleMapsLoaded}
                helperText={
                  !isGoogleMapsLoaded
                    ? "Veuillez patienter pendant le chargement de l'API"
                    : ""
                }
              />
            )}
            renderOption={(props, option) => <li {...props}>{option.label}</li>}
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              return option.label;
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="city"
            label="Ville"
            fullWidth
            value={shippingInfo.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="zipCode"
            label="Code Postal"
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
            Distance calculée : {distance ? distance.toFixed(2) : "--"} km
          </Typography>
          <Typography variant="subtitle1">
            Frais de livraison : {shippingFee.toFixed(2)} € TTC
          </Typography>
        </Box>
      )}
    </Box>
  );
}
