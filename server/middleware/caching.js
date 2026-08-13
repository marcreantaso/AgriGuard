/**
 * Response Caching Middleware
 * Caches responses for GET requests to reduce load
 */

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes default

export const responseCache = {
    /**
     * Get cached response
     */
    get: (key) => {
        const cached = cache.get(key);
        if (!cached) return null;

        if (Date.now() > cached.expiry) {
            cache.delete(key);
            return null;
        }

        return cached.data;
    },

    /**
     * Set cache
     */
    set: (key, data, duration = CACHE_DURATION) => {
        cache.set(key, {
            data,
            expiry: Date.now() + duration
        });
    },

    /**
     * Clear cache
     */
    clear: () => cache.clear(),

    /**
     * Generate cache key from request
     */
    generateKey: (req) => {
        return `${req.method}:${req.path}:${JSON.stringify(req.query)}`;
    }
};

/**
 * Middleware to cache GET responses
 */
export const cachingMiddleware = (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
        return next();
    }

    const key = responseCache.generateKey(req);
    const cached = responseCache.get(key);

    if (cached) {
        console.log(`✅ Cache hit: ${key}`);
        return res.json(cached);
    }

    // Override res.json to cache response
    const originalJson = res.json;
    res.json = function (data) {
        responseCache.set(key, data);
        return originalJson.call(this, data);
    };

    next();
};

export default cachingMiddleware;
