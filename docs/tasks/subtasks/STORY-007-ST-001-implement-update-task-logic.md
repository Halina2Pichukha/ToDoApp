# Technical Subtask: Implement Update Task Logic

## Subtask Metadata
- **Subtask ID:** STORY-007-ST-001
- **Parent Story:** STORY-007 (Update Task Details)
- **Title:** Implement Update Task in TaskManager
- **Complexity:** Medium
- **Estimated Effort:** 2 hours

---

## Description

Add update functionality to TaskManager to modify existing task properties and persist changes.

---

## Technical Requirements

### Update TaskManager
- Location: `src/business/TaskManager.js`

### Implementation
```javascript
async updateTask(id, updates) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
        throw new Error('Task not found');
    }
    
    // Validate updates
    const errors = this.validateTask({
        title: updates.title !== undefined ? updates.title : task.title,
        description: updates.description !== undefined ? updates.description : task.description
    });
    
    if (errors.length > 0) {
        throw new ValidationError(errors);
    }
    
    // Apply updates
    if (updates.title !== undefined) {
        task.title = updates.title.trim();
    }
    if (updates.description !== undefined) {
        task.description = updates.description.trim();
    }
    
    task.updatedAt = new Date().toISOString();
    
    // Persist changes
    await this.storageService.saveTasks(this.tasks);
    
    // Notify subscribers
    this.notifySubscribers();
    
    return task;
}
```

### Architecture References
- **Business Logic:** TaskManager (components.md section 2.1)
- **Validation:** Reuse validation from STORY-002
- **Data Flow:** Update flow (system-architecture.md)

---

## Acceptance Criteria

- [ ] Update method accepts task ID and updates object
- [ ] Validates updated data before saving
- [ ] Updates only provided fields
- [ ] Updates updatedAt timestamp
- [ ] Persists changes to storage
- [ ] Notifies subscribers
- [ ] Throws error if task not found
- [ ] Throws ValidationError if data invalid

---

## Testing Requirements

### Unit Tests
- Test successful task update
- Test partial updates (title only, description only)
- Test validation on update
- Test updatedAt timestamp changes
- Test error on invalid ID
- Test storage persistence
- Test subscriber notification

---

## Dependencies
- STORY-003-ST-001 (TaskManager base)
- STORY-002-ST-001 (Validation)

---

## Definition of Done
- [ ] Update method implemented
- [ ] Validation integrated
- [ ] Unit tests passing (≥90% coverage)
- [ ] Code reviewed
