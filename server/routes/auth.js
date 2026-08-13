import express from 'express';
import { body, validationResult } from 'express-validator';
import { loginLimiter, signupLimiter } from '../middleware/rateLimiter.js';
import { authMiddleware } from '../middleware/auth.js';
import { hashPassword, comparePassword, validatePassword } from '../utils/passwordUtils.js';
import { generateToken } from '../utils/tokenUtils.js';
import { db } from '../utils/db.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', loginLimiter, [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user
        const user = db.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare passwords
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken({
            id: user.id,
            email: user.email,
            name: user.name
        });

        // Return user data (without password) and token
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * POST /api/auth/signup
 * Create new user account
 */
router.post('/signup', signupLimiter, [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, phone, location, farmSize, primaryCrop } = req.body;

        // Check if user already exists
        if (db.findUserByEmail(email)) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                error: 'Password does not meet security requirements',
                requirements: passwordValidation.errors
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = db.createUser({
            name,
            email,
            password: hashedPassword,
            phone,
            location,
            farmSize,
            primaryCrop
        });

        // Generate token
        const token = generateToken({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
        });

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

/**
 * POST /api/auth/verify
 * Verify JWT token and return user data
 */
router.post('/verify', authMiddleware, (req, res) => {
    try {
        const user = db.findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json({
            message: 'Token verified',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

/**
 * POST /api/auth/logout
 * Logout user (mainly for client-side cleanup)
 */
router.post('/logout', authMiddleware, (req, res) => {
    // Token is invalidated on client side by removing it
    res.json({ message: 'Logout successful' });
});

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put('/profile', authMiddleware, [
    body('name').optional().trim().notEmpty(),
    body('phone').optional().trim(),
    body('location').optional().trim(),
    body('farmSize').optional().trim(),
    body('primaryCrop').optional().trim()
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const updatedUser = db.updateUser(req.user.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = updatedUser;
        res.json({
            message: 'Profile updated successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Profile update failed' });
    }
});

/**
 * PUT /api/auth/password
 * Change user password
 */
router.put('/password', authMiddleware, [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;
        const user = db.findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isPasswordValid = await comparePassword(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Validate new password strength
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                error: 'New password does not meet security requirements',
                requirements: passwordValidation.errors
            });
        }

        // Hash and update password
        const hashedPassword = await hashPassword(newPassword);
        db.updateUserPassword(user.id, hashedPassword);

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ error: 'Password change failed' });
    }
});

export default router;
