/**
 * AddTaskButton - Button to trigger task creation
 */

export class AddTaskButton {
    constructor(container) {
        this.container = container;
    }

    render() {
        const button = document.createElement('button');
        button.id = 'add-task-btn';
        button.className = 'btn btn-primary add-task-btn';
        button.setAttribute('aria-label', 'Add new task');

        // Add SVG icon
        button.innerHTML = `
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
            </svg>
            Add New Task
        `;

        button.addEventListener('click', () => {
            const event = new CustomEvent('show-task-form');
            window.dispatchEvent(event);
        });

        this.container.appendChild(button);
        return button;
    }
}
