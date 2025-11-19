# Non-Functional Requirements Mapping - ToDoApp

**Document Version:** 1.0  
**Date:** 2025-11-19  
**Status:** Active  
**Author:** Tech Architect Team  

---

## Overview

This document maps each non-functional requirement (NFR) from the Business Requirements Document to specific architectural decisions, implementation strategies, and validation approaches. It ensures all NFRs are addressed in the architecture and provides clear guidance for implementation teams.

---

## NFR Summary

| Category | Count | Coverage |
|----------|-------|----------|
| Platform & Technology | 3 | 100% |
| Usability | 4 | 100% |
| Performance | 3 | 100% |
| Reliability & Availability | 4 | 100% |
| Security | 4 | 100% |
| Scalability | 2 | 100% |
| Maintainability | 4 | 100% |
| Browser Compatibility | 1 | 100% |
| **Total** | **25** | **100%** |

---

## Platform & Technology

### NFR-001: Web-based Application

**Requirement:** Web-based application accessible via modern browsers

**Architectural Decisions:**
- [ADR-002: Frontend Technology Choices](./decisions/ADR-002-frontend-technology.md) - HTML5, CSS3, JavaScript ES6+
- Single Page Application architecture
- Static file hosting (GitHub Pages, Netlify)

**Implementation Strategy:**
- Pure web technologies (HTML/CSS/JS)
- No native app required
- Progressive enhancement approach
- Works on any device with modern browser

**Validation:**
- ✅ Application runs in all target browsers
- ✅ Accessible via URL (no installation needed)
- ✅ Responsive across devices

**Testing:**
- Cross-browser testing on all target platforms
- Different devices (desktop, tablet, mobile)
- Various screen sizes

---

### NFR-002: Responsive Design (320px to 4K)

**Requirement:** Responsive design supporting 320px to 4K resolution

**Architectural Decisions:**
- Mobile-first CSS approach
- Flexbox and CSS Grid for layouts
- Fluid typography and spacing
- Media queries for breakpoints

**Implementation Strategy:**
```css
/* Mobile first (320px+) */
.container {
    padding: 1rem;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }
}

/* 4K (2560px+) */
@media (min-width: 2560px) {
    .container {
        max-width: 1800px;
    }
}
```

**Breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 2559px
- 4K: 2560px+

**Validation:**
- ✅ Layout works at all breakpoints
- ✅ No horizontal scrolling
- ✅ Touch targets ≥44x44px on mobile
- ✅ Content readable at all sizes

**Testing:**
- Responsive design testing tools
- Real device testing
- Chrome DevTools device emulation
- Viewport testing (320px to 4K)

---

### NFR-003: Single Page Application

**Requirement:** Single Page Application architecture for MVP

**Architectural Decisions:**
- [ADR-001: Architectural Style](./decisions/ADR-001-architectural-style.md) - Layered architecture
- Client-side routing (if needed)
- Dynamic content updates without page reload
- State management via TaskManager

**Implementation Strategy:**
- One HTML page (index.html)
- JavaScript handles all interactions
- DOM manipulation for UI updates
- No page refreshes for CRUD operations

**Validation:**
- ✅ No page reloads during normal operation
- ✅ All features accessible from single page
- ✅ Fast, smooth user experience

**Testing:**
- Verify no page reloads in browser network tab
- Test all user flows without navigation
- Performance monitoring

---

## Usability

### NFR-004: Intuitive Interface

**Requirement:** Intuitive interface - new users create first task within 30 seconds

**Architectural Decisions:**
- Simple, clean UI design
- Clear call-to-action buttons
- Minimal steps to create task
- Helpful empty states

**Implementation Strategy:**
- Prominent "Add Task" button
- Simple form (title + optional description)
- Immediate visual feedback
- Helpful placeholder text
- Empty state with guidance

**Validation:**
- ✅ User testing: Time to first task <30s
- ✅ Clear navigation
- ✅ Obvious primary actions

