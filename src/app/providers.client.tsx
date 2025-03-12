"use client";

import { Provider } from 'react-redux';
import { store } from '../store/store';

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { RentalPeriodProvider } from "@/contexts/RentalperiodContext";
import { StripeProvider } from "@/contexts/StripeContext";
import ThemeProvider from "@/providers/ThemeProvider";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer"

export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <RentalPeriodProvider>
              <Navigation />
              <StripeProvider>{children}</StripeProvider>
              <Footer />
            </RentalPeriodProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
