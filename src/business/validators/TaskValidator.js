/**
 * TaskValidator - Validates task data
 * Ensures data integrity and business rules compliance
 */

export class TaskValidator {
    static MAX_TITLE_LENGTH = 200;
    static MAX_DESCRIPTION_LENGTH = 1000;

    /**
     * Validate task data
     * @param {Object} taskData - Task data to validate
     * @returns {Object} Validation result { valid: boolean, errors: string[] }
     */
    static validate(taskData) {
        const errors = [];

        // Title validation
        if (!taskData.title || typeof taskData.title !== 'string') {
            errors.push('Title is required');
        } else if (taskData.title.trim().length === 0) {
            errors.push('Title cannot be empty');
        } else if (taskData.title.length > this.MAX_TITLE_LENGTH) {
            errors.push(`Title must not exceed ${this.MAX_TITLE_LENGTH} characters`);
        }

        // Description validation (optional but has max length)
        if (taskData.description !== undefined && taskData.description !== null) {
            if (typeof taskData.description !== 'string') {
                errors.push('Description must be a string');
            } else if (taskData.description.length > this.MAX_DESCRIPTION_LENGTH) {
                errors.push(`Description must not exceed ${this.MAX_DESCRIPTION_LENGTH} characters`);
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate title only (for real-time validation)
     * @param {string} title - Title to validate
     * @returns {Object} Validation result
     */
    static validateTitle(title) {
        const errors = [];

        if (!title || typeof title !== 'string') {
            errors.push('Title is required');
        } else if (title.trim().length === 0) {
            errors.push('Title cannot be empty');
        } else if (title.length > this.MAX_TITLE_LENGTH) {
            errors.push(`Title must not exceed ${this.MAX_TITLE_LENGTH} characters`);
        }

        return {
            valid: errors.length === 0,
            errors,
            remaining: this.MAX_TITLE_LENGTH - (title?.length || 0)
        };
    }

    /**
     * Validate description only (for real-time validation)
     * @param {string} description - Description to validate
     * @returns {Object} Validation result
     */
    static validateDescription(description) {
        const errors = [];

        if (description && typeof description !== 'string') {
            errors.push('Description must be a string');
        } else if (description && description.length > this.MAX_DESCRIPTION_LENGTH) {
            errors.push(`Description must not exceed ${this.MAX_DESCRIPTION_LENGTH} characters`);
        }

        return {
            valid: errors.length === 0,
            errors,
            remaining: this.MAX_DESCRIPTION_LENGTH - (description?.length || 0)
        };
    }

    /**
     * Sanitize task data by escaping HTML
     * @param {Object} taskData - Task data to sanitize
     * @returns {Object} Sanitized task data
     */
    static sanitize(taskData) {
        return {
            ...taskData,
            title: this.escapeHTML(taskData.title || ''),
            description: this.escapeHTML(taskData.description || '')
        };
    }

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    static escapeHTML(str) {
        if (typeof str !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}
