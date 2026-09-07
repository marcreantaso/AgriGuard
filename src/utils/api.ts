import { cacheManager, CACHE_EXPIRY_MS } from './cacheManager';
import { performanceMonitor } from './performanceMonitor';
import { localDb } from './localDb';

export class ApiError extends Error {
    constructor(public message: string, public status: number, public code: string, public details?: unknown) {
        super(message);
        this.name = 'ApiError';
    }
}

// Simulate network delay for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type AuthResponse = { user: { id: string; email: string; name: string; phone?: string | null; location?: string | null; farmSize?: string | null; primaryCrop?: string | null; joined?: string | Date | null } };

export const authApi = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        performanceMonitor.start(`api-login`);
        await delay(500);
        try {
            const user = await localDb.authenticateUser(email, password);
            performanceMonitor.end(`api-login`);
            return { user };
        } catch (err: any) {
            throw new ApiError(err.message, 400, err.message);
        }
    },
    
    signup: async (userData: { name: string; email: string; password: string }): Promise<AuthResponse> => {
        performanceMonitor.start(`api-signup`);
        await delay(500);
        try {
            const user = await localDb.createUser(userData);
            performanceMonitor.end(`api-signup`);
            return { user };
        } catch (err: any) {
            throw new ApiError(err.message, 400, err.message);
        }
    },
    
    verify: async (): Promise<AuthResponse> => {
        // Local DB verification isn't strictly needed as we rely on tokenStorage,
        // but we'll simulate a success if a token exists. (Handled in AuthContext).
        await delay(200);
        // We throw an error if no user is found, but for now we just return a stub
        // because verify is usually called with a token. We assume the frontend tokenStorage is source of truth.
        const storedUserStr = localStorage.getItem('auth_token'); // Assuming tokenStorage uses this
        if (storedUserStr) {
             const user = JSON.parse(storedUserStr);
             return { user };
        }
        throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    },
    
    logout: async (): Promise<{ ok: boolean }> => {
        await delay(200);
        cacheManager.clear();
        return { ok: true };
    },
    
    updateProfile: async (updates: Record<string, string>): Promise<AuthResponse> => {
        await delay(500);
        const storedUserStr = localStorage.getItem('auth_token');
        if (!storedUserStr) throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
        
        try {
            const currentUser = JSON.parse(storedUserStr);
            const user = await localDb.updateUser(currentUser.id, updates);
            return { user };
        } catch (err: any) {
             throw new ApiError(err.message, 400, err.message);
        }
    },
    
    changePassword: async (currentPassword: string, newPassword: string) => {
        await delay(500);
        // Simple mock
        return { ok: true };
    }
};

// Generic API mock for other endpoints (devices, alerts, etc)
export const api = {
    get: async <T>(endpoint: string, useCache = true, cacheExpiry = CACHE_EXPIRY_MS.MEDIUM): Promise<T> => {
        if (useCache) {
            const cached = cacheManager.get(endpoint);
            if (cached) return cached as T;
        }
        await delay(300);
        // Mock empty arrays for endpoints that aren't implemented in localDb yet
        const data = [] as unknown as T;
        if (useCache) cacheManager.set(endpoint, data, null, cacheExpiry);
        return data;
    },
    post: async <T>(endpoint: string, data: unknown): Promise<T> => {
        await delay(300);
        return { ...data as any, id: Math.random().toString(36).substring(2, 9) } as T;
    },
    put: async <T>(endpoint: string, data: unknown): Promise<T> => {
        await delay(300);
        return data as T;
    },
    delete: async <T>(endpoint: string): Promise<T> => {
        await delay(300);
        return {} as T;
    },
    clearCache: () => cacheManager.clear(),
    getCacheStats: () => cacheManager.getStats()
};
