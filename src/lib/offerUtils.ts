// Utility functions for managing offer modal behavior

/**
 * Force show offer modal immediately (useful for testing)
 */
export const forceShowOfferModal = () => {
  window.dispatchEvent(new CustomEvent('forceShowOffers'));
  console.log('Force show offer modal event dispatched');
};

/**
 * Check if user is logged in
 */
export const isUserLoggedIn = () => {
  return !!localStorage.getItem('token');
};
