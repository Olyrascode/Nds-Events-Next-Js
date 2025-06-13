/**
 * Calcule le prix HT à partir du prix TTC et du taux de TVA
 * @param {number} priceTTC - Prix TTC
 * @param {number} vatRate - Taux de TVA (20 ou 5.5)
 * @returns {number} Prix HT arrondi à 2 décimales
 */
export const calculatePriceHT = (priceTTC, vatRate = 20) => {
  if (!priceTTC || priceTTC <= 0) return 0;
  const priceHT = priceTTC / (1 + vatRate / 100);
  return Math.round(priceHT * 100) / 100;
};

/**
 * Calcule le montant de TVA à partir du prix TTC et du taux de TVA
 * @param {number} priceTTC - Prix TTC
 * @param {number} vatRate - Taux de TVA (20 ou 5.5)
 * @returns {number} Montant de TVA arrondi à 2 décimales
 */
export const calculateVATAmount = (priceTTC, vatRate = 20) => {
  if (!priceTTC || priceTTC <= 0) return 0;
  const priceHT = calculatePriceHT(priceTTC, vatRate);
  const vatAmount = priceTTC - priceHT;
  return Math.round(vatAmount * 100) / 100;
};

/**
 * Calcule tous les éléments de prix (HT, TVA, TTC) d'un coup
 * @param {number} priceTTC - Prix TTC
 * @param {number} vatRate - Taux de TVA (20 ou 5.5)
 * @returns {object} Objet avec priceHT, vatAmount, priceTTC et vatRate
 */
export const calculateAllPrices = (priceTTC, vatRate = 20) => {
  const priceHT = calculatePriceHT(priceTTC, vatRate);
  const vatAmount = calculateVATAmount(priceTTC, vatRate);

  return {
    priceHT,
    vatAmount,
    priceTTC: Math.round(priceTTC * 100) / 100,
    vatRate,
  };
};

/**
 * Formate un prix pour l'affichage
 * @param {number} price - Prix à formater
 * @param {string} currency - Devise (par défaut €)
 * @returns {string} Prix formaté
 */
export const formatPrice = (price, currency = "€") => {
  if (typeof price !== "number" || isNaN(price)) return `0,00 ${currency}`;
  return `${price.toFixed(2).replace(".", ",")} ${currency}`;
};

/**
 * Formate le taux de TVA pour l'affichage
 * @param {number} vatRate - Taux de TVA
 * @returns {string} Taux formaté
 */
export const formatVATRate = (vatRate) => {
  if (vatRate === 5.5) return "5,5%";
  if (vatRate === 20) return "20%";
  return `${vatRate}%`;
};
