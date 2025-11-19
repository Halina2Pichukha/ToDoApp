# ADR-005: Testing Strategy and Frameworks

## Status
Accepted

## Context

ToDoApp requires a comprehensive testing strategy to ensure code quality, reliability, and maintainability. The testing approach must support the layered architecture, enable continuous integration, and meet the code coverage requirements.

### Key Considerations:
- MVP timeline: 4-6 weeks
- Small development team (1-2 developers)
- No framework dependencies (vanilla JavaScript)
- Layered architecture (UI, Business Logic, Data Access)
- Must achieve ≥80% code coverage
- Support CI/CD pipeline
- Accessibility testing required (WCAG 2.1 Level AA)

### Requirements Driving This Decision:
- NFR-022: ≥80% code coverage for unit tests
- NFR-005: WCAG 2.1 AA accessibility compliance
- NFR-021: Code follows best practices
- All functional requirements must be tested
- Performance requirements must be validated

## Decision

We will implement a **multi-layer testing strategy** using the testing pyramid approach:

### Testing Layers:

1. **Unit Tests (60-70% of tests)**
   - Test individual functions and classes in isolation
   - Focus on business logic and data layer
   - Framework: **Jest**
   - Target: ≥80% code coverage

2. **Integration Tests (20-30% of tests)**
   - Test component interactions
   - Test storage integration
   - Test UI components with DOM
   - Framework: **Jest + Testing Library (DOM)**

3. **End-to-End Tests (5-10% of tests)**
   - Test complete user flows
   - Test critical paths (create, edit, delete tasks)
   - Framework: **Playwright** or **Cypress** (recommended: Playwright)

4. **Accessibility Tests**
   - Automated accessibility testing
   - Manual testing with screen readers
   - Framework: **axe-core** or **pa11y**

5. **Performance Tests**
   - Lighthouse audits
   - Performance API measurements
   - Load testing with many tasks

### Selected Test Frameworks:

| Framework | Purpose | Justification |
|-----------|---------|---------------|
| **Jest** | Unit & Integration testing | Industry standard, excellent docs, zero config |
| **Testing Library (DOM)** | DOM component testing | Best practices, accessibility-focused |
| **Playwright** | E2E testing | Modern, fast, good cross-browser support |
| **axe-core** | Accessibility testing | Industry standard, comprehensive checks |

## Consequences

### Positive

1. **Comprehensive Coverage**
   - All layers tested (unit, integration, e2e)
   - Catches bugs at different levels
   - Accessibility built into testing
   - Performance validated

2. **Developer Experience**
   - Jest has excellent error messages
   - Fast test execution
   - Watch mode for development
   - Snapshot testing for UI

3. **CI/CD Ready**
   - All frameworks support headless mode
   - Easy to integrate with GitHub Actions
   - Fast feedback on pull requests
   - Automated quality gates

4. **Maintainability**
   - Tests serve as documentation
   - Refactoring confidence
   - Regression prevention
   - Clear test organization

5. **Quality Assurance**
   - Meets 80% coverage requirement
   - Validates all requirements
   - Ensures accessibility
   - Proves performance targets

### Negative

1. **Initial Setup Time**
   - Configuration of test frameworks
   - Learning curve for team
   - Writing tests takes time
   - May slow initial development

2. **Maintenance Burden**
   - Tests need to be updated with code
   - False positives need fixing
   - E2E tests can be flaky
   - Keep tests fast and reliable

3. **Additional Dependencies**
   - Jest, Testing Library, Playwright add dependencies
   - Need to maintain test infrastructure
   - Security updates for test dependencies

4. **Complexity**
   - Multiple test types to manage
   - Different patterns for each layer
   - Mocking can be tricky
   - Balance between test speed and coverage

## Alternatives Considered

### Alternative 1: Vitest
Modern, Vite-native test framework.

**Pros:**
- Very fast (ES modules native)
- Compatible with Jest API
- Better TypeScript support
- Modern architecture

**Rejected because:**
- Less mature than Jest
- Smaller community
- Not needed without Vite
- Jest more than sufficient

**Reconsider when:** If project adopts Vite as build tool

### Alternative 2: Mocha + Chai
Classic testing combination.

**Pros:**
- Flexible
- Well-established
- Large ecosystem

**Rejected because:**
- More setup required
- Less integrated experience
- Jest is more modern
- No snapshot testing built-in

### Alternative 3: Jasmine
Standalone test framework.

**Pros:**
- No dependencies
- All-in-one solution

**Rejected because:**
- Less popular than Jest
- Slower development
- Weaker ecosystem

### Alternative 4: Selenium for E2E
Traditional E2E testing.

