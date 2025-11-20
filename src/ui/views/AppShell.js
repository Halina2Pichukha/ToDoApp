/**
 * AppShell - Main application view
 * Orchestrates all UI components and manages app layout
 */

import { TaskListView } from './TaskListView.js';
import { TaskFormView } from './TaskFormView.js';
import { ConfirmationDialog } from '../components/ConfirmationDialog.js';

export class AppShell {
    constructor(container, taskManager) {
        this.container = container;
        this.taskManager = taskManager;
        this.taskListView = null;
        this.taskFormView = null;
        this.confirmationDialog = null;
    }

    render() {
        // Create main layout
        this.container.innerHTML = `
            <header class="app-header">
                <h1>ToDoApp</h1>
                <p class="app-tagline">Manage your tasks effectively</p>
            </header>
            <main class="app-main">
                <div id="task-list-container"></div>
            </main>
            <div id="modal-container"></div>
            <div id="dialog-container"></div>
        `;

        // Initialize views
        const taskListContainer = this.container.querySelector('#task-list-container');
        const modalContainer = this.container.querySelector('#modal-container');
        const dialogContainer = this.container.querySelector('#dialog-container');

        this.taskListView = new TaskListView(taskListContainer, this.taskManager);
        this.taskFormView = new TaskFormView(modalContainer, this.taskManager);
        this.confirmationDialog = new ConfirmationDialog(dialogContainer);

        // Render initial views
        this.taskListView.render();

        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for show/hide task form events
        window.addEventListener('show-task-form', (e) => {
            this.taskFormView.show(e.detail?.taskId);
        });

        window.addEventListener('hide-task-form', () => {
            this.taskFormView.hide();
        });

        // Listen for delete confirmation events
        window.addEventListener('show-delete-confirmation', (e) => {
            this.confirmationDialog.show({
                title: 'Delete Task',
                message: 'Are you sure you want to delete this task? This action cannot be undone.',
                confirmText: 'Delete',
                cancelText: 'Cancel',
                onConfirm: () => {
                    this.taskManager.deleteTask(e.detail.taskId);
                }
            });
        });
    }
}
