# Data Architecture - ToDoApp

**Document Version:** 1.0  
**Date:** 2025-11-19  
**Status:** Active  
**Author:** Tech Architect Team  

---

## Overview

This document defines the data architecture for ToDoApp, including data models, storage strategies, data flow, validation rules, and migration strategies. The design supports the MVP's client-side localStorage approach while enabling future backend integration.

---

## Data Model

### Task Entity

The core entity of the application is the Task.

**Task Schema:**

```javascript
{
    "id": "string (UUID v4)",
    "title": "string (1-200 characters, required)",
    "description": "string (0-1000 characters, optional)",
    "completed": "boolean (default: false)",
    "createdAt": "string (ISO-8601 timestamp)",
    "updatedAt": "string (ISO-8601 timestamp)"
}
```

**Example:**
```javascript
{
    "id": "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread, and coffee",
    "completed": false,
    "createdAt": "2025-11-19T10:30:00.000Z",
    "updatedAt": "2025-11-19T10:30:00.000Z"
}
```

### Field Specifications

| Field | Type | Required | Validation | Default | Notes |
|-------|------|----------|------------|---------|-------|
| **id** | String (UUID) | Yes | UUID v4 format | Auto-generated | Immutable, unique identifier |
| **title** | String | Yes | Length: 1-200 chars, Non-empty after trim | None | Primary display text |
| **description** | String | No | Length: 0-1000 chars | Empty string | Optional details |
| **completed** | Boolean | Yes | Boolean value | false | Task completion status |
| **createdAt** | String (ISO-8601) | Yes | Valid ISO-8601 | Auto-generated | Creation timestamp |
| **updatedAt** | String (ISO-8601) | Yes | Valid ISO-8601 | Auto-generated | Last modification timestamp |

---

## Storage Structure

### localStorage Schema

All tasks are stored under a single key in localStorage.

**Storage Key:** `todoapp_tasks`

**Storage Format:**
```javascript
{
    "version": "1.0",
    "lastModified": "2025-11-19T12:00:00.000Z",
    "tasks": [
        {
            "id": "...",
            "title": "...",
            "description": "...",
            "completed": false,
            "createdAt": "...",
            "updatedAt": "..."
        },
        // ... more tasks
    ]
}
```

### Storage Metadata

| Field | Type | Purpose |
|-------|------|---------|
| **version** | String | Data schema version for migrations |
| **lastModified** | ISO-8601 String | Last update timestamp |
| **tasks** | Array | Array of task objects |

---

## Data Validation Rules

### Input Validation

#### Title Validation:
```javascript
function validateTitle(title) {
    const errors = [];
    
    // Required
    if (!title || title.trim() === '') {
        errors.push({
            field: 'title',
            code: 'TITLE_REQUIRED',
            message: 'Title is required'
        });
    }
    
    // Length
    if (title && title.length > 200) {
        errors.push({
            field: 'title',
            code: 'TITLE_TOO_LONG',
            message: 'Title must be 200 characters or less'
        });
    }
    
    return errors;
}
```

#### Description Validation:
```javascript
function validateDescription(description) {
    const errors = [];
    
    // Optional field - only validate if provided
    if (description && description.length > 1000) {
        errors.push({
            field: 'description',
            code: 'DESCRIPTION_TOO_LONG',
            message: 'Description must be 1000 characters or less'
        });
    }
    
    return errors;
}
```

#### Completed Validation:
```javascript
function validateCompleted(completed) {
    const errors = [];
    
    if (completed !== undefined && typeof completed !== 'boolean') {
        errors.push({
            field: 'completed',
            code: 'INVALID_BOOLEAN',
            message: 'Completed must be true or false'
        });
    }
    
    return errors;
}
```

### Data Sanitization

```javascript
function sanitizeTaskData(taskData) {
    return {
        title: taskData.title?.trim() || '',
        description: taskData.description?.trim() || '',
        completed: Boolean(taskData.completed)
    };
}
```

