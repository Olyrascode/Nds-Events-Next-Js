import React from "react";
import Link from "next/link";
import { useSmartLoading } from "../../hooks/useSmartLoading";

/**
 * Composant Link intelligent qui affiche un loader seulement si nécessaire
 */
export default function LoadingLink({
  href,
  children,
  onClick,
  showLoader = true,
  ...props
}) {
  const { navigateWithLoader } = useSmartLoading();

  const handleClick = (e) => {
    if (showLoader) {
      navigateWithLoader(() => {
        // Exécuter le onClick personnalisé s'il existe
        if (onClick) {
          onClick(e);
        }
        // Le loader s'arrêtera automatiquement après navigation
      });
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
