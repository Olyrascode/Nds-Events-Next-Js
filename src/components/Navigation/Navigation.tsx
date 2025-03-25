"use client";
import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Badge,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { menuItems } from "./navigationConfig";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "./UserMenu";
import CartDrawer from "../CartDrawer/CartDrawer";
import { MobileMenu } from "./MobileMenu";
import styles from "./navigation.module.scss";
import { slugify } from "@/utils/slugify";

export default function Navigation() {
  const pathname = usePathname();
  const { cart, setIsCartOpen, isCartOpen } = useCart();
  const { currentUser, logout } = useAuth();
  const isActive = (path: string) => pathname === path;
  const { categories: autresProduitsCategories, loading: categoriesLoading } =
    useCategories("autres-produits");
  const [autresProduitsAnchor, setAutresProduitsAnchor] =
    useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(
    null
  );

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
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const cartItemCount = cart.reduce(
    (total: number, item) => total + item.quantity,
    0
  );

  const handleAutresProduitsClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAutresProduitsAnchor(event.currentTarget);
  };

  const handleAutresProduitsClose = () => {
    setAutresProduitsAnchor(null);
  };

  const renderMenuItem = (item: {
    label: string;
    path: string;
    value?: string;
  }) => {
    if (item.value === "autres-produits") {
      return (
        <div key={item.path}>
          <Button
            endIcon={<ArrowDropDownIcon />}
            onClick={handleAutresProduitsClick}
            sx={{
              color: "#ffffff",
              "&:hover": { color: "#ff6b00" },
            }}
            className={styles.navigation__link}
          >
            {item.label}
          </Button>
          <Menu
            anchorEl={autresProduitsAnchor}
            open={Boolean(autresProduitsAnchor)}
            onClose={handleAutresProduitsClose}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "#000",
                color: "#fff",
              },
            }}
          >
            {categoriesLoading ? (
              <MenuItem disabled>Chargement...</MenuItem>
            ) : (
              autresProduitsCategories.map((category) => (
                <Link
                  key={category}
                  href={`/autres-produits/${slugify(category)}`}
                  passHref
                >
                  <MenuItem
                    onClick={handleAutresProduitsClose}
                    sx={{
                      color: "#fff",
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
          </Menu>
        </div>
      );
    }

    return (
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
    );
  };

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
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "none",
              md: "none",
              lg: "flex",
              xl: "flex",
            },
            ml: 10,
          }}
        >
          {menuItems.map(renderMenuItem)}
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
            <>
              <Link key="login" href="/Login" passHref>
                <IconButton sx={{ color: "#ffffff" }}>
                  <LoginIcon />
                </IconButton>
              </Link>
              <Link key="signup" href="/Signup" passHref>
                <IconButton sx={{ color: "#ffffff" }}>
                  <PersonAddIcon />
                </IconButton>
              </Link>
            </>
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
    </AppBar>
  );
}
