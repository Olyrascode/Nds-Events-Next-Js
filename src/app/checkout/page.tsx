// "use client";
// import { useEffect } from 'react';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useCart } from '../../contexts/CartContext';
// import { useAuth } from '../../contexts/AuthContext';
// import { createOrder } from '../../services/orders.service';
// import OrderSummary from '../../components/checkout/OrderSummary';
// import DeliveryOptions from '../../components/checkout/DeliveryOptions';
// import ShippingForm from '../../components/checkout/ShippingForm';
// import BillingForm from '../../components/checkout/BillingForm';
// import PaymentForm from '../../components/checkout/PaymentForm';
// import { calculateOrderTotal } from '../../utils/priceUtils';
// import {
//   Box,
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   Paper,
//   Alert,
//   Divider
// } from '@mui/material';

// const steps = ['Review Order', 'Billing & Shipping', 'Payment'];

// export default function Checkout() {
//   const [activeStep, setActiveStep] = useState(0);
//   const [deliveryMethod, setDeliveryMethod] = useState('pickup');
//   const [shippingInfo, setShippingInfo] = useState({
//     address: '',
//     city: '',
//     zipCode: ''
//   });
//   const [billingInfo, setBillingInfo] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     zipCode: ''
//   });
//   const [error, setError] = useState('');
  
//   const { cart, clearCart } = useCart();
//   const { currentUser } = useAuth();
//   const router = useRouter();

//   // Calcul de cartRequiresDelivery
// // const cartRequiresDelivery = cart?.items?.some(item =>
// //   item.selectedOptions &&
// //   Object.values(item.selectedOptions).some(opt => opt.deliveryMandatory === true)
// // );
// // Calculez si au moins un article impose la livraison obligatoire
// const cartRequiresDelivery = cart.some(item =>
//   item.selectedOptions &&
//   Object.values(item.selectedOptions).some(opt => opt.deliveryMandatory === true)
// );



// useEffect(() => {
//   if (cartRequiresDelivery && deliveryMethod !== 'delivery') {
//     setDeliveryMethod('delivery');
//   }
// }, [cartRequiresDelivery, deliveryMethod]);

//   const validateBillingInfo = () => {
//     return Object.values(billingInfo).every(value => value.trim() !== '');
//   };

//   const validateShippingInfo = () => {
//     if (deliveryMethod === 'pickup') return true;
//     return Object.values(shippingInfo).every(value => value.trim() !== '');
//   };

//   const handleNext = () => {
//     setError('');

//     if (activeStep === 0) {
//       if (deliveryMethod === 'delivery' && !validateShippingInfo()) {
//         setError('Please fill in all shipping information');
//         return;
//       }
//     } else if (activeStep === 1) {
//       if (!validateBillingInfo()) {
//         setError('Please fill in all billing information');
//         return;
//       }
//     }

//     setActiveStep((prevStep) => prevStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevStep) => prevStep - 1);
//   };

//   const handlePaymentSuccess = async (paymentIntent) => {
//     console.log('🟡 currentUser:', currentUser); // Vérifie si currentUser existe
  
//     try {
//       if (!currentUser || !(currentUser._id || currentUser.id)) {
//         setError("Utilisateur non authentifié");
//         return;
//       }
//       const userId = currentUser._id || currentUser.id; 

//       const { total } = calculateOrderTotal(cart, cart[0].startDate, cart[0].endDate, deliveryMethod);
  
//       const order = await createOrder({
//         userId: userId,  // 🔥 Assure-toi d'utiliser `_id`
//         customerEmail: currentUser.email,
//         products: cart,
//         deliveryMethod,
//         shippingInfo: deliveryMethod === 'delivery' ? shippingInfo : null,
//         billingInfo,
//         startDate: new Date(cart[0].startDate),
//         endDate: new Date(cart[0].endDate),
//         total,
//         paymentIntentId: paymentIntent.id,
//         status: 'confirmé',
//         createdAt: new Date()
//       });
  
//       clearCart();
//       router.push(`/order-confirmation?id=${order._id}`);
//     } catch (error) {
//       setError('Échec de création de commande, veuillez réessayer.');
//       console.error('🔴 Erreur création commande:', error);
//     }
//   };
//   const getStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Box>
//             <OrderSummary
//               cart={cart}
//               startDate={cart[0].startDate}
//               endDate={cart[0].endDate}
//               deliveryMethod={deliveryMethod}
//             />
//             <DeliveryOptions
//               value={deliveryMethod}
//               onChange={setDeliveryMethod}
//               forceDelivery={cartRequiresDelivery}
//             />
//             {deliveryMethod === 'Livraison' && (
//               <ShippingForm
//                 shippingInfo={shippingInfo}
//                 setShippingInfo={setShippingInfo}
//               />
//             )}
//           </Box>
//         );
//       case 1:
//         return (
//           <Box>
//             <BillingForm
//               billingInfo={billingInfo}
//               setBillingInfo={setBillingInfo}
//             />
//             <Divider sx={{ my: 3 }} />
//             <OrderSummary
//               cart={cart}
//               startDate={cart[0].startDate}
//               endDate={cart[0].endDate}
//               deliveryMethod={deliveryMethod}
//             />
//           </Box>
//         );
//       case 2:
//         const { total } = calculateOrderTotal(
//           cart,
//           cart[0].startDate,
//           cart[0].endDate,
//           deliveryMethod
//         );
//         return (
//           <Box>
//             <OrderSummary
//               cart={cart}
//               startDate={cart[0].startDate}
//               endDate={cart[0].endDate}
//               deliveryMethod={deliveryMethod}
//             />
//             <PaymentForm
//               amount={Math.round(total * 100)}
//               onSuccess={handlePaymentSuccess}
//             />
//           </Box>
//         );
//       default:
//         return 'Unknown step';
//     }
//   };

