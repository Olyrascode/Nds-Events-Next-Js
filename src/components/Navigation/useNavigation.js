// Exemple de hook pour Next.js
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function useNavigation() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  const { logout } = useAuth();
  const router = useRouter();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
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
      router.push("/Login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return {
    anchorEl,
    mobileAnchorEl,
    handleMenu,
    handleMobileMenu,
    handleClose,
    handleLogout,
  };
}
