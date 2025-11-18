# STORY-006: Edit Task Form

## Story Metadata
- **Story ID:** STORY-006
- **Title:** Edit Task Form
- **Epic:** EPIC-001 (Task CRUD Operations)
- **Created:** 2025-11-18
- **Status:** Planned
- **Priority:** Medium
- **Complexity:** Medium
- **Estimated Effort:** 4 story points

---

## User Story

**As a** user  
**I want to** click an "Edit" button on a task and see an edit form pre-populated with current values  
**So that** I can modify task details

---

## Business Value

Enables users to update task information, correct mistakes, and keep their tasks accurate and up-to-date.

---

## Acceptance Criteria

### AC1: Edit Button Visible
**Given** I am viewing a task in the task list  
**Then** I should see an "Edit" button or icon for each task  
**And** the button should be clearly visible and clickable

### AC2: Edit Form Appears with Current Values
**Given** I click the "Edit" button on a task  
**Then** an edit form should appear  
**And** the title field should be pre-populated with the current title  
**And** the description field should be pre-populated with the current description  
**And** the title field should be auto-focused

### AC3: Form Layout Same as Create
**Given** the edit form is displayed  
**Then** it should have the same layout and fields as the create form:
- Title input (required)
- Description textarea (optional)
- Character counters
- Save and Cancel buttons

### AC4: Character Counters Show Current Length
**Given** the edit form is pre-populated  
**Then** character counters should show current length (e.g., "25/200")  
**And** counters should update as I type

### AC5: Cancel Discards Changes
**Given** I am editing a task  
**When** I modify the fields and click "Cancel"  
**Then** the edit form should close  
**And** the task should retain its original values  
**And** no changes should be saved

---

## Technical Notes

### Edit Form Implementation
```javascript
function showEditForm(taskId) {
  const task = findTaskById(taskId);
  const form = document.getElementById('edit-form');
  
  // Pre-populate fields
  document.getElementById('edit-title').value = task.title;
  document.getElementById('edit-description').value = task.description;
  
  // Update character counters
  updateCharacterCount('edit-title');
  updateCharacterCount('edit-description');
  
  // Store task ID for update
  form.dataset.taskId = taskId;
  
  // Show form and focus title
  form.style.display = 'block';
  document.getElementById('edit-title').focus();
  document.getElementById('edit-title').select(); // Select text for easy replacement
}
```

### Form Reuse
- Consider reusing the create form component
- Pass `mode` prop: 'create' or 'edit'
- Load data when mode is 'edit'

---

## Dependencies

### Blocked By
- STORY-001: Create Task Form
- STORY-003: Display Task List

### Blocks
- STORY-007: Update Task Details

### Related To
- STORY-002: Task Input Validation (same validation rules)
- EPIC-002: User Interface & Design

---

## Requirements Traceability

### Functional Requirements
- **FR-003:** Update existing tasks

### User Stories (Original)
- **US-003:** Update Tasks

### Non-Functional Requirements
- **NFR-004:** Intuitive interface
- **NFR-006:** Visual feedback

---

## Definition of Done

- [ ] Edit button displayed for each task
- [ ] Clicking edit button opens form with current values
- [ ] Form pre-populates title and description
- [ ] Character counters show current length
- [ ] Title field auto-focused and text selected
- [ ] Cancel button closes form without saving
- [ ] Form has same validation as create form
- [ ] Responsive layout
- [ ] Keyboard accessible
- [ ] Unit tests written and passing
- [ ] Code reviewed and approved

---

## Test Scenarios

### Test 1: Edit Button Visibility
1. View task list with tasks
2. Verify each task has an Edit button
3. Verify button is clearly labeled

### Test 2: Form Pre-population
1. Click Edit on a task
2. Verify form appears
3. Verify title field contains current title
4. Verify description field contains current description
5. Verify title field is focused

### Test 3: Character Counters
1. Open edit form for task with 25-char title
2. Verify counter shows "25/200"
3. Type more characters
4. Verify counter updates

### Test 4: Cancel Button
1. Open edit form
2. Modify both fields
3. Click Cancel
4. Verify form closes
5. Verify task unchanged in list

---

## UI/UX Considerations

### Button Placement
- In task item actions area
- Visible on hover (desktop) or always (mobile)
- Clear icon or text label

### Form Presentation
- Modal overlay (recommended)
- Or inline expansion
- Consistent with create form

### Auto-focus Behavior
- Focus title field on open
- Select existing text for easy replacement
- Cursor at end if user wants to append

---

## Notes

- Reuse create form component if possible
- Validation rules same as create
- Consider inline editing (future enhancement)
- Support keyboard shortcut to edit (future)

---

## Related Documentation

- [User Stories](../../requirements/user-stories.md)
- [EPIC-001: Task CRUD Operations](../epics/EPIC-001-task-crud-operations.md)

---

**Last Updated:** 2025-11-18  
**Status:** Ready for Development
