// API Base URL
// In production, use the same domain (relative URL)
// In development, use localhost
const getApiBaseUrl = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production, use relative URL (same domain)
  if (import.meta.env.MODE === 'production' || import.meta.env.PROD) {
    return '/api';
  }
  
  // In development, use localhost
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🌐 Making API request to: ${url}`);
    
    const response = await fetch(url, config);
    
    // Check if response is HTML (error page) - this happens when server returns 404 or error page
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // Try to read as text first to see what we got
      const text = await response.text();
      console.error('❌ Non-JSON response received. Content-Type:', contentType);
      console.error('❌ Response preview:', text.substring(0, 500));
      
      // If it's HTML, it's likely a 404 or error page
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        throw new Error(`لم يتم إرجاع بيانات JSON (ربما الـ endpoint غير موجود أو الـ backend غير شغال). تحقق من: ${url}`);
      }
      
      // If it's not JSON but also not HTML, try to parse as JSON anyway
      try {
        const data = JSON.parse(text);
        if (!response.ok) {
          throw new Error(data.message || `خطأ ${response.status}: ${response.statusText}`);
        }
        return data;
      } catch (parseError) {
        throw new Error(`استجابة غير متوقعة. تحقق من أن الـ backend يعمل على ${API_BASE_URL}`);
      }
    }
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `خطأ ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('❌ API Request Error:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error(`لا يمكن الاتصال بالـ backend. تأكد من أن الـ backend يعمل على ${API_BASE_URL}. قم بتشغيل: cd backend && npm start`);
    }
    if (error.message.includes('<!DOCTYPE') || error.message.includes('<html')) {
      throw new Error(`تم إرجاع صفحة HTML بدلاً من JSON. تحقق من أن الـ endpoint صحيح وأن الـ backend يعمل.`);
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: userData,
    });
  },

  getMe: async () => {
    return apiRequest('/auth/me');
  },

  updateProfile: async (userData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: userData,
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return apiRequest('/auth/password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    });
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Orders API
export const ordersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/orders/${id}`);
  },

  create: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: orderData,
    });
  },

  createInquiry: async (inquiryData) => {
    return apiRequest('/orders/inquiry', {
      method: 'POST',
      body: inquiryData,
    });
  },

  update: async (id, orderData) => {
    return apiRequest(`/orders/${id}`, {
      method: 'PUT',
      body: orderData,
    });
  },

  confirm: async (id) => {
    return apiRequest(`/orders/${id}/confirm`, {
      method: 'POST',
    });
  },

  delete: async (id) => {
    return apiRequest(`/orders/${id}`, {
      method: 'DELETE',
    });
  },
};

// Customers API
export const customersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/customers?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/customers/${id}`);
  },

  create: async (customerData) => {
    return apiRequest('/customers', {
      method: 'POST',
      body: customerData,
    });
  },

  update: async (id, customerData) => {
    return apiRequest(`/customers/${id}`, {
      method: 'PUT',
      body: customerData,
    });
  },

  delete: async (id) => {
    return apiRequest(`/customers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Workers API
export const workersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/workers?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/workers/${id}`);
  },

  create: async (workerData) => {
    return apiRequest('/workers', {
      method: 'POST',
      body: workerData,
    });
  },

  update: async (id, workerData) => {
    return apiRequest(`/workers/${id}`, {
      method: 'PUT',
      body: workerData,
    });
  },

  delete: async (id) => {
    return apiRequest(`/workers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Housemaids API (Assistants)
export const housemaidsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/housemaids?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/housemaids/${id}`);
  },

  create: async (housemaidData) => {
    return apiRequest('/housemaids', {
      method: 'POST',
      body: housemaidData,
    });
  },

  update: async (id, housemaidData) => {
    return apiRequest(`/housemaids/${id}`, {
      method: 'PUT',
      body: housemaidData,
    });
  },

  delete: async (id) => {
    return apiRequest(`/housemaids/${id}`, {
      method: 'DELETE',
    });
  },
};

