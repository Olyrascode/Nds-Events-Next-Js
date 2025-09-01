"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface LoadingContextType {
  isPageLoading: boolean;
  startPageLoading: () => void;
  stopPageLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Mémoriser les fonctions pour éviter les re-rendus en boucle
  const startPageLoading = useCallback(() => {
    setIsPageLoading(true);
  }, []);

  const stopPageLoading = useCallback(() => {
    setIsPageLoading(false);
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isPageLoading,
        startPageLoading,
        stopPageLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function usePageLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("usePageLoading must be used within a LoadingProvider");
  }
  return context;
}
