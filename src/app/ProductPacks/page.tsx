// "use client";

// import { useState, useEffect } from 'react';
// import { Container, Typography, Grid } from '@mui/material';
// import { fetchPacks } from '../../services/packs.service';
// import ProductCard from '../../components/ProductCard/ProductCard';
// import RentalDialog from '../../components/RentalDialog';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import ErrorMessage from '../../components/common/ErrorMessage';
// import './_ProductPacks.scss';


// interface Pack {
//   id: string;
//   name: string;
//   description: string;
//   imageUrl?: string;
//   price: number;
//   // … autres propriétés
// }


// export default function ProductPacks() {
//   const [packs, setPacks] = useState([]);
//   const [selectedPack, setSelectedPack] = useState(null);
//   const [openRentalDialog, setOpenRentalDialog] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     loadPacks();
//   }, []);

//   const loadPacks = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const packsData = await fetchPacks();
//       setPacks(packsData);
//     } catch (error) {
//       setError('Failed to load equipment packages. Please try again later.');
//       console.error('Error fetching packs:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRentClick = (pack) => {
//     setSelectedPack(pack);
//     setOpenRentalDialog(true);
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorMessage message={error} />;

//   return (
//     <div className="product-packs">
//       <Container>
//         <Typography variant="h4" component="h1" gutterBottom className="product-packs__title">
//           Packs d&apos;equipments
//         </Typography>
//         <Typography variant="subtitle1" gutterBottom className="product-packs__subtitle">
//           Simplifiez votre location avec nos packs
//         </Typography>

//         <Grid container spacing={4}>
//           {packs.map((pack, index) => (
//             <Grid item key={pack.id || index} xs={12} sm={6} md={4}>
//               <ProductCard
//                 product={pack}
//                 onRent={handleRentClick}
//                 isPack
//               />
//             </Grid>
//           ))}
//         </Grid>

//         {selectedPack && (
//           <RentalDialog
//             open={openRentalDialog}
//             onClose={() => setOpenRentalDialog(false)}
//             product={selectedPack}
//             isPack
//           />
//         )}
//       </Container>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { fetchPacks } from '../../services/packs.service';
import ProductCard from '../../components/ProductCard/ProductCard';
import RentalDialog from '../../components/RentalDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './_ProductPacks.scss';
import { Product } from '@/types/Product';

interface Pack {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  discountPercentage?: number;
}

const convertPackToProduct = (pack: Pack): Product => ({
  id: pack.id || pack._id,    // Utilise pack.id si présent, sinon pack._id
  _id: pack.id || pack._id,    // Même logique ici
  title: pack.name,
  name: pack.name,
  description: pack.description,
  imageUrl: pack.imageUrl || '',
  price: pack.price,
  minQuantity: 1,
  discountPercentage: pack.discountPercentage || 0,
  navCategory: 'pack',
  category: 'pack',
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
      setError('Failed to load equipment packages. Please try again later.');
      console.error('Error fetching packs:', error);
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
        <Typography variant="h4" component="h1" gutterBottom className="product-packs__title">
          Packs d&apos;équipements
        </Typography>
        <Typography variant="h5" gutterBottom className="product-packs__subtitle">
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
    </div>
  );
}
