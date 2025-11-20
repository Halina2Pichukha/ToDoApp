/**
 * Task Model
 * Represents a single task in the ToDoApp
 */

export class Task {
    /**
     * Create a new Task
     * @param {Object} data - Task data
     * @param {string} data.id - Unique identifier (auto-generated if not provided)
     * @param {string} data.title - Task title
     * @param {string} [data.description=''] - Task description
     * @param {boolean} [data.completed=false] - Completion status
     * @param {string} [data.createdAt] - Creation timestamp (auto-generated if not provided)
     * @param {string} [data.updatedAt] - Last update timestamp (auto-generated if not provided)
     */
    constructor(data = {}) {
        this.id = data.id || this.#generateId();
        this.title = data.title || '';
        this.description = data.description || '';
        this.completed = data.completed || false;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    /**
     * Generate a unique ID for the task
     * @private
     * @returns {string} Unique ID
     */
    #generateId() {
        return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Convert task to plain object
     * @returns {Object} Task as plain object
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            completed: this.completed,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Create a Task instance from a plain object
     * @param {Object} data - Plain object data
     * @returns {Task} Task instance
     */
    static fromJSON(data) {
        return new Task(data);
    }
}
