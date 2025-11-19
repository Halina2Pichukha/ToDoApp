# Component Design - ToDoApp

**Document Version:** 1.0  
**Date:** 2025-11-19  
**Status:** Active  
**Author:** Tech Architect Team  

---

## Overview

This document defines the component architecture for ToDoApp, describing each component's responsibilities, interfaces, dependencies, and interactions. The design follows the layered architecture pattern established in [ADR-001](./decisions/ADR-001-architectural-style.md).

---

## Component Architecture

### Layer Overview

```
┌─────────────────────────────────────────────────────┐
│                  UI Layer (View)                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ App Shell │ TaskList │ TaskForm │ TaskItem │   │
│  │  Modal │ Notification │ EmptyState │ ...    │   │
│  └─────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│           Business Logic Layer                       │
│  ┌─────────────────────────────────────────────┐   │
│  │       TaskManager (Controller)               │   │
│  │  - Task CRUD operations                      │   │
│  │  - Validation                                │   │
│  │  - State management                          │   │
│  │  - Event coordination                        │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │       Validators & Utilities                 │   │
│  └─────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│              Data Access Layer                       │
│  ┌─────────────────────────────────────────────┐   │
│  │         StorageService                       │   │
│  │  - CRUD operations on localStorage           │   │
│  │  - Serialization/Deserialization             │   │
│  │  - Error handling                            │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Component Catalog

### 1. Application Core

#### 1.1 App (Main Application)

**Location:** `src/app.js`

**Responsibility:**
- Application initialization and lifecycle management
- Component orchestration
- Global configuration
- Error boundary

**Interface:**
```javascript
class App {
    constructor(config)
    init()
    destroy()
}
```

**Dependencies:**
- TaskManager
- StorageService
- All UI components

**Example:**
```javascript
class App {
    constructor() {
        this.config = this.loadConfig();
        this.storageService = new StorageService();
        this.taskManager = new TaskManager(this.storageService);
        this.components = {};
    }
    
    async init() {
        // Initialize storage
        if (!this.storageService.isAvailable()) {
            this.showStorageError();
            return;
        }
        
        // Load tasks
        await this.taskManager.loadTasks();
        
        // Initialize UI components
        this.components.appShell = new AppShell(this.taskManager);
        this.components.taskList = new TaskListView(this.taskManager);
        this.components.taskForm = new TaskFormView(this.taskManager);
        
        // Render initial state
        this.render();
    }
    
    render() {
        this.components.appShell.render();
    }
    
    destroy() {
        Object.values(this.components).forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
    }
}
```

---

### 2. Business Logic Layer

#### 2.1 TaskManager

**Location:** `src/business/TaskManager.js`

**Responsibility:**
- Central controller for task operations
- Business logic and validation
- State management
- Event coordination
- Observer pattern implementation

**Interface:**
```javascript
class TaskManager {
    // Lifecycle
    constructor(storageService)
    async loadTasks()
    
    // CRUD operations
    async addTask(taskData)
    async updateTask(id, updates)
    async deleteTask(id)
    async toggleTaskCompletion(id)
    
    // Queries
    getTasks()
    getTask(id)
    getCompletedTasks()
    getIncompleteTasks()
    
    // State management
    subscribe(callback)
    unsubscribe(callback)
    notifySubscribers()
    
    // Validation
    validateTask(taskData)
}
```

**Key Methods:**
```javascript
class TaskManager {
    constructor(storageService) {
        this.storageService = storageService;
        this.tasks = [];
        this.subscribers = new Map();
        this.nextSubscriberId = 0;
    }
    
