"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { fetchAvailableStock } from "../../../features/stockSlice";
import { useCart } from "../../../contexts/CartContext";
import { fetchProductById } from "../../../services/products.service";
import { calculateRentalDays } from "../../../utils/dateUtils";
import { addDays } from "date-fns";
import { Typography, Container, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fr } from "date-fns/locale";
import { useRentalPeriod } from "../../../contexts/RentalperiodContext";
import ProductOptions, {
  ProductOption,
  SelectedOption,
} from "../components/ProductOptions";
import RentalPeriod from "../components/RentalPeriod";
import QuantitySelector from "../components/QuantitySelector";
import PriceCalculation from "../components/PriceCalculation";
import Image from "next/image";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import "./ProductDetails.scss";
import SimilarProductsCarousel from "@/components/SimilarProductsCarousel";
import Breadcrumb from "@/components/common/Breadcrumb";

// Ajout de la constante pour l'URL de l'API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// Fonction utilitaire pour corriger les URLs d'images
const fixImageUrl = (url: string | undefined): string => {
  if (!url) return "/default-placeholder.png";
  return url.replace("http://localhost:5000", API_URL);
};

export interface Product {
  _id: string;
  title: string;
  imageUrl?: string;
  description: string;
  price: number;
  minQuantity?: number;
  lotSize?: number;
  options?: ProductOption[];
  category?: string;
  navCategory?: string;
  carouselImages?: Array<{
    url: string;
    fileName: string;
  }>;
}

type SelectedOptions = Record<string, SelectedOption>;

interface RootState {
  stock: {
    stockByProduct: { [key: string]: number };
    loading: boolean;
  };
}

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface ProductDetailsProps {
  productId?: string; // Rendre productId optionnel pour la compatibilité
  breadcrumbItems?: BreadcrumbItem[]; // Élements du fil d'Ariane
}

