"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../../contexts/CartContext";
import Image from "next/image";
import { Container, Typography, Paper, Button, Alert } from "@mui/material";
import RentalPeriod from "../../produit-details/components/RentalPeriod";
import QuantitySelector from "../../produit-details/components/QuantitySelector";
import PackProducts from "../../PackDetails/components/PackProducts";
import PriceCalculation from "../../PackDetails/components/PriceCalculation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fr } from "date-fns/locale";
import { addDays } from "date-fns";
import { useRentalPeriod } from "../../../contexts/RentalperiodContext";
import "../../PackDetails/PackDetails.scss";
import SimilarPacksCarousel from "../../../components/SimilarPacksCarousel";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// Fonction utilitaire pour corriger les URLs d'images
const fixImageUrl = (url: string | undefined | null): string => {
  if (!url) return "";

  // Remplacer localhost:5000 par l'API_URL correct
  if (url.includes("localhost:5000")) {
    return url.replace("http://localhost:5000", API_URL);
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const apiURL = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  const imagePath = url.startsWith("/") ? url.slice(1) : url;
  if (!imagePath) return ""; // Éviter de retourner juste API_URL/api/files/
  return `${apiURL}/api/files/${imagePath}`;
};

// ─── INTERFACES ────────────────────────────────────────────────

interface PackProduct {
  product: {
    _id: string;
    title: string;
    imageUrl?: string;
    price: number;
  };
  quantity: number;
}

interface Pack {
  _id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  description?: string;
  products: PackProduct[];
  discountPercentage?: number;
  minQuantity?: number;
  category?: string;
  navCategory?: string;
  carouselImages?: Array<{
    url: string;
    fileName: string;
  }>;
}

// ─── COMPONENT ────────────────────────────────────────────────

export default function PackDetails({ pack }: { pack: Pack }) {
  console.log(
    "[PackDetailsClient] Received pack data:",
    JSON.parse(JSON.stringify(pack))
  );

  const { addToCart, cart } = useCart()!;
  const { rentalPeriod, setRentalPeriod } = useRentalPeriod()!;
  const { startDate, endDate } = rentalPeriod;

  const [quantity, setQuantity] = useState<number>(1);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [error] = useState<string | null>(null);
  const [productStockAvailability, setProductStockAvailability] = useState<
    Record<string, number>
  >({});
  const [maxPackQuantity, setMaxPackQuantity] = useState<number | null>(null);
  const [currentDisplayImage, setCurrentDisplayImage] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (pack && pack.imageUrl) {
      setCurrentDisplayImage(fixImageUrl(pack.imageUrl));
    } else if (
      pack &&
      pack.carouselImages &&
      pack.carouselImages.length > 0 &&
      pack.carouselImages[0].url
    ) {
      // Fallback to the first carousel image if main image is missing
      setCurrentDisplayImage(fixImageUrl(pack.carouselImages[0].url));
    }
  }, [pack]);

  const handleStartDateChange = (date: Date | null) => {
    setRentalPeriod({ ...rentalPeriod, startDate: date });
  };

  const handleEndDateChange = (date: Date | null) => {
    setRentalPeriod({ ...rentalPeriod, endDate: date });
  };

  const handleImageClick = (imageUrl: string) => {
    setCurrentDisplayImage(fixImageUrl(imageUrl));
  };

  useEffect(() => {
    async function fetchStockForPackProducts() {
      if (!pack || !pack.products || !startDate || !endDate) return;

      const productStockPromises = pack.products.map(
        async (packItem: PackProduct) => {
          if (!packItem.product || !packItem.product._id) {
            console.error(`Produit invalide dans le pack :`, packItem);
            return { productId: null, availableStock: 0 };
          }
          try {
            const productId = packItem.product._id;
            const startDateStr = encodeURIComponent(startDate.toISOString());
            const endDateStr = encodeURIComponent(endDate.toISOString());
            const response = await fetch(
              `${API_URL}/api/stock/${productId}?startDate=${startDateStr}&endDate=${endDateStr}`,
              { cache: "no-store" }
            );

            if (!response.ok) {
              const errorText = await response.text();
              console.error(
                `Erreur récupération stock pour ${packItem.product.title} (status: ${response.status}): ${errorText}`
              );
              throw new Error(
                `Erreur récupération stock pour ${packItem.product.title}`
              );
            }

            const data = await response.json();
            return { productId, availableStock: data.availableStock };
          } catch (error) {
            console.error(
              `Erreur récupération stock produit ${packItem.product.title}:`,
              error
            );
            return { productId: null, availableStock: 0 };
          }
        }
      );

      const stockResults = await Promise.all(productStockPromises);
      const stockMap = stockResults.reduce(
        (acc: Record<string, number>, item) => {
          if (item.productId) acc[item.productId] = item.availableStock;
          return acc;
        },
        {}
      );

      setProductStockAvailability(stockMap);

      if (pack.products.length > 0) {
        const maxPossiblePacks = pack.products.map((packItem: PackProduct) => {
          const availableStock = stockMap[packItem.product._id] || 0;
          return Math.floor(availableStock / packItem.quantity);
        });
        setMaxPackQuantity(Math.min(...maxPossiblePacks));
      }
    }
    fetchStockForPackProducts();
  }, [pack, startDate, endDate]);

  const allImages = pack
    ? [
        ...(pack.imageUrl
          ? [{ url: fixImageUrl(pack.imageUrl), fileName: "main-image" }]
          : []),
        ...(pack.carouselImages || []).map((img) => ({
          ...img,
          url: fixImageUrl(img.url),
        })),
      ].filter((img) => img.url && img.url !== fixImageUrl("")) // Filtrer les images avec URL vide après fixImageUrl
    : [];

  // Préparer les produits pour le composant PackProducts avec les URLs d'image corrigées
  const productsForDisplay =
    pack?.products.map((item) => ({
      ...item,
      product: {
        ...item.product,
        imageUrl: fixImageUrl(item.product.imageUrl),
      },
    })) || [];

  const isFormValid =
    pack &&
    startDate &&
    endDate &&
    quantity > 0 &&
    maxPackQuantity !== null &&
    quantity <= maxPackQuantity &&
    !error;

  return (
    <>
      <Container className="pack-details">
        <Paper className="pack-details__content">
          <div className="pack__section">
            <div className="pack-details__header">
              <div className="pack-details__left-column">
                {currentDisplayImage && (
                  <Image
                    src={currentDisplayImage}
                    alt={pack.title}
                    width={400}
                    height={300}
                    className="pack-details__image"
                  />
                )}

                {allImages.length > 1 && (
                  <div className="product-details__carousel">
                    <div className="product-details__carousel-container">
                      {allImages.map((img, index) => (
                        <div
                          key={index}
                          className={`product-details__carousel-item ${
                            currentDisplayImage === img.url ? "active" : ""
                          }`}
                          onClick={() => handleImageClick(img.url)}
                        >
                          <Image
                            src={img.url}
                            alt={`${pack.title} - Image ${index + 1}`}
                            width={120}
                            height={90}
                            style={{ objectFit: "contain" }}
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pack-details__right-column">
                <div className="product-details__text">
                  <Typography variant="h4">{pack?.title}</Typography>
                  <Typography variant="h6">{pack?.description}</Typography>
                </div>

                <PackProducts products={productsForDisplay} />
              </div>
            </div>

            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={fr}
            >
              <RentalPeriod
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                disabled={cart.length > 0}
                minStartDate={addDays(new Date(), 2)}
              />
            </LocalizationProvider>

            <Paper className="pack-details__product-stock">
              <Typography variant="h6">Stock des produits du pack</Typography>
              {(pack?.products || []).map((packItem: PackProduct) => {
                const product = packItem.product;
                const productId = product?._id;
                const productName = product?.title || "Produit inconnu";
                return productId ? (
                  <Typography
                    key={productId}
                    variant="body2"
                    color="textSecondary"
                  >
                    {productName}:{" "}
                    {productStockAvailability[productId] !== undefined
                      ? `${productStockAvailability[productId]} disponibles`
                      : "Chargement..."}
                  </Typography>
                ) : (
                  <Typography key={Math.random()} variant="body2" color="error">
                    Produit invalide : Données manquantes
                  </Typography>
                );
              })}
            </Paper>
            <Typography
              variant="body2"
              color="textSecondary"
              mt={5}
              fontSize={18}
              fontWeight={600}
            >
              Nombre maximal de packs disponibles :{" "}
              {maxPackQuantity !== null ? maxPackQuantity : "Chargement..."}
            </Typography>
            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              minQuantity={pack?.minQuantity}
              stock={maxPackQuantity ?? undefined}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <PriceCalculation
              products={pack?.products || []}
              quantity={quantity}
              startDate={startDate || new Date()}
              endDate={endDate || new Date()}
              discountPercentage={pack?.discountPercentage || 0}
              setFinalPrice={setFinalPrice}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={() =>
                addToCart({
                  ...pack!,
                  id: pack!._id!,
                  title: pack!.title,
                  type: "pack",
                  quantity,
                  startDate,
                  endDate,
                  price: finalPrice,
                })
              }
              className="pack-details__add-to-cart"
              disabled={!isFormValid}
            >
              Ajouter le pack au panier
            </Button>
          </div>
        </Paper>

        {pack && (
          <SimilarPacksCarousel
            currentPackId={pack._id}
            category={pack.category || ""}
            navCategory={pack.navCategory || ""}
          />
        )}
      </Container>
    </>
  );
}
