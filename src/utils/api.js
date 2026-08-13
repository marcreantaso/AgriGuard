import { tokenStorage } from './tokenStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Make authenticated API call
 */
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    const token = tokenStorage.getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.error || 'API request failed');
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
};

/**
 * Authentication API methods
 */
export const authApi = {
    /**
     * Login with email and password
     */
    login: async (email, password) => {
        const response = await apiCall('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (response.token) {
            tokenStorage.setToken(response.token);
            tokenStorage.setUser(response.user);
        }

        return response;
    },

    /**
     * Sign up new user
     */
    signup: async (userData) => {
        const response = await apiCall('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (response.token) {
            tokenStorage.setToken(response.token);
            tokenStorage.setUser(response.user);
        }

        return response;
    },

    /**
     * Verify current token
     */
    verify: async () => {
        try {
            return await apiCall('/api/auth/verify', {
                method: 'POST'
            });
        } catch (error) {
            if (error.status === 401) {
                tokenStorage.clear();
            }
            throw error;
        }
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            await apiCall('/api/auth/logout', {
                method: 'POST'
            });
        } catch (error) {
            // Log but don't throw on logout
            console.error('Logout error:', error);
        } finally {
            tokenStorage.clear();
        }
    },

    /**
     * Update user profile
     */
    updateProfile: async (updates) => {
        const response = await apiCall('/api/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(updates)
        });

        if (response.user) {
            tokenStorage.setUser(response.user);
        }

        return response;
    },

    /**
     * Change password
     */
    changePassword: async (currentPassword, newPassword) => {
        return await apiCall('/api/auth/password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    }
};

/**
 * Generic API call helper
 */
export const api = {
    get: (endpoint) => apiCall(endpoint, { method: 'GET' }),
    post: (endpoint, data) => apiCall(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint, data) => apiCall(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' })
};
