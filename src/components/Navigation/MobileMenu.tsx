
import { Menu, MenuItem, Divider } from '@mui/material';
import Link from 'next/link';
import { menuItems, adminMenuItems } from './navigationConfig';

export function MobileMenu({ anchorEl, onClose, currentUser, isActive }) {
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      {menuItems.map((item) => (
        <Link key={item.path} href={item.path} passHref>
          <MenuItem onClick={onClose} selected={isActive(item.path)}>
            {item.label}
          </MenuItem>
        </Link>
      ))}
      {currentUser && currentUser.isAdmin && (
        [
          <Divider key="admin-divider" />,
          ...adminMenuItems.map((item) => (
            <Link key={item.path} href={item.path} passHref>
              <MenuItem onClick={onClose}>{item.label}</MenuItem>
            </Link>
          ))
        ]
      )}
    </Menu>
  );
}
