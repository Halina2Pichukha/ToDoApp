# Technical Subtask: Connect Edit Form to Update Logic

## Subtask Metadata
- **Subtask ID:** STORY-007-ST-002
- **Parent Story:** STORY-007 (Update Task Details)
- **Title:** Wire Edit Form Submission to TaskManager Update
- **Complexity:** Low
- **Estimated Effort:** 1 hour

---

## Description

Connect the edit form submission to TaskManager's updateTask method and handle the update flow.

---

## Technical Requirements

### Update TaskFormView
- Location: `src/ui/views/TaskFormView.js`

### Implementation
```javascript
async handleSubmit(event) {
    event.preventDefault();
    
    if (!this.validateForm()) {
        return;
    }
    
    const titleInput = document.getElementById('task-title');
    const descriptionInput = document.getElementById('task-description');
    
    const taskData = {
        title: titleInput.value,
        description: descriptionInput.value
    };
    
    try {
        if (this.taskId) {
            // Edit mode - update existing task
            await this.taskManager.updateTask(this.taskId, taskData);
            this.dispatchEvent('task:updated', { taskId: this.taskId });
        } else {
            // Create mode - add new task
            await this.taskManager.addTask(taskData);
            this.dispatchEvent('task:created');
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            this.showValidationErrors(error.errors);
        } else {
            this.dispatchEvent('task:error', { error });
        }
    }
}
```

### Architecture References
- **Component:** TaskFormView (components.md section 4.3)
- **Error Handling:** Error handling patterns (system-architecture.md section 9)

---

## Acceptance Criteria

- [ ] Form submit calls updateTask when in edit mode
- [ ] Form submit calls addTask when in create mode
- [ ] Success event emitted on successful update
- [ ] Error event emitted on failure
- [ ] Validation errors displayed
- [ ] Form closes on successful update

---

## Testing Requirements

### Integration Tests
- Test edit form submission updates task
- Test validation errors prevent update
- Test success and error event emission

---

## Dependencies
- STORY-006-ST-001 (Edit Form Loading)
- STORY-007-ST-001 (Update Logic)

---

## Definition of Done
- [ ] Form submission wired to update
- [ ] Both create and edit modes work
- [ ] Error handling implemented
- [ ] Tests passing
- [ ] Code reviewed
