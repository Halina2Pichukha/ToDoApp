# Technical Subtask: Integrate Delete Confirmation

## Subtask Metadata
- **Subtask ID:** STORY-008-ST-002
- **Parent Story:** STORY-008 (Delete Task Confirmation)
- **Title:** Integrate Confirmation Dialog with Delete Action
- **Complexity:** Low
- **Estimated Effort:** 1 hour

---

## Description

Integrate the confirmation dialog into the task deletion flow to prevent accidental deletions.

---

## Technical Requirements

### Update TaskListView
- Location: `src/ui/views/TaskListView.js`

### Implementation
```javascript
async handleDeleteClick(taskId) {
    const task = this.taskManager.getTask(taskId);
    
    const confirmed = await this.confirmationDialog.show(
        'Delete Task?',
        `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
        { confirmText: 'Delete', cancelText: 'Cancel' }
    );
    
    if (confirmed) {
        try {
            await this.taskManager.deleteTask(taskId);
            this.notificationManager.success('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
            this.notificationManager.error('Failed to delete task');
        }
    }
}
```

### Architecture References
- **Component:** TaskListView (components.md section 4.2)
- **UX:** Confirmation before destructive action (STORY-008)

---

## Acceptance Criteria

- [ ] Clicking delete button shows confirmation dialog
- [ ] Dialog shows task title in message
- [ ] Clicking "Delete" removes task
- [ ] Clicking "Cancel" keeps task
- [ ] Success notification shown on delete
- [ ] Error notification shown on failure

---

## Testing Requirements

### Integration Tests
- Test delete with confirmation
- Test delete with cancellation
- Test error handling

---

## Dependencies
- STORY-008-ST-001 (Confirmation Dialog)
- STORY-009-ST-001 (Delete Logic)

---

## Definition of Done
- [ ] Confirmation integrated
- [ ] Delete flow working
- [ ] Tests passing
- [ ] Code reviewed
