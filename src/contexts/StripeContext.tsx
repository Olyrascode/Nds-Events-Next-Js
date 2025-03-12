
"use client";

import { createContext, useContext } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

type StripeContextType = {
  stripePromise: Promise<Stripe | null>;
};

const StripeContext = createContext<StripeContextType | null>(null);

export function useStripe() {
  return useContext(StripeContext);
}

export function StripeProvider({ children }: { children: React.ReactNode }) {
  return (
    <StripeContext.Provider value={{ stripePromise }}>
      <Elements stripe={stripePromise}>{children}</Elements>
    </StripeContext.Provider>
  );
}
