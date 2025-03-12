export const formatAmount = (amount) => {
  return Math.round(amount * 100); // Convert to cents for Stripe
};

export const validatePayment = (paymentMethod) => {
  if (!paymentMethod) {
    return 'Payment method is required';
  }
  return null;
};