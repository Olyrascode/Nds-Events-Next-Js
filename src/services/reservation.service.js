import { API_URL } from '../config';

export const addReservation = async (productId, reservation) => {
  try {
    const response = await fetch(`${API_URL}/api/reservations/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, reservation }),
    });

    if (!response.ok) {
      throw new Error('Failed to add reservation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding reservation:', error);
    throw error;
  }
};

export const createReservationsFromOrder = async (order) => {
  try {
    const response = await fetch(`${API_URL}/api/reservations/create-from-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });

    if (!response.ok) {
      throw new Error('Failed to create reservations from order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating reservations from order:', error);
    throw error;
  }
};
