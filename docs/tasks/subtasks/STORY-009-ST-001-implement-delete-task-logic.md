# Technical Subtask: Implement Delete Task Logic

## Subtask Metadata
- **Subtask ID:** STORY-009-ST-001
- **Parent Story:** STORY-009 (Remove Task Permanently)
- **Title:** Implement Delete Task in TaskManager
- **Complexity:** Low
- **Estimated Effort:** 1 hour

---

## Description

Add delete functionality to TaskManager to permanently remove tasks from the task array and storage.

---

## Technical Requirements

### Update TaskManager
- Location: `src/business/TaskManager.js`

### Implementation
```javascript
async deleteTask(id) {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        throw new Error('Task not found');
    }
    
    // Remove task from array
    const deletedTask = this.tasks.splice(taskIndex, 1)[0];
    
    // Persist changes
    await this.storageService.saveTasks(this.tasks);
    
    // Notify subscribers
    this.notifySubscribers();
    
    return deletedTask;
}
```

### Architecture References
- **Business Logic:** TaskManager CRUD (components.md section 2.1)
- **Data Persistence:** Storage integration

---

## Acceptance Criteria

- [ ] Delete method removes task from array
- [ ] Persists changes to storage
- [ ] Notifies subscribers
- [ ] Returns deleted task
- [ ] Throws error if task not found

---

## Testing Requirements

### Unit Tests
- Test successful deletion
- Test task removed from array
- Test storage save called
- Test subscribers notified
- Test error on invalid ID
- Test deleted task returned

---

## Dependencies
- STORY-003-ST-001 (TaskManager)
- STORY-010-ST-001 (StorageService)

---

## Definition of Done
- [ ] Delete method implemented
- [ ] Unit tests passing
- [ ] Code reviewed
