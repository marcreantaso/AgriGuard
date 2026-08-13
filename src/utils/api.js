import { tokenStorage } from './tokenStorage';
import { cacheManager, CACHE_EXPIRY_MS } from './cacheManager';
import { performanceMonitor } from './performanceMonitor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Make authenticated API call with caching support
 */
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    const token = tokenStorage.getToken();

    // Start performance monitoring
    performanceMonitor.start(`api-${endpoint}`);

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

        // End performance monitoring
        const duration = performanceMonitor.end(`api-${endpoint}`);
        performanceMonitor.log(`API ${endpoint}`, duration);

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
};

/**
 * Cached API call (for GET requests)
 */
const cachedApiCall = async (endpoint, cacheExpiry = CACHE_EXPIRY_MS.MEDIUM) => {
    // Check cache first
    const cached = cacheManager.get(endpoint);
    if (cached) {
        return cached;
    }

    // If not cached, fetch and cache
    const data = await apiCall(endpoint, { method: 'GET' });
    cacheManager.set(endpoint, data, null, cacheExpiry);
    return data;
};

/**
 * Authentication API methods
 * No caching for auth endpoints (security critical)
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
            // Clear all cached data on logout
            cacheManager.clear();
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

        // Invalidate user-related cache
        cacheManager.invalidateEndpoint('/api/auth');

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
 * Generic API call helper with caching
 */
export const api = {
    get: (endpoint, useCache = true, cacheExpiry = CACHE_EXPIRY_MS.MEDIUM) => {
        return useCache 
            ? cachedApiCall(endpoint, cacheExpiry)
            : apiCall(endpoint, { method: 'GET' });
    },
    
    post: (endpoint, data) => {
        // Invalidate related cache on POST
        cacheManager.invalidateEndpoint(endpoint.split('?')[0]);
        return apiCall(endpoint, { method: 'POST', body: JSON.stringify(data) });
    },
    
    put: (endpoint, data) => {
        // Invalidate related cache on PUT
        cacheManager.invalidateEndpoint(endpoint.split('?')[0]);
        return apiCall(endpoint, { method: 'PUT', body: JSON.stringify(data) });
    },
    
    delete: (endpoint) => {
        // Invalidate related cache on DELETE
        cacheManager.invalidateEndpoint(endpoint.split('?')[0]);
        return apiCall(endpoint, { method: 'DELETE' });
    },

    /**
     * Clear all cached data
     */
    clearCache: () => {
        cacheManager.clear();
    },

    /**
     * Get cache statistics
     */
    getCacheStats: () => {
        return cacheManager.getStats();
    }
};

