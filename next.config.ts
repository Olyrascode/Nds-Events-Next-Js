import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["82.29.170.25"], // Ajoutez ici tous les domaines autorisés pour vos images
  },
  eslint: {
    ignoreDuringBuilds: true, // Désactive ESLint pendant le build
  },
  
  // ... autres options de configuration
};

export default nextConfig;
