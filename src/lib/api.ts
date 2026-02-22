// API Configuration and Helper Functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Token management
export const getToken = () => localStorage.getItem('token');
export const getAdminToken = () => localStorage.getItem('admin_token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const setAdminToken = (token: string) => localStorage.setItem('admin_token', token);
export const removeToken = () => localStorage.removeItem('token');
export const removeAdminToken = () => localStorage.removeItem('admin_token');

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  useAdminToken = false
): Promise<T> {
  const token = useAdminToken ? getAdminToken() : getToken();
  
  const headers: HeadersInit = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'An error occurred');
  }

  return data;
}

// Authentication APIs
export const authApi = {
  register: (data: { name: string; email: string; password: string; phone: string }) =>
    apiFetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// User APIs
export const userApi = {
  getProfile: () => apiFetch('/api/v1/user/profile'),
  
  updateProfile: (data: { name?: string; email?: string }) =>
    apiFetch('/api/v1/user/update-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Product APIs
export const productApi = {
  getAll: (page = 1, limit = 100) =>
    apiFetch(`/api/v1/products?page=${page}&limit=${limit}`),

  getByCategory: (category: string, page = 1, limit = 10) =>
    apiFetch(`/api/v1/products/category/${encodeURIComponent(category)}?page=${page}&limit=${limit}`),

  getFeatured: (limit = 10) =>
    apiFetch(`/api/v1/products/featured?limit=${limit}`),

  getById: (id: string) =>
    apiFetch(`/api/v1/products/${id}`),
};

// Cart APIs
export const cartApi = {
  add: (data: { productId: string; quantity: number; size: string }) =>
    apiFetch('/api/v1/cart/add', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  get: () => apiFetch('/api/v1/cart/get-cart'),

  update: (data: { productId: string; quantity: number }) =>
    apiFetch('/api/v1/cart/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (productId: string) =>
    apiFetch(`/api/v1/cart/remove/${productId}`, {
      method: 'DELETE',
    }),

  clear: () =>
    apiFetch('/api/v1/cart/clear-cart', {
      method: 'DELETE',
    }),
};

// Wishlist APIs
export const wishlistApi = {
  add: (productId: string) =>
    apiFetch('/api/v1/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),

  get: (category?: string) =>
    apiFetch(`/api/v1/wishlist/get${category ? `?category=${category}` : ''}`),

  remove: (productId: string) =>
    apiFetch(`/api/v1/wishlist/remove/${productId}`, {
      method: 'DELETE',
    }),
};

// Order APIs
export const orderApi = {
  create: (data: {
    totalAmount: number;
    address: {
      line1: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    paymentMethod: string;
  }) =>
    apiFetch('/api/v1/orders/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createRazorpayOrder: (data: {
    totalAmount: number;
    address: {
      line1: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  }) =>
    apiFetch('/api/v1/orders/create-razorpay-order', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyPayment: (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: string;
  }) =>
    apiFetch('/api/v1/orders/verify-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (page = 1, limit = 10) =>
    apiFetch(`/api/v1/orders?page=${page}&limit=${limit}`),

  getAllWithFilters: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    paymentMethod?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    return apiFetch(`/api/v1/orders?${queryParams.toString()}`);
  },

  getById: (id: string) =>
    apiFetch(`/api/v1/orders/${id}`),

  update: (id: string, data: any) =>
    apiFetch(`/api/v1/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch(`/api/v1/orders/${id}`, {
      method: 'DELETE',
    }),

  cancel: (id: string) =>
    apiFetch(`/api/v1/orders/${id}/cancel`, {
      method: 'POST',
    }),
};

// QR Code API
export const qrApi = {
  get: () => apiFetch('/api/v1/get-qr'),
};

// Offers APIs
export const offersApi = {
  // User endpoints
  getActive: (category?: string) =>
    apiFetch(`/api/v1/offers/active${category ? `?category=${category}` : ''}`),
  
  getById: (id: string) =>
    apiFetch(`/api/v1/offers/${id}`),
};

// Admin APIs
export const adminApi = {
  login: (data: { email: string; password: string }) =>
    apiFetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Products
  products: {
    create: (formData: FormData) =>
      apiFetch('/api/admin/add-product', {
        method: 'POST',
        body: formData,
      }, true),

    getAll: (page = 1, limit = 10) =>
      apiFetch(`/api/admin/get-all-products?page=${page}&limit=${limit}`, {}, true),

    update: (id: string, formData: FormData) =>
      apiFetch(`/api/admin/update-product/${id}`, {
        method: 'PUT',
        body: formData,
      }, true),

    delete: (id: string) =>
      apiFetch(`/api/admin/delete-product/${id}`, {
        method: 'DELETE',
      }, true),
  },

  // Orders
  orders: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      filter?: string;
      category?: string;
      search?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.filter) queryParams.append('filter', params.filter);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      
      return apiFetch(`/api/admin/get-all-orders?${queryParams.toString()}`, {}, true);
    },

    getById: (id: string) =>
      apiFetch(`/api/admin/get-order/${id}`, {}, true),

    updateStatus: (id: string, status: string) =>
      apiFetch(`/api/admin/update-order/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }, true),

    delete: (id: string) =>
      apiFetch(`/api/admin/delete-order/${id}`, {
        method: 'DELETE',
      }, true),

    getStatistics: () =>
      apiFetch('/api/admin/order-statistics', {}, true),

    cleanupAbandoned: () =>
      apiFetch('/api/admin/cleanup-abandoned-orders', {
        method: 'POST',
      }, true),
  },

  // QR Code
  qr: {
    upload: (formData: FormData) =>
      apiFetch('/api/admin/add-qr', {
        method: 'POST',
        body: formData,
      }, true),
  },

  // Offers Management
  offers: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      category?: string;
      isActive?: boolean;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      
      return apiFetch(`/api/admin/offers?${queryParams.toString()}`, {}, true);
    },

    create: (formData: FormData) =>
      apiFetch('/api/admin/offers', {
        method: 'POST',
        body: formData,
      }, true),

    update: (id: string, formData: FormData) =>
      apiFetch(`/api/admin/offers/${id}`, {
        method: 'PUT',
        body: formData,
      }, true),

    delete: (id: string) =>
      apiFetch(`/api/admin/offers/${id}`, {
        method: 'DELETE',
      }, true),

    toggle: (id: string) =>
      apiFetch(`/api/admin/offers/${id}/toggle`, {
        method: 'PATCH',
      }, true),
  },

  // Inventory Management
  inventory: {
    // Get inventory overview with filters
    getOverview: (params?: {
      category?: string;
      lowStock?: boolean;
      outOfStock?: boolean;
      threshold?: number;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.lowStock) queryParams.append('lowStock', 'true');
      if (params?.outOfStock) queryParams.append('outOfStock', 'true');
      if (params?.threshold) queryParams.append('threshold', params.threshold.toString());
      return apiFetch(`/api/admin/inventory/overview?${queryParams.toString()}`, {}, true);
    },

    // Get low stock alerts
    getLowStockAlerts: (threshold = 10, category?: string) => {
      const params = new URLSearchParams({ threshold: threshold.toString() });
      if (category) params.append('category', category);
      return apiFetch(`/api/admin/inventory/low-stock?${params.toString()}`, {}, true);
    },

    // Get stock alerts (critical and warnings)
    getStockAlerts: () => apiFetch('/api/admin/inventory/alerts', {}, true),

    // Get inventory stats
    getInventoryStats: () => apiFetch('/api/admin/inventory/stats', {}, true),

    // Get inventory trends
    getInventoryTrends: (days = 30) => 
      apiFetch(`/api/admin/inventory/trends?days=${days}`, {}, true),

    // Update single product stock
    updateProductStock: (productId: string, stock: number, operation: 'set' | 'add' | 'subtract' = 'set') =>
      apiFetch(`/api/admin/inventory/update-stock/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ stock, operation }),
      }, true),

    // Bulk update stock
    bulkUpdateStock: (updates: Array<{ productId: string; stock: number; operation: 'set' | 'add' | 'subtract' }>) =>
      apiFetch('/api/admin/inventory/bulk-update-stock', {
        method: 'PUT',
        body: JSON.stringify({ updates }),
      }, true),

    // Get category analytics
    getCategoryAnalytics: (category?: string) => {
      const params = category ? `?category=${category}` : '';
      return apiFetch(`/api/admin/inventory/analytics${params}`, {}, true);
    },

    // Get stock movement report
    getStockMovementReport: (startDate?: string, endDate?: string) => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      return apiFetch(`/api/admin/inventory/stock-movement?${params.toString()}`, {}, true);
    },

    // Get products by category
    getProductsByCategory: (category: string) =>
      apiFetch(`/api/admin/inventory/category/${encodeURIComponent(category)}`, {}, true),
  },
};