---

## Data Operations

### Create (C)

**Operation:** Add new task

```javascript
async function createTask(taskData) {
    // 1. Validate input
    const sanitized = sanitizeTaskData(taskData);
    const errors = validateTask(sanitized);
    if (errors.length > 0) {
        throw new ValidationError(errors);
    }
    
    // 2. Create task object
    const task = {
        id: generateUUID(),
        title: sanitized.title,
        description: sanitized.description,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // 3. Add to collection
    tasks.push(task);
    
    // 4. Persist
    await storageService.saveTasks(tasks);
    
    // 5. Return created task
    return task;
}
```

### Read (R)

**Operation:** Retrieve tasks

```javascript
// Get all tasks
function getAllTasks() {
    return [...tasks]; // Return copy to prevent mutation
}

// Get single task by ID
function getTaskById(id) {
    return tasks.find(task => task.id === id);
}

// Get completed tasks
function getCompletedTasks() {
    return tasks.filter(task => task.completed);
}

// Get incomplete tasks
function getIncompleteTasks() {
    return tasks.filter(task => !task.completed);
}
```

### Update (U)

**Operation:** Update existing task

```javascript
async function updateTask(id, updates) {
    // 1. Find task
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        throw new NotFoundError(`Task with id ${id} not found`);
    }
    
    // 2. Validate updates
    const sanitized = sanitizeTaskData(updates);
    const errors = validateTask(sanitized);
    if (errors.length > 0) {
        throw new ValidationError(errors);
    }
    
    // 3. Apply updates
    const task = tasks[index];
    Object.assign(task, sanitized, {
        updatedAt: new Date().toISOString()
    });
    
    // 4. Persist
    await storageService.saveTasks(tasks);
    
    // 5. Return updated task
    return task;
}
```

### Delete (D)

**Operation:** Remove task

```javascript
async function deleteTask(id) {
    // 1. Find task index
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        throw new NotFoundError(`Task with id ${id} not found`);
    }
    
    // 2. Remove from collection
    const [deleted] = tasks.splice(index, 1);
    
    // 3. Persist
    await storageService.saveTasks(tasks);
    
    // 4. Return deleted task
    return deleted;
}
```

---

## Data Integrity

### Constraints

1. **Unique IDs**
   - Each task must have a unique UUID
   - IDs are immutable once created
   - No duplicate IDs allowed

2. **Required Fields**
   - `id`, `title`, `completed`, `createdAt`, `updatedAt` must always exist
   - Cannot save task without required fields

3. **Field Lengths**
   - Title: 1-200 characters
   - Description: 0-1000 characters
   - Enforced at validation layer

4. **Type Safety**
   - `id`: String (UUID format)
   - `title`: String
   - `description`: String
   - `completed`: Boolean
   - `createdAt`, `updatedAt`: String (ISO-8601)

### Data Validation Layers

```
┌─────────────────────────────────────┐
│   1. Client-Side Input Validation   │ ← Form validation
│      (Immediate user feedback)      │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  2. Business Logic Validation       │ ← TaskManager validation
│     (Before state update)           │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  3. Storage Layer Validation        │ ← Before persistence
│     (Data integrity check)          │
└─────────────────────────────────────┘
```

---

## Data Flow

### Task Creation Flow

```
User Input → Form Validation → TaskManager.addTask()
                                        │
                                        ▼
                              Validate & Sanitize
                                        │
                                        ▼
                              Create Task Object
                                        │
                                        ▼
                              Add to State (tasks[])
                                        │
                                        ▼
                              StorageService.saveTasks()
                                        │
                                        ▼
                              Serialize to JSON
                                        │
                                        ▼
                              localStorage.setItem()
                                        │
                                        ▼
                              Notify Subscribers
                                        │
                                        ▼
                              UI Re-render
```

### Data Loading Flow (App Initialization)