**Testing:**
- User acceptance testing
- Time-to-task measurement
- Usability studies
- A/B testing (post-MVP)

**Success Metric:** ≥90% of test users create task within 30 seconds

---

### NFR-005: WCAG 2.1 Level AA Compliance

**Requirement:** WCAG 2.1 Level AA accessibility compliance

**Architectural Decisions:**
- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Sufficient color contrast
- Focus indicators

**Implementation Strategy:**
```html
<!-- Semantic HTML -->
<main>
    <h1>My Tasks</h1>
    <form aria-label="Create new task">
        <label for="task-title">Title</label>
        <input id="task-title" type="text" required>
    </form>
    <ul role="list" aria-label="Task list">
        <li role="listitem">...</li>
    </ul>
</main>

<!-- Keyboard navigation -->
<button tabindex="0" aria-label="Delete task">Delete</button>

<!-- ARIA live regions for dynamic updates -->
<div role="status" aria-live="polite">Task created</div>
```

**Color Contrast Requirements:**
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

**Validation:**
- ✅ axe-core automated testing passes
- ✅ Manual screen reader testing
- ✅ Keyboard navigation works
- ✅ Color contrast verified

**Testing:**
- Automated: axe-core, pa11y, Lighthouse
- Manual: NVDA, JAWS, VoiceOver
- Keyboard-only navigation test
- Color blindness simulation

**Success Criteria:**
- Zero critical accessibility violations
- All features keyboard accessible
- Screen reader compatible

---

### NFR-006: Clear Visual Feedback

**Requirement:** Clear visual feedback for all user actions

**Architectural Decisions:**
- Toast notifications for actions
- Loading states
- Success/error messages
- Hover/focus/active states
- Confirmation dialogs

**Implementation Strategy:**
```javascript
// Action feedback
async function createTask(data) {
    // Show loading
    showLoading('Creating task...');
    
    try {
        const task = await taskManager.addTask(data);
        
        // Show success
        showSuccess('Task created successfully!');
        
    } catch (error) {
        // Show error
        showError('Failed to create task. Please try again.');
    } finally {
        hideLoading();
    }
}
```

**Feedback Types:**
- **Loading**: Spinner or progress indicator
- **Success**: Green checkmark + message
- **Error**: Red X + error message
- **Info**: Blue info icon + message
- **Confirmation**: Modal dialog before destructive actions

**Validation:**
- ✅ Every action has visible feedback
- ✅ Feedback appears within 100ms
- ✅ Clear success/error distinction

**Testing:**
- Test all CRUD operations
- Verify feedback timing
- Check error scenarios
- User feedback surveys

---

### NFR-007: Keyboard Navigation Support

**Requirement:** Keyboard navigation support for all primary functions

**Architectural Decisions:**
- Tab order management
- Keyboard shortcuts
- Focus management
- Skip links

**Implementation Strategy:**
```javascript
// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N: New task
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openTaskForm();
    }
    
    // Escape: Close modal/cancel
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Focus management
function openModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    
    // Focus first focusable element
    const firstInput = modal.querySelector('input, button');
    firstInput?.focus();
}
```

**Tab Order:**
1. Skip to main content link
2. Main navigation
3. Task form inputs
4. Task list items
5. Task action buttons

**Validation:**
- ✅ All features accessible via keyboard
- ✅ Logical tab order
- ✅ Visible focus indicators
- ✅ No keyboard traps

**Testing:**
- Unplug mouse, use keyboard only
- Tab through all elements
- Test shortcuts
- Screen reader testing

---

## Performance

### NFR-008: Page Load Time <2s

**Requirement:** Page load time <2 seconds on standard broadband (10 Mbps)

**Architectural Decisions:**
- [ADR-002: Frontend Technology](./decisions/ADR-002-frontend-technology.md) - No heavy frameworks
- Minimal dependencies
- Optimized assets
- Efficient code

**Implementation Strategy:**
- Minimize HTTP requests
- Compress/minify CSS and JavaScript
- Optimize images
- Use browser caching
- Lazy load non-critical resources

