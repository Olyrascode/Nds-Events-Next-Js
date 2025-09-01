import { usePageTransitions } from "../../hooks/usePageTransitions";

/**
 * Composant qui gère intelligemment les transitions de pages
 * S'active seulement quand c'est vraiment nécessaire
 */
export default function PageTransitionHandler() {
  // Désactivé par défaut - décommentez si vous voulez la détection automatique
  // usePageTransitions();

  // Ce composant ne rend rien pour l'instant
  // Le loader est maintenant contrôlé manuellement via useSmartLoading
  return null;
}
