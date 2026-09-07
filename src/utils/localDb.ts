import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AgriGuardDB extends DBSchema {
    users: {
        key: string;
        value: {
            id: string;
            email: string;
            name: string;
            passwordHash: string;
            phone?: string | null;
            location?: string | null;
            farmSize?: string | null;
            primaryCrop?: string | null;
            joined: string;
        };
        indexes: { 'by-email': string };
    };
    devices: {
        key: string;
        value: any;
    };
    alerts: {
        key: string;
        value: any;
    };
    readings: {
        key: string;
        value: any;
    };
}

let dbPromise: Promise<IDBPDatabase<AgriGuardDB>> | null = null;

export const initDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<AgriGuardDB>('agriguard-db', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { keyPath: 'id' });
                    userStore.createIndex('by-email', 'email', { unique: true });
                }
                if (!db.objectStoreNames.contains('devices')) {
                    db.createObjectStore('devices', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('alerts')) {
                    db.createObjectStore('alerts', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('readings')) {
                    db.createObjectStore('readings', { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
};

// --- Basic Mock Utilities ---

const generateId = () => Math.random().toString(36).substring(2, 15);

// Simple hash mock
const mockHash = (password: string) => btoa(password);

export const localDb = {
    async createUser(data: { name: string; email: string; password: string }) {
        const db = await initDB();
        const existing = await db.getFromIndex('users', 'by-email', data.email);
        if (existing) {
            throw new Error('ACCOUNT_EXISTS');
        }

        const newUser = {
            id: generateId(),
            name: data.name,
            email: data.email,
            passwordHash: mockHash(data.password),
            joined: new Date().toISOString()
        };

        await db.put('users', newUser);
        return newUser;
    },

    async authenticateUser(email: string, password: string) {
        const db = await initDB();
        const user = await db.getFromIndex('users', 'by-email', email);
        if (!user || user.passwordHash !== mockHash(password)) {
            throw new Error('INVALID_CREDENTIALS');
        }
        return user;
    },
    
    async updateUser(id: string, updates: Record<string, string>) {
        const db = await initDB();
        const user = await db.get('users', id);
        if (!user) throw new Error('USER_NOT_FOUND');
        
        const updatedUser = { ...user, ...updates };
        await db.put('users', updatedUser);
        return updatedUser;
    }
};
