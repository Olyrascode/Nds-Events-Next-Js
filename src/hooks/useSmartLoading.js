import { useState, useCallback } from "react";
import { usePageLoading } from "../contexts/LoadingContext";

/**
 * Hook intelligent pour contrôler le loader de page manuellement
 * Avec détection automatique des chargements longs
 */
export function useSmartLoading() {
  const { startPageLoading, stopPageLoading } = usePageLoading();
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  // Fonction pour déclencher un loader intelligent
  const smartLoading = useCallback(
    async (asyncFunction, minDisplayTime = 200) => {
      const startTime = performance.now();

      try {
        setIsLocalLoading(true);

        // Attendre 200ms avant d'afficher le loader global
        const showLoaderTimer = setTimeout(() => {
          startPageLoading();
        }, 200);

        // Exécuter la fonction async
        const result = await asyncFunction();

        // Calculer le temps écoulé
        const elapsedTime = performance.now() - startTime;

        // Si le loader a été affiché, s'assurer qu'il reste visible au moins minDisplayTime
        if (elapsedTime > 200) {
          const remainingTime = Math.max(
            0,
            minDisplayTime - (elapsedTime - 200)
          );
          if (remainingTime > 0) {
            await new Promise((resolve) => setTimeout(resolve, remainingTime));
          }
        } else {
          // Annuler l'affichage du loader si l'opération a été rapide
          clearTimeout(showLoaderTimer);
        }

        return result;
      } finally {
        setIsLocalLoading(false);
        stopPageLoading();
      }
    },
    [startPageLoading, stopPageLoading]
  );

  // Fonction pour les navigations manuelles
  const navigateWithLoader = useCallback(
    (navigationFunction) => {
      startPageLoading();

      // Auto-arrêt après 2 secondes si pas d'arrêt manuel
      const autoStopTimer = setTimeout(() => {
        stopPageLoading();
      }, 2000);

      // Exécuter la navigation
      const result = navigationFunction();

      // Si c'est une Promise, arrêter le loader quand elle se résout
      if (result && typeof result.then === "function") {
        result.finally(() => {
          clearTimeout(autoStopTimer);
          stopPageLoading();
        });
      }

      return result;
    },
    [startPageLoading, stopPageLoading]
  );

  return {
    isLocalLoading,
    smartLoading,
    navigateWithLoader,
    startLoading: startPageLoading,
    stopLoading: stopPageLoading,
  };
}

export default useSmartLoading;
