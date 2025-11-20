/**
 * Application entry point
 * Initializes the ToDoApp and sets up the UI
 */

import { TaskManager } from './business/TaskManager.js';
import { AppShell } from './ui/views/AppShell.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    
    if (!appContainer) {
        console.error('App container not found');
        return;
    }

    // Initialize task manager
    const taskManager = new TaskManager();

    // Initialize and render app shell
    const app = new AppShell(appContainer, taskManager);
    app.render();
});