    async addTask(taskData) {
        // Validate input
        const errors = this.validateTask(taskData);
        if (errors.length > 0) {
            throw new ValidationError(errors);
        }
        
        // Create task object
        const task = {
            id: this.generateId(),
            title: taskData.title.trim(),
            description: (taskData.description || '').trim(),
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add to state
        this.tasks.push(task);
        
        // Persist
        await this.storageService.saveTasks(this.tasks);
        
        // Notify subscribers
        this.notifySubscribers();
        
        return task;
    }
    
    validateTask(taskData) {
        const errors = [];
        
        if (!taskData.title || taskData.title.trim() === '') {
            errors.push({ field: 'title', message: 'Title is required' });
        }
        
        if (taskData.title && taskData.title.length > 200) {
            errors.push({ 
                field: 'title', 
                message: 'Title must be 200 characters or less' 
            });
        }
        
        if (taskData.description && taskData.description.length > 1000) {
            errors.push({ 
                field: 'description', 
                message: 'Description must be 1000 characters or less' 
            });
        }
        
        return errors;
    }
    
    subscribe(callback) {
        const id = this.nextSubscriberId++;
        this.subscribers.set(id, callback);
        return () => this.subscribers.delete(id);
    }
    
    notifySubscribers() {
        const tasksCopy = [...this.tasks];
        this.subscribers.forEach(callback => callback(tasksCopy));
    }
}
```

**Dependencies:**
- StorageService
- Validator utilities (optional)

---

#### 2.2 Validators

**Location:** `src/business/validators/`

**Responsibility:**
- Input validation rules
- Reusable validation functions
- Error message generation

**Interface:**
```javascript
// TaskValidator.js
export const validateTitle = (title) => { /* ... */ };
export const validateDescription = (description) => { /* ... */ };
export const sanitizeInput = (input) => { /* ... */ };
```

---

#### 2.3 Task Model

**Location:** `src/business/models/Task.js`

**Responsibility:**
- Task data structure definition
- Task factory function
- Type definitions (if using TypeScript later)

**Interface:**
```javascript
export class Task {
    constructor(data) {
        this.id = data.id || generateUUID();
        this.title = data.title;
        this.description = data.description || '';
        this.completed = data.completed || false;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }
    
    update(updates) {
        Object.assign(this, updates);
        this.updatedAt = new Date().toISOString();
    }
    
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            completed: this.completed,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
```

---

### 3. Data Access Layer

#### 3.1 StorageService

**Location:** `src/data/StorageService.js`

**Responsibility:**
- Abstract storage operations
- localStorage implementation
- Serialization/deserialization
- Error handling
- Storage quota management

**Interface:**
```javascript
class StorageService {
    constructor()
    
    // Storage operations
    saveTasks(tasks)
    getAllTasks()
    
    // Utility methods
    isAvailable()
    getStorageInfo()
    clear()
    
    // Migration support
    validateAndMigrate(data)
}
```

**Implementation:**
```javascript
class StorageService {
    constructor() {
        this.storageKey = 'todoapp_tasks';
        this.version = '1.0';
    }
    
    saveTasks(tasks) {
        try {
            const data = {
                tasks: tasks,
                version: this.version,
                lastModified: new Date().toISOString()
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return { success: true };
            
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                return { 
                    success: false, 
                    error: 'quota_exceeded',
                    message: 'Storage quota exceeded'
                };
            }
            
            return { 
                success: false, 
                error: 'storage_error',
                message: error.message
            };
        }
    }
    
    getAllTasks() {
        try {
            const data = localStorage.getItem(this.storageKey);
            
            if (!data) {
                return [];
            }
            
            const parsed = JSON.parse(data);
            return this.validateAndMigrate(parsed);
            
        } catch (error) {
            console.error('Error reading tasks:', error);
            return [];
        }
    }
    
    validateAndMigrate(data) {
        // Handle different versions
        if (!data.version) {
            // Legacy format: array of tasks
            return Array.isArray(data) ? data : [];
        }
        
        // Current format
        return data.tasks || [];
    }
    
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    getStorageInfo() {
        const data = localStorage.getItem(this.storageKey) || '';
        const used = new Blob([data]).size;
        
        return {
            used: used,
            usedFormatted: this.formatBytes(used),
            estimatedQuota: 5 * 1024 * 1024, // 5MB typical
            percentUsed: (used / (5 * 1024 * 1024)) * 100
        };
    }
    
    formatBytes(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    
    clear() {
        localStorage.removeItem(this.storageKey);
    }
}
```

**Dependencies:**
- None (only browser localStorage API)

---

### 4. UI Layer Components

#### 4.1 AppShell

**Location:** `src/ui/AppShell.js`

**Responsibility:**
- Main application layout
- Header/footer rendering
- Global UI state (modals, notifications)

**Interface:**
```javascript
class AppShell {
    constructor(taskManager)
    render()
    showModal(modalComponent)
    hideModal()
    showNotification(message, type)
}
```

---

#### 4.2 TaskListView

**Location:** `src/ui/views/TaskListView.js`

**Responsibility:**
- Render list of tasks
- Handle task item interactions
- Empty state display
- Subscribe to task updates

**Interface:**
```javascript
class TaskListView {
    constructor(taskManager, containerElement)
    render(tasks)
    destroy()
    
