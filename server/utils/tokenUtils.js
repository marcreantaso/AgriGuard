import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 * @param {object} payload - Token payload
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || '7d',
        issuer: 'agriguard-server'
    });
};

/**
 * Verify JWT token
 * @param {string} token - Token to verify
 * @returns {object} Decoded token
 * @throws {Error} If token is invalid
 */
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Decode JWT token without verification (use with caution)
 * @param {string} token - Token to decode
 * @returns {object} Decoded token
 */
export const decodeToken = (token) => {
    return jwt.decode(token);
};
