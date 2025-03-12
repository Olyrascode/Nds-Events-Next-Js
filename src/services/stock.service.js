import { API_URL } from '../config';

export const updateProductStock = async (productId, quantity, operation = 'decrease') => {
  try {
    const response = await fetch(`${API_URL}/api/stock/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity, operation }),
    });

    if (!response.ok) {
      throw new Error('Failed to update stock');
    }

    const data = await response.json();
    return data.newStock;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

export const getAvailableStock = async (productId, startDate, endDate) => {
  try {
    console.log(`📡 Requête API : Stock pour ${productId} du ${startDate} au ${endDate}`);
    const response = await fetch(`${API_URL}/api/stock/available?productId=${productId}&startDate=${startDate}&endDate=${endDate}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch available stock');
    }

    const data = await response.json();
    return data.availableStock;
  } catch (error) {
    console.error('❌ Erreur récupération stock:', error);
    throw error;
  }
};