    // Event handlers
    handleTaskClick(taskId)
    handleToggleCompletion(taskId)
    handleEditClick(taskId)
    handleDeleteClick(taskId)
}
```

**Implementation:**
```javascript
class TaskListView {
    constructor(taskManager, containerElement) {
        this.taskManager = taskManager;
        this.container = containerElement || document.getElementById('task-list');
        
        // Subscribe to task updates
        this.unsubscribe = taskManager.subscribe((tasks) => {
            this.render(tasks);
        });
        
        // Setup event delegation
        this.setupEventHandlers();
    }
    
    render(tasks) {
        if (tasks.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        this.container.innerHTML = tasks.map(task => 
            this.renderTaskItem(task)
        ).join('');
    }
    
    renderTaskItem(task) {
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" 
                 data-task-id="${task.id}">
                <input type="checkbox" 
                       class="task-checkbox"
                       ${task.completed ? 'checked' : ''}
                       aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}">
                <div class="task-content">
                    <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                    ${task.description ? 
                        `<p class="task-description">${this.escapeHtml(task.description)}</p>` 
                        : ''}
                    <span class="task-date">${this.formatDate(task.createdAt)}</span>
                </div>
                <div class="task-actions">
                    <button class="btn-edit" 
                            data-action="edit"
                            aria-label="Edit task">
                        ✏️
                    </button>
                    <button class="btn-delete" 
                            data-action="delete"
                            aria-label="Delete task">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }
    
    renderEmptyState() {
        this.container.innerHTML = `
            <div class="empty-state">
                <p>No tasks yet. Create your first task to get started!</p>
            </div>
        `;
    }
    
    setupEventHandlers() {
        // Event delegation for efficiency
        this.container.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;
            
            const taskId = taskItem.dataset.taskId;
            
            if (e.target.matches('.task-checkbox')) {
                this.handleToggleCompletion(taskId);
            } else if (e.target.matches('[data-action="edit"]')) {
                this.handleEditClick(taskId);
            } else if (e.target.matches('[data-action="delete"]')) {
                this.handleDeleteClick(taskId);
            }
        });
    }
    
    async handleToggleCompletion(taskId) {
        try {
            await this.taskManager.toggleTaskCompletion(taskId);
        } catch (error) {
            console.error('Error toggling task:', error);
            this.showError('Failed to update task');
        }
    }
    
    handleEditClick(taskId) {
        // Emit event for app to show edit form
        this.dispatchEvent('task:edit', { taskId });
    }
    
