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
                <svg class="empty-state-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="35" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                    <path d="M25 40L35 50L55 30" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>
                </svg>
                <h3 class="empty-state-title">No tasks yet</h3>
                <p class="empty-state-message">Click the "Add Task" button to create your first task</p>
            </div>
        `;
    }
}
