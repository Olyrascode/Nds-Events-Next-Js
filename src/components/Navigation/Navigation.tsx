"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { AppBar, Toolbar, Button, IconButton, Box, Badge } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { menuItems } from "./navigationConfig";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import CartDrawer from "../CartDrawer/CartDrawer";
import styles from "./navigation.module.scss";

export default function Navigation() {
  const { currentUser, logout } = useAuth();
  const { cart, isCartOpen, setIsCartOpen } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      router.push("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const isActive = (path: string) => pathname === path;
  const cartItemCount = cart.reduce((total: number, item) => total + item.quantity, 0);

  return (
    <AppBar position="static" className={styles.navigation}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: "flex", lg: "none" } }}
          onClick={handleMobileMenu}
        >
          <MenuIcon />
        </IconButton>
        <Link href="/" passHref>
          <Image
            src="/img/home/logoHomePage.png"
            alt="NDS Events"
            width={100}
            height={40}
            className={styles.navigation__logo}
          />
        </Link>
        <Box sx={{ display: { xs: "none",sm: "none", md: "none", lg: "flex", xl: "flex" }, ml: 10,  }}>
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} passHref>
              <Button
                sx={{
                  color: "#ffffff",
                  "&:hover": { color: "#ff6b00" },
                }}
                className={`${styles.navigation__link} ${
                  isActive(item.path) ? styles["navigation__link--active"] : ""
                }`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit" onClick={() => setIsCartOpen(true)}>
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          {currentUser ? (
            <IconButton color="inherit" onClick={handleMenu}>
              <AccountCircleIcon />
            </IconButton>
          ) : (
            [
              <Link key="login" href="/Login" passHref>
                <Button
                  sx={{
                    color: "#ffffff",
                    "&:hover": { color: "#ff6b00" },
                  }}
                >
                  Connexion
                </Button>
              </Link>,
              <Link key="signup" href="/Signup" passHref>
                <Button
                  sx={{
                    color: "#ffffff",
                    "&:hover": { color: "#ff6b00" },
                  }}
                >
                  Créer un compte
                </Button>
              </Link>
            ]
          )}
        </Box>
        <UserMenu
          anchorEl={anchorEl}
          onClose={handleClose}
          currentUser={currentUser!}
          onLogout={handleLogout}
        />
        <MobileMenu
          anchorEl={mobileAnchorEl}
          onClose={handleClose}
          currentUser={currentUser!}
          isActive={isActive}
        
        />
        <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
          
      </Toolbar>
      <div className={styles.heroLocation}>
        <p>Location de matériels de réception en Rhône-Alpes</p>
      </div>
    </AppBar>
  );
}
