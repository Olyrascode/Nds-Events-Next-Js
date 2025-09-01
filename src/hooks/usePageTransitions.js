import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePageLoading } from "../contexts/LoadingContext";

/**
 * Hook intelligent pour gérer les loaders de transition de pages
 * Ne s'active que pour les navigations qui prennent vraiment du temps
 */
export function usePageTransitions() {
  const pathname = usePathname();
  const { startPageLoading, stopPageLoading } = usePageLoading();
  const previousPathnameRef = useRef(pathname);
  const isFirstRenderRef = useRef(true);
  const navigationStartTimeRef = useRef(null);

  useEffect(() => {
    // Éviter de déclencher le loader au premier rendu
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    // Vérifier si le pathname a vraiment changé
    if (previousPathnameRef.current === pathname) {
      return;
    }

    // Marquer le début de la navigation
    navigationStartTimeRef.current = performance.now();

    // Mettre à jour la référence du pathname précédent
    previousPathnameRef.current = pathname;

    let showLoaderTimer;
    let hasShownLoader = false;

    // Détecter si la page est vraiment en train de charger
    const checkIfPageIsStillLoading = () => {
      // Vérifier si le document est encore en train de charger
      if (document.readyState !== "complete") {
        return true;
      }

      // Vérifier s'il y a des images en cours de chargement
      const images = document.querySelectorAll("img");
      for (let img of images) {
        if (!img.complete) {
          return true;
        }
      }

      return false;
    };

    // Attendre 300ms, puis vérifier si on a vraiment besoin du loader
    showLoaderTimer = setTimeout(() => {
      const loadingTime = performance.now() - navigationStartTimeRef.current;

      // Afficher le loader seulement si :
      // 1. Ça fait plus de 300ms qu'on navigue
      // 2. ET la page est encore en train de charger
      if (loadingTime > 300 && checkIfPageIsStillLoading()) {
        startPageLoading();
        hasShownLoader = true;

        // Auto-arrêt après 3 secondes maximum
        setTimeout(() => {
          stopPageLoading();
        }, 3000);
      }
    }, 300);

    // Écouter quand la page a fini de charger pour arrêter le loader
    const handlePageLoad = () => {
      if (hasShownLoader) {
        stopPageLoading();
      }
    };

    // Écouter les événements de fin de chargement
    window.addEventListener("load", handlePageLoad);
    document.addEventListener("DOMContentLoaded", handlePageLoad);

    return () => {
      // Nettoyer les timers et listeners
      if (showLoaderTimer) {
        clearTimeout(showLoaderTimer);
      }

      window.removeEventListener("load", handlePageLoad);
      document.removeEventListener("DOMContentLoaded", handlePageLoad);

      // Arrêter le loader au cleanup
      if (hasShownLoader) {
        stopPageLoading();
      }
    };
  }, [pathname]);
}

export default usePageTransitions;
