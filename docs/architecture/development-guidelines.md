# Development Guidelines - ToDoApp

**Document Version:** 1.0  
**Date:** 2025-11-19  
**Status:** Active  
**Author:** Tech Architect Team  

---

## Overview

This document provides comprehensive development guidelines for ToDoApp, covering code organization, coding standards, testing practices, build processes, and collaboration workflows. These guidelines ensure consistency, maintainability, and quality across the codebase.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Coding Standards](#coding-standards)
3. [Naming Conventions](#naming-conventions)
4. [Testing Strategy](#testing-strategy)
5. [Git Workflow](#git-workflow)
6. [Code Review Process](#code-review-process)
7. [Build and Deployment](#build-and-deployment)
8. [Performance Guidelines](#performance-guidelines)
9. [Security Best Practices](#security-best-practices)
10. [Documentation Standards](#documentation-standards)

---

## Project Structure

### Recommended Directory Layout

```
ToDoApp/
├── .github/                    # GitHub-specific files
│   ├── workflows/              # CI/CD workflows
│   └── ISSUE_TEMPLATE/         # Issue templates
├── docs/                       # Documentation
│   ├── architecture/           # Architecture documents
│   ├── requirements/           # Requirements documents
│   ├── tasks/                  # Task breakdowns
│   ├── mockups/                # UI mockups
│   └── roles/                  # Role definitions
├── src/                        # Source code
│   ├── app.js                  # Application entry point
│   ├── business/               # Business logic layer
│   │   ├── TaskManager.js
│   │   ├── models/
│   │   │   └── Task.js
│   │   └── validators/
│   │       └── TaskValidator.js
│   ├── data/                   # Data access layer
│   │   ├── StorageService.js
│   │   └── repositories/
│   ├── ui/                     # UI layer
│   │   ├── components/
│   │   │   ├── Modal.js
│   │   │   ├── Notification.js
│   │   │   └── TaskItem.js
│   │   └── views/
│   │       ├── AppShell.js
│   │       ├── TaskListView.js
│   │       └── TaskFormView.js
│   ├── utils/                  # Utilities and helpers
│   │   ├── helpers.js
│   │   ├── eventBus.js
│   │   └── constants.js
│   └── styles/                 # CSS files
│       ├── main.css
│       ├── components/
│       └── layouts/
├── tests/                      # Test files
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   ├── e2e/                    # End-to-end tests
│   ├── accessibility/          # Accessibility tests
│   └── fixtures/               # Test fixtures
├── public/                     # Static assets
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── jest.config.js              # Jest configuration
├── .gitignore                  # Git ignore patterns
├── package.json                # Dependencies and scripts
├── AGENTS.md                   # Agent documentation
└── README.md                   # Project README
```

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **JavaScript classes** | PascalCase | `TaskManager.js`, `StorageService.js` |
| **JavaScript utilities** | camelCase | `helpers.js`, `eventBus.js` |
| **CSS files** | kebab-case | `main.css`, `task-list.css` |
| **Test files** | `.test.js` suffix | `TaskManager.test.js` |
| **HTML files** | lowercase | `index.html` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_TITLE_LENGTH` |

---

## Coding Standards

### JavaScript Style Guide

#### General Rules

1. **Use ES6+ Features**
   ```javascript
   // ✅ Good: Use const/let
   const taskManager = new TaskManager();
   let currentTask = null;
   
   // ❌ Bad: Don't use var
   var taskManager = new TaskManager();
   ```

2. **Prefer Arrow Functions**
   ```javascript
   // ✅ Good: Arrow function for callbacks
   tasks.map(task => task.id);
   
   // ❌ Bad: Traditional function
   tasks.map(function(task) { return task.id; });
   ```

3. **Use Template Literals**
   ```javascript
   // ✅ Good: Template literal
   const message = `Task "${task.title}" was created`;
   
   // ❌ Bad: String concatenation
   const message = 'Task "' + task.title + '" was created';
   ```

4. **Destructuring**
   ```javascript
   // ✅ Good: Destructuring
   const { title, description } = task;
   
   // ❌ Bad: Individual assignment
   const title = task.title;
   const description = task.description;
   ```

#### Class Structure

```javascript
/**
 * TaskManager handles all task-related operations.
 */
class TaskManager {
    // 1. Private fields first (with # prefix)
    #tasks = [];
    #storageService;
    #subscribers = new Map();
    
    // 2. Constructor
    constructor(storageService) {
        this.#storageService = storageService;
    }
    
    // 3. Public methods
    async addTask(taskData) {
        // Implementation
    }
    
    getTasks() {
        return [...this.#tasks];
    }
    
    // 4. Private methods last
    #validateTask(task) {
        // Implementation
    }
    
    #notifySubscribers() {
        // Implementation
    }
}
```

#### Function Documentation

```javascript
/**
 * Creates a new task and saves it to storage.
 * 
 * @param {Object} taskData - The task data
 * @param {string} taskData.title - Task title (required)
 * @param {string} [taskData.description] - Task description (optional)
 * @returns {Promise<Task>} The created task
 * @throws {ValidationError} If validation fails
 * 
 * @example
 * const task = await taskManager.addTask({
 *     title: 'Buy groceries',
 *     description: 'Milk and eggs'
 * });
 */
async addTask(taskData) {
    // Implementation
}
```

#### Error Handling

```javascript
// ✅ Good: Specific error handling
try {
    await taskManager.addTask(data);
} catch (error) {
    if (error instanceof ValidationError) {
        showValidationErrors(error.errors);
    } else if (error instanceof StorageError) {
        showStorageError();
    } else {
        console.error('Unexpected error:', error);
        showGenericError();
    }
}

// ❌ Bad: Generic catch with no handling
try {
    await taskManager.addTask(data);
} catch (error) {
    console.log(error);
}
```

#### Async/Await

```javascript
// ✅ Good: Use async/await
async function loadTasks() {
    try {
        const tasks = await storageService.getAllTasks();
        return tasks;
    } catch (error) {
        console.error('Failed to load tasks:', error);
        return [];
    }
}

// ❌ Bad: Promise chains for simple operations
function loadTasks() {
    return storageService.getAllTasks()
        .then(tasks => tasks)
        .catch(error => {
            console.error('Failed to load tasks:', error);
            return [];
        });
}
```

### CSS Style Guide

#### Organization

```css
/* 1. Variables */
:root {
    --color-primary: #007bff;
    --color-success: #28a745;
    --spacing-unit: 8px;
}

/* 2. Reset/Normalize */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* 3. Base styles */
body {
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
}

/* 4. Layout */
.container {
    max-width: 1200px;
    margin: 0 auto;
}

/* 5. Components */
.task-item {
    /* Component styles */
}

/* 6. Utilities */
.text-center {
    text-align: center;
}
```

#### Naming Convention (BEM-inspired)

```css
/* Block */
.task-item { }

/* Element */
.task-item__title { }
.task-item__description { }
.task-item__actions { }

/* Modifier */
.task-item--completed { }
.task-item--editing { }
```

#### Responsive Design

```css
/* Mobile first */
.container {
    padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }
}
```

### HTML Style Guide

```html
<!-- ✅ Good: Semantic HTML with accessibility -->
<main>
    <h1>My Tasks</h1>
    
    <form aria-label="Create new task">
        <div class="form-group">
            <label for="task-title">Title</label>
            <input 
                id="task-title" 
                type="text" 
                required
                aria-required="true"
                maxlength="200">
        </div>
        
        <button type="submit">Add Task</button>
    </form>
    
    <ul role="list" aria-label="Task list">
        <li role="listitem" class="task-item">
            <span>Task title</span>
        </li>
    </ul>
</main>

<!-- ❌ Bad: Non-semantic, no accessibility -->
<div>
    <div>My Tasks</div>
    <div>
        <input placeholder="Title">
        <div onclick="addTask()">Add Task</div>
    </div>
    <div>
        <div>Task title</div>
    </div>
</div>
```

---

## Naming Conventions

### Variables and Functions

```javascript
// ✅ Good: Descriptive names
const maxTitleLength = 200;
const isTaskCompleted = task.completed;
const taskCount = tasks.length;

function createTask(taskData) { }
function validateTaskInput(input) { }
function handleTaskSubmit(event) { }

// ❌ Bad: Unclear names
const max = 200;
const flag = task.completed;
const count = tasks.length;

function create(data) { }
function validate(input) { }
function handler(e) { }
```

### Classes and Components

```javascript
// ✅ Good: PascalCase for classes
class TaskManager { }
class StorageService { }
class TaskListView { }

// ❌ Bad: camelCase for classes
class taskManager { }
class storage_service { }
```

### Constants

```javascript
// ✅ Good: UPPER_SNAKE_CASE for constants
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const STORAGE_KEY = 'todoapp_tasks';
const API_BASE_URL = 'https://api.example.com';

// Group related constants
const ValidationLimits = {
    MAX_TITLE_LENGTH: 200,
    MAX_DESCRIPTION_LENGTH: 1000,
    MIN_TITLE_LENGTH: 1
};
```

### Boolean Variables

```javascript
// ✅ Good: Use is/has/can prefixes
const isCompleted = task.completed;
const hasDescription = task.description !== '';
const canDelete = user.permissions.includes('delete');
const shouldRender = tasks.length > 0;

// ❌ Bad: Unclear boolean names
const completed = task.completed;
const description = task.description !== '';
```

---

## Testing Strategy

### Unit Tests

**Location:** `tests/unit/` or co-located with source in `__tests__/`

**Structure:**
```javascript
import { TaskManager } from '../../src/business/TaskManager';

describe('TaskManager', () => {
    let taskManager;
    let mockStorage;
    
    beforeEach(() => {
        mockStorage = {
            saveTasks: jest.fn().mockResolvedValue(undefined),
            getAllTasks: jest.fn().mockResolvedValue([])
        };
        taskManager = new TaskManager(mockStorage);
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    describe('addTask', () => {
        it('should create task with required fields', async () => {
            const taskData = { title: 'Test task' };
            const task = await taskManager.addTask(taskData);
            
            expect(task).toHaveProperty('id');
            expect(task).toHaveProperty('title', 'Test task');
            expect(task).toHaveProperty('completed', false);
        });
        
        it('should throw ValidationError for empty title', async () => {
            await expect(taskManager.addTask({ title: '' }))
                .rejects
                .toThrow(ValidationError);
        });
    });
});
```

### Integration Tests

```javascript
describe('Task CRUD Integration', () => {
    beforeEach(() => {
        localStorage.clear();
    });
    
    it('should persist task through full lifecycle', async () => {
        const storage = new StorageService();
        const manager = new TaskManager(storage);
        
        // Create
        const created = await manager.addTask({ title: 'Test' });
        expect(created.id).toBeDefined();
        
        // Read
        const tasks = manager.getTasks();
        expect(tasks).toHaveLength(1);
        
        // Update
        await manager.updateTask(created.id, { title: 'Updated' });
        expect(manager.getTask(created.id).title).toBe('Updated');
        
        // Delete
        await manager.deleteTask(created.id);
        expect(manager.getTasks()).toHaveLength(0);
    });
});
```

### E2E Tests

```javascript
import { test, expect } from '@playwright/test';

test('complete task flow', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Create task
    await page.fill('[data-testid="task-title"]', 'Buy groceries');
    await page.click('[data-testid="add-task"]');
    
    // Verify task appears
    await expect(page.locator('.task-item')).toContainText('Buy groceries');
    
    // Complete task
    await page.click('[data-testid="task-checkbox"]');
    await expect(page.locator('.task-item')).toHaveClass(/completed/);
});
```

### Test Coverage Requirements

- Overall: ≥80%
- Business Logic: ≥90%
- Data Layer: ≥85%
- UI Layer: ≥70%

**Run tests:**
```bash
# Unit tests
npm test

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# E2E tests
npm run test:e2e
```

---

## Git Workflow

### Branch Naming

```
main                     # Production-ready code
develop                  # Integration branch

feature/task-crud        # New features
bugfix/task-validation   # Bug fixes
hotfix/security-xss      # Critical fixes
docs/architecture        # Documentation
refactor/task-manager    # Code improvements
```

### Commit Messages

Follow Conventional Commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, no code change
- `refactor`: Code change without feature/fix
- `test`: Adding tests
- `chore`: Build, dependencies, etc.

**Examples:**
```
feat(tasks): add task completion toggle

Implemented checkbox to mark tasks as complete/incomplete.
Includes visual feedback and persistence.

Closes #123

---

fix(storage): handle quota exceeded error gracefully

Added user-friendly error message when localStorage is full.
Provides option to delete completed tasks.

---

docs(architecture): add ADR for state management

Documented decision to use observer pattern for state updates.
```

### Commit Guidelines

1. **Atomic commits**: One logical change per commit
2. **Present tense**: "Add feature" not "Added feature"
3. **Imperative mood**: "Fix bug" not "Fixes bug"
4. **Reference issues**: "Closes #123" or "Refs #456"
5. **Keep subject ≤50 chars**: Body for details

---

## Code Review Process

### Code Review Checklist

#### Functionality
- [ ] Code works as intended
- [ ] Edge cases handled
- [ ] Error handling in place
- [ ] No console errors or warnings

#### Code Quality
- [ ] Follows coding standards
- [ ] DRY principle applied
- [ ] Single Responsibility Principle
- [ ] Proper naming conventions
- [ ] No commented-out code
- [ ] No debugging code (console.log)

#### Testing
- [ ] Tests included for new code
- [ ] All tests pass
- [ ] Coverage maintained/improved
- [ ] Edge cases tested

#### Performance
- [ ] No performance regressions
- [ ] Efficient algorithms used
- [ ] No memory leaks

#### Security
- [ ] No security vulnerabilities
- [ ] Input validation present
- [ ] XSS prevention applied
- [ ] No sensitive data in code

#### Documentation
- [ ] JSDoc comments for public APIs
- [ ] README updated if needed
- [ ] Inline comments for complex logic
- [ ] Architecture docs updated if needed

### Review Process

1. **Self-Review**: Review your own code before submitting
2. **Create PR**: Descriptive title and description
3. **Request Review**: Tag appropriate reviewers
4. **Address Feedback**: Respond to all comments
5. **Approval**: Get at least 1 approval
6. **Merge**: Squash and merge to keep history clean

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings

## Screenshots (if applicable)
```

---

## Build and Deployment

### Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test
```

### Build Process

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

#### GitHub Pages

```bash
# Build and deploy
npm run deploy
```

#### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Auto-deploy on push to `main`

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build
```

---

## Performance Guidelines

### General Principles

1. **Avoid Premature Optimization**: Profile before optimizing
2. **Measure Performance**: Use Performance API
3. **Optimize Critical Path**: Focus on user-facing operations
4. **Lazy Load**: Load non-critical resources later

### DOM Manipulation

```javascript
// ✅ Good: Batch DOM updates
function renderTasks(tasks) {
    const html = tasks.map(renderTask).join('');
    container.innerHTML = html;
}

// ❌ Bad: Individual DOM updates
function renderTasks(tasks) {
    tasks.forEach(task => {
        const element = renderTask(task);
        container.appendChild(element);
    });
}
```

### Event Listeners

```javascript
// ✅ Good: Event delegation
taskList.addEventListener('click', (e) => {
    if (e.target.matches('.task-checkbox')) {
        handleToggle(e.target.closest('.task-item'));
    }
});

// ❌ Bad: Listener per item
tasks.forEach(task => {
    task.addEventListener('click', handleToggle);
});
```

### Performance Measurement

```javascript
// Measure operation performance
const start = performance.now();
await someOperation();
const end = performance.now();
console.log(`Operation took ${end - start}ms`);
```

---

## Security Best Practices

### Input Validation

```javascript
// Always validate and sanitize inputs
function sanitizeInput(input) {
    return input.trim().slice(0, MAX_LENGTH);
}

function validateTitle(title) {
    if (!title || title.trim() === '') {
        throw new ValidationError('Title required');
    }
    if (title.length > 200) {
        throw new ValidationError('Title too long');
    }
}
```

### HTML Escaping

```javascript
// Always escape user content
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Usage
element.innerHTML = `<span>${escapeHtml(userInput)}</span>`;
```

### Security Checklist

- [ ] All user inputs validated
- [ ] HTML escaping applied
- [ ] No eval() or innerHTML with user data
- [ ] CSP headers configured
- [ ] HTTPS enforced
- [ ] No sensitive data in client code
- [ ] Dependencies updated regularly

---

## Documentation Standards

### Code Comments

```javascript
// ✅ Good: Explain WHY, not WHAT
// Check cache first to avoid expensive API call
const cached = cache.get(key);

// Complex algorithm requires explanation
// Using binary search for O(log n) performance
// on sorted array

// ❌ Bad: Obvious comments
// Set x to 5
const x = 5;

// Loop through tasks
tasks.forEach(task => { });
```

### JSDoc for Public APIs

```javascript
/**
 * Creates a new task.
 * 
 * @param {Object} taskData - Task data
 * @param {string} taskData.title - Title (required, 1-200 chars)
 * @param {string} [taskData.description] - Description (optional, max 1000 chars)
 * @returns {Promise<Task>} Created task
 * @throws {ValidationError} If validation fails
 */
async addTask(taskData) { }
```

### README Documentation

Every module should have clear documentation:

```markdown
# Module Name

## Purpose
What this module does

## Usage
```javascript
// Example code
```

## API
List of public functions

## Dependencies
What this depends on

## Testing
How to test this module
```

---

## Best Practices Summary

### Do's ✅

- Write small, focused functions
- Use meaningful variable names
- Add tests for new code
- Document public APIs
- Handle errors gracefully
- Follow DRY principle
- Use async/await for async operations
- Validate all inputs
- Escape HTML output
- Keep functions pure when possible
- Use semantic HTML
- Write accessible code
- Optimize for readability

### Don'ts ❌

- Don't use `var`
- Don't use `eval()`
- Don't ignore errors
- Don't commit commented code
- Don't commit console.logs
- Don't skip tests
- Don't use magic numbers
- Don't mutate function arguments
- Don't use inline styles
- Don't skip accessibility
- Don't optimize prematurely
- Don't violate separation of concerns

---

## Tools Configuration

### ESLint (.eslintrc.js)

```javascript
module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true
    },
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {
        'no-unused-vars': 'error',
        'no-console': 'warn',
        'semi': ['error', 'always'],
        'quotes': ['error', 'single'],
        'indent': ['error', 4]
    }
};
```

### Prettier (.prettierrc)

```json
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 4,
    "trailingComma": "none",
    "printWidth": 100
}
```

### Jest (jest.config.js)

```javascript
module.exports = {
    testEnvironment: 'jsdom',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js'
    ]
};
```

---

## References

- [System Architecture](./system-architecture.md)
- [Component Design](./components.md)
- [All ADRs](./decisions/)
- [ESLint Documentation](https://eslint.org/)
- [Jest Documentation](https://jestjs.io/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Last Updated:** 2025-11-19  
**Next Review:** 2026-02-19
