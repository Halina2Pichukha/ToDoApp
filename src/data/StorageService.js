/**
 * StorageService - Data Access Layer
 * Handles all localStorage operations for task persistence
 */

const STORAGE_KEY = 'todoapp_data';
const STORAGE_VERSION = '1.0';

export class StorageService {
    /**
     * Check if localStorage is available
     * @returns {boolean} True if localStorage is available
     */
    static isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Save tasks to localStorage
     * @param {Array} tasks - Array of task objects
     * @returns {Object} Result object with success status
     */
    static saveTasks(tasks) {
        const startTime = performance.now();
        
        if (!this.isAvailable()) {
            return {
                success: false,
                error: 'localStorage is not available'
            };
        }

        try {
            const data = {
                tasks: tasks || [],
                version: STORAGE_VERSION,
                lastModified: new Date().toISOString()
            };

            const serialized = JSON.stringify(data);
            localStorage.setItem(STORAGE_KEY, serialized);

            const duration = performance.now() - startTime;
            
            return {
                success: true,
                duration,
                size: serialized.length
            };
        } catch (e) {
            // Handle quota exceeded or other errors
            if (e.name === 'QuotaExceededError') {
                return {
                    success: false,
                    error: 'Storage quota exceeded',
                    errorType: 'QUOTA_EXCEEDED'
                };
            }
            return {
                success: false,
                error: e.message || 'Failed to save tasks',
                errorType: 'SAVE_ERROR'
            };
        }
    }

    /**
     * Load all tasks from localStorage
     * @returns {Array} Array of task objects (empty array if no data)
     */
    static getAllTasks() {
        if (!this.isAvailable()) {
            return [];
        }

        try {
            const serialized = localStorage.getItem(STORAGE_KEY);
            
            if (!serialized) {
                // No data yet - new user or cleared storage
                return [];
            }

            const data = JSON.parse(serialized);
            
            // Validate and migrate data if needed
            const validated = this.validateAndMigrate(data);
            
            return Array.isArray(validated.tasks) ? validated.tasks : [];
        } catch (e) {
            // Corrupted data - return empty array and log error
            console.error('Failed to load tasks:', e);
            return [];
        }
    }

    /**
     * Validate and migrate data structure
     * @param {Object} data - Raw data from localStorage
     * @returns {Object} Validated/migrated data
     */
    static validateAndMigrate(data) {
        if (!data || typeof data !== 'object') {
            return { tasks: [], version: STORAGE_VERSION };
        }

        // Handle data from older versions (if needed in future)
        if (!data.version || data.version !== STORAGE_VERSION) {
            // For now, just ensure it has the required structure
            return {
                tasks: Array.isArray(data.tasks) ? data.tasks : [],
                version: STORAGE_VERSION,
                lastModified: data.lastModified || new Date().toISOString()
            };
        }

        return data;
    }

    /**
     * Get storage usage information
     * @returns {Object} Storage info including size and quota
     */
    static getStorageInfo() {
        if (!this.isAvailable()) {
            return {
                available: false,
                used: 0,
                total: 0
            };
        }

        try {
            const serialized = localStorage.getItem(STORAGE_KEY) || '';
            const used = new Blob([serialized]).size;
            
            // Most browsers provide ~5MB for localStorage
            // This is an approximation as exact quota varies
            const estimated = 5 * 1024 * 1024; // 5MB in bytes

            return {
                available: true,
                used,
                total: estimated,
                percentage: (used / estimated) * 100
            };
        } catch (e) {
            return {
                available: true,
                used: 0,
                total: 0,
                error: e.message
            };
        }
    }

    /**
     * Clear all stored data
     * @returns {boolean} True if successful
     */
    static clear() {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (e) {
            console.error('Failed to clear storage:', e);
            return false;
        }
    }
}
