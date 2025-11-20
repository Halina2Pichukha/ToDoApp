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
        button.textContent = '+ Add Task';
        button.setAttribute('aria-label', 'Add new task');

        button.addEventListener('click', () => {
            const event = new CustomEvent('show-task-form');
            window.dispatchEvent(event);
        });

        this.container.appendChild(button);
        return button;
    }
}
