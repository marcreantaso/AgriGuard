import { hashPassword } from './passwordUtils.js';

/**
 * In-memory database for users
 * In production, replace with a real database (PostgreSQL, MongoDB, etc.)
 */

let users = [];

/**
 * Initialize database with test user
 * This runs once on server startup
 */
export const initializeUsers = async () => {
    if (users.length === 0) {
        try {
            const hashedPassword = await hashPassword('AgriGuard123!');
            users = [
                {
                    id: 'farmer_1',
                    email: 'farmer@agri.com',
                    password: hashedPassword,
                    name: 'Juan Dela Cruz',
                    joined: new Date().toISOString(),
                    phone: '09123456789',
                    location: 'Nueva Ecija',
                    farmSize: '5 hectares',
                    primaryCrop: 'Rice'
                }
            ];
            console.log('✅ Test user initialized - Email: farmer@agri.com, Password: AgriGuard123!');
        } catch (error) {
            console.error('Failed to initialize test user:', error);
        }
    }
};

export const db = {
    // User operations
    findUserByEmail: (email) => {
        return users.find(u => u.email === email.toLowerCase());
    },

    findUserById: (id) => {
        return users.find(u => u.id === id);
    },

    createUser: (userData) => {
        const newUser = {
            id: 'farmer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            email: userData.email.toLowerCase(),
            password: userData.password,
            name: userData.name,
            joined: new Date().toISOString(),
            phone: userData.phone || '',
            location: userData.location || '',
            farmSize: userData.farmSize || '',
            primaryCrop: userData.primaryCrop || 'Rice'
        };

        users.push(newUser);
        return newUser;
    },

    updateUser: (id, updates) => {
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) return null;

        // Don't allow email or password updates via this method
        const { email, password, ...safeUpdates } = updates;

        users[userIndex] = { ...users[userIndex], ...safeUpdates };
        return users[userIndex];
    },

    updateUserPassword: (id, newPassword) => {
        const user = users.find(u => u.id === id);
        if (user) {
            user.password = newPassword;
        }
        return user;
    },

    deleteUser: (id) => {
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users.splice(index, 1);
            return true;
        }
        return false;
    },

    getAllUsers: () => {
        return users.map(u => {
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
        });
    }
};
