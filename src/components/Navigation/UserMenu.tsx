
"use client";
import React from "react";
import { Menu, MenuItem, Typography, Divider } from '@mui/material';
import Link from 'next/link';
import { adminMenuItems } from './navigationConfig';

interface UserMenuProps {
  anchorEl: HTMLElement | null;         // L'élément qui sert d'ancre (ou null)
  onClose: () => void;                  // Fonction pour fermer le menu
  currentUser: {
    email: string;
    isAdmin?: boolean;                  // Marqué optionnel si ce n'est pas toujours défini
  };
  onLogout: () => void;                 // Fonction pour déconnecter l'utilisateur
}

export function UserMenu({ anchorEl, onClose, currentUser, onLogout }:UserMenuProps) {
  if (!currentUser) return null;

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem disabled>
        <Typography variant="body2" color="textSecondary">
          {currentUser.email}
        </Typography>
      </MenuItem>
      <Divider />
      <Link href="/account/orders" passHref>
        <MenuItem onClick={onClose}>Mes commandes</MenuItem>
      </Link>
   {currentUser.isAdmin &&
  [
    <Divider key="admin-divider" />,
    ...adminMenuItems.map((item) => (
      <Link key={item.path} href={item.path} passHref>
        <MenuItem onClick={onClose}>{item.label}</MenuItem>
      </Link>
    ))
  ]
}

      <Divider />
      <MenuItem onClick={onLogout}>Déconnexion</MenuItem>
    </Menu>
  );
}
