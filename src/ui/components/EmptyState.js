/**
 * EmptyState - Shown when there are no tasks
 */

export class EmptyState {
    constructor(container) {
        this.container = container;
    }

    render() {
        this.container.innerHTML = `
            <div class="empty-state">
                <svg class="empty-state-icon" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 class="empty-state-title">No tasks yet!</h2>
                <p class="empty-state-message">Create your first task to start organizing your day and stay on top of what matters.</p>
                <button 
                    class="btn btn-primary" 
                    aria-label="Add your first task"
                    onclick="window.dispatchEvent(new CustomEvent('show-task-form'))">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" style="display: inline-block; vertical-align: middle; margin-right: 0.5rem;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add Your First Task
                </button>
            </div>
        `;
    }
}
