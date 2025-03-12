export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateBillingInfo = (billingInfo) => {
  return Object.values(billingInfo).every(value => value.trim() !== '');
};

export const validateShippingInfo = (shippingInfo, deliveryMethod) => {
  if (deliveryMethod === 'pickup') return true;
  return Object.values(shippingInfo).every(value => value.trim() !== '');
};

export const validateProductOptions = (selectedOptions, requiredOptions) => {
  if (!requiredOptions || requiredOptions.length === 0) return true;
  return requiredOptions.every(option => selectedOptions[option.name]);
};