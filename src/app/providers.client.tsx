"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { usePathname } from "next/navigation";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { RentalPeriodProvider } from "@/contexts/RentalperiodContext";
import { StripeProvider } from "@/contexts/StripeContext";
import ThemeProvider from "@/providers/ThemeProvider";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function ProvidersWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Ne pas afficher le Breadcrumb global sur la page d'accueil et sur les pages de détail de produit
  const isProductDetailsPage =
    pathname?.startsWith("/produits/") && pathname?.split("/").length > 2;
  const shouldShowBreadcrumb = !isHomePage && !isProductDetailsPage;

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <RentalPeriodProvider>
              <Navigation />
              {shouldShowBreadcrumb && <Breadcrumb />}
              <StripeProvider>{children}</StripeProvider>
              <Footer />
            </RentalPeriodProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