// Applications API
export const applicationsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/applications?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/applications/${id}`);
  },

  create: async (applicationData) => {
    return apiRequest('/applications', {
      method: 'POST',
      body: applicationData,
    });
  },

  update: async (id, applicationData) => {
    return apiRequest(`/applications/${id}`, {
      method: 'PUT',
      body: applicationData,
    });
  },

  accept: async (id) => {
    return apiRequest(`/applications/${id}/accept`, {
      method: 'POST',
    });
  },

  reject: async (id) => {
    return apiRequest(`/applications/${id}/reject`, {
      method: 'POST',
    });
  },

  delete: async (id) => {
    return apiRequest(`/applications/${id}`, {
      method: 'DELETE',
    });
  },
};

// Messages API
export const messagesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/messages?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/messages/${id}`);
  },

  create: async (messageData) => {
    return apiRequest('/messages', {
      method: 'POST',
      body: messageData,
    });
  },

  update: async (id, messageData) => {
    return apiRequest(`/messages/${id}`, {
      method: 'PUT',
      body: messageData,
    });
  },

  reply: async (id, replyMessage) => {
    return apiRequest(`/messages/${id}/reply`, {
      method: 'POST',
      body: { replyMessage },
    });
  },

  delete: async (id) => {
    return apiRequest(`/messages/${id}`, {
      method: 'DELETE',
    });
  },
};

// Overview API
export const overviewAPI = {
  getStats: async () => {
    return apiRequest('/overview');
  },
  getProfileStats: async () => {
    return apiRequest('/overview/profile-stats');
  },
};

// Reports API
export const reportsAPI = {
  getOrdersReport: async () => {
    return apiRequest('/reports/orders');
  },
  getRevenueReport: async () => {
    return apiRequest('/reports/revenue');
  },
  getWorkersReport: async () => {
    return apiRequest('/reports/workers');
  },
  getSatisfactionReport: async () => {
    return apiRequest('/reports/satisfaction');
  },
};

// Settings API
export const settingsAPI = {
  getSettings: async () => {
    return apiRequest('/settings');
  },
  updateSettings: async (settings) => {
    return apiRequest('/settings', {
      method: 'PUT',
      body: settings,
    });
  },
  getUsers: async () => {
    return apiRequest('/settings/users');
  },
  updateUserPassword: async (userId, newPassword) => {
    return apiRequest(`/settings/users/${userId}/password`, {
      method: 'PUT',
      body: { newPassword },
    });
  },
  getTimezones: async () => {
    return apiRequest('/settings/timezones');
  },
};

// Permissions API
export const permissionsAPI = {
  getAll: async () => {
    return apiRequest('/permissions');
  },

  getSupervisorPermissions: async (supervisorId) => {
    return apiRequest(`/permissions/${supervisorId}`);
  },

  getMyPermissions: async () => {
    return apiRequest('/permissions/me');
  },

  updateSupervisorPermissions: async (supervisorId, permissions) => {
    return apiRequest(`/permissions/${supervisorId}`, {
      method: 'PUT',
      body: { permissions },
    });
  },

  deleteSupervisor: async (supervisorId) => {
    return apiRequest(`/permissions/${supervisorId}`, {
      method: 'DELETE',
    });
  },
};

// Discounts API
export const discountsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/discounts?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/discounts/${id}`);
  },

  getActive: async (targetType) => {
    return apiRequest(`/discounts/active/${targetType}`);
  },

  create: async (discountData) => {
    return apiRequest('/discounts', {
      method: 'POST',
      body: discountData,
    });
  },

  update: async (id, discountData) => {
    return apiRequest(`/discounts/${id}`, {
      method: 'PUT',
      body: discountData,
    });
  },

  delete: async (id) => {
    return apiRequest(`/discounts/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  authAPI,
  ordersAPI,
  customersAPI,
  workersAPI,
  housemaidsAPI,
  applicationsAPI,
  messagesAPI,
  overviewAPI,
  permissionsAPI,
  reportsAPI,
  settingsAPI,
  discountsAPI,
};