**Pros:**
- Very mature
- Wide browser support

**Rejected because:**
- Slower than modern alternatives
- More complex setup
- Worse developer experience
- Playwright/Cypress superior

### Alternative 5: No E2E Tests
Skip E2E testing for MVP.

**Rejected because:**
- Critical user flows must be tested
- Integration tests don't cover full stack
- E2E tests catch real user issues
- Needed for production confidence

## Implementation Notes

### Project Structure:
```
ToDoApp/
├── src/
│   ├── business/
│   │   ├── TaskManager.js
│   │   └── __tests__/
│   │       └── TaskManager.test.js
│   ├── data/
│   │   ├── StorageService.js
│   │   └── __tests__/
│   │       └── StorageService.test.js
│   └── ui/
│       ├── views/
│       │   ├── TaskListView.js
│       │   └── __tests__/
│       │       └── TaskListView.test.js
├── tests/
│   ├── integration/
│   │   └── task-crud.test.js
│   ├── e2e/
│   │   └── user-flows.spec.js
│   └── accessibility/
│       └── wcag-compliance.test.js
└── jest.config.js
```

### Jest Configuration:
```javascript
// jest.config.js
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
        '!src/**/*.test.js',
        '!src/**/__tests__/**'
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    testMatch: [
        '**/__tests__/**/*.test.js',
        '**/tests/**/*.test.js'
    ]
};
```

### Unit Test Example:
```javascript
// src/business/__tests__/TaskManager.test.js
import { TaskManager } from '../TaskManager';

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
    
    describe('addTask', () => {
        it('should create task with required fields', async () => {
            const taskData = { title: 'Test task' };
            const task = await taskManager.addTask(taskData);
            
            expect(task).toHaveProperty('id');
            expect(task).toHaveProperty('title', 'Test task');
            expect(task).toHaveProperty('completed', false);
            expect(task).toHaveProperty('createdAt');
        });
        
        it('should validate title is required', async () => {
            await expect(
                taskManager.addTask({})
            ).rejects.toThrow('Title is required');
        });
        
        it('should enforce title length limit', async () => {
            const longTitle = 'a'.repeat(201);
            await expect(
                taskManager.addTask({ title: longTitle })
            ).rejects.toThrow('Title must be 200 characters or less');
        });
        
        it('should save task to storage', async () => {
            await taskManager.addTask({ title: 'Test' });
            expect(mockStorage.saveTasks).toHaveBeenCalled();
        });
    });
});
```

### Integration Test Example:
```javascript
// tests/integration/task-crud.test.js
import { TaskManager } from '../../src/business/TaskManager';
import { StorageService } from '../../src/data/StorageService';

describe('Task CRUD Integration', () => {
    let taskManager;
    let storage;
    
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        storage = new StorageService();
        taskManager = new TaskManager(storage);
    });
    
    it('should persist task through full lifecycle', async () => {
        // Create
        const task = await taskManager.addTask({ 
            title: 'Integration test task' 
        });
        expect(task.id).toBeDefined();
        
        // Read
        const tasks = taskManager.getTasks();
        expect(tasks).toHaveLength(1);
        expect(tasks[0].title).toBe('Integration test task');
        
        // Update
        await taskManager.updateTask(task.id, { 
            title: 'Updated task' 
        });
        const updated = taskManager.getTask(task.id);
        expect(updated.title).toBe('Updated task');
        
        // Verify persistence
        const loadedTasks = storage.getAllTasks();
        expect(loadedTasks[0].title).toBe('Updated task');
        
        // Delete
        await taskManager.deleteTask(task.id);
        expect(taskManager.getTasks()).toHaveLength(0);
    });
});
```

### E2E Test Example:
```javascript
// tests/e2e/user-flows.spec.js
import { test, expect } from '@playwright/test';

test.describe('Task Management User Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
    });
    
    test('should create, edit, and delete a task', async ({ page }) => {
        // Create task
        await page.fill('[data-testid="task-title-input"]', 'Buy groceries');
        await page.click('[data-testid="add-task-button"]');
        
        // Verify task appears
        await expect(page.locator('.task-item')).toContainText('Buy groceries');
        
        // Edit task
        await page.click('[data-testid="edit-task-button"]');
        await page.fill('[data-testid="task-title-input"]', 'Buy groceries and milk');
        await page.click('[data-testid="save-task-button"]');
        
        // Verify edit
        await expect(page.locator('.task-item')).toContainText('Buy groceries and milk');
        
        // Complete task
        await page.click('[data-testid="task-checkbox"]');
        await expect(page.locator('.task-item')).toHaveClass(/completed/);
        
        // Delete task
        await page.click('[data-testid="delete-task-button"]');
        await page.click('[data-testid="confirm-delete-button"]');
        
        // Verify deletion
        await expect(page.locator('.task-item')).toHaveCount(0);
    });
    
    test('should persist tasks across page reload', async ({ page }) => {
        // Create task
        await page.fill('[data-testid="task-title-input"]', 'Persistent task');
        await page.click('[data-testid="add-task-button"]');
        
        // Reload page
        await page.reload();
        
        // Verify task still exists
        await expect(page.locator('.task-item')).toContainText('Persistent task');
    });
});
```

