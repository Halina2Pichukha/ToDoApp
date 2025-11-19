# STORY-007: Update Task Details

## Story Metadata
- **Story ID:** STORY-007
- **Title:** Update Task Details
- **Epic:** EPIC-001 (Task CRUD Operations)
- **Created:** 2025-11-18
- **Status:** Planned
- **Priority:** Medium
- **Complexity:** Medium
- **Estimated Effort:** 3 story points

---

## User Story

**As a** user  
**I want to** save changes to a task from the edit form  
**So that** my updates are persisted and visible in the task list

---

## Business Value

Completes the edit functionality by actually saving changes, allowing users to maintain accurate and up-to-date task information.

---

## Acceptance Criteria

### AC1: Save Button Updates Task
**Given** I have edited a task in the edit form  
**When** I click the "Save" button  
**Then** the task should be updated with the new values  
**And** the changes should be saved to localStorage  
**And** the edit form should close  
**And** the operation should complete within 100ms

### AC2: Updated Task Visible in List
**Given** I have saved changes to a task  
**Then** the task list should immediately reflect the changes  
**And** the updated title should be visible  
**And** no page refresh should be required

### AC3: Validation Before Save
**Given** I am editing a task  
**When** I try to save with invalid data (empty title, too long)  
**Then** I should see validation errors  
**And** the task should not be updated  
**And** the form should remain open

### AC4: Updated Timestamp Set
**Given** I save changes to a task  
**Then** the task's `updatedAt` timestamp should be set to current time  
**And** the `createdAt` timestamp should remain unchanged

### AC5: Confirmation Message Displayed
**Given** I successfully save changes to a task  
**Then** I should see a brief success message (e.g., "Task updated")  
**And** the message should disappear after 2-3 seconds

---

## Technical Notes

### Update Implementation
```javascript
function updateTask(taskId, updatedData) {
  const tasks = loadTasksFromStorage();
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    showError('Task not found');
    return false;
  }
  
  // Validate input
  if (!validateTask(updatedData)) {
    return false;
  }
  
  // Update task
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: updatedData.title.trim(),
    description: updatedData.description.trim(),
    updatedAt: new Date().toISOString(),
  };
  
  // Save to storage
  saveTasksToStorage(tasks);
  
  // Update UI
  renderTaskList(tasks);
  hideEditForm();
  showSuccessMessage('Task updated');
  
  return true;
}
```

### Data Flow
1. User clicks Save in edit form
2. Collect form data
3. Validate data (reuse validation from create)
4. Update task object in array
5. Save to localStorage
6. Re-render task list
7. Close form
8. Show success message

---

## Dependencies

### Blocked By
- STORY-006: Edit Task Form
- STORY-002: Task Input Validation
- STORY-010: Task Data Persistence

### Blocks
- None

### Related To
- STORY-003: Display Task List (re-render after update)
- EPIC-003: Data Persistence Layer

---

## Requirements Traceability

### Functional Requirements
- **FR-003:** Update existing tasks

### User Stories (Original)
- **US-003:** Update Tasks

### Non-Functional Requirements
- **NFR-006:** Visual feedback (success message)
- **NFR-009:** Operations <100ms
- **NFR-011:** Data integrity ensured
- **NFR-012:** Persist across sessions

---

## Definition of Done

- [ ] Save button updates task with new values
- [ ] Changes persisted to localStorage
- [ ] Task list reflects changes immediately
- [ ] updatedAt timestamp set correctly
- [ ] createdAt timestamp unchanged
- [ ] Validation prevents invalid updates
- [ ] Success message displayed after save
- [ ] Edit form closes after save
- [ ] Operation completes within 100ms
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Code reviewed and approved

---

## Test Scenarios

### Test 1: Successful Update
1. Open edit form for a task
2. Change title and description
3. Click Save
4. Verify form closes
5. Verify task list shows new values
6. Verify success message appears

### Test 2: Validation on Update
1. Open edit form
2. Clear title field
3. Click Save
4. Verify validation error appears
5. Verify task not updated
6. Verify form stays open

### Test 3: Timestamp Update
1. Note original createdAt timestamp
2. Edit and save task
3. Verify updatedAt is current time
4. Verify createdAt unchanged

### Test 4: Persistence
1. Edit and save a task
2. Refresh page
3. Verify task shows updated values

### Test 5: Cancel vs Save
1. Open edit form
2. Make changes
3. Click Cancel (not Save)
4. Verify task unchanged

---

## UI/UX Considerations

### Success Feedback
- Toast/snackbar notification
- Auto-dismiss after 2-3 seconds
- Green color to indicate success
- Non-intrusive placement

### Error Handling
- Same validation as create
- Clear error messages
- Keep form open on error
- Focus on invalid field

### Performance
- Instant UI update (optimistic update)
- Background save to storage
- No perceived lag

---

## Notes

- Reuse validation logic from create task
- Consider debouncing auto-save (future)
- Track revision history (post-MVP)
- Undo update functionality (post-MVP)

---

## Related Documentation

- [User Stories](../../requirements/user-stories.md)
- [EPIC-001: Task CRUD Operations](../epics/EPIC-001-task-crud-operations.md)

---

**Last Updated:** 2025-11-18  
**Status:** Ready for Development
