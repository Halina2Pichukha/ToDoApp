/**
 * TaskListView - Displays the list of tasks
 */

import { TaskItem } from '../components/TaskItem.js';
import { EmptyState } from '../components/EmptyState.js';
import { AddTaskButton } from '../components/AddTaskButton.js';

export class TaskListView {
    constructor(container, taskManager) {
        this.container = container;
        this.taskManager = taskManager;
        this.unsubscribe = null;
    }

    render() {
        // Create the list structure
        this.container.innerHTML = `
            <div class="task-list-header">
                <h2>My Tasks</h2>
                <div id="add-task-button-container"></div>
            </div>
            <div id="task-list" class="task-list"></div>
        `;

        // Render add button
        const addButtonContainer = this.container.querySelector('#add-task-button-container');
        const addButton = new AddTaskButton(addButtonContainer);
        addButton.render();

        // Subscribe to task changes
        this.unsubscribe = this.taskManager.subscribe((tasks) => {
            this.renderTasks(tasks);
        });

        // Initial render
        this.renderTasks(this.taskManager.getTasks());
    }

    renderTasks(tasks) {
        const taskListElement = this.container.querySelector('#task-list');
        
        if (!tasks || tasks.length === 0) {
            // Show empty state
            const emptyState = new EmptyState(taskListElement);
            emptyState.render();
            return;
        }

        // Clear and render tasks
        taskListElement.innerHTML = '';
        
        // Sort tasks by creation date (newest first)
        const sortedTasks = [...tasks].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        sortedTasks.forEach(task => {
            const taskItem = new TaskItem(task, this.taskManager);
            const taskElement = taskItem.render();
            taskListElement.appendChild(taskElement);
        });
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}
