import { Menu, MenuItem, Divider } from "@mui/material";
import Link from "next/link";
import { menuItems, adminMenuItems } from "./navigationConfig";
import { useCategories } from "@/hooks/useCategories";
import { slugify } from "@/utils/slugify";
import { User } from "@/contexts/AuthContext";

interface MobileMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  currentUser: User | null;
  isActive: (path: string) => boolean;
}

interface MenuItem {
  value?: string;
  path: string;
  label: string;
}

export function MobileMenu({
  anchorEl,
  onClose,
  currentUser,
  isActive,
}: MobileMenuProps) {
  const { categories: autresProduitsCategories, loading: categoriesLoading } =
    useCategories("autres-produits");

  const renderMenuItem = (item: MenuItem) => {
    if (item.value === "autres-produits") {
      return (
        <div key={item.path}>
          <MenuItem
            sx={{
              fontSize: "1.2rem",
              padding: "12px 20px",
              color: "#fff",
              display: "block",
              textDecoration: "none",
              "&:hover": {
                backgroundColor: "#ff6b00",
                color: "#fff",
              },
            }}
          >
            {item.label}
          </MenuItem>
          {categoriesLoading ? (
            <MenuItem disabled>Chargement...</MenuItem>
          ) : (
            autresProduitsCategories.map((category) => (
              <Link
                key={category}
                href={`/autres-produits/${slugify(category)}`}
                passHref
                style={{ textDecoration: "none" }}
              >
                <MenuItem
                  onClick={onClose}
                  sx={{
                    fontSize: "1.1rem",
                    padding: "10px 18px",
                    color: "#fff",
                    display: "block",
                    textDecoration: "none",
                    "&:hover": {
                      backgroundColor: "#ff6b00",
                      color: "#fff",
                    },
                  }}
                >
                  {category}
                </MenuItem>
              </Link>
            ))
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        href={item.path}
        passHref
        style={{ textDecoration: "none" }}
      >
        <MenuItem
          onClick={onClose}
          selected={isActive(item.path)}
          sx={{
            fontSize: "1.2rem",
            padding: "12px 20px",
            color: "#fff",
            display: "block",
            textDecoration: "none",
            "&:hover": {
              backgroundColor: "#ff6b00",
              color: "#fff",
            },
            "&.Mui-selected": {
              backgroundColor: "#ff6b00 !important",
              color: "#fff !important",
            },
          }}
        >
          {item.label}
        </MenuItem>
      </Link>
    );
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "#000", // Fond noir
          color: "#fff", // Texte blanc
          width: "100vw", // Largeur totale de l'écran
          maxWidth: "100vw",
          borderRadius: "0px",
          left: "0 !important",
        },
      }}
    >
      {menuItems.map(renderMenuItem)}
      {currentUser && currentUser.isAdmin && (
        <div>
          <Divider sx={{ backgroundColor: "#555" }} />
          {adminMenuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              passHref
              style={{ textDecoration: "none" }}
            >
              <MenuItem
                onClick={onClose}
                sx={{
                  fontSize: "1.1rem",
                  padding: "10px 18px",
                  color: "#fff",
                  display: "block",
                  textDecoration: "none",
                  "&:hover": {
                    backgroundColor: "#ff6b00",
                    color: "#fff",
                  },
                }}
              >
                {item.label}
              </MenuItem>
            </Link>
          ))}
        </div>
      )}
    </Menu>
  );
}