export default function ProductDetails({
  productId,
  breadcrumbItems,
}: ProductDetailsProps = {}) {
  const paramProductId = useParams()?.productId as string;
  const pathname = usePathname(); // Récupérer le chemin URL
  const actualProductId = productId || paramProductId; // Utiliser le productId des props ou des params

  const { addToCart, setIsCartOpen, cart } = useCart();

  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const { rentalPeriod, setRentalPeriod } = useRentalPeriod()!;
  const { startDate, endDate } = rentalPeriod;
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [quantityError, setQuantityError] = useState<string>("");
  // Nouvel état pour stocker l'image actuellement affichée
  const [currentDisplayImage, setCurrentDisplayImage] = useState<string | null>(
    null
  );

  // Extraire la sous-catégorie de l'URL si possible
  const [extractedCategory, setExtractedCategory] = useState<string>("");

  // Bloquer le calendrier si un produit est déjà dans le panier (quelle que soient ses dates)
  const isCalendarDisabled = cart.length > 0;

  const availableStock = useSelector(
    (state: RootState) => state.stock.stockByProduct[actualProductId]
  );
  const stockLoading = useSelector((state: RootState) => state.stock.loading);

  // Calcul du nombre maximum de lots disponibles si le produit se loue en lots
  const maxLotsAvailable =
    product && product.lotSize && product.lotSize > 1
      ? Math.floor(availableStock / product.lotSize)
      : availableStock;

  const handleStartDateChange = (date: Date | null) => {
    setRentalPeriod({ ...rentalPeriod, startDate: date });
  };

  const handleEndDateChange = (date: Date | null) => {
    setRentalPeriod({ ...rentalPeriod, endDate: date });
  };

  useEffect(() => {
    // Extraire la catégorie de l'URL
    if (pathname) {
      console.log("Pathname:", pathname);
      // Format attendu: /[category]/[subcategory]/[productId]
      const parts = pathname.split("/").filter((p) => p);
      if (parts.length >= 2) {
        // Si l'URL contient au moins deux parties (catégorie, sous-catégorie)
        const subcategory = parts[1]; // La deuxième partie est la sous-catégorie
        console.log("Sous-catégorie extraite de l'URL:", subcategory);
        setExtractedCategory(subcategory);
      }
    }
  }, [pathname]);

  useEffect(() => {
    async function loadProduct() {
      try {
        setError(null);
        const productData = await fetchProductById(actualProductId);
        console.log("Produit chargé:", productData);

        // Corriger les URLs d'images dans le produit chargé
        if (productData.imageUrl) {
          productData.imageUrl = fixImageUrl(productData.imageUrl);
        }

        // Corriger les URLs des images du carousel
        if (
          productData.carouselImages &&
          productData.carouselImages.length > 0
        ) {
          productData.carouselImages = productData.carouselImages.map(
            (img: { url: string; fileName: string }) => ({
              ...img,
              url: fixImageUrl(img.url),
            })
          );
        }

        setProduct(productData);
        // Définir l'image principale comme image affichée par défaut
        setCurrentDisplayImage(productData.imageUrl || null);
        setQuantity(productData.minQuantity || 1);
      } catch (err) {
        console.error("Erreur lors du chargement du produit:", err);
        setError("Impossible de charger le produit.");
      }
    }
    loadProduct();
  }, [actualProductId]);

  // On utilise useMemo pour éviter de recréer des objets Date à chaque rendu
  const displayedStartDate = useMemo(
    () =>
      startDate ||
      (cart.length > 0 && cart[0].startDate
        ? new Date(cart[0].startDate)
        : null),
    [startDate, cart]
  );
  const displayedEndDate = useMemo(
    () =>
      endDate ||
      (cart.length > 0 && cart[0].endDate ? new Date(cart[0].endDate) : null),
    [endDate, cart]
  );

  const effectiveStartDate = displayedStartDate;
  const effectiveEndDate = displayedEndDate;

  useEffect(() => {
    if (actualProductId && effectiveStartDate && effectiveEndDate) {
      const params = {
        productId: actualProductId,
        startDate: effectiveStartDate.toISOString(),
        endDate: effectiveEndDate.toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch(fetchAvailableStock(params));
    }
  }, [actualProductId, effectiveStartDate, effectiveEndDate, dispatch]);

  useEffect(() => {
    if (!product) return;
    const days = calculateRentalDays(effectiveStartDate, effectiveEndDate);
    const lotSize = product.lotSize || 1;
    const optionPrice = Object.values(selectedOptions).reduce(
      (acc, opt) => acc + opt.price,
      0
    );
    const unitPrice = product.price + optionPrice;
    const basePrice = unitPrice * quantity * lotSize;
    let computedFinalPrice = basePrice;
    if (days > 4) {
      const extraDays = days - 4;
      computedFinalPrice += basePrice * 0.15 * extraDays;
    }
    setFinalPrice(computedFinalPrice);
  }, [
    product,
    selectedOptions,
    quantity,
    effectiveStartDate,
    effectiveEndDate,
  ]);

  // Validation de la quantité en tenant compte du lot
  useEffect(() => {
    if (product) {
      if (product.lotSize && product.lotSize > 1) {
        const maxLots = Math.floor(availableStock / product.lotSize);
        if (quantity > maxLots) {
          setQuantityError(
            `Vous ne pouvez pas sélectionner plus de ${maxLots} lots (soit ${
              maxLots * product.lotSize
            } unités).`
          );
        } else {
          setQuantityError("");
        }
      } else {
        if (quantity > availableStock) {
          setQuantityError(
            `Stock insuffisant. Vous avez demandé ${quantity} unités.`
          );
        } else {
          setQuantityError("");
        }
      }
    }
  }, [quantity, availableStock, product]);

  // On simplifie le changement de quantité ici
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (product?.lotSize && product.lotSize > 1) {
      const maxLots = Math.floor(availableStock / product.lotSize);
      if (quantity > maxLots) {
        setError(
          `La quantité demandée dépasse le stock disponible. Maximum ${maxLots} lots disponibles (soit ${
            maxLots * product.lotSize
          } unités).`
        );
        return;
      }
    } else {
      if (quantity > availableStock) {
        setError("La quantité demandée dépasse le stock disponible.");
        return;
      }
    }

    if (!product) return;

    // Réinitialiser l'erreur et ajouter au panier
    setError("");
    addToCart({
      id: product._id,
      title: product.title,
      price: finalPrice,
      imageUrl: product.imageUrl,
      quantity,
      startDate: effectiveStartDate,
      endDate: effectiveEndDate,
      selectedOptions,
      lotSize: product.lotSize,
      type: "product",
    });
    setIsCartOpen(true);
  };

  // La validité du formulaire tient compte du type de produit (lot ou non)
  const isFormValid =
    product !== null &&
    effectiveStartDate !== null &&
    effectiveEndDate !== null &&
    quantity > 0 &&
    (product?.lotSize && product.lotSize > 1
      ? quantity <= Math.floor(availableStock / product.lotSize)
      : quantity <= availableStock) &&
    !quantityError;

  // Préparation des images pour affichage - placé avant la condition de rendu
  const allImages = useMemo(() => {
    if (!product) return [];
    // Image principale
    const mainImage = { url: product.imageUrl || "", fileName: "main" };
    // Images du carousel si elles existent
    const carouselImgs = product.carouselImages || [];

    // Corriger toutes les URLs d'images
    return [mainImage, ...carouselImgs].map(
      (img: { url: string; fileName: string }) => ({
        ...img,
        url: fixImageUrl(img.url),
      })
    );
  }, [product]);

  if (!product) {
    return (
      <div className="product-details__error">
        {error || "Produit introuvable."}
      </div>
    );
  }

  // Fonction pour changer l'image principale
  const handleImageClick = (imageUrl: string) => {
    setCurrentDisplayImage(imageUrl);
  };

  return (
    <div className="mainContainer">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
        <Container className="product-details">
          <div className="product-details__header">
            <div className="product-details__left-column">
              {/* Affiche l'image actuellement sélectionnée */}
              {currentDisplayImage && (
                <Image
                  src={currentDisplayImage}
                  alt={product.title}
                  className="product-details__image"
                  width={500}
                  height={400}
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              )}

              {/* Carrousel avec toutes les images */}
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
                          alt={`${product.title} - Image ${index + 1}`}
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

            <div className="product-details__right-column">
              <div className="product-details__text">
                <Typography variant="h1">{product.title}</Typography>
                <Typography variant="h2">{product.description}</Typography>
              </div>

              {product.options?.length ? (
                <ProductOptions
                  options={product.options}
                  selectedOptions={selectedOptions}
                  onChange={setSelectedOptions}
                />
              ) : (
                <Typography variant="h6">{product.price}€ par jour</Typography>
              )}

              <Typography variant="h6">
                {Number(product.lotSize) > 1
                  ? `${(
                      product.price *
                      Number(product.lotSize) *
                      quantity
                    ).toFixed(2)}€ pour ${quantity} ${
                      quantity > 1 ? "lots" : "lot"
                    } de ${product.lotSize} unités`
                  : `${product.price.toFixed(2)}€ par unité`}
              </Typography>
            </div>
          </div>

          <RentalPeriod
            startDate={displayedStartDate}
            endDate={displayedEndDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            disabled={isCalendarDisabled}
            minStartDate={addDays(new Date(), 2)}
          />
          {effectiveStartDate &&
            effectiveEndDate &&
            (stockLoading ? (
              <Typography color="textSecondary" variant="body2">
                Chargement du stock...
              </Typography>
            ) : availableStock !== undefined ? (
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
                fontWeight={600}
                fontSize={18}
              >
                {product.lotSize && product.lotSize > 1
                  ? `Stock disponible : ${maxLotsAvailable} lots (soit ${
                      maxLotsAvailable * product.lotSize
                    } unités)`
                  : `Stock disponible : ${availableStock} unités`}
              </Typography>
            ) : null)}
          {product.lotSize && product.lotSize > 1 && (
            <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
              <strong>
                ({quantity} lots) {quantity * product.lotSize} unités
              </strong>
            </Typography>
          )}

          <QuantitySelector
            quantity={quantity}
            onChange={handleQuantityChange}
            minQuantity={product.minQuantity}
            stock={availableStock}
          />

          {quantityError && (
            <Typography color="error" variant="body2">
              {quantityError}
            </Typography>
          )}

          <PriceCalculation
            price={product.price}
            quantity={quantity}
            startDate={effectiveStartDate || new Date()}
            endDate={effectiveEndDate || new Date()}
            selectedOptions={selectedOptions}
            setFinalPrice={setFinalPrice}
            lotSize={product.lotSize || 1}
          />
          <Button
            className="product-details__add-to-cart"
            onClick={handleAddToCart}
            disabled={!isFormValid}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Ajouter au panier
          </Button>
        </Container>
        {product && (
          <SimilarProductsCarousel
            currentProductId={product._id}
            category={product.category || extractedCategory}
          />
        )}
        <div className="listIconContainer">
          <div className="listIcon">
            <ul>
              <li>
                <Image
                  src="/img/divers/calendar-small.svg"
                  alt="Calendrier"
                  width={24}
                  height={24}
                  priority
                />
                <p>
                  Les tarifs de base sur notre site sont donnés pour des
                  locations de 1 à 4 jours.
                </p>
              </li>
              <li>
                <Image
                  src="/img/divers/double-arrow-up.svg"
                  alt="Flèche double vers le haut"
                  width={24}
                  height={24}
                  priority
                />
                <p>
                  Livraisons/Récupérations sur votre événement non disponible le
                  Dimanche
                </p>
              </li>
              <li>
                <Image
                  src="/img/divers/double-arrow-down.svg"
                  alt="Flèche double vers le bas"
                  width={24}
                  height={24}
                  priority
                />
                <p>
                  Récupérations/Restitutions à nos locaux non disponible le
                  Samedi et Dimanche
                </p>
              </li>
            </ul>
            <div className="cardBottom">
              <div className="cardLeft">
                <Image
                  src="/img/divers/visa.svg"
                  alt="Logo Visa"
                  width={48}
                  height={32}
                  priority
                />
                <p>
                  Choisissez vos produits directement en ligne et payez par
                  Carte Bancaire ou directement au depot NDS par chèque,
                  virement ou espèce
                </p>
              </div>
              <div className="cardRight">
                <Image
                  src="/img/divers/truck.svg"
                  alt="Camion de livraison"
                  width={48}
                  height={32}
                  priority
                />
                <p>
                  Divers modes de livraison à votre disposition : Retrait sur
                  place, ou livraison et récupération par nos équipes!
                </p>
              </div>
            </div>
          </div>
          <div className="bottomLink">
            <p>
              Pour toutes autres questions, vous pouvez vous référer à nos
              Conditions Générales de Vente ou notre Foire Aux Questions.
            </p>
          </div>
        </div>
      </LocalizationProvider>
    </div>
  );
}
