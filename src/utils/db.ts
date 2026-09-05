/**
 * AgriGuard IndexedDB Utility — Offline-first storage
 * Stores: fieldVisits, safetyLogs, walletTransactions, marketplaceOffers
 */

const DB_NAME = 'AgriGuardDB';
const DB_VERSION = 1;

const STORES = {
    FIELD_VISITS: 'fieldVisits',
    SAFETY_LOGS: 'safetyLogs',
    WALLET_TRANSACTIONS: 'walletTransactions',
    MARKETPLACE_OFFERS: 'marketplaceOffers',
};

let dbInstance = null;

const openDB = () => {
    if (dbInstance) return Promise.resolve(dbInstance);

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            Object.values(STORES).forEach((storeName) => {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id' });
                }
            });
        };

        request.onsuccess = (event) => {
            dbInstance = event.target.result;
            resolve(dbInstance);
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error);
            reject(event.target.error);
        };
    });
};

/**
 * Get all records from a store
 */
export const getAll = async (storeName) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Get a single record by ID
 */
export const getById = async (storeName, id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Add a new record
 */
export const add = async (storeName, data) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const record = { ...data, id: data.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}` };
        const request = store.put(record);
        request.onsuccess = () => resolve(record);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Update an existing record
 */
export const update = async (storeName, data) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.put(data);
        request.onsuccess = () => resolve(data);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Remove a record by ID
 */
export const remove = async (storeName, id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Clear all records in a store
 */
export const clearStore = async (storeName) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
};

export { STORES };
export default { getAll, getById, add, update, remove, clearStore, STORES };