**Asset Budget:**
- HTML: <10KB
- CSS: <30KB (minified)
- JavaScript: <60KB (minified)
- Total: <100KB
- Gzip compression: ~30KB

**Validation:**
- ✅ Lighthouse Performance score >90
- ✅ Page load <2s on 10 Mbps
- ✅ Time to Interactive <1s

**Testing:**
- Lighthouse CI
- WebPageTest
- Chrome DevTools Performance tab
- Throttled network testing (3G, 4G)

**Measurement:**
```javascript
// Performance API
window.addEventListener('load', () => {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page load time: ${pageLoadTime}ms`);
});
```

---

### NFR-009: Task Operations <100ms

**Requirement:** Task operations complete within 100ms

**Architectural Decisions:**
- [ADR-003: Data Persistence](./decisions/ADR-003-data-persistence.md) - localStorage (fast)
- In-memory task array
- Efficient algorithms
- No blocking operations

**Implementation Strategy:**
```javascript
// Measure operation performance
async function createTaskWithMetrics(data) {
    const start = performance.now();
    
    const task = await taskManager.addTask(data);
    
    const end = performance.now();
    const duration = end - start;
    
    console.log(`Create task: ${duration}ms`);
    
    if (duration > 100) {
        console.warn('Performance warning: Operation took longer than 100ms');
    }
    
    return task;
}
```

**Optimizations:**
- O(1) array push for create
- O(1) map lookup for read (if using Map)
- O(n) filter/find for queries (acceptable for <1000 tasks)
- Batch DOM updates

**Validation:**
- ✅ Create task: <100ms
- ✅ Update task: <100ms
- ✅ Delete task: <100ms
- ✅ Toggle completion: <100ms

**Testing:**
- Performance tests with various task counts
- Profiling with Chrome DevTools
- Automated performance testing

---

### NFR-010: Support 1000+ Tasks

**Requirement:** Support for at least 1000 tasks without degradation

**Architectural Decisions:**
- Efficient data structures
- Virtual scrolling (if needed)
- Pagination strategy (post-MVP)
- Performance monitoring

**Implementation Strategy:**
```javascript
// Performance test
async function performanceTest() {
    const start = performance.now();
    
    // Create 1000 tasks
    for (let i = 0; i < 1000; i++) {
        await taskManager.addTask({ title: `Task ${i}` });
    }
    
    const end = performance.now();
    console.log(`Created 1000 tasks in ${end - start}ms`);
    
    // Render test
    const renderStart = performance.now();
    renderTaskList(taskManager.getTasks());
    const renderEnd = performance.now();
    console.log(`Rendered 1000 tasks in ${renderEnd - renderStart}ms`);
}
```

**Optimizations for Large Lists:**
- Virtual scrolling (render only visible items)
- Pagination (50-100 tasks per page)
- Lazy rendering
- Debounced search/filter

**Validation:**
- ✅ 1000 tasks render within acceptable time
- ✅ No UI freezing
- ✅ Smooth scrolling

**Testing:**
- Load test with 1000, 5000, 10000 tasks
- Measure render time
- Monitor memory usage
- Test on low-end devices

---

## Reliability & Availability

### NFR-011: Data Integrity

**Requirement:** Data integrity ensured - no task loss or corruption

**Architectural Decisions:**
- [ADR-003: Data Persistence](./decisions/ADR-003-data-persistence.md)
- Validation at multiple layers
- Atomic operations
- Error recovery

**Implementation Strategy:**
```javascript
// Atomic save with validation
async function saveTasksAtomically(tasks) {
    // 1. Validate all tasks
    const validationErrors = tasks
        .map((task, index) => ({ task, index }))
        .filter(({ task }) => !isValidTask(task))
        .map(({ index }) => index);
    
    if (validationErrors.length > 0) {
        throw new Error(`Invalid tasks at indices: ${validationErrors}`);
    }
    
    // 2. Create backup before saving
    const currentData = localStorage.getItem('todoapp_tasks');
    const backup = currentData;
    
    try {
        // 3. Save new data
        const data = {
            version: '1.0',
            tasks: tasks,
            lastModified: new Date().toISOString()
        };
        localStorage.setItem('todoapp_tasks', JSON.stringify(data));
        
        // 4. Verify save
        const saved = localStorage.getItem('todoapp_tasks');
        const parsed = JSON.parse(saved);
        if (parsed.tasks.length !== tasks.length) {
            throw new Error('Save verification failed');
        }
        
    } catch (error) {
        // 5. Restore backup on error
        if (backup) {
            localStorage.setItem('todoapp_tasks', backup);
        }
        throw error;
    }
}
```

**Validation:**
- ✅ No data loss during normal operations
- ✅ Data survives browser refresh
- ✅ Corrupted data detected and handled

**Testing:**
- Create/update/delete operations
- Browser refresh during operations
- Simulate storage errors
- Data corruption scenarios

---

### NFR-012: Persistence Across Sessions

**Requirement:** Tasks persist across browser sessions (localStorage)

**Architectural Decisions:**
- localStorage for persistence
- Load on initialization
- Save on every change

**Implementation Strategy:**
```javascript
// Load on app initialization
async function initializeApp() {
    const tasks = storageService.getAllTasks();
    await taskManager.loadTasks(tasks);
}

