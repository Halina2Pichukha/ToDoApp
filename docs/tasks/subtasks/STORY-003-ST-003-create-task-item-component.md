# Technical Subtask: Create TaskItem Component

## Subtask Metadata
- **Subtask ID:** STORY-003-ST-003
- **Parent Story:** STORY-003 (Display Task List)
- **Title:** Create Reusable TaskItem Component
- **Complexity:** Low
- **Estimated Effort:** 2 hours

---

## Description

Create a reusable TaskItem component for rendering individual tasks with proper structure, styling, and accessibility.

---

## Technical Requirements

### Component Structure
- Location: `src/ui/components/TaskItem.js`
- Reusable component for task rendering

### Implementation Details
```javascript
class TaskItem {
    constructor(task) {
        this.task = task;
    }
    
    render() {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${this.task.completed ? 'completed' : ''}`;
        taskElement.dataset.taskId = this.task.id;
        
        taskElement.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox"
                ${this.task.completed ? 'checked' : ''}
                aria-label="Mark task as ${this.task.completed ? 'incomplete' : 'complete'}"
            />
            <div class="task-content">
                <h3 class="task-title">${this.escapeHtml(this.task.title)}</h3>
                ${this.task.description ? 
                    `<p class="task-description">${this.escapeHtml(this.task.description)}</p>` 
                    : ''}
                <span class="task-date" aria-label="Created on">
                    ${this.formatDate(this.task.createdAt)}
                </span>
            </div>
            <div class="task-actions">
                <button 
                    class="btn-icon btn-edit" 
                    data-action="edit"
                    aria-label="Edit task: ${this.escapeHtml(this.task.title)}"
                >
                    ✏️ Edit
                </button>
                <button 
                    class="btn-icon btn-delete" 
                    data-action="delete"
                    aria-label="Delete task: ${this.escapeHtml(this.task.title)}"
                >
                    🗑️ Delete
                </button>
            </div>
        `;
        
        return taskElement;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatDate(isoString) {
        const date = new Date(isoString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
}

export default TaskItem;
```

### Architecture References
- **Component Design:** TaskItemView (components.md section 4.4)
- **Security:** HTML escaping (security.md)
- **Accessibility:** ARIA labels (NFR-015)

---

## Acceptance Criteria

- [ ] TaskItem renders with all task data
- [ ] Checkbox shows completion status
- [ ] Edit and delete buttons present
- [ ] Proper ARIA labels for accessibility
- [ ] Date formatted in readable format
- [ ] HTML content escaped
- [ ] Completed tasks have visual distinction (strikethrough, opacity)

---

## Testing Requirements

### Unit Tests
- Test render with complete task
- Test render with incomplete task
- Test with/without description
- Test HTML escaping
- Test date formatting

---

## Dependencies
- None (independent component)

---

## Definition of Done
- [ ] TaskItem component implemented
- [ ] All task data displayed
- [ ] Accessibility features added
- [ ] Security implemented
- [ ] Unit tests passing
- [ ] Code reviewed
