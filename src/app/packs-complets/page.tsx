"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography, Grid } from "@mui/material";
import { fetchPacks } from "../../services/packs.service";
import ProductCard from "../../components/ProductCard/ProductCard";
import RentalDialog from "../../components/RentalDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./_ProductPacks.scss";
import { Product } from "@/types/Product";

interface Pack {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  discountPercentage?: number;
  slug: string;
  category?: string;
  navCategory?: string;
}

const convertPackToProduct = (pack: Pack): Product => ({
  id: pack._id,
  _id: pack._id,
  title: pack.name,
  name: pack.name,
  description: pack.description,
  imageUrl: pack.imageUrl || "",
  price: pack.price,
  minQuantity: 1,
  discountPercentage: pack.discountPercentage || 0,
  navCategory: pack.navCategory || "pack",
  category: pack.category || "pack",
  slug: pack.slug,
});

export default function ProductPacks() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [filteredPacks, setFilteredPacks] = useState<Pack[]>([]);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category");

  useEffect(() => {
    loadPacks();
  }, []);

  // Filtrer les packs quand ils sont chargés ou quand le paramètre de catégorie change
  useEffect(() => {
    if (packs.length > 0) {
      if (categoryParam) {
        // Filtrer les packs par catégorie
        const filtered = packs.filter(
          (pack) =>
            (pack.category &&
              pack.category.toLowerCase() === categoryParam.toLowerCase()) ||
            (pack.navCategory &&
              pack.navCategory.toLowerCase() === categoryParam.toLowerCase())
        );
        setFilteredPacks(filtered);
      } else {
        // Afficher tous les packs si aucun filtre n'est spécifié
        setFilteredPacks(packs);
      }
    }
  }, [packs, categoryParam]);

  const loadPacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const packsData = await fetchPacks();
      setPacks(packsData);
    } catch (error) {
      setError(
        "Impossible de charger les packs. Veuillez réessayer plus tard."
      );
      console.error("Erreur lors de la récupération des packs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRentClick = (pack: Pack) => {
    setSelectedPack(pack);
    setOpenRentalDialog(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // Titre dynamique basé sur la catégorie
  const getTitle = () => {
    if (categoryParam) {
      return `Packs pour ${categoryParam}`;
    }
    return "Packs d'équipements";
  };

  return (
    <div className="product-packs">
      <Container>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          className="product-packs__title"
        >
          {getTitle()}
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          className="product-packs__subtitle"
        >
          Simplifiez votre location avec nos packs
        </Typography>

        {filteredPacks.length === 0 ? (
          <Typography variant="h6" className="product-packs__no-results">
            Aucun pack disponible pour cette catégorie.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {filteredPacks.map((pack) => (
              <Grid item key={pack.slug || pack._id} xs={12} sm={6} md={4}>
                <ProductCard
                  product={convertPackToProduct(pack)}
                  onRent={handleRentClick}
                  isPack
                />
              </Grid>
            ))}
          </Grid>
        )}
        {selectedPack && (
          <RentalDialog
            open={openRentalDialog}
            onClose={() => setOpenRentalDialog(false)}
            product={convertPackToProduct(selectedPack)}
            isPack
          />
        )}
      </Container>
      <Container className="bottom-info">
        <button className="button-contacez-nous">
          <Link href="/contact">Plus de produits - contactez nous</Link>
        </button>
        <p>
          <span>
            NDS Event&apos;s, spécialiste de la location de matériel
            d&apos;événement en Rhône Alpes (Grenoble, Isère 38) depuis plus de
            10 ans !
          </span>{" "}
          <br />
          <br />
          Dans cette catégorie, vous trouverez à la location, des packs complets
          où tout est inclus ! Des tanbles, des chaises, de la vaisselle
          (verres, couverts, assiettes, tasses, etc...), tout l&apos;art de la
          table avec différentes gammes, du traditionnel &quot;standard&quot;
          aux produits hauts de gamme pour un mariage par exemple, mais aussi
          des nappes et serviettes en tissus blanc. <br />
          <br />
          La vaisselle se loue propre et se rend sale, nous nous occupons du
          lavage et il est inclus dans les prix ! Idem pour les tissus, le
          service de blanchisserie est compris !<br />
          <br /> Une offre au meilleur prix garanti dans la région !
        </p>
      </Container>
    </div>
  );
}
