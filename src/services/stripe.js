// Simulate a payment intent creation
export const createPaymentIntent = async (amount) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In production, this would make a real API call to your backend
  return {
    clientSecret: 'test_secret_' + Math.random().toString(36).substr(2, 9),
    amount: amount
  };
};