// Save on every change
async function updateTask(id, updates) {
    // Update in memory
    const task = tasks.find(t => t.id === id);
    Object.assign(task, updates);
    
    // Persist immediately
    await storageService.saveTasks(tasks);
}
```

**Validation:**
- ✅ Tasks available after browser close/reopen
- ✅ Data survives computer restart
- ✅ No data loss

**Testing:**
- Create tasks, close browser, reopen
- Verify data persists
- Test on different browsers

---

### NFR-013: Graceful Storage Error Handling

**Requirement:** Graceful handling of storage quota errors

**Architectural Decisions:**
- Detect quota errors
- User-friendly error messages
- Recovery suggestions

**Implementation Strategy:**
```javascript
async function handleStorageError(error) {
    if (error.name === 'QuotaExceededError') {
        // Get storage info
        const info = storageService.getStorageInfo();
        
        // Show user-friendly message
        showError(
            'Storage is full!',
            `You're using ${info.usedFormatted} of storage. 
             Consider deleting completed tasks to free up space.`,
            [
                { label: 'Delete Completed', action: deleteCompletedTasks },
                { label: 'OK', action: dismissError }
            ]
        );
    } else if (error.message.includes('localStorage')) {
        showError(
            'Storage not available',
            'localStorage is not available. Your data won\'t be saved. ' +
            'This can happen in private browsing mode.',
            [{ label: 'OK', action: dismissError }]
        );
    } else {
        showError('Unable to save', 'Please try again.');
    }
}
```

**Validation:**
- ✅ Quota errors detected and handled
- ✅ User informed of issue
- ✅ Recovery options provided

**Testing:**
- Fill localStorage to quota
- Attempt to add tasks
- Verify error handling
- Test in private browsing mode

---

### NFR-014: Uptime Target (Post-MVP)

**Requirement:** ≥99.5% uptime target (post-MVP with backend)

**Note:** Not applicable for MVP (client-side only)

**Future Implementation:**
- Backend infrastructure monitoring
- Load balancing
- Redundancy and failover
- Health checks and alerting

---

## Security

### NFR-015: Local Data Storage

**Requirement:** Data stored locally in browser (MVP - no transmission)

**Architectural Decisions:**
- [ADR-003: Data Persistence](./decisions/ADR-003-data-persistence.md) - localStorage
- No external data transmission
- No analytics or tracking

**Implementation:**
- All data in localStorage
- No API calls (MVP)
- No third-party scripts
- Complete data privacy

**Validation:**
- ✅ No network requests for data
- ✅ Data stays on device
- ✅ Privacy notice displayed

**Testing:**
- Monitor network tab (should be empty except initial load)
- Verify no data transmission

---

### NFR-016: HTTPS/TLS (Post-MVP)

**Requirement:** HTTPS/TLS 1.2+ encryption (post-MVP)

**Current Implementation (MVP):**
- HTTPS for static hosting
- No data transmission, so encryption not critical for MVP

**Future Implementation:**
- All API calls over HTTPS
- TLS 1.2 or higher
- Valid SSL certificate

---

### NFR-017: Authentication (Post-MVP)

**Requirement:** Proper authentication and authorization (post-MVP)

**Not applicable for MVP** (single-user, client-side)

**Future Implementation:**
- JWT-based authentication
- Secure password hashing
- Session management

---

### NFR-018: Error Message Security

**Requirement:** No sensitive information in error messages or logs

**Architectural Decisions:**
- [Security Architecture](./security.md)
- Generic user-facing errors
- Detailed logs only in development

**Implementation:**
```javascript
function handleError(error, context) {
    // Log details for developers (development only)
    if (isDevelopment()) {
        console.error('Error:', {
            message: error.message,
            stack: error.stack,
            context: context
        });
    }
    
    // Show generic message to users
    if (error instanceof ValidationError) {
        showUserError('Please check your input.');
    } else {
        showUserError('An error occurred. Please try again.');
    }
}
```

**Validation:**
- ✅ No system details in user errors
- ✅ No stack traces shown to users
- ✅ Safe error logging

**Testing:**
- Trigger various errors
- Verify user-facing messages
- Check console logs

---

## Scalability

### NFR-019: Multi-User Extensibility

**Requirement:** Architecture supports future multi-user extension

**Architectural Decisions:**
- [ADR-001: Architectural Style](./decisions/ADR-001-architectural-style.md)
- Layered architecture ready for backend
- Storage service abstraction

**Design for Future:**
```javascript
// Current (MVP): localStorage
class LocalStorageService {
    async getTasks() {
        // localStorage implementation
    }
}

