# ADR-002: Frontend Technology Choices

## Status
Accepted

## Context

The ToDoApp MVP requires frontend technologies that enable rapid development while meeting performance, accessibility, and maintainability requirements. The selection must balance modern capabilities with simplicity and minimal dependencies.

### Key Considerations:
- MVP timeline: 4-6 weeks
- Small development team (1-2 developers)
- Target browsers: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Performance targets: <2s page load, <100ms operations
- Accessibility requirement: WCAG 2.1 Level AA
- Must work offline after initial load
- Future extensibility for backend integration

### Requirements Driving This Decision:
- NFR-001: Web-based application
- NFR-002: Responsive design (320px to 4K)
- NFR-005: WCAG 2.1 Level AA compliance
- NFR-008: Page load time <2 seconds
- NFR-021: Code follows best practices

## Decision

We will use **Vanilla JavaScript (ES6+), HTML5, and CSS3** with **zero framework dependencies** for the MVP.

### Technology Stack:

#### Core Technologies:
1. **HTML5**
   - Semantic elements for accessibility
   - Native form validation
   - Modern APIs (localStorage, fetch)

2. **CSS3**
   - Flexbox and Grid for layouts
   - Custom properties (CSS variables)
   - Media queries for responsiveness
   - Native animations and transitions

3. **JavaScript ES6+**
   - ES Modules for code organization
   - Classes for component structure
   - Async/await for asynchronous operations
   - Template literals for HTML generation
   - Destructuring and modern syntax

#### Browser APIs:
- **localStorage**: Data persistence
- **DOM API**: User interface manipulation
- **Events API**: User interaction handling
- **Fetch API**: Future backend communication

#### Development Tools:
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Jest** (recommended): Unit testing
- **Testing Library** (recommended): Component testing
- **Git**: Version control

## Consequences

### Positive

1. **Performance**
   - Zero framework overhead
   - Minimal bundle size (<100KB easily achievable)
   - Faster page load times
   - No virtual DOM overhead
   - Direct DOM manipulation when needed

2. **Simplicity**
   - No build step required for development
   - Simple deployment (just static files)
   - Easy debugging (no transpilation)
   - Lower learning curve
   - Full control over implementation

3. **Security**
   - No third-party dependencies
   - No dependency vulnerabilities
   - No supply chain risks
   - Complete code visibility

4. **Browser Compatibility**
   - ES6+ supported by all target browsers
   - No transpilation needed
   - Native browser features only
   - Consistent behavior across browsers

5. **Future Flexibility**
   - Easy to add frameworks later if needed
   - Can integrate libraries incrementally
   - No vendor lock-in
   - Clean foundation for refactoring

6. **Maintainability**
   - No framework version upgrades
   - No breaking changes from dependencies
   - Long-term stability
   - Easy handoff to new developers

### Negative

1. **More Manual Work**
   - No built-in state management
   - No reactive data binding
   - Manual DOM manipulation
   - More boilerplate code

2. **Reinventing Patterns**
   - Need to implement common patterns manually
   - Component lifecycle management
   - Event handling systems
   - Router (if needed later)

3. **Limited Tooling**
   - No framework-specific DevTools
   - No hot module replacement (HMR) out of the box
   - Manual optimization needed

4. **Developer Experience**
   - Less convenient than modern frameworks
   - More code for same functionality
   - No declarative UI syntax (like JSX)

5. **Scalability Concerns**
   - May become harder to manage as app grows
   - Manual optimization required
   - Need careful architecture to avoid spaghetti code

## Alternatives Considered

### Alternative 1: React
Modern, popular UI library with large ecosystem.

**Pros:**
- Large community and resources
- Excellent developer experience
- Rich ecosystem of libraries
- Component-based architecture
- Virtual DOM for performance

**Rejected because:**
- Adds ~40-50KB to bundle size (even minified)
- Build step required (babel, webpack)
- Overkill for MVP complexity
- Longer learning curve for team
- Dependency management overhead
- Not needed for current feature set

**Reconsider when:**
- App grows significantly (50+ components)
- Complex state management needed
- Team size increases
- User feedback indicates need for more features

### Alternative 2: Vue.js
Progressive framework, easier learning curve than React.

**Pros:**
- Lighter than React (~30KB)
- Good documentation
- Template syntax easier for beginners
- Two-way data binding

