# Technical Subtask: Implement Client-Side Validation Logic

## Subtask Metadata
- **Subtask ID:** STORY-002-ST-001
- **Parent Story:** STORY-002 (Task Input Validation)
- **Title:** Implement Client-Side Validation Logic
- **Complexity:** Medium
- **Estimated Effort:** 2 hours

---

## Description

Create validation logic for task input fields including required field validation, length validation, and whitespace validation as specified in STORY-002.

---

## Technical Requirements

### Component Structure
- Location: `src/business/validators/TaskValidator.js`
- Follow validation patterns from components.md section 2.2

### Implementation Details
```javascript
class TaskValidator {
    static VALIDATION_RULES = {
        title: {
            required: true,
            minLength: 1,
            maxLength: 200,
            trim: true
        },
        description: {
            required: false,
            maxLength: 1000
        }
    };
    
    static validate(taskData) {
        const errors = [];
        
        // Title validation
        if (!taskData.title || taskData.title.trim() === '') {
            errors.push({
                field: 'title',
                message: 'Title is required'
            });
        } else if (taskData.title.trim() === '' && taskData.title.length > 0) {
            errors.push({
                field: 'title',
                message: 'Title cannot be empty'
            });
        } else if (taskData.title.length > this.VALIDATION_RULES.title.maxLength) {
            errors.push({
                field: 'title',
                message: `Maximum title length reached (${this.VALIDATION_RULES.title.maxLength} characters)`
            });
        }
        
        // Description validation
        if (taskData.description && taskData.description.length > this.VALIDATION_RULES.description.maxLength) {
            errors.push({
                field: 'description',
                message: `Maximum description length reached (${this.VALIDATION_RULES.description.maxLength} characters)`
            });
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    static validateField(fieldName, value) {
        const errors = [];
        const rules = this.VALIDATION_RULES[fieldName];
        
        if (!rules) return { isValid: true, errors: [] };
        
        if (rules.required && (!value || value.trim() === '')) {
            errors.push({
                field: fieldName,
                message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
            });
        }
        
        if (rules.maxLength && value && value.length > rules.maxLength) {
            errors.push({
                field: fieldName,
                message: `Maximum length is ${rules.maxLength} characters`
            });
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

export default TaskValidator;
```

### Architecture References
- **Business Logic:** Validators (components.md section 2.2)
- **Validation Rules:** From data-architecture.md and STORY-002
- **Error Handling:** Error handling strategy (system-architecture.md section 9)

---

## Acceptance Criteria

- [ ] Title required validation implemented (AC1)
- [ ] Title length validation (max 200 chars) implemented (AC2)
- [ ] Description length validation (max 1000 chars) implemented (AC3)
- [ ] Whitespace-only title validation implemented (AC4)
- [ ] Validation returns structured error objects
- [ ] Both full-form and single-field validation supported

---

## Testing Requirements

### Unit Tests
- Test required field validation
- Test max length validation (title 200, description 1000)
- Test whitespace-only title rejection
- Test valid data passes validation
- Test empty description is allowed

---

## Dependencies
- None (independent validation logic)

---

## Definition of Done
- [ ] Validation logic implemented
- [ ] All validation rules working
- [ ] Unit tests passing (≥90% coverage)
- [ ] Code reviewed
