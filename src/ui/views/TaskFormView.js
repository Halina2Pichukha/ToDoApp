/**
 * TaskFormView - Task creation/editing form
 */

import { TaskValidator } from '../../business/validators/TaskValidator.js';

export class TaskFormView {
    constructor(container, taskManager) {
        this.container = container;
        this.taskManager = taskManager;
        this.currentTaskId = null;
    }

    show(taskId = null) {
        this.currentTaskId = taskId;
        this.render();
    }

    hide() {
        this.container.innerHTML = '';
        this.currentTaskId = null;
    }

    render() {
        const isEditing = this.currentTaskId !== null;
        const task = isEditing ? this.taskManager.getTaskById(this.currentTaskId) : null;

        this.container.innerHTML = `
            <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="form-title">
                <div class="modal">
                    <div class="modal-header">
                        <h2 id="form-title">${isEditing ? 'Edit Task' : 'Add New Task'}</h2>
                        <button class="modal-close" aria-label="Close">&times;</button>
                    </div>
                    <form id="task-form" class="modal-body">
                        <div class="form-group">
                            <label for="task-title">
                                Task Title <span class="required">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="task-title" 
                                name="title"
                                maxlength="200"
                                required
                                aria-required="true"
                                placeholder="e.g., Buy groceries for dinner"
                                value="${task ? this.escapeHTML(task.title) : ''}"
                            />
                            <div class="form-meta">
                                <span class="error-message" id="title-error" role="alert"></span>
                                <span class="char-counter" id="title-counter">0/200</span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="task-description">
                                Description <span class="text-gray-500">(optional)</span>
                            </label>
                            <textarea 
                                id="task-description" 
                                name="description"
                                maxlength="1000"
                                rows="4"
                                placeholder="Add more details about this task..."
                            >${task ? this.escapeHTML(task.description) : ''}</textarea>
                            <div class="form-meta">
                                <span class="error-message" id="description-error" role="alert"></span>
                                <span class="char-counter" id="description-counter">0/1000</span>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" id="cancel-btn">Cancel</button>
                            <button type="submit" class="btn btn-primary" id="save-btn">
                                ${isEditing ? 'Save Changes' : 'Add Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.updateCharCounters();
        
        // Focus title field
        setTimeout(() => {
            this.container.querySelector('#task-title')?.focus();
        }, 100);
    }

    attachEventListeners() {
        const form = this.container.querySelector('#task-form');
        const titleInput = this.container.querySelector('#task-title');
        const descInput = this.container.querySelector('#task-description');
        const closeBtn = this.container.querySelector('.modal-close');
        const cancelBtn = this.container.querySelector('#cancel-btn');
        const overlay = this.container.querySelector('.modal-overlay');

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Character counters and validation
        titleInput.addEventListener('input', () => {
            this.updateCharCounters();
            this.validateField('title');
        });

        descInput.addEventListener('input', () => {
            this.updateCharCounters();
            this.validateField('description');
        });

        // Close actions
        closeBtn.addEventListener('click', () => this.hide());
        cancelBtn.addEventListener('click', () => this.hide());
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hide();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        }, { once: true });
    }

    updateCharCounters() {
        const titleInput = this.container.querySelector('#task-title');
        const descInput = this.container.querySelector('#task-description');
        const titleCounter = this.container.querySelector('#title-counter');
        const descCounter = this.container.querySelector('#description-counter');

        if (titleInput && titleCounter) {
            titleCounter.textContent = `${titleInput.value.length}/200`;
        }

        if (descInput && descCounter) {
            descCounter.textContent = `${descInput.value.length}/1000`;
        }
    }

    validateField(fieldName) {
        const input = this.container.querySelector(`#task-${fieldName}`);
        const errorElement = this.container.querySelector(`#${fieldName}-error`);

        if (!input || !errorElement) return true;

        const value = input.value;
        let validation;

        if (fieldName === 'title') {
            validation = TaskValidator.validateTitle(value);
        } else {
            validation = TaskValidator.validateDescription(value);
        }

        if (!validation.valid) {
            errorElement.textContent = validation.errors[0];
            input.setAttribute('aria-invalid', 'true');
            return false;
        } else {
            errorElement.textContent = '';
            input.removeAttribute('aria-invalid');
            return true;
        }
    }

    handleSubmit() {
        const titleInput = this.container.querySelector('#task-title');
        const descInput = this.container.querySelector('#task-description');

        const titleValid = this.validateField('title');
        const descValid = this.validateField('description');

        if (!titleValid || !descValid) {
            return;
        }

        const taskData = {
            title: titleInput.value.trim(),
            description: descInput.value.trim()
        };

        let result;
        if (this.currentTaskId) {
            // Update existing task
            result = this.taskManager.updateTask(this.currentTaskId, taskData);
        } else {
            // Add new task
            result = this.taskManager.addTask(taskData);
        }

        if (result.success) {
            this.hide();
        } else {
            // Show error
            const titleError = this.container.querySelector('#title-error');
            titleError.textContent = result.errors?.join(', ') || 'Failed to save task';
        }
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}
