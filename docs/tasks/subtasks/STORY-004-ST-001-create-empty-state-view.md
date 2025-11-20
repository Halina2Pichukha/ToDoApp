# Technical Subtask: Create EmptyStateView Component

## Subtask Metadata
- **Subtask ID:** STORY-004-ST-001
- **Parent Story:** STORY-004 (Empty State Handling)
- **Title:** Create EmptyStateView Component
- **Complexity:** Low
- **Estimated Effort:** 1 hour

---

## Description

Implement an EmptyStateView component that displays a helpful message when no tasks exist, guiding users to create their first task.

---

## Technical Requirements

### Component Structure
- Location: `src/ui/components/EmptyStateView.js`

### Implementation
```javascript
class EmptyStateView {
    render(container) {
        container.innerHTML = `
            <div class="empty-state" role="status">
                <div class="empty-state-icon" aria-hidden="true">📝</div>
                <h2 class="empty-state-title">No tasks yet</h2>
                <p class="empty-state-message">
                    Create your first task to get started!
                </p>
                <button id="empty-state-add-btn" class="btn-primary">
                    + Add Your First Task
                </button>
            </div>
        `;
        
        document.getElementById('empty-state-add-btn').addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('show-task-form'));
        });
    }
}
```

### Architecture References
- **UI Layer:** EmptyStateView (components.md)
- **UX:** Empty state best practices (STORY-004)

---

## Acceptance Criteria

- [ ] Empty state displayed when task array is empty
- [ ] Friendly, encouraging message shown
- [ ] "Add Task" button visible in empty state
- [ ] Clicking button opens task form
- [ ] Proper ARIA role for accessibility

---

## Testing Requirements

### Unit Tests
- Test empty state renders
- Test button click triggers event

---

## Dependencies
- None

---

## Definition of Done
- [ ] Component implemented
- [ ] Integrated with TaskListView
- [ ] Tests passing
- [ ] Code reviewed
