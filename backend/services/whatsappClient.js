// WhatsApp integration is temporarily disabled on the server.
// All WhatsApp-related imports and logic are commented out to avoid runtime errors
// when the dependency '@whiskeysockets/baileys' is not installed on the server.
//
// To re-enable later, restore the previous implementation and ensure dependencies
// are installed, then set up initialization in server.js.

let isInitialized = false;
let isReady = false;

export const initializeWhatsApp = async () => {
  console.log('ℹ️ WhatsApp integration is currently disabled.');
  isInitialized = false;
  isReady = false;
  return null;
};

export const sendWhatsAppMessage = async () => {
  return {
    success: false,
    error: 'WhatsApp integration is disabled حالياً.',
  };
};

export const getWhatsAppStatus = () => {
  return {
    isInitialized: false,
    isReady: false,
    hasClient: false,
  };
};

export default {
  initializeWhatsApp,
  sendWhatsAppMessage,
  getWhatsAppStatus,
};

