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
                <h1>
                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    My Tasks
                </h1>
                <p class="app-tagline">Create and manage your daily tasks beautifully</p>
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
