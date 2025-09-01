import React from "react";
import { usePageLoading } from "../../contexts/LoadingContext";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Composant de loader global pour les transitions de pages
 */
const PageLoader = () => {
  const { isPageLoading } = usePageLoading();

  if (!isPageLoading) return null;

  return <LoadingSpinner fullscreen={true} message="Navigation en cours..." />;
};

export default PageLoader;
