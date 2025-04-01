const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// Récupérer tous les jours fermés
export const getAllClosedDays = async () => {
  try {
    const response = await fetch(`${API_URL}/api/closeddays`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching closed days:", error);
    throw error;
  }
};

// Récupérer les jours fermés entre deux dates
export const getClosedDaysBetweenDates = async (startDate, endDate) => {
  try {
    const url = new URL(`${API_URL}/api/closeddays/between`);
    url.searchParams.append("startDate", startDate);
    url.searchParams.append("endDate", endDate);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching closed days between dates:", error);
    throw error;
  }
};

// Vérifier si une date est fermée
export const isDateClosed = async (date) => {
  try {
    const url = new URL(`${API_URL}/api/closeddays/check`);
    url.searchParams.append("date", date);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.isClosed;
  } catch (error) {
    console.error("Error checking if date is closed:", error);
    throw error;
  }
};

// Ajouter un jour fermé
export const addClosedDay = async (closedDayData) => {
  try {
    const response = await fetch(`${API_URL}/api/closeddays`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(closedDayData),
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding closed day:", error);
    throw error;
  }
};

// Supprimer un jour fermé
export const deleteClosedDay = async (closedDayId) => {
  try {
    const response = await fetch(`${API_URL}/api/closeddays/${closedDayId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting closed day:", error);
    throw error;
  }
};
