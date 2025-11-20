# Technical Subtask: Write Validation Unit Tests

## Subtask Metadata
- **Subtask ID:** STORY-022-ST-002
- **Parent Story:** STORY-022 (Task CRUD Unit Tests)
- **Title:** Write Unit Tests for Task Validation
- **Complexity:** Medium
- **Estimated Effort:** 2 hours

---

## Description

Write unit tests for task validation logic covering all validation rules.

---

## Technical Requirements

### Test File
- Location: `tests/unit/business/TaskValidator.test.js`

### Test Coverage
```javascript
describe('TaskValidator', () => {
    describe('title validation', () => {
        test('should reject empty title', () => {});
        test('should reject whitespace-only title', () => {});
        test('should reject title > 200 chars', () => {});
        test('should accept valid title', () => {});
        test('should trim whitespace', () => {});
    });
    
    describe('description validation', () => {
        test('should accept empty description', () => {});
        test('should reject description > 1000 chars', () => {});
        test('should accept valid description', () => {});
    });
});
```

---

## Acceptance Criteria

- [ ] All validation rules tested
- [ ] Edge cases covered
- [ ] ≥95% coverage for validator

---

## Dependencies
- STORY-021-ST-001 (Jest setup)
- STORY-002-ST-001 (Validation logic)

---

## Definition of Done
- [ ] Tests written
- [ ] All passing
- [ ] High coverage
- [ ] Code reviewed
