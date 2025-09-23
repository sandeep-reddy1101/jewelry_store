// Store configuration
export const STORE_CONFIG = {
  name: 'Vasudha',
  fullName: 'Vasudha Jewelry',
  tagline: 'Exquisite Jewelry Collection',
  description: 'Premium jewelry store management system',
  // Add other store-related constants here
  currency: '₹',
  currencySymbol: '₹',
} as const;

// Derived values
export const STORE_DISPLAY = {
  shortName: STORE_CONFIG.name,
  brandName: `${STORE_CONFIG.name} Jewelry`,
  systemName: `${STORE_CONFIG.name} Store Management`,
  welcomeMessage: `Welcome to ${STORE_CONFIG.name} Jewelry Store`,
} as const;

// Export individual values for convenience
export const { name: STORE_NAME, fullName: STORE_FULL_NAME } = STORE_CONFIG;