//   if (!cart.length) {
//     return (
//       <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
//         <Alert severity="info">
//           Votre panier est vide. Ajoutez des produits avec de procéder au paiement.
//         </Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
//       <Paper sx={{ p: 3 }}>
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
//           {steps.map((label) => (
//             <Step key={label}>
//               <StepLabel>{label}</StepLabel>
//             </Step>
//           ))}
//         </Stepper>
        
//         {getStepContent(activeStep)}
        
//         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
//           {activeStep !== 0 && (
//             <Button onClick={handleBack} sx={{ mr: 1 }}>
//               Précédent
//             </Button>
//           )}
//           {activeStep < steps.length - 1 && (
//             <Button variant="contained" onClick={handleNext}>
//               Suivant
//             </Button>
//           )}
//         </Box>
//       </Paper>
//     </Box>
//   );
// }
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { createOrder } from '../../services/orders.service';
import OrderSummary from '../../components/checkout/OrderSummary';
import DeliveryOptions from '../../components/checkout/DeliveryOptions';
import ShippingForm from '../../components/checkout/ShippingForm';
import BillingForm from '../../components/checkout/BillingForm';
import PaymentForm from '../../components/checkout/PaymentForm';
import { calculateOrderTotal } from '../../utils/priceUtils';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Alert,
  Divider,
} from '@mui/material';

interface ShippingInfo {
  address: string;
  city: string;
  zipCode: string;
}

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

interface PaymentIntent {
  id: string;
}

interface OrderTotals {
  total: number;
  subTotal: number;
  taxRate: number;
  taxAmount: number;
}

const steps = ['Review Order', 'Billing & Shipping', 'Payment'];

export default function Checkout() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [deliveryMethod, setDeliveryMethod] = useState<string>('pickup');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: '',
    city: '',
    zipCode: '',
  });
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [error, setError] = useState<string>('');
  
  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const router = useRouter();

  // On suppose que chaque item du cart a une propriété selectedOptions et quantity
  const cartRequiresDelivery = cart.some(item =>
    item.selectedOptions &&
    Object.values(item.selectedOptions).some(opt => opt.deliveryMandatory === true)
  );

  useEffect(() => {
    if (cartRequiresDelivery && deliveryMethod !== 'delivery') {
      setDeliveryMethod('delivery');
    }
  }, [cartRequiresDelivery, deliveryMethod]);

  const validateBillingInfo = (): boolean =>
    Object.values(billingInfo).every(value => value.trim() !== '');

  const validateShippingInfo = (): boolean =>
    deliveryMethod === 'pickup' ||
    Object.values(shippingInfo).every(value => value.trim() !== '');

  const handleNext = () => {
    setError('');
    if (activeStep === 0 && deliveryMethod === 'delivery' && !validateShippingInfo()) {
      setError('Please fill in all shipping information');
      return;
    } else if (activeStep === 1 && !validateBillingInfo()) {
      setError('Please fill in all billing information');
      return;
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Ici, on suppose que calculateOrderTotal prend seulement le panier et retourne un OrderTotals
  const orderTotals: OrderTotals = calculateOrderTotal(cart);

  const handlePaymentSuccess = async (paymentIntent: PaymentIntent) => {
    if (!currentUser || !(currentUser._id || currentUser.id)) {
      setError("Utilisateur non authentifié");
      return;
    }
    const userId = currentUser._id || currentUser.id;
    try {
      const order = await createOrder({
        userId: userId,
        customerEmail: currentUser.email,
        products: cart,
        deliveryMethod,
        shippingInfo: deliveryMethod === 'delivery' ? shippingInfo : null,
        billingInfo,
        startDate: new Date(cart[0].startDate!),
        endDate: new Date(cart[0].endDate!),
        total: orderTotals.total,
        paymentIntentId: paymentIntent.id,
        status: 'confirmé',
        createdAt: new Date(),
      });
      clearCart();
      router.push(`/order-confirmation?id=${order._id}`);
    } catch (error) {
      setError('Échec de création de commande, veuillez réessayer.');
      console.error('Order creation error:', error);
    }
  };

  // On retire startDate et endDate des props passées à OrderSummary, supposant que son interface n'inclut que cart et deliveryMethod
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <OrderSummary cart={cart} deliveryMethod={deliveryMethod} />
            <DeliveryOptions
              value={deliveryMethod}
              onChange={setDeliveryMethod}
              forceDelivery={cartRequiresDelivery}
            />
            {deliveryMethod === 'delivery' && (
              <ShippingForm shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} />
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <BillingForm billingInfo={billingInfo} setBillingInfo={setBillingInfo} />
            <Divider sx={{ my: 3 }} />
            <OrderSummary cart={cart} deliveryMethod={deliveryMethod} />
          </Box>
        );
      case 2:
        return (
          <Box>
            <OrderSummary cart={cart} deliveryMethod={deliveryMethod} />
            <PaymentForm
              amount={Math.round(orderTotals.total * 100)}
              onSuccess={handlePaymentSuccess}
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (!cart.length) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        <Alert severity="info">
          Votre panier est vide. Ajoutez des produits et procédez au paiement.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Précédent
            </Button>
          )}
          {activeStep < steps.length - 1 && (
            <Button variant="contained" onClick={handleNext}>
              Suivant
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
