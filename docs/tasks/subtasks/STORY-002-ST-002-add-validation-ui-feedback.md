# Technical Subtask: Add Real-Time Validation UI Feedback

## Subtask Metadata
- **Subtask ID:** STORY-002-ST-002
- **Parent Story:** STORY-002 (Task Input Validation)
- **Title:** Add Real-Time Validation UI Feedback
- **Complexity:** Medium
- **Estimated Effort:** 2 hours

---

## Description

Integrate validation logic with the task form UI to provide real-time feedback including error messages, field highlighting, and dynamic error clearing (STORY-002 AC5).

---

## Technical Requirements

### Update TaskFormView
- Location: `src/ui/views/TaskFormView.js`
- Add validation event handlers
- Display validation errors inline

### Implementation Details
```javascript
class TaskFormView {
    setupValidationHandlers() {
        const titleInput = document.getElementById('task-title');
        const descriptionInput = document.getElementById('task-description');
        
        // Validate on blur
        titleInput.addEventListener('blur', () => {
            this.validateField('title', titleInput.value);
        });
        
        descriptionInput.addEventListener('blur', () => {
            this.validateField('description', descriptionInput.value);
        });
        
        // Clear errors on input (AC5)
        titleInput.addEventListener('input', () => {
            this.clearFieldError('title');
            this.updateCounter('title');
        });
        
        descriptionInput.addEventListener('input', () => {
            this.clearFieldError('description');
            this.updateCounter('description');
        });
    }
    
    validateField(fieldName, value) {
        const result = TaskValidator.validateField(fieldName, value);
        
        if (!result.isValid) {
            this.showFieldError(fieldName, result.errors[0].message);
        } else {
            this.clearFieldError(fieldName);
        }
        
        return result.isValid;
    }
    
    showFieldError(fieldName, message) {
        const input = document.getElementById(`task-${fieldName}`);
        const errorDiv = document.getElementById(`${fieldName}-error`);
        
        // Add error class to input (red border)
        input.classList.add('input-error');
        input.setAttribute('aria-invalid', 'true');
        
        // Display error message
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Announce to screen readers
        errorDiv.setAttribute('role', 'alert');
    }
    
    clearFieldError(fieldName) {
        const input = document.getElementById(`task-${fieldName}`);
        const errorDiv = document.getElementById(`${fieldName}-error`);
        
        // Remove error class
        input.classList.remove('input-error');
        input.setAttribute('aria-invalid', 'false');
        
        // Hide error message
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
    
    showValidationErrors(errors) {
        errors.forEach(error => {
            this.showFieldError(error.field, error.message);
        });
        
        // Focus first error field
        if (errors.length > 0) {
            const firstErrorField = document.getElementById(`task-${errors[0].field}`);
            firstErrorField.focus();
        }
    }
    
    validateForm() {
        const titleInput = document.getElementById('task-title');
        const descriptionInput = document.getElementById('task-description');
        
        const result = TaskValidator.validate({
            title: titleInput.value,
            description: descriptionInput.value
        });
        
        if (!result.isValid) {
            this.showValidationErrors(result.errors);
        }
        
        return result.isValid;
    }
}
```

### CSS for Error States
```css
.input-error {
    border-color: #dc3545;
    border-width: 2px;
}

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: none;
}

.character-counter.warning {
    color: #ffc107;
    font-weight: bold;
}
```

### Architecture References
- **UI Layer:** TaskFormView error handling (components.md section 4.3)
- **Error Strategy:** Error handling patterns (system-architecture.md section 9.1)
- **Accessibility:** ARIA attributes for errors (NFR-015)

---

## Acceptance Criteria

- [ ] Error messages display below fields with validation errors
- [ ] Input fields highlighted with red border on error (AC1)
- [ ] Errors clear immediately when user starts typing valid input (AC5)
- [ ] Character limit warnings shown when approaching max length
- [ ] Error messages are accessible to screen readers
- [ ] Focus moves to first error field on form submission

---

## Testing Requirements

### Unit Tests
- Test error display on invalid input
- Test error clearing on valid input
- Test multiple validation errors
- Test ARIA attributes are set correctly

### Manual Testing
- Verify visual error indicators
- Test with screen reader
- Verify keyboard navigation with errors

---

## Dependencies
- STORY-002-ST-001 (Validation Logic)
- STORY-001-ST-003 (Form Fields)

---

## Definition of Done
- [ ] Real-time validation feedback implemented
- [ ] Error states display correctly
- [ ] Error clearing works (AC5)
- [ ] Accessibility tested
- [ ] Unit tests passing
- [ ] Code reviewed