**Rejected because:**
- Still adds dependency overhead
- Build step recommended for production
- Not needed for MVP scope
- Same concerns as React but less ecosystem

### Alternative 3: Svelte
Compiler-based framework with no runtime overhead.

**Pros:**
- Smallest bundle size
- No virtual DOM
- Great developer experience
- Reactive by default

**Rejected because:**
- Build step required (compiler)
- Smaller community and ecosystem
- Less familiar to most developers
- Overkill for MVP

### Alternative 4: Web Components
Native browser standard for reusable components.

**Pros:**
- Native browser support
- Framework-agnostic
- True encapsulation
- Standard-based

**Rejected for MVP because:**
- Browser support still evolving
- Polyfills needed for older browsers
- More complex than needed
- Can be added later incrementally

**Decision:** Keep Web Components as an option for post-MVP refactoring

### Alternative 5: jQuery
Classic DOM manipulation library.

**Rejected because:**
- Legacy technology
- Larger than needed
- Modern browsers don't need it
- Not relevant for modern development

## Implementation Notes

### Code Organization:
```javascript
// Use ES6 modules for organization
// Example: TaskManager.js
export class TaskManager {
    constructor(storageService) {
        this.storageService = storageService;
        this.tasks = [];
    }
    
    async loadTasks() {
        this.tasks = await this.storageService.getAllTasks();
        return this.tasks;
    }
}
```

### HTML Generation:
```javascript
// Use template literals for HTML
function renderTask(task) {
    return `
        <div class="task-item" data-id="${task.id}">
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span>${escapeHtml(task.title)}</span>
        </div>
    `;
}
```

### Event Handling:
```javascript
// Event delegation for efficiency
taskList.addEventListener('click', (e) => {
    if (e.target.matches('.task-checkbox')) {
        handleToggleTask(e.target.closest('.task-item'));
    }
});
```

### Browser Compatibility:
All ES6+ features used are supported by target browsers:
- Chrome 90+ (latest - 2)
- Firefox 88+ (latest - 2)
- Safari 14+ (latest - 2)
- Edge 90+ (latest - 2)

No transpilation needed.

### Optional Build Step:
For production, consider:
- Minification (Terser)
- Bundling multiple files (Rollup or esbuild)
- CSS minification
- Source maps for debugging

But these are optional optimizations, not requirements.

## Migration Path

### Adding a Framework Later:
If the application grows and requires a framework:

1. **Incremental Migration**
   - Introduce framework alongside vanilla code
   - Migrate components incrementally
   - Keep business logic layer unchanged

2. **Recommended Approach**
   - Start with most complex components
   - Rewrite UI layer only
   - Keep existing architecture

3. **Easy to Integrate**
   - Current modular structure supports any framework
   - Business logic is framework-agnostic
   - Storage layer unchanged

## Validation Against Tech Architect Principles

✅ **Simplicity (KISS)**: No unnecessary complexity  
✅ **Performance**: Minimal overhead, fast load times  
✅ **Maintainability**: No framework updates, stable foundation  
✅ **Security**: No third-party dependencies  
✅ **Team-Friendly**: Standard web technologies, widely understood  
✅ **Future-Proof**: Easy to add frameworks later if needed  
✅ **Cost-Effective**: No licensing, no build infrastructure needed  

## Success Metrics

### Performance Metrics:
- Bundle size: <100KB total
- Page load: <2s on 10 Mbps connection
- Time to Interactive: <1s
- Lighthouse Performance Score: >90

### Development Metrics:
- MVP delivery: Within 4-6 weeks
- Code quality: ESLint passing, >80% test coverage
- No security vulnerabilities (npm audit)

## References

- [Business Requirements Document](../../requirements/business-requirements-document.md)
- [MVP Scope](../../requirements/mvp-scope.md)
- [NFR Requirements](../../requirements/business-requirements-document.md#5-non-functional-requirements)
- [EPIC-002: User Interface Design](../../tasks/epics/EPIC-002-user-interface-design.md)

## Related ADRs

- [ADR-001: Architectural Style](./ADR-001-architectural-style.md)
- [ADR-003: Data Persistence Strategy](./ADR-003-data-persistence.md)
- [ADR-005: Testing Strategy](./ADR-005-testing-strategy.md)

---

**Date:** 2025-11-19  
**Author:** Tech Architect Team  
**Reviewers:** Development Team Lead, Product Owner
