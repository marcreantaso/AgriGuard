/**
 * API Response Caching
 * Reduces redundant API calls and improves perceived performance
 */

const CACHE_EXPIRY_MS = {
    SHORT: 5 * 60 * 1000,      // 5 minutes
    MEDIUM: 30 * 60 * 1000,    // 30 minutes
    LONG: 60 * 60 * 1000       // 1 hour
};

class CacheManager {
    constructor() {
        this.cache = new Map();
        this.timers = new Map();
    }

    /**
     * Generate cache key from endpoint and parameters
     */
    generateKey(endpoint, params = null) {
        let key = endpoint;
        if (params) {
            key += JSON.stringify(params);
        }
        return key;
    }

    /**
     * Get cached data if not expired
     */
    get(endpoint, params = null) {
        const key = this.generateKey(endpoint, params);
        const cached = this.cache.get(key);

        if (!cached) return null;

        if (Date.now() > cached.expiry) {
            this.invalidate(endpoint, params);
            return null;
        }

        console.log(`✅ Cache hit: ${endpoint}`);
        return cached.data;
    }

    /**
     * Set cache with expiry
     */
    set(endpoint, data, params = null, expiryMs = CACHE_EXPIRY_MS.MEDIUM) {
        const key = this.generateKey(endpoint, params);

        // Clear existing timer
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }

        // Store data with expiry time
        this.cache.set(key, {
            data,
            expiry: Date.now() + expiryMs,
            timestamp: Date.now()
        });

        // Auto-invalidate after expiry
        const timer = setTimeout(() => {
            this.invalidate(endpoint, params);
        }, expiryMs);

        this.timers.set(key, timer);
    }

    /**
     * Invalidate specific cache entry
     */
    invalidate(endpoint, params = null) {
        const key = this.generateKey(endpoint, params);
        this.cache.delete(key);
        
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
    }

    /**
     * Invalidate all cache entries for an endpoint
     */
    invalidateEndpoint(endpoint) {
        for (const [key] of this.cache) {
            if (key.startsWith(endpoint)) {
                this.invalidate(endpoint);
            }
        }
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
        for (const timer of this.timers.values()) {
            clearTimeout(timer);
        }
        this.timers.clear();
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.entries()).map(([key, value]) => ({
                key,
                age: Date.now() - value.timestamp,
                expires: value.expiry - Date.now()
            }))
        };
    }
}

export const cacheManager = new CacheManager();

/**
 * Higher-order function to wrap API calls with caching
 */
export const withCache = (apiCall, endpoint, expiryMs = CACHE_EXPIRY_MS.MEDIUM) => {
    return async (params = null) => {
        // Check cache first
        const cached = cacheManager.get(endpoint, params);
        if (cached) return cached;

        // Call API
        const data = await apiCall(params);

        // Cache result
        cacheManager.set(endpoint, data, params, expiryMs);

        return data;
    };
};

export { CACHE_EXPIRY_MS };
