/**
 * TaskItem - Individual task component
 */

export class TaskItem {
    constructor(task, taskManager) {
        this.task = task;
        this.taskManager = taskManager;
    }

    render() {
        const item = document.createElement('div');
        item.className = `task-item ${this.task.completed ? 'completed' : ''}`;
        item.setAttribute('data-task-id', this.task.id);

        item.innerHTML = `
            <div class="task-checkbox">
                <input 
                    type="checkbox" 
                    id="task-${this.task.id}" 
                    ${this.task.completed ? 'checked' : ''}
                    aria-label="Mark task as ${this.task.completed ? 'incomplete' : 'complete'}"
                />
            </div>
            <div class="task-content">
                <h3 class="task-title">${this.escapeHTML(this.task.title)}</h3>
                ${this.task.description ? `<p class="task-description">${this.escapeHTML(this.task.description)}</p>` : ''}
                <div class="task-meta">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span class="task-date">Created ${this.formatDate(this.task.createdAt)}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn edit-btn" aria-label="Edit task">
                    Edit
                </button>
                <button class="task-action-btn delete-btn" aria-label="Delete task">
                    Delete
                </button>
            </div>
        `;

        this.attachEventListeners(item);
        return item;
    }

    attachEventListeners(item) {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const editBtn = item.querySelector('.edit-btn');
        const deleteBtn = item.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => {
            this.taskManager.toggleTaskCompletion(this.task.id);
        });

        editBtn.addEventListener('click', () => {
            const event = new CustomEvent('show-task-form', {
                detail: { taskId: this.task.id }
            });
            window.dispatchEvent(event);
        });

        deleteBtn.addEventListener('click', () => {
            const event = new CustomEvent('show-delete-confirmation', {
                detail: { taskId: this.task.id }
            });
            window.dispatchEvent(event);
        });
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'today';
        } else if (diffDays === 1) {
            return 'yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
}
