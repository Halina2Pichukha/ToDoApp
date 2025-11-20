# Technical Subtask: Create Task Form Modal Component

## Subtask Metadata
- **Subtask ID:** STORY-001-ST-002
- **Parent Story:** STORY-001 (Create Task Form)
- **Title:** Create Task Form Modal Component
- **Complexity:** Medium
- **Estimated Effort:** 3 hours

---

## Description

Implement a modal component that displays the task creation form when the "Add Task" button is clicked, as specified in STORY-001 AC2.

---

## Technical Requirements

### Component Structure
- Create modal manager component
- Location: `src/ui/components/ModalManager.js`
- Follow ModalManager interface from `docs/architecture/components.md` section 4.5

### Implementation Details
```javascript
class ModalManager {
    constructor() {
        this.activeModal = null;
    }
    
    show(content, options = {}) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        
        // Create modal content container
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = content;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Handle ESC key to close
        this.setupKeyHandlers(overlay);
        
        // Trap focus within modal
        this.trapFocus(modal);
        
        this.activeModal = overlay;
        
        // Display within 100ms requirement (AC2)
        requestAnimationFrame(() => {
            overlay.classList.add('modal-visible');
        });
    }
    
    hide() {
        if (this.activeModal) {
            this.activeModal.remove();
            this.activeModal = null;
        }
    }
    
    setupKeyHandlers(overlay) {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        };
        overlay.addEventListener('keydown', handleEscape);
    }
    
    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (firstElement) {
            firstElement.focus();
        }
        
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
    }
}
```

### Architecture References
- **Component Design:** ModalManager (components.md section 4.5)
- **Accessibility:** Focus trapping and ARIA (security.md, NFR-015)
- **Performance:** Display within 100ms (NFR-009)

---

## Acceptance Criteria

- [ ] Modal appears when triggered
- [ ] Modal displays within 100ms (STORY-001 AC2)
- [ ] Modal has proper ARIA attributes (role="dialog", aria-modal="true")
- [ ] Focus is trapped within modal
- [ ] ESC key closes modal
- [ ] Clicking outside modal closes it (optional but recommended)
- [ ] Modal overlay prevents interaction with background content

---

## Testing Requirements

### Unit Tests
- Verify modal shows and hides correctly
- Verify ARIA attributes are set
- Verify ESC key handling
- Performance test: modal display < 100ms

### Accessibility Tests
- Focus trap works correctly
- Screen reader announces modal properly
- Keyboard navigation works

---

## Dependencies
- STORY-001-ST-001 (Add Task Button) - to trigger modal

---

## Definition of Done
- [ ] ModalManager implemented
- [ ] Show/hide functionality works
- [ ] Performance requirement met (<100ms)
- [ ] Accessibility features implemented
- [ ] Unit tests passing
- [ ] Code reviewed
