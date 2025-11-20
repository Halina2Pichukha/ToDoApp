# Technical Subtask: Write TaskManager Unit Tests

## Subtask Metadata
- **Subtask ID:** STORY-022-ST-001
- **Parent Story:** STORY-022 (Task CRUD Unit Tests)
- **Title:** Write Comprehensive Unit Tests for TaskManager
- **Complexity:** High
- **Estimated Effort:** 4 hours

---

## Description

Write comprehensive unit tests for all TaskManager CRUD operations, validation, and state management.

---

## Technical Requirements

### Test File
- Location: `tests/unit/business/TaskManager.test.js`

### Test Coverage
```javascript
describe('TaskManager', () => {
    describe('addTask', () => {
        test('should add valid task', async () => {});
        test('should generate unique ID', async () => {});
        test('should set createdAt timestamp', async () => {});
        test('should reject invalid title', async () => {});
        test('should trim whitespace', async () => {});
        test('should save to storage', async () => {});
        test('should notify subscribers', async () => {});
    });
    
    describe('updateTask', () => {
        test('should update existing task', async () => {});
        test('should update timestamp', async () => {});
        test('should validate updates', async () => {});
        test('should throw error for invalid ID', async () => {});
    });
    
    describe('deleteTask', () => {
        test('should delete task by ID', async () => {});
        test('should save after delete', async () => {});
        test('should throw error for invalid ID', async () => {});
    });
    
    describe('toggleTaskCompletion', () => {
        test('should toggle completed status', async () => {});
        test('should update timestamp', async () => {});
    });
    
    describe('observer pattern', () => {
        test('should subscribe to changes', () => {});
        test('should notify on changes', () => {});
        test('should unsubscribe', () => {});
    });
});
```

---

## Acceptance Criteria

- [ ] All TaskManager methods tested
- [ ] Edge cases covered
- [ ] Mock dependencies (StorageService)
- [ ] ≥90% code coverage for TaskManager
- [ ] All tests passing

---

## Dependencies
- STORY-021-ST-001 (Jest setup)
- STORY-003-ST-001 (TaskManager implementation)

---

## Definition of Done
- [ ] Tests written
- [ ] All tests passing
- [ ] Coverage ≥90%
- [ ] Code reviewed
