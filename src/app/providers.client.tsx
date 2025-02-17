// // app/providers.client.tsx (fichier client)
// "use client";

// import { AuthProvider } from "@/contexts/AuthContext";
// import { CartProvider } from "@/contexts/CartContext";
// import { RentalPeriodProvider } from "@/contexts/RentalperiodContext";
// import { StripeProvider } from "@/contexts/StripeContext";
// import ThemeProvider from "@/providers/ThemeProvider";
// import Navigation from "@/components/Navigation/Navigation";

// export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <CartProvider>
//           <RentalPeriodProvider>
//             <Navigation />
//             <StripeProvider>{children}</StripeProvider>
//           </RentalPeriodProvider>
//         </CartProvider>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }
// app/providers.client.tsx (fichier client)
"use client";

import { Provider } from 'react-redux';
import { store } from '../store/store';

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { RentalPeriodProvider } from "@/contexts/RentalperiodContext";
import { StripeProvider } from "@/contexts/StripeContext";
import ThemeProvider from "@/providers/ThemeProvider";
import Navigation from "@/components/Navigation/Navigation";

export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <RentalPeriodProvider>
              <Navigation />
              <StripeProvider>{children}</StripeProvider>
            </RentalPeriodProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
