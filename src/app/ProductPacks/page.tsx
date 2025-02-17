"use client";

import { useState, useEffect } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { fetchPacks } from '../../services/packs.service';
import ProductCard from '../../components/ProductCard/ProductCard';
import RentalDialog from '../../components/RentalDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './_ProductPacks.scss';

export default function ProductPacks() {
  const [packs, setPacks] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [openRentalDialog, setOpenRentalDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError('Failed to load equipment packages. Please try again later.');
      console.error('Error fetching packs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRentClick = (pack) => {
    setSelectedPack(pack);
    setOpenRentalDialog(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="product-packs">
      <Container>
        <Typography variant="h4" component="h1" gutterBottom className="product-packs__title">
          Packs d'equipments
        </Typography>
        <Typography variant="subtitle1" gutterBottom className="product-packs__subtitle">
          Simplifiez votre location avec nos packs
        </Typography>

        <Grid container spacing={4}>
          {packs.map((pack, index) => (
            <Grid item key={pack.id || index} xs={12} sm={6} md={4}>
              <ProductCard
                product={pack}
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
            product={selectedPack}
            isPack
          />
        )}
      </Container>
    </div>
  );
}