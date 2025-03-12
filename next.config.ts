import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["api-nds-events.fr"], // Ajoutez ici tous les domaines autorisés pour vos images
  },
  eslint: {
    ignoreDuringBuilds: true, // Désactive ESLint pendant le build
  },
  typescript: {
    ignoreBuildErrors: true, // Désactive la vérification des erreurs TypeScript durant le build (NON RECOMMANDÉ)
  },
  
  // ... autres options de configuration
};

export default nextConfig;
