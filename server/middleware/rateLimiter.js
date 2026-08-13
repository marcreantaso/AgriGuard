import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for login attempts
 * Prevents brute force attacks
 */
export const loginLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5, // 5 requests per windowMs
    message: 'Too many login attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req, res) => {
        // Skip rate limiting for successful requests
        return res.statusCode === 200;
    }
});

/**
 * Rate limiter for signup attempts
 * Prevents spam registration
 */
export const signupLimiter = rateLimit({
    windowMs: 3600000, // 1 hour
    max: 3, // 3 signup attempts per hour
    message: 'Too many signup attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
    windowMs: 60000, // 1 minute
    max: 30, // 30 requests per minute
    message: 'Too many requests. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});
