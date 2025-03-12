
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-nds-events.fr';


// Créer une commande
export const createOrder = async (orderData) => {
  try {
    // 🔴 Adaptation en fonction du mode de paiement
    if (orderData.paymentMethod !== "card") {
      // Pour virement, chèques ou espèces
      orderData.paymentIntentId = "manual"; // ✅ Valeur par défaut pour les paiements manuels
      orderData.status = "Pending";         // ✅ Statut en attente pour ces moyens
    } else {
      // Pour les paiements par carte via Stripe
      orderData.status = "confirmé";         // ✅ Statut confirmé pour les paiements instantanés
    }
    
    console.log('🟡 Envoi de la commande:', orderData);
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) throw new Error('Erreur lors de la création de la commande');
    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('🔴 Erreur création commande:', error);
    throw error;
  }
};

export const fetchCancelledOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/api/cancelledOrders`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des commandes rejetées');
    const data = await response.json();
    return data.orders;
  } catch (error) {
    console.error('Erreur récupération commandes rejetées:', error);
    throw error;
  }
};

// Récupérer les commandes d'un utilisateur
export const fetchUserOrders = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/orders/user/${userId}`);
    if (!response.ok) throw new Error('Erreur récupération commandes');
    const data = await response.json();
    return data.orders;
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    throw error;
  }
};

export const fetchOrdersForMonth = async (startDate, endDate) => {
  try {
    const response = await fetch(`${API_URL}/api/orders`);
    if (!response.ok) throw new Error('Erreur récupération commandes');

    const data = await response.json();
    return data.orders.filter(order => {
      const orderDate = new Date(order.startDate);
      return orderDate >= startDate && orderDate <= endDate;
    });
  } catch (error) {
    console.error('Erreur récupération commandes:', error);
    throw error;
  }
};

// Récupérer toutes les commandes
export const fetchAllOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/api/orders`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des commandes');
    const data = await response.json();
    return data.orders;
  } catch (error) {
    console.error('Erreur fetchAllOrders:', error);
    throw error;
  }
};

// Supprimer une commande
export const deleteOrder = async (orderId) => {
  if (!orderId) {
    console.error("🔴 Erreur : Pas d'ID de commande fourni !");
    return;
  }
  try {
    const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Erreur lors de la suppression de la commande (Statut: ${response.status})`);
    return true;
  } catch (error) {
    console.error('🔴 Erreur deleteOrder:', error);
    throw error;
  }
};

export const deleteCancelledOrder = async (orderId) => {
  if (!orderId) {
    console.error("🔴 Erreur: ID de commande non fourni !");
    return;
  }
  try {
    const response = await fetch(`${API_URL}/api/cancelledOrders/${orderId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Erreur lors de la suppression de la commande rejetée (Statut: ${response.status})`);
    return true;
  } catch (error) {
    console.error("🔴 Erreur deleteCancelledOrder:", error);
    throw error;
  }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus: newStatus }),
    });

    if (!response.ok) throw new Error('Erreur mise à jour statut');
    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('🔴 Erreur mise à jour statut:', error);
    throw error;
  }
};