import { cacheManager, CACHE_EXPIRY_MS } from './cacheManager';
import { performanceMonitor } from './performanceMonitor';

export class ApiError extends Error {
    constructor(public message: string, public status: number, public code: string, public details?: unknown) {
        super(message);
        this.name = 'ApiError';
    }
}

const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    performanceMonitor.start(`api-${endpoint}`);
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    try {
        const response = await fetch(endpoint, { ...options, headers, credentials: 'include' });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const payload = data.error || {};
            throw new ApiError(payload.message || 'API request failed', response.status, payload.code || 'SERVER_ERROR', payload.details);
        }
        const duration = performanceMonitor.end(`api-${endpoint}`);
        performanceMonitor.log(`API ${endpoint}`, duration);
        return data as T;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError('Unable to reach the service. Check your connection and try again.', 0, 'NETWORK_ERROR');
    }
};

const cachedApiCall = async <T>(endpoint: string, cacheExpiry = CACHE_EXPIRY_MS.MEDIUM): Promise<T> => {
    const cached = cacheManager.get(endpoint);
    if (cached) return cached as T;
    const data = await apiCall<T>(endpoint, { method: 'GET' });
    cacheManager.set(endpoint, data, null, cacheExpiry);
    return data;
};

export type AuthResponse = { user: { id: string; email: string; name: string; phone?: string | null; location?: string | null; farmSize?: string | null; primaryCrop?: string | null; joined?: string | Date | null } };

export const authApi = {
    login: (email: string, password: string) => apiCall<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    signup: (userData: { name: string; email: string; password: string }) => apiCall<AuthResponse>('/api/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
    verify: () => apiCall<AuthResponse>('/api/auth/verify', { method: 'POST' }),
    logout: () => apiCall<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }).finally(() => cacheManager.clear()),
    updateProfile: (updates: Record<string, string>) => apiCall<AuthResponse>('/api/auth/profile', { method: 'PUT', body: JSON.stringify(updates) }),
    changePassword: (currentPassword: string, newPassword: string) => apiCall('/api/auth/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) })
};

export const api = {
    get: <T>(endpoint: string, useCache = true, cacheExpiry = CACHE_EXPIRY_MS.MEDIUM) => useCache ? cachedApiCall<T>(endpoint, cacheExpiry) : apiCall<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, data: unknown) => apiCall<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: <T>(endpoint: string, data: unknown) => apiCall<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'DELETE' }),
    clearCache: () => cacheManager.clear(),
    getCacheStats: () => cacheManager.getStats()
};
