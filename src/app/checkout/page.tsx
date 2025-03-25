"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { createOrder } from "../../services/orders.service";
import OrderSummary from "../../components/checkout/OrderSummary";
import DeliveryOptions from "../../components/checkout/DeliveryOptions";
import ShippingForm from "../../components/checkout/ShippingForm";
import BillingForm from "../../components/checkout/BillingForm";
import PaymentForm from "../../components/checkout/PaymentForm";
import PaymentMethodSelection from "../../components/checkout/PaymentMethodSelection/PaymentMethodSelection";
import { calculateOrderTotal } from "../../utils/priceUtils";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Alert,
  Divider,
  Typography,
} from "@mui/material";

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
  itemsTotal: number;
  deliveryFee: number;
  total: number;
}

const steps = ["Review Order", "Billing & Shipping", "Payment"];

export default function Checkout() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryMethod, setDeliveryMethod] = useState<string>("pickup");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: "",
    city: "",
    zipCode: "",
  });
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [error, setError] = useState<string>("");
  // 🔧 Ajout d'un state pour les frais de livraison
  const [shippingFee, setShippingFee] = useState<number | null>(null);

  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const router = useRouter();

  const cartRequiresDelivery = cart.some(
    (item) =>
      item.selectedOptions &&
      Object.values(item.selectedOptions).some(
        (opt) => opt.deliveryMandatory === true
      )
  );

  useEffect(() => {
    if (cartRequiresDelivery && deliveryMethod !== "delivery") {
      setDeliveryMethod("delivery");
    }
  }, [cartRequiresDelivery, deliveryMethod]);

  const validateBillingInfo = (): boolean =>
    Object.values(billingInfo).every((value) => value.trim() !== "");

  const validateShippingInfo = (): boolean =>
    deliveryMethod === "pickup" ||
    Object.values(shippingInfo).every((value) => value.trim() !== "");

  const handleNext = () => {
    setError("");
    // 🔧 Vérifier que pour la livraison, les infos et les frais sont calculés
    if (
      activeStep === 0 &&
      deliveryMethod === "delivery" &&
      (!validateShippingInfo() || shippingFee === null)
    ) {
      setError(
        "Veuillez remplir toutes les informations de livraison et calculer les frais."
      );
      return;
    } else if (activeStep === 1 && !validateBillingInfo()) {
      setError("Please fill in all billing information");
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const orderTotals = calculateOrderTotal(cart, deliveryMethod) as OrderTotals;

  const handlePaymentSuccess = async (paymentIntent: PaymentIntent) => {
    // Suppression de la vérification d'authentification pour permettre le paiement sans utilisateur connecté
    const userId = currentUser ? currentUser._id || currentUser.id : undefined;

    // Pour la livraison, vérifiez que les frais ont été calculés
    if (deliveryMethod === "delivery" && shippingFee === null) {
      setError("Les frais de livraison ne sont pas calculés.");
      return;
    }

    try {
      // Dans le cas de livraison, orderTotals.total inclut un forfait de 60€ par défaut.
      // Pour obtenir le montant correct, soustrayez ce forfait et ajoutez shippingFee.
      const finalTotal =
        deliveryMethod === "delivery"
          ? orderTotals.total - 60 + shippingFee!
          : orderTotals.total;

      const order = await createOrder({
        userId: userId,
        customerEmail: currentUser ? currentUser.email : "",
        products: cart,
        deliveryMethod,
        shippingInfo: deliveryMethod === "delivery" ? shippingInfo : null,
        billingInfo,
        startDate: new Date(cart[0].startDate!),
        endDate: new Date(cart[0].endDate!),
        total: finalTotal,
        shippingFee: deliveryMethod === "delivery" ? shippingFee! : 0,
        paymentIntentId: paymentIntent.id,
        status: "confirmé",
        paymentMethod,
        createdAt: new Date(),
      });
      clearCart();
      router.push(`/order-confirmation?id=${order._id}`);
    } catch (error) {
      setError("Échec de création de commande, veuillez réessayer.");
      console.error("Order creation error:", error);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <OrderSummary
              cart={cart}
              deliveryMethod={deliveryMethod}
              shippingFee={shippingFee}
            />
            <DeliveryOptions
              value={deliveryMethod}
              onChange={setDeliveryMethod}
              forceDelivery={cartRequiresDelivery}
              shippingFee={shippingFee}
            />

            {deliveryMethod === "delivery" && (
              // 🔧 Passage du state shippingFee et de sa fonction de mise à jour à ShippingForm
              <ShippingForm
                shippingInfo={shippingInfo}
                setShippingInfo={setShippingInfo}
                shippingFee={shippingFee}
                setShippingFee={setShippingFee}
              />
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <BillingForm
              billingInfo={billingInfo}
              setBillingInfo={setBillingInfo}
            />
            <Divider sx={{ my: 3 }} />
            <OrderSummary
              cart={cart}
              deliveryMethod={deliveryMethod}
              shippingFee={shippingFee}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <OrderSummary
              cart={cart}
              deliveryMethod={deliveryMethod}
              shippingFee={shippingFee}
            />
            <PaymentMethodSelection
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
            {paymentMethod === "card" ? (
              <PaymentForm
                amount={Math.round(orderTotals.total * 100)}
                onSuccess={handlePaymentSuccess}
              />
            ) : (
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Vous avez choisi le paiement par {paymentMethod}. Les
                  instructions pour finaliser votre commande vous seront
                  envoyées par email.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() =>
                    handlePaymentSuccess({
                      id: "manual_" + Math.random().toString(36).substr(2, 9),
                    })
                  }
                >
                  Confirmer la commande
                </Button>
              </Box>
            )}
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  if (!cart.length) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
        <Alert severity="info">
          Votre panier est vide. Ajoutez des produits et procédez au paiement.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
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
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Précédent
            </Button>
          )}
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              // 🔧 Désactive le bouton "Suivant" si l'étape d'expédition est active, que la livraison est sélectionnée et que les frais n'ont pas été calculés
              disabled={
                activeStep === 0 &&
                deliveryMethod === "delivery" &&
                shippingFee === null
              }
            >
              Suivant
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
