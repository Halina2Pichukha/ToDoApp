# STORY-013: Form UI Components

## Story Metadata
- **Story ID:** STORY-013
- **Title:** Form UI Components
- **Epic:** EPIC-002 (User Interface & Design)
- **Created:** 2025-11-18
- **Status:** Planned
- **Priority:** High
- **Complexity:** Medium
- **Estimated Effort:** 4 story points

---

## User Story

**As a** user  
**I want to** use well-designed and intuitive form components  
**So that** creating and editing tasks is easy and pleasant

---

## Business Value

Improves user experience during task creation/editing, reducing friction and encouraging task management.

---

## Acceptance Criteria

### AC1: Input Field Styling
**Given** I see a form input field  
**Then** it should have clear borders and padding  
**And** placeholder text should be visible but subtle  
**And** focus state should be clearly indicated (e.g., blue border)

### AC2: Label Design
**Given** I see form fields  
**Then** each field should have a clear label  
**And** required fields should be marked (e.g., asterisk)  
**And** labels should be properly associated with inputs

### AC3: Button Styling
**Given** I see form buttons (Save, Cancel)  
**Then** primary action (Save) should be visually prominent (e.g., blue)  
**And** secondary action (Cancel) should be less prominent (e.g., gray)  
**And** buttons should have hover and active states

### AC4: Error State Styling
**Given** a form field has a validation error  
**Then** the field should have error styling (e.g., red border)  
**And** error message should be displayed in red  
**And** error icon should be shown (optional)

### AC5: Character Counter Styling
**Given** I see character counters  
**Then** they should be small and unobtrusive  
**And** they should turn red when approaching limit  
**And** they should update in real-time as I type

---

## Technical Notes

### Form CSS
```css
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #424242;
}

.form-label.required::after {
  content: " *";
  color: #f44336;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-input.error,
.form-textarea.error {
  border-color: #f44336;
}

.form-error {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #f44336;
}

.char-counter {
  font-size: 12px;
  color: #757575;
  text-align: right;
  margin-top: 4px;
}

.char-counter.warning {
  color: #ff9800;
}

.char-counter.error {
  color: #f44336;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #2196f3;
  color: white;
}

.btn-primary:hover {
  background-color: #1976d2;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #424242;
}

.btn-secondary:hover {
  background-color: #bdbdbd;
}
```

---

## Dependencies

### Blocked By
- STORY-011: Responsive Layout Foundation

### Blocks
- None

### Related To
- STORY-001: Create Task Form
- STORY-006: Edit Task Form
- EPIC-002: User Interface & Design

---

## Requirements Traceability

### Non-Functional Requirements
- **NFR-002:** Modern UI design
- **NFR-004:** Intuitive interface
- **NFR-006:** Visual feedback

---

## Definition of Done

- [ ] Input fields styled with clear focus states
- [ ] Labels properly designed and associated
- [ ] Buttons have clear visual hierarchy
- [ ] Error states visually distinct
- [ ] Character counters styled and functional
- [ ] Responsive on all screen sizes
- [ ] Touch-friendly on mobile
- [ ] Accessibility compliant
- [ ] Code reviewed and approved

---

## UI/UX Considerations

### Focus States
- Clear blue border on focus
- Subtle shadow for depth
- No harsh outlines

### Error States  
- Red border for error fields
- Red text for error messages
- Error icon (optional)
- Clear, helpful messages

### Button Hierarchy
- Primary: Blue, prominent
- Secondary: Gray, less prominent
- Danger: Red (for destructive actions)

---

## Notes

- Forms should feel polished and professional
- Validate on blur and submit, not on every keystroke
- Provide clear feedback for all states
- Test with keyboard navigation

---

## Related Documentation

- [EPIC-002: User Interface & Design](../epics/EPIC-002-user-interface-design.md)

---

**Last Updated:** 2025-11-18  
**Status:** Ready for Development
