import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ProductCard from "./ProductCard/ProductCard";
import { getSimilarProducts } from "../services/products.service";
import "./SimilarProductsCarousel.scss";

const SimilarProductsCarousel = ({ currentProductId, category }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        console.log("Récupération des produits similaires pour:", {
          currentProductId,
          category,
        });

        if (!category) {
          console.warn("Catégorie non définie ou vide");
          setLoading(false);
          setSimilarProducts([]);
          return;
        }

        const products = await getSimilarProducts(currentProductId, category);
        console.log(
          `Produits similaires récupérés (${products.length}):`,
          products
        );

        if (products && products.length > 0) {
          // Limiter à 4 produits maximum
          const limitedProducts = products.slice(0, 4);
          setSimilarProducts(limitedProducts);
          setVisibleProducts(limitedProducts);
        } else {
          console.log("Aucun produit similaire trouvé");
          setSimilarProducts([]);
          setVisibleProducts([]);
        }
      } catch (err) {
        console.error("Erreur détaillée:", err);
        setError(null);
        setSimilarProducts([]);
        setVisibleProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      fetchSimilarProducts();
    }
  }, [currentProductId, category]);

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
    return <Typography>Chargement des produits similaires...</Typography>;
  if (!similarProducts || similarProducts.length === 0) return null;

  // Déterminer si nous devons afficher les boutons de navigation
  // Les boutons sont nécessaires seulement si la largeur de tous les produits
  // dépasse la largeur du conteneur
  const shouldShowNavigation = similarProducts.length > 1;

  return (
    <Box className="similar-products">
      <Typography variant="h4" gutterBottom>
        Produits similaires
      </Typography>
      <Box className="similar-products__wrapper">
        {shouldShowNavigation && (
          <IconButton
            className="similar-products__nav-button similar-products__nav-button--left"
            onClick={() => handleScroll("left")}
            disabled={scrollPosition === 0}
          ></IconButton>
        )}

        <Box className="similar-products__container">
          {similarProducts.map((product) => (
            <Box key={product._id} className="similar-products__item">
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>

        {shouldShowNavigation && (
          <IconButton
            className="similar-products__nav-button similar-products__nav-button--right"
            onClick={() => handleScroll("right")}
          ></IconButton>
        )}
      </Box>
    </Box>
  );
};

export default SimilarProductsCarousel;
