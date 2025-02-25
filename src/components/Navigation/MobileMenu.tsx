
import { Menu, MenuItem, Divider } from "@mui/material";
import Link from "next/link";
import { menuItems, adminMenuItems } from "./navigationConfig";

export function MobileMenu({ anchorEl, onClose, currentUser, isActive }) {
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
      {menuItems.map((item) => (
        <Link key={item.path} href={item.path} passHref style={{ textDecoration: "none" }}>
          <MenuItem
            component="a"
            onClick={onClose}
            selected={isActive(item.path)}
            sx={{
              fontSize: "1.2rem",
              padding: "12px 20px",
              color: "#fff", // Texte blanc
              display: "block", // Permet d'occuper toute la largeur
              textDecoration: "none", // Supprime le soulignement
              "&:hover": {
                backgroundColor: "#ff6b00", // Hover orange
                color: "#fff",
              },
              "&.Mui-selected": {
                backgroundColor: "#ff6b00 !important", // Actif orange
                color: "#fff !important",
              },
            }}
          >
            {item.label}
          </MenuItem>
        </Link>
      ))}
      {currentUser && currentUser.isAdmin && (
        <div>

          <Divider sx={{ backgroundColor: "#555" }} />
          {adminMenuItems.map((item) => (
            <Link key={item.path} href={item.path} passHref style={{ textDecoration: "none" }}>
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
