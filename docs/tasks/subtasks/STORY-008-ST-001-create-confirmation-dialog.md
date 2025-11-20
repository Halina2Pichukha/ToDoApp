# Technical Subtask: Create Confirmation Dialog Component

## Subtask Metadata
- **Subtask ID:** STORY-008-ST-001
- **Parent Story:** STORY-008 (Delete Task Confirmation)
- **Title:** Create Reusable Confirmation Dialog
- **Complexity:** Medium
- **Estimated Effort:** 2 hours

---

## Description

Create a reusable confirmation dialog component for confirming destructive actions like task deletion.

---

## Technical Requirements

### Component Structure
- Location: `src/ui/components/ConfirmationDialog.js`

### Implementation
```javascript
class ConfirmationDialog {
    constructor(modalManager) {
        this.modalManager = modalManager;
    }
    
    show(title, message, options = {}) {
        return new Promise((resolve) => {
            const dialogHTML = `
                <div class="confirmation-dialog" role="alertdialog" aria-labelledby="dialog-title" aria-describedby="dialog-message">
                    <h2 id="dialog-title">${this.escapeHtml(title)}</h2>
                    <p id="dialog-message">${this.escapeHtml(message)}</p>
                    <div class="dialog-actions">
                        <button id="dialog-confirm" class="btn-danger" autofocus>
                            ${options.confirmText || 'Delete'}
                        </button>
                        <button id="dialog-cancel" class="btn-secondary">
                            ${options.cancelText || 'Cancel'}
                        </button>
                    </div>
                </div>
            `;
            
            this.modalManager.show(dialogHTML);
            
            const confirmBtn = document.getElementById('dialog-confirm');
            const cancelBtn = document.getElementById('dialog-cancel');
            
            const handleConfirm = () => {
                this.modalManager.hide();
                resolve(true);
                cleanup();
            };
            
            const handleCancel = () => {
                this.modalManager.hide();
                resolve(false);
                cleanup();
            };
            
            const cleanup = () => {
                confirmBtn.removeEventListener('click', handleConfirm);
                cancelBtn.removeEventListener('click', handleCancel);
            };
            
            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn.addEventListener('click', handleCancel);
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

export default ConfirmationDialog;
```

### Architecture References
- **Component:** ModalManager integration (components.md section 4.5)
- **Pattern:** Promise-based API for async confirmation
- **Accessibility:** ARIA alertdialog role

---

## Acceptance Criteria

- [ ] Dialog shows title and message
- [ ] Confirm and Cancel buttons present
- [ ] Returns promise that resolves to true/false
- [ ] Confirm button auto-focused
- [ ] ESC key cancels (via modal manager)
- [ ] Proper ARIA roles for accessibility
- [ ] Customizable button text

---

## Testing Requirements

### Unit Tests
- Test dialog shows correctly
- Test confirm returns true
- Test cancel returns false
- Test custom button text
- Test ARIA attributes

---

## Dependencies
- STORY-001-ST-002 (ModalManager)

---

## Definition of Done
- [ ] ConfirmationDialog implemented
- [ ] Promise-based API working
- [ ] Accessibility features added
- [ ] Tests passing
- [ ] Code reviewed
