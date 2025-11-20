/**
 * Unit tests for StorageService
 */

import { StorageService } from '../../src/data/StorageService.js';

describe('StorageService', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    afterEach(() => {
        // Clean up after each test
        localStorage.clear();
    });

    describe('isAvailable', () => {
        test('should return true when localStorage is available', () => {
            expect(StorageService.isAvailable()).toBe(true);
        });

        test('should return false when localStorage is not available', () => {
            // Mock localStorage to throw error
            const originalSetItem = Storage.prototype.setItem;
            Storage.prototype.setItem = () => {
                throw new Error('localStorage disabled');
            };

            expect(StorageService.isAvailable()).toBe(false);

            // Restore
            Storage.prototype.setItem = originalSetItem;
        });
    });

    describe('saveTasks', () => {
        test('should save tasks successfully', () => {
            const tasks = [
                { id: '1', title: 'Test Task', completed: false }
            ];

            const result = StorageService.saveTasks(tasks);

            expect(result.success).toBe(true);
            expect(result.duration).toBeDefined();
            expect(result.size).toBeGreaterThan(0);
        });

        test('should save empty array', () => {
            const result = StorageService.saveTasks([]);

            expect(result.success).toBe(true);
            
            const loaded = StorageService.getAllTasks();
            expect(loaded).toEqual([]);
        });

        test('should include version and timestamp in saved data', () => {
            const tasks = [{ id: '1', title: 'Test' }];
            StorageService.saveTasks(tasks);

            const raw = JSON.parse(localStorage.getItem('todoapp_data'));
            expect(raw.version).toBe('1.0');
            expect(raw.lastModified).toBeDefined();
            expect(raw.tasks).toEqual(tasks);
        });

        test('should handle quota exceeded error', () => {
            // Mock localStorage.setItem to throw quota error (but not during isAvailable check)
            const originalSetItem = Storage.prototype.setItem;
            let callCount = 0;
            
            Storage.prototype.setItem = function(key, value) {
                callCount++;
                // Allow the test call in isAvailable to succeed
                if (callCount === 1 && key === '__storage_test__') {
                    return originalSetItem.call(this, key, value);
                }
                // Throw quota error for actual save
                const error = new Error('Quota exceeded');
                error.name = 'QuotaExceededError';
                throw error;
            };

            const result = StorageService.saveTasks([{ id: '1', title: 'Test' }]);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Storage quota exceeded');
            expect(result.errorType).toBe('QUOTA_EXCEEDED');

            // Restore
            Storage.prototype.setItem = originalSetItem;
        });

        test('should handle other save errors', () => {
            // Mock localStorage.setItem to throw generic error
            const originalSetItem = Storage.prototype.setItem;
            let callCount = 0;
            
            Storage.prototype.setItem = function(key, value) {
                callCount++;
                // Allow the test call in isAvailable to succeed
                if (callCount === 1 && key === '__storage_test__') {
                    return originalSetItem.call(this, key, value);
                }
                throw new Error('Generic error');
            };

            const result = StorageService.saveTasks([{ id: '1', title: 'Test' }]);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Generic error');
            expect(result.errorType).toBe('SAVE_ERROR');

            // Restore
            Storage.prototype.setItem = originalSetItem;
        });

        test('should complete within 50ms', () => {
            const tasks = Array.from({ length: 100 }, (_, i) => ({
                id: String(i),
                title: `Task ${i}`,
                description: 'Test description',
                completed: false
            }));

            const result = StorageService.saveTasks(tasks);

            expect(result.success).toBe(true);
            expect(result.duration).toBeLessThan(50);
        });
    });

    describe('getAllTasks', () => {
        test('should return empty array when no data exists', () => {
            const tasks = StorageService.getAllTasks();
            expect(tasks).toEqual([]);
        });

        test('should load saved tasks successfully', () => {
            const testTasks = [
                { id: '1', title: 'Task 1', completed: false },
                { id: '2', title: 'Task 2', completed: true }
            ];

            StorageService.saveTasks(testTasks);
            const loaded = StorageService.getAllTasks();

            expect(loaded).toEqual(testTasks);
        });

        test('should handle corrupted data gracefully', () => {
            // Save invalid JSON
            localStorage.setItem('todoapp_data', 'invalid{json}');

            const tasks = StorageService.getAllTasks();
            expect(tasks).toEqual([]);
        });

        test('should handle missing tasks property', () => {
            // Save data without tasks array
            localStorage.setItem('todoapp_data', JSON.stringify({
                version: '1.0'
            }));

            const tasks = StorageService.getAllTasks();
            expect(tasks).toEqual([]);
        });

        test('should handle non-array tasks property', () => {
            // Save data with invalid tasks property
            localStorage.setItem('todoapp_data', JSON.stringify({
                tasks: 'not an array',
                version: '1.0'
            }));

            const tasks = StorageService.getAllTasks();
            expect(tasks).toEqual([]);
        });

        test('should complete within 100ms', () => {
            const tasks = Array.from({ length: 1000 }, (_, i) => ({
                id: String(i),
                title: `Task ${i}`,
                completed: false
            }));
            StorageService.saveTasks(tasks);

            const startTime = performance.now();
            StorageService.getAllTasks();
            const duration = performance.now() - startTime;

            expect(duration).toBeLessThan(100);
        });
    });

    describe('validateAndMigrate', () => {
        test('should validate correct data structure', () => {
            const data = {
                tasks: [{ id: '1', title: 'Test' }],
                version: '1.0',
                lastModified: new Date().toISOString()
            };

            const validated = StorageService.validateAndMigrate(data);
            expect(validated).toEqual(data);
        });

        test('should handle missing version', () => {
            const data = {
                tasks: [{ id: '1', title: 'Test' }]
            };

            const validated = StorageService.validateAndMigrate(data);
            expect(validated.version).toBe('1.0');
            expect(validated.tasks).toEqual(data.tasks);
        });

        test('should handle null data', () => {
            const validated = StorageService.validateAndMigrate(null);
            expect(validated.tasks).toEqual([]);
            expect(validated.version).toBe('1.0');
        });

        test('should handle invalid data type', () => {
            const validated = StorageService.validateAndMigrate('invalid');
            expect(validated.tasks).toEqual([]);
            expect(validated.version).toBe('1.0');
        });
    });

    describe('getStorageInfo', () => {
        test('should return storage information', () => {
            const info = StorageService.getStorageInfo();

            expect(info.available).toBe(true);
            expect(info.used).toBeDefined();
            expect(info.total).toBeGreaterThan(0);
            expect(info.percentage).toBeDefined();
        });

        test('should calculate used space correctly', () => {
            const tasks = [{ id: '1', title: 'Test Task' }];
            StorageService.saveTasks(tasks);

            const info = StorageService.getStorageInfo();
            expect(info.used).toBeGreaterThan(0);
        });
    });

    describe('clear', () => {
        test('should clear all stored data', () => {
            const tasks = [{ id: '1', title: 'Test' }];
            StorageService.saveTasks(tasks);

            expect(StorageService.getAllTasks()).toHaveLength(1);

            const result = StorageService.clear();
            expect(result).toBe(true);
            expect(StorageService.getAllTasks()).toEqual([]);
        });

        test('should return true even if no data exists', () => {
            const result = StorageService.clear();
            expect(result).toBe(true);
        });
    });
});
