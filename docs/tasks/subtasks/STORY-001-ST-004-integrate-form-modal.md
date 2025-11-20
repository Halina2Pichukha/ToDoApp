# Technical Subtask: Integrate Form with Modal

## Subtask Metadata
- **Subtask ID:** STORY-001-ST-004
- **Parent Story:** STORY-001 (Create Task Form)
- **Title:** Integrate Form with Modal and Wire Event Handlers
- **Complexity:** Low
- **Estimated Effort:** 1 hour

---

## Description

Connect the Add Task button, modal, and form components together with proper event handling to complete the task creation form flow (STORY-001 AC5).

---

## Technical Requirements

### Integration Code
- Location: `src/app.js` or `src/ui/AppShell.js`
- Wire up event listeners between components
- Handle form submission and cancellation

### Implementation Details
```javascript
class App {
    initializeTaskForm() {
        // Listen for show form event from Add Task button
        window.addEventListener('show-task-form', () => {
            this.showTaskForm();
        });
        
        // Listen for form cancel event
        window.addEventListener('form:cancel', () => {
            this.hideTaskForm();
        });
        
        // Listen for form submit event
        window.addEventListener('form:submit', (e) => {
            this.handleTaskFormSubmit(e.detail);
        });
    }
    
    showTaskForm(task = null) {
        const formView = new TaskFormView(this.taskManager);
        const formHTML = formView.render(task);
        this.modalManager.show(formHTML);
    }
    
    hideTaskForm() {
        this.modalManager.hide();
        // Clear form data if needed
    }
    
    async handleTaskFormSubmit(taskData) {
        try {
            await this.taskManager.addTask(taskData);
            this.hideTaskForm();
            this.notificationManager.success('Task created successfully');
        } catch (error) {
            this.notificationManager.error('Failed to create task');
        }
    }
}
```

### Architecture References
- **Application Core:** App initialization (components.md section 1.1)
- **Event Pattern:** Event coordination (system-architecture.md section 5.1)
- **Component Communication:** Event bus pattern (components.md section 6)

---

## Acceptance Criteria

- [ ] Clicking "Add Task" button opens modal with form
- [ ] Clicking "Cancel" button closes form without saving
- [ ] Modal closes immediately on cancel (AC5)
- [ ] Form state is cleared after cancel
- [ ] Events are properly handled and cleaned up

---

## Testing Requirements

### Integration Tests
- Test button click -> modal open flow
- Test cancel button -> modal close flow
- Verify no memory leaks from event listeners

---

## Dependencies
- STORY-001-ST-001 (Add Task Button)
- STORY-001-ST-002 (Modal Component)
- STORY-001-ST-003 (Form Fields)

---

## Definition of Done
- [ ] Components integrated
- [ ] Event flow working end-to-end
- [ ] Cancel functionality works per AC5
- [ ] Integration tests passing
- [ ] Code reviewed
