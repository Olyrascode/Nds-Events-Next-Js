import React from "react";
import {
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  Container,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface BreadcrumbItem {
  label: string;
  href: string;
  // Si true, ce lien sera affiché comme texte (élément actuel)
  active?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHomeLink?: boolean;
  containerMaxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

/**
 * Composant de fil d'Ariane (Breadcrumb) réutilisable
 *
 * @example
 * // Utilisation basique avec détection automatique du chemin
 * <Breadcrumb />
 *
 * @example
 * // Utilisation avec items personnalisés
 * <Breadcrumb
 *   items={[
 *     { label: 'Produits', href: '/produits' },
 *     { label: 'Chaises', href: '/produits/chaises', active: true }
 *   ]}
 * />
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHomeLink = true,
  containerMaxWidth = "lg",
}) => {
  const pathname = usePathname();

  // Si aucun item n'est fourni, générer automatiquement à partir du chemin
  const breadcrumbItems = items || generateBreadcrumbItems(pathname);

  // Ajouter le lien d'accueil en premier si demandé
  const displayItems = showHomeLink
    ? [{ label: "Accueil", href: "/" }, ...breadcrumbItems]
    : breadcrumbItems;

  return (
    <Container maxWidth={containerMaxWidth}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="fil d'ariane"
        sx={{
          py: 2,
          "& .MuiBreadcrumbs-ol": {
            flexWrap: { xs: "wrap", sm: "nowrap" },
          },
        }}
      >
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;

          // Si c'est le premier élément et qu'il s'agit de l'accueil, afficher une icône
          if (index === 0 && item.href === "/" && showHomeLink) {
            return (
              <MuiLink
                key="home"
                component={Link}
                href="/"
                color="inherit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "&:hover": { color: "primary.main" },
                  textDecoration: "none",
                }}
                underline="hover"
              >
                <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
                <span className="sr-only">Accueil</span>
              </MuiLink>
            );
          }

          // Si c'est le dernier élément ou marqué comme actif, afficher en texte
          if (isLast || item.active) {
            return (
              <Typography
                key={item.href}
                color="text.primary"
                aria-current="page"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                {item.label}
              </Typography>
            );
          }

          // Sinon, afficher comme lien
          return (
            <MuiLink
              key={item.href}
              component={Link}
              href={item.href}
              color="inherit"
              underline="hover"
              sx={{
                "&:hover": { color: "primary.main" },
                textDecoration: "none",
              }}
            >
              {item.label}
            </MuiLink>
          );
        })}
      </Breadcrumbs>
    </Container>
  );
};

/**
 * Fonction pour formater un segment de chemin en libellé lisible
 */
function formatSegmentLabel(segment: string): string {
  try {
    // Décoder les caractères URL (ex: %20, %C3%A9, etc.)
    const decodedSegment = decodeURIComponent(segment);

    return (
      decodedSegment
        // Remplacer les tirets par des espaces
        .replace(/-/g, " ")
        // Première lettre en majuscule
        .replace(/^\w/, (c) => c.toUpperCase())
        // Remplacer les paramètres dynamiques par "Détails"
        .replace(/\[(.*?)\]/, "Détails")
    );
  } catch (error) {
    // En cas d'erreur de décodage, retourner le segment original
    console.error("Erreur lors du décodage d'un segment d'URL:", error);
    return segment
      .replace(/-/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .replace(/\[(.*?)\]/, "Détails");
  }
}

/**
 * Génère automatiquement les éléments du fil d'Ariane à partir du chemin
 */
function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  if (pathname === "/") return [];

  // Diviser le chemin et filtrer les segments vides
  const segments = pathname.split("/").filter(Boolean);

  // Convertir les segments en éléments de breadcrumb
  return segments.map((segment, index) => {
    // Construire le chemin cumulatif jusqu'à ce segment
    const href = `/${segments.slice(0, index + 1).join("/")}`;

    // Formater le libellé en utilisant la nouvelle fonction
    const label = formatSegmentLabel(segment);

    // Le dernier segment est actif
    const active = index === segments.length - 1;

    return { label, href, active };
  });
}

export default Breadcrumb;
