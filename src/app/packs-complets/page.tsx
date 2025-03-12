
"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography, Grid } from "@mui/material";
import { fetchPacks } from "../../services/packs.service";
import ProductCard from "../../components/ProductCard/ProductCard";
import RentalDialog from "../../components/RentalDialog";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import "./_ProductPacks.scss";
import { Product } from "@/types/Product";

interface Pack {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  discountPercentage?: number;
}

const convertPackToProduct = (pack: Pack): Product => ({
  id: pack.id || pack._id, // Utilise pack.id si présent, sinon pack._id
  _id: pack.id || pack._id, // Même logique ici
  title: pack.name,
  name: pack.name,
  description: pack.description,
  imageUrl: pack.imageUrl || "",
  price: pack.price,
  minQuantity: 1,
  discountPercentage: pack.discountPercentage || 0,
  navCategory: "pack",
  category: "pack",
});

export default function ProductPacks() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [openRentalDialog, setOpenRentalDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPacks();
  }, []);

  const loadPacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const packsData = await fetchPacks();
      setPacks(packsData);
    } catch (error) {
      setError("Failed to load equipment packages. Please try again later.");
      console.error("Error fetching packs:", error);
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

  return (
    <div className="product-packs">
      <Container>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          className="product-packs__title"
        >
          Packs d&apos;équipements
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          className="product-packs__subtitle"
        >
          Simplifiez votre location avec nos packs
        </Typography>

        <Grid container spacing={4}>
          {packs.map((pack, index) => (
            <Grid item key={pack.id || index} xs={12} sm={6} md={4}>
              <ProductCard
                product={convertPackToProduct(pack)}
                onRent={handleRentClick}
                isPack
              />
            </Grid>
          ))}
        </Grid>
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
      <button className="button-contacez-nous"><a href="/contact">Plus de produits - contactez nous</a></button>
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
          (verres, couverts, assiettes, tasses, etc...), tout l'art de la table
          avec différentes gammes, du traditionnel "standard" aux produits hauts
          de gamme pour un mariage par exemple, mais aussi des nappes et
          serviettes en tissus blanc. <br />
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
