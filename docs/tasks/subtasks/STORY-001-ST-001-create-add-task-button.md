# Technical Subtask: Create Add Task Button Component

## Subtask Metadata
- **Subtask ID:** STORY-001-ST-001
- **Parent Story:** STORY-001 (Create Task Form)
- **Title:** Create Add Task Button Component
- **Complexity:** Low
- **Estimated Effort:** 1 hour

---

## Description

Implement a visible "Add Task" button component that serves as the entry point for task creation, as specified in STORY-001 AC1.

---

## Technical Requirements

### Component Structure
- Create button component in UI layer
- Location: `src/ui/components/AddTaskButton.js`
- Follow component architecture from `docs/architecture/components.md`

### Implementation Details
```javascript
class AddTaskButton {
    constructor(containerElement) {
        this.container = containerElement;
    }
    
    render() {
        const button = document.createElement('button');
        button.id = 'add-task-btn';
        button.className = 'btn-primary add-task-btn';
        button.textContent = '+ Add Task';
        button.setAttribute('aria-label', 'Add new task');
        
        button.addEventListener('click', () => {
            this.handleClick();
        });
        
        this.container.appendChild(button);
    }
    
    handleClick() {
        // Emit event to show task form
        const event = new CustomEvent('show-task-form');
        window.dispatchEvent(event);
    }
}
```

### Architecture References
- **UI Layer:** AppShell component (system-architecture.md section 2.2)
- **Event Pattern:** Observer pattern (components.md section 8.2)
- **Accessibility:** WCAG 2.1 AA compliance (NFR-015)

---

## Acceptance Criteria

- [ ] Button is visible on page load
- [ ] Button has clear "Add Task" or "+" text
- [ ] Button is in prominent location (top of task list area)
- [ ] Button has proper ARIA label for accessibility
- [ ] Click event is properly handled
- [ ] Button follows design system styles (when available)

---

## Testing Requirements

### Unit Tests
- Verify button renders correctly
- Verify click event is emitted
- Verify ARIA attributes are present

### Manual Testing
- Button visible on all screen sizes
- Button accessible via keyboard (Tab key)
- Screen reader announces button properly

---

## Dependencies
- None (foundational component)

---

## Definition of Done
- [ ] Component implemented and renders
- [ ] Event handling works
- [ ] Accessibility attributes added
- [ ] Unit tests passing
- [ ] Code reviewed