```
App Init → StorageService.getAllTasks()
                    │
                    ▼
        localStorage.getItem('todoapp_tasks')
                    │
                    ▼
        Parse JSON (with error handling)
                    │
                    ▼
        Validate & Migrate if needed
                    │
                    ▼
        Return tasks array
                    │
                    ▼
        TaskManager.loadTasks(tasks)
                    │
                    ▼
        Set internal state
                    │
                    ▼
        Notify subscribers
                    │
                    ▼
        UI renders task list
```

---

## Data Migration Strategy

### Version Management

The data structure includes a `version` field to support future migrations.

**Current Version:** `1.0`

### Migration Process

```javascript
function migrateData(data) {
    // No version field means legacy format
    if (!data.version) {
        return migrateLegacyToV1(data);
    }
    
    // Already on current version
    if (data.version === '1.0') {
        return data;
    }
    
    // Future migrations
    // if (data.version === '1.0') {
    //     data = migrateV1ToV2(data);
    // }
    
    return data;
}

function migrateLegacyToV1(data) {
    // Legacy: array of tasks directly
    if (Array.isArray(data)) {
        return {
            version: '1.0',
            lastModified: new Date().toISOString(),
            tasks: data
        };
    }
    
    // Unknown format, start fresh
    return {
        version: '1.0',
        lastModified: new Date().toISOString(),
        tasks: []
    };
}
```

### Future Migration Example (V1 to V2)

```javascript
// Example: Adding a "priority" field in V2
function migrateV1ToV2(dataV1) {
    return {
        version: '2.0',
        lastModified: new Date().toISOString(),
        tasks: dataV1.tasks.map(task => ({
            ...task,
            priority: 'medium' // Default priority for existing tasks
        }))
    };
}
```

---

## Error Handling

### Storage Errors

```javascript
class StorageError extends Error {
    constructor(code, message, originalError) {
        super(message);
        this.name = 'StorageError';
        this.code = code;
        this.originalError = originalError;
    }
}

// Error codes:
// - QUOTA_EXCEEDED: localStorage quota exceeded
// - NOT_AVAILABLE: localStorage not available (private browsing)
// - CORRUPTED_DATA: Data in localStorage is corrupted
// - PARSE_ERROR: JSON parsing failed
```

### Validation Errors

```javascript
class ValidationError extends Error {
    constructor(errors) {
        super('Validation failed');
        this.name = 'ValidationError';
        this.errors = errors; // Array of error objects
    }
}

// Error object format:
{
    field: 'title',
    code: 'TITLE_REQUIRED',
    message: 'Title is required'
}
```

### Error Recovery

```javascript
function loadTasksWithRecovery() {
    try {
        const data = localStorage.getItem('todoapp_tasks');
        return JSON.parse(data);
        
    } catch (error) {
        if (error instanceof SyntaxError) {
            // Corrupted data - log and start fresh
            console.error('Corrupted task data detected:', error);
            localStorage.removeItem('todoapp_tasks');
            return { version: '1.0', tasks: [] };
        }
        throw error;
    }
}
```

---

## Performance Considerations

### Read Performance

- **Single Read on Init**: Load all tasks once on app initialization
- **In-Memory Access**: All subsequent reads from memory (no localStorage access)
- **O(1) Lookup**: Use Map for ID-based lookups if needed

### Write Performance

- **Batched Writes**: Minimize localStorage write operations
- **Atomic Updates**: All-or-nothing writes to prevent partial state
- **Async Pattern**: Use async/await even though localStorage is sync (future-proof)

### Scalability

**Target Capacity:**
- Support 1000+ tasks without performance degradation
- Estimated storage: ~200KB for 1000 tasks (well within 5MB quota)

**Optimization Strategies:**
1. Lazy loading (future): Load tasks in chunks if needed
2. Virtual scrolling (future): Render only visible tasks
3. Indexing (future): Use IndexedDB if performance becomes issue

---

## Data Security

### Client-Side Security Measures

