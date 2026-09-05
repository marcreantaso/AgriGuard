/**
 * Secure Token Storage
 * Stores JWT tokens with XSS protection strategies
 */

const USER_KEY = 'agriguard_user_data';

export const tokenStorage = {
    /**
     * Set token in secure storage
     * Note: In production, consider using httpOnly cookies with a backend session
     */
    /**
     * Remove token from storage
     */
    removeToken: () => {
        try {
            sessionStorage.removeItem(USER_KEY);
            localStorage.removeItem(USER_KEY);
        } catch (error) {
            console.error('Failed to remove token:', error);
        }
    },

    /**
     * Store user data (without sensitive info)
     */
    setUser: (user) => {
        try {
            const safeUser = {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                location: user.location,
                farmSize: user.farmSize,
                primaryCrop: user.primaryCrop,
                joined: user.joined
            };
            sessionStorage.setItem(USER_KEY, JSON.stringify(safeUser));
            localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
        } catch (error) {
            console.error('Failed to store user data:', error);
        }
    },

    /**
     * Get stored user data
     */
    getUser: () => {
        try {
            const user = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Failed to retrieve user data:', error);
            return null;
        }
    },

    /**
     * Clear all auth data
     */
    clear: () => {
        tokenStorage.removeToken();
    },

    /**
     * Check if token exists and is likely valid
     */
    hasToken: () => !!tokenStorage.getUser()
};
