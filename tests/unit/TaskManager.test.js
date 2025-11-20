/**
 * Unit tests for TaskManager
 */

import { TaskManager } from '../../src/business/TaskManager.js';
import { StorageService } from '../../src/data/StorageService.js';

describe('TaskManager', () => {
    let taskManager;

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        taskManager = new TaskManager();
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('constructor', () => {
        test('should initialize with empty tasks', () => {
            expect(taskManager.getTasks()).toEqual([]);
        });

        test('should load existing tasks from storage', () => {
            const existingTasks = [
                { id: '1', title: 'Task 1', description: '', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            ];
            StorageService.saveTasks(existingTasks);

            const manager = new TaskManager();
            expect(manager.getTasks()).toHaveLength(1);
            expect(manager.getTasks()[0].title).toBe('Task 1');
        });
    });

    describe('addTask', () => {
        test('should add a valid task', () => {
            const taskData = {
                title: 'New Task',
                description: 'Task description'
            };

            const result = taskManager.addTask(taskData);

            expect(result.success).toBe(true);
            expect(result.task).toBeDefined();
            expect(result.task.title).toBe('New Task');
            expect(result.task.id).toBeDefined();
            expect(taskManager.getTasks()).toHaveLength(1);
        });

        test('should reject invalid task', () => {
            const taskData = {
                title: '',
                description: 'No title'
            };

            const result = taskManager.addTask(taskData);

            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
            expect(taskManager.getTasks()).toHaveLength(0);
        });

        test('should sanitize task data', () => {
            const taskData = {
                title: '<script>alert("xss")</script>',
                description: 'Test'
            };

            const result = taskManager.addTask(taskData);

            expect(result.success).toBe(true);
            expect(result.task.title).not.toContain('<script>');
        });

        test('should persist task to storage', () => {
            const taskData = {
                title: 'Persisted Task'
            };

            taskManager.addTask(taskData);

            const stored = StorageService.getAllTasks();
            expect(stored).toHaveLength(1);
            expect(stored[0].title).toBe('Persisted Task');
        });

        test('should notify subscribers', (done) => {
            const callback = (tasks) => {
                expect(tasks).toHaveLength(1);
                done();
            };

            taskManager.subscribe(callback);
            taskManager.addTask({ title: 'New Task' });
        });
    });

    describe('updateTask', () => {
        test('should update an existing task', () => {
            const addResult = taskManager.addTask({ title: 'Original Title' });
            const taskId = addResult.task.id;

            const updateResult = taskManager.updateTask(taskId, {
                title: 'Updated Title'
            });

            expect(updateResult.success).toBe(true);
            expect(updateResult.task.title).toBe('Updated Title');
        });

        test('should reject update to non-existent task', () => {
            const result = taskManager.updateTask('non-existent-id', {
                title: 'Updated'
            });

            expect(result.success).toBe(false);
            expect(result.errors).toContain('Task not found');
        });

        test('should reject invalid updates', () => {
            const addResult = taskManager.addTask({ title: 'Original' });
            const taskId = addResult.task.id;

            const result = taskManager.updateTask(taskId, {
                title: ''
            });

            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
        });

        test('should update timestamps', () => {
            const addResult = taskManager.addTask({ title: 'Task' });
            const taskId = addResult.task.id;
            const originalUpdatedAt = addResult.task.updatedAt;

            // Wait a bit to ensure timestamp changes
            setTimeout(() => {
                const updateResult = taskManager.updateTask(taskId, {
                    description: 'New description'
                });

                expect(updateResult.task.updatedAt).not.toBe(originalUpdatedAt);
            }, 10);
        });

        test('should persist changes to storage', () => {
            const addResult = taskManager.addTask({ title: 'Original' });
            const taskId = addResult.task.id;

            taskManager.updateTask(taskId, { title: 'Updated' });

            const stored = StorageService.getAllTasks();
            expect(stored[0].title).toBe('Updated');
        });
    });

    describe('deleteTask', () => {
        test('should delete an existing task', () => {
            const addResult = taskManager.addTask({ title: 'To Delete' });
            const taskId = addResult.task.id;

            const result = taskManager.deleteTask(taskId);

            expect(result.success).toBe(true);
            expect(taskManager.getTasks()).toHaveLength(0);
        });

        test('should reject deletion of non-existent task', () => {
            const result = taskManager.deleteTask('non-existent-id');

            expect(result.success).toBe(false);
            expect(result.errors).toContain('Task not found');
        });

        test('should persist deletion to storage', () => {
            const addResult = taskManager.addTask({ title: 'To Delete' });
            const taskId = addResult.task.id;

            taskManager.deleteTask(taskId);

            const stored = StorageService.getAllTasks();
            expect(stored).toHaveLength(0);
        });
    });

    describe('toggleTaskCompletion', () => {
        test('should toggle task from incomplete to complete', () => {
            const addResult = taskManager.addTask({ title: 'Task' });
            const taskId = addResult.task.id;

            expect(addResult.task.completed).toBe(false);

            const result = taskManager.toggleTaskCompletion(taskId);

            expect(result.success).toBe(true);
            expect(result.task.completed).toBe(true);
        });

        test('should toggle task from complete to incomplete', () => {
            const addResult = taskManager.addTask({ title: 'Task' });
            const taskId = addResult.task.id;

            // Toggle to complete
            taskManager.toggleTaskCompletion(taskId);
            // Toggle back to incomplete
            const result = taskManager.toggleTaskCompletion(taskId);

            expect(result.task.completed).toBe(false);
        });

        test('should reject toggle for non-existent task', () => {
            const result = taskManager.toggleTaskCompletion('non-existent-id');

            expect(result.success).toBe(false);
            expect(result.errors).toContain('Task not found');
        });

        test('should persist toggle to storage', () => {
            const addResult = taskManager.addTask({ title: 'Task' });
            const taskId = addResult.task.id;

            taskManager.toggleTaskCompletion(taskId);

            const stored = StorageService.getAllTasks();
            expect(stored[0].completed).toBe(true);
        });
    });

    describe('getTaskById', () => {
        test('should return task by ID', () => {
            const addResult = taskManager.addTask({ title: 'Find Me' });
            const taskId = addResult.task.id;

            const task = taskManager.getTaskById(taskId);

            expect(task).toBeDefined();
            expect(task.id).toBe(taskId);
            expect(task.title).toBe('Find Me');
        });

        test('should return null for non-existent task', () => {
            const task = taskManager.getTaskById('non-existent-id');
            expect(task).toBeNull();
        });
    });

    describe('subscribe', () => {
        test('should notify subscribers on task addition', (done) => {
            const callback = (tasks) => {
                if (tasks.length > 0) {
                    expect(tasks).toHaveLength(1);
                    done();
                }
            };

            taskManager.subscribe(callback);
            taskManager.addTask({ title: 'New Task' });
        });

        test('should notify subscribers on task update', (done) => {
            const addResult = taskManager.addTask({ title: 'Original' });
            const taskId = addResult.task.id;
            
            const callback = (tasks) => {
                if (tasks.length > 0 && tasks[0].title === 'Updated') {
                    expect(tasks[0].title).toBe('Updated');
                    done();
                }
            };

            taskManager.subscribe(callback);
            taskManager.updateTask(taskId, { title: 'Updated' });
        });

        test('should notify subscribers on task deletion', (done) => {
            const addResult = taskManager.addTask({ title: 'To Delete' });
            const taskId = addResult.task.id;
            
            const callback = (tasks) => {
                if (tasks.length === 0) {
                    expect(tasks).toHaveLength(0);
                    done();
                }
            };

            taskManager.subscribe(callback);
            taskManager.deleteTask(taskId);
        });

        test('should allow unsubscribing', () => {
            let callCount = 0;
            const callback = () => { callCount++; };

            const unsubscribe = taskManager.subscribe(callback);
            taskManager.addTask({ title: 'Task 1' });
            expect(callCount).toBe(1);

            unsubscribe();
            taskManager.addTask({ title: 'Task 2' });
            expect(callCount).toBe(1); // Should not increase
        });

        test('should handle errors in subscriber callbacks', () => {
            const errorCallback = () => {
                throw new Error('Subscriber error');
            };
            let successCallCount = 0;
            const successCallback = () => { successCallCount++; };

            taskManager.subscribe(errorCallback);
            taskManager.subscribe(successCallback);

            // Should not throw
            expect(() => {
                taskManager.addTask({ title: 'Task' });
            }).not.toThrow();

            expect(successCallCount).toBeGreaterThan(0);
        });
    });

    describe('clearAll', () => {
        test('should clear all tasks', () => {
            taskManager.addTask({ title: 'Task 1' });
            taskManager.addTask({ title: 'Task 2' });

            expect(taskManager.getTasks()).toHaveLength(2);

            taskManager.clearAll();

            expect(taskManager.getTasks()).toHaveLength(0);
        });

        test('should persist clear to storage', () => {
            taskManager.addTask({ title: 'Task 1' });
            taskManager.clearAll();

            const stored = StorageService.getAllTasks();
            expect(stored).toHaveLength(0);
        });
    });

    describe('getTasks', () => {
        test('should return a copy of tasks array', () => {
            taskManager.addTask({ title: 'Task 1' });

            const tasks1 = taskManager.getTasks();
            const tasks2 = taskManager.getTasks();

            expect(tasks1).toEqual(tasks2);
            expect(tasks1).not.toBe(tasks2); // Different array instances
        });
    });
});
