import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ProductCard from "./ProductCard/ProductCard";
import { getSimilarPacks } from "../services/packs.service";
import "./SimilarProductsCarousel.scss"; // Réutiliser les mêmes styles

const SimilarPacksCarousel = ({ currentPackId, category, navCategory }) => {
  const [similarPacks, setSimilarPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const fetchSimilarPacks = async () => {
      try {
        setLoading(true);
        console.log("Récupération des packs similaires pour:", {
          currentPackId,
          category,
          navCategory,
        });

        if (!category && !navCategory) {
          console.warn("Catégorie et navCategory non définies ou vides");
          setLoading(false);
          setSimilarPacks([]);
          return;
        }

        const packs = await getSimilarPacks(
          currentPackId,
          category,
          navCategory
        );
        console.log(`Packs similaires récupérés (${packs.length}):`, packs);

        if (packs && packs.length > 0) {
          setSimilarPacks(packs);
        } else {
          console.log("Aucun pack similaire trouvé");
          setSimilarPacks([]);
        }
      } catch (err) {
        console.error("Erreur détaillée:", err);
        setError(null); // Ne pas afficher d'erreur à l'utilisateur
        setSimilarPacks([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentPackId) {
      fetchSimilarPacks();
    }
  }, [currentPackId, category, navCategory]);

  const handleScroll = (direction) => {
    const container = document.querySelector(".similar-products__container");
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.8;
    const newPosition =
      scrollPosition + (direction === "left" ? -scrollAmount : scrollAmount);

    // Limiter le défilement
    const maxScroll = container.scrollWidth - container.offsetWidth;
    const finalPosition = Math.max(0, Math.min(newPosition, maxScroll));

    setScrollPosition(finalPosition);
    container.scrollTo({
      left: finalPosition,
      behavior: "smooth",
    });
  };

  if (loading)
    return <Typography>Chargement des packs similaires...</Typography>;
  if (!similarPacks || similarPacks.length === 0) return null;

  // Déterminer si nous devons afficher les boutons de navigation
  const shouldShowNavigation = similarPacks.length > 1;

  return (
    <Box className="similar-products">
      <Typography variant="h4" gutterBottom>
        Packs similaires
      </Typography>
      <Box className="similar-products__wrapper">
        {shouldShowNavigation && (
          <IconButton
            className="similar-products__nav-button similar-products__nav-button--left"
            onClick={() => handleScroll("left")}
            disabled={scrollPosition === 0}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        <Box className="similar-products__container">
          {similarPacks.map((pack) => (
            <Box key={pack._id} className="similar-products__item">
              <ProductCard product={{ ...pack, isPack: true }} />
            </Box>
          ))}
        </Box>

        {shouldShowNavigation && (
          <IconButton
            className="similar-products__nav-button similar-products__nav-button--right"
            onClick={() => handleScroll("right")}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default SimilarPacksCarousel;
