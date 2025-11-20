/**
 * TaskManager - Business Logic Controller
 * Manages task state and coordinates between UI and data layers
 * Implements Observer pattern for state change notifications
 */

import { Task } from './models/Task.js';
import { TaskValidator } from './validators/TaskValidator.js';
import { StorageService } from '../data/StorageService.js';

export class TaskManager {
    #tasks = [];
    #subscribers = [];

    constructor() {
        this.loadTasks();
    }

    /**
     * Load tasks from storage
     */
    loadTasks() {
        const tasksData = StorageService.getAllTasks();
        this.#tasks = tasksData.map(data => Task.fromJSON(data));
        this.notifySubscribers();
    }

    /**
     * Get all tasks
     * @returns {Array<Task>} Array of tasks
     */
    getTasks() {
        return [...this.#tasks];
    }

    /**
     * Get a single task by ID
     * @param {string} id - Task ID
     * @returns {Task|null} Task or null if not found
     */
    getTaskById(id) {
        return this.#tasks.find(task => task.id === id) || null;
    }

    /**
     * Add a new task
     * @param {Object} taskData - Task data
     * @returns {Object} Result { success: boolean, task?: Task, errors?: string[] }
     */
    addTask(taskData) {
        // Validate task data
        const validation = TaskValidator.validate(taskData);
        if (!validation.valid) {
            return {
                success: false,
                errors: validation.errors
            };
        }

        // Sanitize input to prevent XSS
        const sanitized = TaskValidator.sanitize(taskData);

        // Create new task
        const task = new Task(sanitized);
        this.#tasks.push(task);

        // Persist to storage
        this.#saveTasks();

        return {
            success: true,
            task
        };
    }

    /**
     * Update an existing task
     * @param {string} id - Task ID
     * @param {Object} updates - Fields to update
     * @returns {Object} Result { success: boolean, task?: Task, errors?: string[] }
     */
    updateTask(id, updates) {
        const task = this.getTaskById(id);
        if (!task) {
            return {
                success: false,
                errors: ['Task not found']
            };
        }

        // Create updated task data
        const updatedData = {
            ...task.toJSON(),
            ...updates,
            updatedAt: new Date().toISOString()
        };

        // Validate updated data
        const validation = TaskValidator.validate(updatedData);
        if (!validation.valid) {
            return {
                success: false,
                errors: validation.errors
            };
        }

        // Sanitize input
        const sanitized = TaskValidator.sanitize(updatedData);

        // Update task properties
        task.title = sanitized.title;
        task.description = sanitized.description;
        if (updates.completed !== undefined) {
            task.completed = updates.completed;
        }
        task.updatedAt = sanitized.updatedAt;

        // Persist to storage
        this.#saveTasks();

        return {
            success: true,
            task
        };
    }

    /**
     * Delete a task
     * @param {string} id - Task ID
     * @returns {Object} Result { success: boolean, errors?: string[] }
     */
    deleteTask(id) {
        const index = this.#tasks.findIndex(task => task.id === id);
        if (index === -1) {
            return {
                success: false,
                errors: ['Task not found']
            };
        }

        this.#tasks.splice(index, 1);
        this.#saveTasks();

        return {
            success: true
        };
    }

    /**
     * Toggle task completion status
     * @param {string} id - Task ID
     * @returns {Object} Result { success: boolean, task?: Task, errors?: string[] }
     */
    toggleTaskCompletion(id) {
        const task = this.getTaskById(id);
        if (!task) {
            return {
                success: false,
                errors: ['Task not found']
            };
        }

        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();

        this.#saveTasks();

        return {
            success: true,
            task
        };
    }

    /**
     * Subscribe to task changes
     * @param {Function} callback - Callback to invoke on changes
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.#subscribers.push(callback);
        
        // Return unsubscribe function
        return () => {
            const index = this.#subscribers.indexOf(callback);
            if (index > -1) {
                this.#subscribers.splice(index, 1);
            }
        };
    }

    /**
     * Notify all subscribers of state changes
     */
    notifySubscribers() {
        const tasks = this.getTasks();
        this.#subscribers.forEach(callback => {
            try {
                callback(tasks);
            } catch (e) {
                console.error('Error in subscriber callback:', e);
            }
        });
    }

    /**
     * Save tasks to storage and notify subscribers
     * @private
     */
    #saveTasks() {
        const tasksData = this.#tasks.map(task => task.toJSON());
        const result = StorageService.saveTasks(tasksData);
        
        if (!result.success) {
            console.error('Failed to save tasks:', result.error);
        }

        this.notifySubscribers();
    }

    /**
     * Clear all tasks
     * @returns {boolean} Success status
     */
    clearAll() {
        this.#tasks = [];
        this.#saveTasks();
        return true;
    }
}
