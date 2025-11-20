# Technical Subtask: Implement Toggle Completion Logic

## Subtask Metadata
- **Subtask ID:** STORY-005-ST-001
- **Parent Story:** STORY-005 (Toggle Task Completion)
- **Title:** Implement Toggle Completion in TaskManager
- **Complexity:** Low
- **Estimated Effort:** 1 hour

---

## Description

Add toggle completion functionality to TaskManager to change task completed status and persist the change.

---

## Technical Requirements

### Update TaskManager
- Location: `src/business/TaskManager.js`

### Implementation
```javascript
async toggleTaskCompletion(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
        throw new Error('Task not found');
    }
    
    task.completed = !task.completed;
    task.updatedAt = new Date().toISOString();
    
    await this.storageService.saveTasks(this.tasks);
    this.notifySubscribers();
    
    return task;
}
```

### Architecture References
- **Business Logic:** TaskManager operations (components.md section 2.1)
- **Data Model:** Task structure (data-architecture.md)

---

## Acceptance Criteria

- [ ] Toggle method toggles completed boolean
- [ ] Updates updatedAt timestamp
- [ ] Persists change to storage
- [ ] Notifies subscribers
- [ ] Returns updated task
- [ ] Throws error if task not found

---

## Testing Requirements

### Unit Tests
- Test toggling incomplete to complete
- Test toggling complete to incomplete
- Test timestamp update
- Test storage save called
- Test subscribers notified
- Test error on invalid ID

---

## Dependencies
- STORY-003-ST-001 (TaskManager)
- STORY-010-ST-001 (StorageService)

---

## Definition of Done
- [ ] Toggle method implemented
- [ ] Unit tests passing
- [ ] Code reviewed