    async handleDeleteClick(taskId) {
        // Show confirmation
        const confirmed = await this.showConfirmation(
            'Delete task?',
            'This action cannot be undone.'
        );
        
        if (confirmed) {
            try {
                await this.taskManager.deleteTask(taskId);
                this.showSuccess('Task deleted');
            } catch (error) {
                console.error('Error deleting task:', error);
                this.showError('Failed to delete task');
            }
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString();
    }
    
    destroy() {
        this.unsubscribe();
    }
}
```

**Dependencies:**
- TaskManager
- NotificationManager (for success/error messages)
- ModalManager (for confirmation dialogs)

---

#### 4.3 TaskFormView

**Location:** `src/ui/views/TaskFormView.js`

**Responsibility:**
- Render task creation/edit form
- Handle form validation
- Submit task data
- Show validation errors

**Interface:**
```javascript
class TaskFormView {
    constructor(taskManager, containerElement)
    render(task = null) // null for create, task object for edit
    clear()
    validate()
    handleSubmit(event)
    showValidationErrors(errors)
}
```

---

#### 4.4 TaskItemView

**Location:** `src/ui/components/TaskItem.js`

**Responsibility:**
- Render individual task item
- Handle task-specific interactions
- Reusable component

---

#### 4.5 ModalManager

**Location:** `src/ui/components/ModalManager.js`

**Responsibility:**
- Display modal dialogs
- Confirmation dialogs
- Modal lifecycle management

**Interface:**
```javascript
class ModalManager {
    show(content, options)
    hide()
    confirm(title, message)
}
```

---

#### 4.6 NotificationManager

**Location:** `src/ui/components/NotificationManager.js`

**Responsibility:**
- Display toast notifications
- Success/error/info messages
- Auto-dismiss notifications

**Interface:**
```javascript
class NotificationManager {
    success(message, duration)
    error(message, duration)
    info(message, duration)
}
```

---

### 5. Utility Components

#### 5.1 EventBus

**Location:** `src/utils/EventBus.js`

**Responsibility:**
- Global event system
- Component communication
- Event subscription/publishing

**Interface:**
```javascript
class EventBus {
    on(event, callback)
    off(event, callback)
    emit(event, data)
}
```

---

#### 5.2 Utils

**Location:** `src/utils/helpers.js`

**Responsibility:**
- Common utility functions
- ID generation
- Date formatting
- HTML escaping

**Functions:**
```javascript
export function generateUUID() { /* ... */ }
export function escapeHtml(text) { /* ... */ }
export function formatDate(isoString) { /* ... */ }
export function debounce(func, wait) { /* ... */ }
export function throttle(func, wait) { /* ... */ }
```

---

## Component Communication

### Communication Patterns:

1. **Top-Down (Props)**
   - Parent components pass data to children
   - Configuration and initial state

2. **Bottom-Up (Events)**
   - Child components emit events
   - Parents handle events and update state

3. **Observer Pattern (State Updates)**
   - Components subscribe to TaskManager
   - Automatic re-render on state changes

4. **Event Bus (Global Events)**
   - Cross-component communication
   - Modal open/close
   - Notifications

### Communication Flow Example:

```
User clicks "Delete" on task
        │
        ▼
TaskItemView emits 'task:delete' event
        │
        ▼
TaskListView handles event
        │
        ▼
Shows confirmation modal (ModalManager)
        │
        ▼ (if confirmed)
Calls taskManager.deleteTask(id)
        │
        ▼
TaskManager updates state
        │
        ▼
StorageService persists changes
        │
        ▼
TaskManager notifies subscribers
        │
        ▼
TaskListView re-renders with updated tasks
        │
        ▼
Shows success notification
```

---

## Component Lifecycle

### Standard Component Lifecycle:

```javascript
class Component {
    constructor(dependencies) {
        // Initialize component
        // Store dependencies
        // Setup local state
    }
    
    init() {
        // Setup event listeners
        // Subscribe to state changes
        // Initial render
    }
    
    render(data) {
        // Update DOM
        // Handle data changes
    }
    
    destroy() {
        // Remove event listeners
        // Unsubscribe from state
        // Clean up resources
    }
}
```

---

## Error Handling in Components

### Error Handling Strategy:

```javascript
class TaskListView {
    async handleAction() {
        try {
            // Perform action
            await this.taskManager.someAction();
            
        } catch (error) {
            if (error instanceof ValidationError) {
                this.showValidationErrors(error.errors);
            } else if (error instanceof StorageError) {
                this.showError('Storage error. Please try again.');
            } else {
                console.error('Unexpected error:', error);
                this.showError('An error occurred. Please try again.');
            }
        }
    }
}
```

---

## Testing Strategy per Component

### Business Logic Layer:
- **Unit Tests**: 90% coverage
- Mock storage service
- Test all business rules
- Test validation logic

### Data Access Layer:
- **Integration Tests**: 85% coverage
- Test with real localStorage
- Test error scenarios
- Test data migrations

### UI Layer:
- **Component Tests**: 70% coverage
- Test user interactions
- Test rendering
- Mock TaskManager

---

## Future Enhancements

### Potential Component Additions:

1. **SearchComponent** (Post-MVP)
   - Filter tasks by title/description
   - Search UI component

2. **FilterComponent** (Post-MVP)
   - Filter by completed/incomplete
   - Filter by date range

3. **SortComponent** (Post-MVP)
   - Sort by date, title, status

4. **ExportComponent** (Post-MVP)
   - Export tasks to JSON/CSV

5. **ThemeManager** (Post-MVP)
   - Dark mode support
   - Theme switching

---

## References

- [System Architecture](./system-architecture.md)
- [ADR-001: Architectural Style](./decisions/ADR-001-architectural-style.md)
- [ADR-004: State Management](./decisions/ADR-004-state-management.md)
- [EPIC-001: Task CRUD Operations](../tasks/epics/EPIC-001-task-crud-operations.md)
- [EPIC-002: User Interface Design](../tasks/epics/EPIC-002-user-interface-design.md)

---

**Last Updated:** 2025-11-19  
**Next Review:** 2026-02-19
