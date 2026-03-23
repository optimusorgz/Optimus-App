import client from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Authentication Service
 * Handles user registration, login, profile, and token verification
 */
export const authService = {
    register: async (email, password, fullName, userType) => {
        const response = await client.post('/auth/register', {
            email,
            password,
            full_name: fullName,
            user_type: userType,
        });
        
        if (response.data.token) {
            await AsyncStorage.setItem('authToken', response.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    },

    login: async (email, password) => {
        const response = await client.post('/auth/login', {
            email,
            password,
        });
        
        if (response.data.token) {
            await AsyncStorage.setItem('authToken', response.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    },

    verifyToken: async () => {
        const response = await client.post('/auth/verify-token');
        return response.data;
    },

    getProfile: async () => {
        const response = await client.get('/auth/profile');
        return response.data;
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('user');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    },

    getCurrentUser: async () => {
        try {
            const userJson = await AsyncStorage.getItem('user');
            return userJson ? JSON.parse(userJson) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },
};

/**
 * Category Service
 * Handles fetching product categories
 */
export const categoryService = {
    getCategories: async () => {
        const response = await client.get('/categories');
        return response.data.categories || [];
    },

    getCategoryById: async (id) => {
        const response = await client.get(`/categories/${id}`);
        return response.data;
    },

    createCategory: async (name, description) => {
        const response = await client.post('/categories', {
            name,
            description,
        });
        return response.data;
    },
};

/**
 * Product Service
 * Handles product operations: listing, searching, details, reviews, filtering
 */
export const productService = {
    getProducts: async (params = {}) => {
        const response = await client.get('/products', { params });
        return response.data.products || [];
    },

    getProductById: async (id) => {
        const response = await client.get(`/products/${id}`);
        return response.data;
    },

    searchProducts: async (query, params = {}) => {
        const response = await client.get('/products/search', {
            params: { search: query, ...params },
        });
        return response.data.products || [];
    },

    getProductsByCategory: async (categoryId, sortBy = 'rating') => {
        const response = await client.get('/products', {
            params: {
                category_id: categoryId,
                sort_by: sortBy,
            },
        });
        return response.data.products || [];
    },

    getSellerProducts: async (sellerId) => {
        const response = await client.get('/products', {
            params: { seller_id: sellerId },
        });
        return response.data.products || [];
    },

    getProductReviews: async (productId) => {
        const response = await client.get(`/products/${productId}/reviews`);
        return response.data.reviews || [];
    },

    addReview: async (productId, rating, comment) => {
        const response = await client.post(`/products/${productId}/reviews`, {
            rating,
            comment,
        });
        return response.data;
    },

    createProduct: async (productData) => {
        const response = await client.post('/products', productData);
        return response.data;
    },

    updateProduct: async (id, productData) => {
        const response = await client.put(`/products/${id}`, productData);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await client.delete(`/products/${id}`);
        return response.data;
    },
};

/**
 * Wishlist Service
 * Handles wishlist operations
 */
export const wishlistService = {
    getWishlist: async () => {
        const response = await client.get('/wishlist');
        return response.data.wishlist || [];
    },

    addToWishlist: async (productId) => {
        const response = await client.post('/wishlist', { product_id: productId });
        return response.data;
    },

    removeFromWishlist: async (productId) => {
        const response = await client.delete(`/wishlist/${productId}`);
        return response.data;
    },

    isInWishlist: async (productId) => {
        const response = await client.get(`/wishlist/${productId}/check`);
        return response.data;
    },
};

/**
 * Order Service
 * Handles order creation, retrieval, updates
 */
export const orderService = {
    createOrder: async (orderData) => {
        const response = await client.post('/orders', orderData);
        return response.data;
    },

    getOrderById: async (orderId) => {
        const response = await client.get(`/orders/${orderId}`);
        return response.data;
    },

    getBuyerOrders: async () => {
        const response = await client.get('/orders/buyer/orders');
        return response.data.orders || [];
    },

    getSellerOrders: async () => {
        const response = await client.get('/orders/seller/orders');
        return response.data.orders || [];
    },

    updateOrderStatus: async (orderId, status) => {
        const response = await client.put(`/orders/${orderId}/status`, { status });
        return response.data;
    },

    cancelOrder: async (orderId) => {
        const response = await client.put(`/orders/${orderId}/cancel`);
        return response.data;
    },

    getOrderStats: async () => {
        try {
            const orders = await orderService.getSellerOrders();
            const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
            const totalOrders = orders.length;
            const completedOrders = orders.filter(o => o.status === 'completed').length;

            return {
                totalOrders,
                totalRevenue,
                completedOrders,
                pendingOrders: totalOrders - completedOrders,
            };
        } catch (error) {
            console.error('Error fetching order stats:', error);
            throw error;
        }
    },
};

export default {
    authService,
    categoryService,
    productService,
    wishlistService,
    orderService,
};