1. **Input Sanitization**
   - Escape HTML in all user inputs
   - Prevent XSS attacks
   - Trim and validate all strings

2. **Data Privacy**
   - All data stored locally (never transmitted in MVP)
   - No data collection or analytics
   - User owns and controls all data

3. **No Sensitive Data**
   - Task data is not encrypted (client-side localStorage)
   - Users should be informed not to store sensitive information
   - Display warning in documentation/UI

### Future Security (with Backend)

When backend is added:
- HTTPS/TLS for data in transit
- Server-side validation
- Authentication and authorization
- Data encryption at rest
- Audit logging

---

## Data Export/Import (Post-MVP)

### Export Format (Future)

```javascript
{
    "exportedAt": "2025-11-19T12:00:00.000Z",
    "version": "1.0",
    "taskCount": 5,
    "tasks": [ /* task objects */ ]
}
```

### Import Validation (Future)

```javascript
function validateImportData(data) {
    // Validate structure
    if (!data.tasks || !Array.isArray(data.tasks)) {
        throw new Error('Invalid import format');
    }
    
    // Validate each task
    data.tasks.forEach((task, index) => {
        const errors = validateTask(task);
        if (errors.length > 0) {
            throw new Error(`Task ${index + 1} is invalid: ${errors[0].message}`);
        }
    });
    
    return true;
}
```

---

## Database Design (Post-MVP)

When migrating to a backend, suggested database schema:

### PostgreSQL Schema (Recommended)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT title_not_empty CHECK (LENGTH(TRIM(title)) > 0)
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

### MongoDB Schema (Alternative)

```javascript
{
    _id: ObjectId,
    userId: ObjectId,
    title: String, // max 200 chars
    description: String, // max 1000 chars
    completed: Boolean,
    createdAt: ISODate,
    updatedAt: ISODate
}

// Indexes
db.tasks.createIndex({ userId: 1, createdAt: -1 });
db.tasks.createIndex({ userId: 1, completed: 1 });
```

---

## Data Retention and Cleanup

### MVP (localStorage)
- Data persists until user clears browser data
- No automatic cleanup
- No retention policy

### Post-MVP (with Backend)
- Consider retention policies for inactive users
- Archive old completed tasks (>1 year)
- Soft delete with recovery period (30 days)

---

## Testing Data Scenarios

### Test Data Sets

**Empty State:**
```javascript
{ version: '1.0', tasks: [] }
```

**Single Task:**
```javascript
{
    version: '1.0',
    tasks: [{
        id: '...',
        title: 'Test task',
        description: '',
        completed: false,
        createdAt: '...',
        updatedAt: '...'
    }]
}
```

**Large Data Set (Performance Testing):**
- 1000 tasks
- 5000 tasks
- 10000 tasks (edge case)

**Edge Cases:**
- Tasks with max-length title (200 chars)
- Tasks with max-length description (1000 chars)
- Tasks with special characters
- Tasks with unicode/emoji
- Corrupted data scenarios

---

## Validation Against Requirements

✅ **FR-001**: Task creation with title and description - Supported  
✅ **FR-002**: Task viewing - All tasks retrievable  
✅ **FR-003**: Task editing - Update operation supported  
✅ **FR-004**: Task deletion - Delete operation supported  
✅ **FR-005**: Task completion toggle - Completed field supported  
✅ **NFR-011**: Data integrity ensured - Validation at multiple layers  
✅ **NFR-012**: Persist across sessions - localStorage implementation  
✅ **NFR-013**: Handle storage errors gracefully - Error handling implemented  

---

## References

- [System Architecture](./system-architecture.md)
- [ADR-003: Data Persistence Strategy](./decisions/ADR-003-data-persistence.md)
- [Component Design](./components.md)
- [EPIC-003: Data Persistence Layer](../tasks/epics/EPIC-003-data-persistence-layer.md)

---

**Last Updated:** 2025-11-19  
**Next Review:** 2026-02-19
