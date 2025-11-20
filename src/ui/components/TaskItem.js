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
                    <span class="task-date">Created ${this.formatDate(this.task.createdAt)}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-icon edit-btn" aria-label="Edit task" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                </button>
                <button class="btn-icon delete-btn" aria-label="Delete task" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
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
