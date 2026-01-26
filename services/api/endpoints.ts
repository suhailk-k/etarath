export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/method/login',
    SEND_OTP: '/api/auth/login',
    VERIFY_OTP: '/api/auth/verifyOtp', 
  },
  USER: {
    PROFILE: '/api/user',
  },
  SALES_AGENT: {
    ORDERS: '/api/salesAgent/order',
    ORDER_HISTORY: '/api/salesAgent/order/assigned',
    PRODUCTS: '/api/salesAgent/product',
    CLAIMS: '/api/salesAgent/claim',
    CLAIM_HISTORY: '/api/salesAgent/claim/assigned',
    CUSTOMERS: '/api/salesAgent/customer',
    HOME: '/api/salesAgent/home',
    UPLOAD: '/api/upload',
    TARGET: '/api/salesAgent/target',
    UPDATE_PROFILE: '/api/user/sales-agent',
  }
};
