# Technical Subtask: Implement Edit Task Form Loading

## Subtask Metadata
- **Subtask ID:** STORY-006-ST-001
- **Parent Story:** STORY-006 (Edit Task Form)
- **Title:** Load Existing Task Data into Form
- **Complexity:** Medium
- **Estimated Effort:** 2 hours

---

## Description

Extend TaskFormView to support edit mode by loading existing task data into the form fields.

---

## Technical Requirements

### Update TaskFormView
- Location: `src/ui/views/TaskFormView.js`

### Implementation
Add edit mode support to existing TaskFormView (see STORY-001-ST-003):
- Accept optional task parameter
- Pre-fill form fields with task data
- Change button text to "Update" instead of "Save"
- Store task ID for update operation

### Architecture References
- **Component Reuse:** TaskFormView (components.md section 4.3)
- **Edit Flow:** STORY-006 acceptance criteria

---

## Acceptance Criteria

- [ ] Form can be opened in edit mode with task data
- [ ] Title field pre-filled with existing title
- [ ] Description field pre-filled with existing description
- [ ] Character counters show current length
- [ ] Button text shows "Update" in edit mode
- [ ] Form title shows "Edit Task" in edit mode

---

## Testing Requirements

### Unit Tests
- Test form renders with existing task data
- Test character counters initialize correctly
- Test edit mode vs create mode

---

## Dependencies
- STORY-001-ST-003 (TaskFormView)
- STORY-003-ST-001 (TaskManager)

---

## Definition of Done
- [ ] Edit mode implemented
- [ ] Data pre-loading working
- [ ] Tests passing
- [ ] Code reviewed
