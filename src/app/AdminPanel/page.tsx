"use client";
import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import ProductsTab from '../../components/admin/ProductsTab';
import ProductList from '../../components/admin/products/ProductList';
import PacksTab from '../../components/admin/PacksTab';
import CalendarTab from '../../components/admin/CalendarTab';
import OrdersTab from '../../components/admin/ordersTab/OrdersTab';
import AdminRoute from '@/components/AdminRoute/AdminRoute';
import './_AdminPanel.scss';



export default function AdminPanel() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number; }) => (
    <div hidden={value !== index} className="admin-panel__content">
      {value === index && children}
    </div>
  );

  return (
    <AdminRoute>
    <div className="admin-panel">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Créer un produit" />
          <Tab label="Gestions produit" />
          <Tab label="Packs de produit" />
          <Tab label="Calendrier commande" />
          <Tab label="Commandes" />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <ProductsTab />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <ProductList />
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <PacksTab />
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <CalendarTab />
      </TabPanel>

      <TabPanel value={currentTab} index={4}>
        <OrdersTab />
      </TabPanel>
    </div>
    </AdminRoute>
  );
}