### Accessibility Test Example:
```javascript
// tests/accessibility/wcag-compliance.test.js
import { injectAxe, checkA11y } from 'axe-playwright';
import { test } from '@playwright/test';

test.describe('Accessibility Compliance', () => {
    test('should have no accessibility violations on main page', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await injectAxe(page);
        await checkA11y(page, null, {
            detailedReport: true,
            detailedReportOptions: {
                html: true
            }
        });
    });
    
    test('should be keyboard navigable', async ({ page }) => {
        await page.goto('http://localhost:3000');
        
        // Tab to title input
        await page.keyboard.press('Tab');
        await expect(page.locator('[data-testid="task-title-input"]')).toBeFocused();
        
        // Tab to add button
        await page.keyboard.press('Tab');
        await expect(page.locator('[data-testid="add-task-button"]')).toBeFocused();
        
        // Create task with Enter
        await page.keyboard.press('Shift+Tab'); // Back to input
        await page.keyboard.type('Keyboard task');
        await page.keyboard.press('Enter');
        
        // Verify task created
        await expect(page.locator('.task-item')).toContainText('Keyboard task');
    });
});
```

## Test-Driven Development (Recommended)

### TDD Workflow:
1. **Red**: Write failing test first
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

### Benefits for ToDoApp:
- Ensures testable code
- Clarifies requirements
- Prevents over-engineering
- Builds confidence

## CI/CD Integration

### GitHub Actions Workflow:
```yaml
name: Test and Deploy

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm run test:a11y
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Coverage Requirements

### Minimum Coverage:
- Overall: 80%
- Business Logic Layer: 90%
- Data Access Layer: 85%
- UI Layer: 70% (UI tests are more expensive)

### What NOT to Test:
- Third-party libraries
- Configuration files
- Trivial getters/setters
- Auto-generated code

## Performance Testing

### Metrics to Validate:
```javascript
// Performance test example
test('should handle 1000 tasks without performance degradation', async () => {
    const start = performance.now();
    
    // Create 1000 tasks
    for (let i = 0; i < 1000; i++) {
        await taskManager.addTask({ title: `Task ${i}` });
    }
    
    const end = performance.now();
    const duration = end - start;
    
    // Should complete within reasonable time
    expect(duration).toBeLessThan(10000); // 10 seconds for 1000 tasks
    
    // Verify all tasks loaded
    const tasks = taskManager.getTasks();
    expect(tasks).toHaveLength(1000);
});
```

## Validation Against Tech Architect Principles

✅ **Quality-Driven**: Comprehensive testing at all levels  
✅ **Best Practices**: Testing pyramid, TDD-friendly  
✅ **Maintainability**: Tests serve as documentation  
✅ **CI/CD Ready**: All tests automatable  
✅ **Accessibility**: Built into testing strategy  
✅ **Performance**: Validated through tests  
✅ **Coverage Goals**: Meets ≥80% requirement  

## Success Metrics

### Coverage Metrics:
- Code coverage: ≥80%
- Mutation testing score: ≥70% (optional)
- All critical paths tested

### Quality Metrics:
- Zero failing tests in main branch
- All PRs require passing tests
- Test execution time: <5 minutes

### Accessibility Metrics:
- Zero critical a11y violations
- WCAG 2.1 Level AA compliance
- Keyboard navigation 100% functional

## References

- [NFR-022: Test Coverage](../../requirements/business-requirements-document.md#57-maintainability)
- [NFR-005: Accessibility](../../requirements/business-requirements-document.md#52-usability)
- [EPIC-004: Quality Assurance Testing](../../tasks/epics/EPIC-004-quality-assurance-testing.md)

## Related ADRs

- [ADR-001: Architectural Style](./ADR-001-architectural-style.md)
- [ADR-002: Frontend Technology](./ADR-002-frontend-technology.md)
- [ADR-004: State Management](./ADR-004-state-management.md)

---

**Date:** 2025-11-19  
**Author:** Tech Architect Team  
**Reviewers:** Development Team Lead, QA Lead
