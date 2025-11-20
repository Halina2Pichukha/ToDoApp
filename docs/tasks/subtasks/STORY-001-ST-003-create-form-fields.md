# Technical Subtask: Create Task Form Fields

## Subtask Metadata
- **Subtask ID:** STORY-001-ST-003
- **Parent Story:** STORY-001 (Create Task Form)
- **Title:** Create Task Form Fields (Title and Description)
- **Complexity:** Medium
- **Estimated Effort:** 2 hours

---

## Description

Implement the task form with title and description input fields, including character counters and proper field labeling as specified in STORY-001 AC3 and AC4.

---

## Technical Requirements

### Component Structure
- Create form view component
- Location: `src/ui/views/TaskFormView.js`
- Follow TaskFormView interface from `docs/architecture/components.md` section 4.3

### Implementation Details
```javascript
class TaskFormView {
    constructor(taskManager, containerElement) {
        this.taskManager = taskManager;
        this.container = containerElement;
        this.maxTitleLength = 200;
        this.maxDescriptionLength = 1000;
    }
    
    render(task = null) {
        const isEdit = task !== null;
        const formHTML = `
            <form id="task-form" class="task-form">
                <div class="form-group">
                    <label for="task-title">
                        Title <span class="required" aria-label="required">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="task-title" 
                        name="title"
                        class="form-control"
                        maxlength="${this.maxTitleLength}"
                        required
                        aria-required="true"
                        aria-describedby="title-counter title-error"
                        value="${task ? this.escapeHtml(task.title) : ''}"
                        autofocus
                    />
                    <div id="title-counter" class="character-counter" aria-live="polite">
                        0/${this.maxTitleLength}
                    </div>
                    <div id="title-error" class="error-message" role="alert"></div>
                </div>
                
                <div class="form-group">
                    <label for="task-description">Description</label>
                    <textarea 
                        id="task-description" 
                        name="description"
                        class="form-control"
                        rows="4"
                        maxlength="${this.maxDescriptionLength}"
                        aria-describedby="description-counter"
                    >${task ? this.escapeHtml(task.description) : ''}</textarea>
                    <div id="description-counter" class="character-counter" aria-live="polite">
                        0/${this.maxDescriptionLength}
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-primary">
                        ${isEdit ? 'Update' : 'Save'}
                    </button>
                    <button type="button" class="btn-secondary" id="cancel-btn">
                        Cancel
                    </button>
                </div>
            </form>
        `;
        
        this.container.innerHTML = formHTML;
        this.setupEventHandlers();
        this.initializeCounters();
        
        // Auto-focus title field (AC2)
        setTimeout(() => {
            document.getElementById('task-title').focus();
        }, 50);
    }
    
    setupEventHandlers() {
        const titleInput = document.getElementById('task-title');
        const descriptionInput = document.getElementById('task-description');
        
        titleInput.addEventListener('input', () => this.updateCounter('title'));
        descriptionInput.addEventListener('input', () => this.updateCounter('description'));
        
        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.handleCancel();
        });
    }
    
    initializeCounters() {
        this.updateCounter('title');
        this.updateCounter('description');
    }
    
    updateCounter(fieldName) {
        const input = document.getElementById(`task-${fieldName}`);
        const counter = document.getElementById(`${fieldName}-counter`);
        const maxLength = fieldName === 'title' ? this.maxTitleLength : this.maxDescriptionLength;
        
        const currentLength = input.value.length;
        counter.textContent = `${currentLength}/${maxLength}`;
        
        // Update counter color if approaching limit
        if (currentLength >= maxLength * 0.9) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    }
    
    handleCancel() {
        const event = new CustomEvent('form:cancel');
        window.dispatchEvent(event);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
```

### Architecture References
- **Component Design:** TaskFormView (components.md section 4.3)
- **Validation Rules:** Title max 200 chars, Description max 1000 chars (data-architecture.md)
- **Accessibility:** Proper labels and ARIA attributes (NFR-015)
- **Security:** HTML escaping for XSS prevention (security.md section 6.1)

---

## Acceptance Criteria

- [ ] Title input field rendered and marked as required
- [ ] Description textarea rendered (optional field)
- [ ] Save and Cancel buttons present
- [ ] Character counters display initial state (0/200, 0/1000)
- [ ] Character counters update in real-time as user types
- [ ] Title field auto-focused when form opens
- [ ] All fields have proper labels and ARIA attributes
- [ ] HTML escaping prevents XSS

---

## Testing Requirements

### Unit Tests
- Verify form renders with all fields
- Verify character counters update correctly
- Verify auto-focus on title field
- Verify HTML escaping works
- Test cancel button handler

### Accessibility Tests
- All form fields have labels
- Required fields marked with aria-required
- Character counters use aria-live for screen readers
- Keyboard navigation works

---

## Dependencies
- None (can be developed independently)

---

## Definition of Done
- [ ] Form fields implemented
- [ ] Character counters working
- [ ] Auto-focus implemented
- [ ] Accessibility attributes added
- [ ] Security (HTML escaping) implemented
- [ ] Unit tests passing
- [ ] Code reviewed