// Future: API
class ApiStorageService {
    constructor(apiClient) {
        this.api = apiClient;
    }
    
    async getTasks() {
        return await this.api.get('/tasks');
    }
}

// Swap implementation, no code changes elsewhere
const storageService = new ApiStorageService(apiClient);
const taskManager = new TaskManager(storageService);
```

**Validation:**
- ✅ Storage layer abstracted
- ✅ Business logic independent of storage
- ✅ UI independent of storage

**Future Migration Path:**
1. Add authentication layer
2. Implement API client
3. Replace LocalStorageService with ApiStorageService
4. No changes to business logic or UI

---

### NFR-020: Small Team Support

**Requirement:** Support for individual users and small teams (≤10 users) without major changes

**Architectural Decisions:**
- Data model supports user ID (future)
- Task sharing architecture (future)
- Role-based access (future)

**Future Enhancement:**
```javascript
// Task model with user support
{
    id: "uuid",
    userId: "uuid", // Owner
    sharedWith: ["uuid1", "uuid2"], // Shared users
    title: "Task title",
    // ... other fields
}
```

**Validation:**
- ✅ Data model extensible for multi-user
- ✅ Architecture supports sharing
- ✅ Minimal refactoring needed

---

## Maintainability

### NFR-021: Code Standards

**Requirement:** Code follows Java coding standards and best practices

**Note:** Requirement mentions Java but project uses JavaScript

**Implementation:**
- ESLint for code quality
- Prettier for formatting
- Code review guidelines
- Consistent naming conventions

**Configuration:**
```javascript
// .eslintrc.js
module.exports = {
    env: {
        browser: true,
        es2021: true
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
        'quotes': ['error', 'single']
    }
};
```

**Validation:**
- ✅ ESLint passes with no errors
- ✅ Consistent code style
- ✅ Best practices followed

**Testing:**
- Run ESLint on all commits
- Prettier check in CI
- Code review checklist

---

### NFR-022: Test Coverage ≥80%

**Requirement:** ≥80% code coverage for unit tests

**Architectural Decisions:**
- [ADR-005: Testing Strategy](./decisions/ADR-005-testing-strategy.md)
- Jest for unit testing
- Testing Library for integration
- Comprehensive test suite

**Coverage Targets:**
- Overall: ≥80%
- Business Logic: ≥90%
- Data Layer: ≥85%
- UI Layer: ≥70%

**Implementation:**
```javascript
// jest.config.js
module.exports = {
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
```

**Validation:**
- ✅ Coverage reports ≥80%
- ✅ All critical paths tested
- ✅ CI fails if coverage drops below 80%

**Testing:**
- Run `npm test -- --coverage`
- Monitor coverage trends
- Review coverage reports

---

### NFR-023: API Documentation

**Requirement:** All public APIs documented

**Implementation:**
- JSDoc comments for all public functions/classes
- README documentation
- Architecture documentation
- Inline code comments where needed

**Example:**
```javascript
/**
 * Creates a new task and persists it to storage.
 * 
 * @param {Object} taskData - The task data
 * @param {string} taskData.title - Task title (required, 1-200 chars)
 * @param {string} [taskData.description] - Task description (optional, max 1000 chars)
 * @returns {Promise<Task>} The created task
 * @throws {ValidationError} If task data is invalid
 * @throws {StorageError} If storage operation fails
 * 
 * @example
 * const task = await taskManager.addTask({
 *     title: 'Buy groceries',
 *     description: 'Milk, eggs, bread'
 * });
 */
async addTask(taskData) {
    // Implementation
}
```

**Validation:**
- ✅ All public APIs have JSDoc
- ✅ Examples provided
- ✅ Parameters and returns documented

---

### NFR-024: Quarterly Requirements Review

**Requirement:** Requirements reviewed quarterly

**Process:**
- Schedule review every 3 months
- Stakeholder meeting
- Update requirements document
- Update architecture if needed

**Review Checklist:**
- Are requirements still relevant?
- New requirements from user feedback?
- Sunset obsolete requirements?
- Update priorities?

---

## Browser Compatibility

### NFR-025: Browser Support Matrix

**Requirement:** Support latest 2 versions of Chrome, Firefox, Safari, Edge, Mobile Safari (iOS 13+), Chrome Mobile

**Architectural Decisions:**
- ES6+ features supported by target browsers
- No transpilation needed
- Progressive enhancement

**Browser Matrix:**

| Browser | Minimum Version | Support Level | Notes |
|---------|----------------|---------------|-------|
| Chrome | Latest - 2 | Full support | Primary development browser |
| Firefox | Latest - 2 | Full support | Good standards compliance |
| Safari | Latest - 2 | Full support | WebKit specific testing needed |
| Edge | Latest - 2 | Full support | Chromium-based |
| Mobile Safari | iOS 13+ | Full support | Touch optimization |
| Chrome Mobile | Latest - 1 | Full support | Mobile testing required |

**Feature Support:**
- ES6+ (classes, arrow functions, async/await)
- Flexbox & CSS Grid
- localStorage API
- DOM APIs

**Validation:**
- ✅ Manual testing on all browsers
- ✅ Automated cross-browser testing
- ✅ No browser-specific bugs

**Testing:**
- BrowserStack or similar service
- Real device testing
- Automated Playwright tests

---

## Summary

All 25 non-functional requirements are fully addressed in the architecture with clear implementation strategies and validation approaches.

**Coverage:**
- ✅ 100% NFR coverage
- ✅ All requirements mapped to architecture decisions
- ✅ Implementation strategies defined
- ✅ Validation approaches established
- ✅ Testing strategies in place

---

## References

- [Business Requirements Document](../requirements/business-requirements-document.md)
- [System Architecture](./system-architecture.md)
- [All ADRs](./decisions/)
- [Component Design](./components.md)
- [Data Architecture](./data-architecture.md)
- [Security Architecture](./security.md)

---

**Last Updated:** 2025-11-19  
**Next Review:** 2026-02-19
