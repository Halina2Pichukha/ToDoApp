# ToDoApp - Diagrams

This directory contains visual diagrams that illustrate the relationships, dependencies, and structure of epics and user stories for the ToDoApp MVP.

**Document Version:** 1.0  
**Last Updated:** 2025-11-18  
**Status:** Active

---

## Diagram Index

1. [Epic Dependencies](#epic-dependencies) - Shows relationships between epics
2. [Story Flow Diagram](#story-flow-diagram) - Shows story dependencies and implementation order
3. [Requirements Traceability](#requirements-traceability) - Maps requirements to stories
4. [MVP Timeline](#mvp-timeline) - Shows phase distribution and timeline
5. [Priority Matrix](#priority-matrix) - Shows story prioritization
6. [Architecture Overview](#architecture-overview) - High-level system architecture
7. [Story Dependency Graph](#story-dependency-graph-detailed) - Complete dependency mapping

---

## Epic Dependencies

This diagram shows how the 5 epics relate to each other and their dependencies.

```mermaid
graph TB
    subgraph "Phase 1: Foundation (Week 1-2)"
        E3[EPIC-003<br/>Data Persistence<br/>4 stories, 15-20 pts]
        E1_P1[EPIC-001 Part 1<br/>Task CRUD Foundation<br/>Create, Display, Persist]
    end
    
    subgraph "Phase 2: Core Features (Week 3-4)"
        E1_P2[EPIC-001 Part 2<br/>Task CRUD Complete<br/>Edit, Delete, Toggle]
        E2_P2[EPIC-002 Part 2<br/>UI Components<br/>Visual Design]
    end
    
    subgraph "Phase 3: Polish (Week 5-6)"
        E2_P3[EPIC-002 Part 3<br/>UI Polish<br/>Accessibility]
        E5[EPIC-005<br/>Non-Functional<br/>3 stories, 15-20 pts]
    end
    
    subgraph "Cross-Cutting (All Phases)"
        E4[EPIC-004<br/>QA & Testing<br/>6 stories, 25-30 pts]
    end
    
    E3 -->|Enables| E1_P1
    E1_P1 -->|Foundation for| E1_P2
    E1_P1 -->|Needs styling| E2_P2
    E1_P2 -->|Complete for| E2_P3
    E2_P2 -->|Ready for| E2_P3
    E2_P3 -->|Validated by| E5
    E4 -.->|Tests| E1_P1
    E4 -.->|Tests| E1_P2
    E4 -.->|Tests| E2_P2
    E4 -.->|Validates| E5
    
    style E3 fill:#e1f5ff
    style E1_P1 fill:#e1f5ff
    style E1_P2 fill:#fff4e1
    style E2_P2 fill:#fff4e1
    style E2_P3 fill:#f0ffe1
    style E5 fill:#f0ffe1
    style E4 fill:#ffe1f5
```

### Epic Relationships

- **EPIC-003 (Data Persistence)** is the foundation - must be implemented first
- **EPIC-001 (Task CRUD)** depends on EPIC-003 for data storage
- **EPIC-002 (UI/Design)** builds on EPIC-001 functionality
- **EPIC-004 (Testing)** is cross-cutting and validates all other epics
- **EPIC-005 (NFRs)** validates the complete system in Phase 3

---

## Story Flow Diagram

This diagram shows the recommended implementation order for stories within Phase 1 (Foundation).

```mermaid
graph LR
    subgraph "Data Persistence Layer"
        S17[S-017<br/>Initialize Storage<br/>2 pts]
        S18[S-018<br/>Save Data<br/>2 pts]
        S19[S-019<br/>Load Data<br/>2 pts]
        S20[S-020<br/>Handle Errors<br/>2 pts]
    end
    
    subgraph "Task Creation"
        S1[S-001<br/>Create Form<br/>5 pts]
        S2[S-002<br/>Validation<br/>3 pts]
        S10[S-010<br/>Persistence<br/>5 pts]
    end
    
    subgraph "Task Display"
        S3[S-003<br/>Display List<br/>3 pts]
        S4[S-004<br/>Empty State<br/>2 pts]
    end
    
    subgraph "UI Foundation"
        S11[S-011<br/>Responsive Layout<br/>5 pts]
    end
    
    subgraph "Testing"
        S21[S-021<br/>Test Framework<br/>3 pts]
    end
    
    S17 --> S18
    S17 --> S19
    S18 --> S20
    S19 --> S20
    
    S17 --> S10
    S1 --> S2
    S2 --> S10
    S10 --> S3
    S3 --> S4
    
    S11 -.->|Styles| S1
    S11 -.->|Styles| S3
    
    S21 -.->|Parallel| S1
    
    style S17 fill:#e1f5ff,stroke:#0066cc,stroke-width:2px
    style S18 fill:#e1f5ff
    style S19 fill:#e1f5ff
    style S20 fill:#e1f5ff
    style S1 fill:#ffe1e1
    style S2 fill:#ffe1e1
    style S10 fill:#ffe1e1
    style S3 fill:#e1ffe1
    style S4 fill:#e1ffe1
    style S11 fill:#fff4e1
    style S21 fill:#f0e1ff
```

### Implementation Order (Phase 1)

**Week 1:**
1. S-017: Initialize localStorage (foundation)
2. S-018, S-019: Save/Load operations
3. S-021: Test framework setup (parallel)
4. S-011: Responsive layout foundation
5. S-001: Create task form

**Week 2:**
6. S-002: Input validation
7. S-010: Task data persistence integration
8. S-003: Display task list
9. S-004: Empty state handling
10. S-020: Storage error handling

---

## Requirements Traceability

This diagram shows how Functional Requirements map to User Stories and detailed Stories.

```mermaid
graph LR
    subgraph "Functional Requirements"
        FR1[FR-001<br/>Create Tasks]
        FR2[FR-002<br/>View Tasks]
        FR3[FR-003<br/>Update Tasks]
        FR4[FR-004<br/>Delete Tasks]
        FR5[FR-005<br/>Mark Complete]
    end
    
    subgraph "Original User Stories"
        US1[US-001<br/>Create Tasks]
        US2[US-002<br/>View Tasks]
        US3[US-003<br/>Update Tasks]
        US4[US-004<br/>Delete Tasks]
        US5[US-005<br/>Mark Complete]
    end
    
    subgraph "Detailed Stories"
        S1[S-001, S-002<br/>S-010]
        S2[S-003, S-004<br/>S-010]
        S3[S-006, S-007<br/>S-010]
        S4[S-008, S-009<br/>S-010]
        S5[S-005<br/>S-010]
    end
    
    FR1 --> US1
    FR2 --> US2
    FR3 --> US3
    FR4 --> US4
    FR5 --> US5
    
    US1 --> S1
    US2 --> S2
    US3 --> S3
    US4 --> S4
    US5 --> S5
    
    style FR1 fill:#e1f5ff
    style FR2 fill:#e1f5ff
    style FR3 fill:#e1f5ff
    style FR4 fill:#e1f5ff
    style FR5 fill:#e1f5ff
    style US1 fill:#fff4e1
    style US2 fill:#fff4e1
    style US3 fill:#fff4e1
    style US4 fill:#fff4e1
    style US5 fill:#fff4e1
    style S1 fill:#e1ffe1
    style S2 fill:#e1ffe1
    style S3 fill:#e1ffe1
    style S4 fill:#e1ffe1
    style S5 fill:#e1ffe1
```

### Coverage Summary

- **5 Functional Requirements** → **5 Original User Stories** → **23+ Detailed Stories**
- **Expansion Ratio:** 5.8x (from 5 to 29 stories)
- **100% FR Coverage:** All functional requirements mapped to stories

---

## MVP Timeline

This Gantt-style diagram shows the distribution of stories across the 3 MVP phases.

```mermaid
gantt
    title ToDoApp MVP Timeline (6 Weeks)
    dateFormat YYYY-MM-DD
    section Phase 1: Foundation
    Data Persistence (S-017 to S-020)     :p1_dp, 2025-11-18, 3d
    Test Framework (S-021)                :p1_tf, 2025-11-18, 2d
    Responsive Layout (S-011)             :p1_ui, 2025-11-20, 3d
    Create Task (S-001, S-002, S-010)     :p1_cr, 2025-11-21, 4d
    Display Tasks (S-003, S-004)          :p1_ds, 2025-11-25, 3d
    
    section Phase 2: Core Features
    Toggle Complete (S-005)               :p2_tg, 2025-12-02, 2d
    Edit Tasks (S-006, S-007)             :p2_ed, 2025-12-02, 4d
    Delete Tasks (S-008, S-009)           :p2_dl, 2025-12-06, 3d
    UI Components (S-012, S-013, S-014)   :p2_ui, 2025-12-04, 5d
    CRUD Tests (S-022)                    :p2_ts, 2025-12-09, 3d
    
    section Phase 3: Polish
    Accessibility (S-015)                 :p3_a11y, 2025-12-16, 3d
    Mobile Touch (S-016)                  :p3_mob, 2025-12-19, 2d
    Integration Tests (S-023)             :p3_int, 2025-12-16, 3d
    Performance (S-027)                   :p3_prf, 2025-12-23, 3d
    Browser Testing (S-028)               :p3_bro, 2025-12-23, 2d
    Code Quality (S-029)                  :p3_cod, 2025-12-26, 2d
```

### Phase Breakdown

| Phase | Duration | Stories | Story Points | Focus |
|-------|----------|---------|--------------|-------|
| Phase 1 | Week 1-2 | 10 stories | ~35 points | Foundation: CRUD core, persistence, basic UI |
| Phase 2 | Week 3-4 | 9 stories | ~35 points | Core Features: Complete CRUD, UI polish, testing |
| Phase 3 | Week 5-6 | 10 stories | ~30 points | Polish: Accessibility, performance, validation |
| **Total** | **6 weeks** | **29 stories** | **~100 points** | **Complete MVP** |

---

## Priority Matrix

This diagram shows story prioritization based on Business Value vs Technical Complexity.

```mermaid
quadrantChart
    title Story Priority Matrix
    x-axis Low Technical Complexity --> High Technical Complexity
    y-axis Low Business Value --> High Business Value
    quadrant-1 High Value, High Complexity (Plan Carefully)
    quadrant-2 High Value, Low Complexity (Do First!)
    quadrant-3 Low Value, Low Complexity (Quick Wins)
    quadrant-4 Low Value, High Complexity (Reconsider)
    
    S-017 Initialize Storage: [0.2, 0.9]
    S-001 Create Form: [0.5, 0.95]
    S-003 Display List: [0.3, 0.9]
    S-005 Toggle Complete: [0.3, 0.85]
    S-010 Persistence: [0.6, 0.95]
    S-011 Responsive Layout: [0.5, 0.8]
    S-002 Validation: [0.4, 0.75]
    S-006 Edit Form: [0.5, 0.7]
    S-007 Update Details: [0.4, 0.7]
    S-008 Delete Confirm: [0.2, 0.65]
    S-009 Delete Permanent: [0.3, 0.65]
    S-004 Empty State: [0.2, 0.5]
    S-015 Accessibility: [0.7, 0.85]
    S-022 Unit Tests: [0.8, 0.8]
    S-012 Visual Design: [0.5, 0.7]
    S-016 Mobile Touch: [0.4, 0.6]
    S-020 Error Handling: [0.3, 0.7]
```

### Priority Quadrants

**Quadrant 2 (High Value, Low Complexity) - Do First:**
- S-017: Initialize Storage
- S-003: Display List
- S-005: Toggle Complete
- S-004: Empty State
- S-008: Delete Confirm

**Quadrant 1 (High Value, High Complexity) - Plan Carefully:**
- S-001: Create Form
- S-010: Persistence Integration
- S-015: Accessibility Compliance
- S-022: Unit Tests

**Quadrant 3 (Low Value, Low Complexity) - Quick Wins:**
- S-002: Validation
- S-016: Mobile Touch
- S-020: Error Handling

**Quadrant 4 (Low Value, High Complexity) - None:**
- All stories provide sufficient value to justify complexity

---

## Architecture Overview

This diagram shows the high-level architecture of the ToDoApp MVP.

```mermaid
graph TB
    subgraph "User Interface Layer (EPIC-002)"
        UI[Web UI<br/>HTML/CSS/JS]
        FORM[Task Forms<br/>Create/Edit]
        LIST[Task List<br/>Display/Toggle]
        FEEDBACK[Visual Feedback<br/>Toast/Errors]
    end
    
    subgraph "Business Logic Layer (EPIC-001)"
        CRUD[Task CRUD Operations<br/>Create, Read, Update, Delete]
        VALID[Validation Logic<br/>Input validation]
        STATE[State Management<br/>Task array in memory]
    end
    
    subgraph "Data Persistence Layer (EPIC-003)"
        STORAGE[Storage Service<br/>localStorage API]
        SERIAL[Serialization<br/>JSON parse/stringify]
        ERROR[Error Handling<br/>Quota, Parse errors]
    end
    
    subgraph "Browser APIs"
        LOCAL[localStorage<br/>5-10MB limit]
    end
    
    subgraph "Testing Layer (EPIC-004)"
        UNIT[Unit Tests<br/>Jest/Mocha]
        INTEG[Integration Tests<br/>CRUD flows]
        E2E[E2E Tests<br/>User journeys]
    end
    
    UI --> FORM
    UI --> LIST
    UI --> FEEDBACK
    
    FORM --> CRUD
    LIST --> CRUD
    
    CRUD --> VALID
    CRUD --> STATE
    STATE --> STORAGE
    
    STORAGE --> SERIAL
    STORAGE --> ERROR
    SERIAL --> LOCAL
    
    UNIT -.->|Tests| CRUD
    UNIT -.->|Tests| VALID
    INTEG -.->|Tests| STATE
    INTEG -.->|Tests| STORAGE
    E2E -.->|Tests| UI
    
    style UI fill:#e1f5ff
    style FORM fill:#e1f5ff
    style LIST fill:#e1f5ff
    style FEEDBACK fill:#e1f5ff
    style CRUD fill:#fff4e1
    style VALID fill:#fff4e1
    style STATE fill:#fff4e1
    style STORAGE fill:#ffe1e1
    style SERIAL fill:#ffe1e1
    style ERROR fill:#ffe1e1
    style LOCAL fill:#f0f0f0
    style UNIT fill:#f0e1ff
    style INTEG fill:#f0e1ff
    style E2E fill:#f0e1ff
```

### Layer Responsibilities

**User Interface Layer (EPIC-002):**
- Handles all user interactions
- Renders task lists and forms
- Displays visual feedback
- Implements responsive design and accessibility

**Business Logic Layer (EPIC-001):**
- Manages task CRUD operations
- Validates user input
- Maintains application state
- Enforces business rules

**Data Persistence Layer (EPIC-003):**
- Provides storage abstraction
- Handles serialization/deserialization
- Manages storage errors
- Ensures data integrity

**Testing Layer (EPIC-004):**
- Validates all layers
- Ensures code coverage ≥80%
- Catches regressions
- Validates user journeys

---

## Story Dependency Graph (Detailed)

This comprehensive diagram shows all story dependencies across all epics.

```mermaid
graph TB
    subgraph "EPIC-003: Data Persistence"
        S17[S-017<br/>Init Storage]
        S18[S-018<br/>Save Data]
        S19[S-019<br/>Load Data]
        S20[S-020<br/>Errors]
    end
    
    subgraph "EPIC-001: Task CRUD"
        S1[S-001<br/>Create Form]
        S2[S-002<br/>Validation]
        S3[S-003<br/>Display List]
        S4[S-004<br/>Empty State]
        S5[S-005<br/>Toggle]
        S6[S-006<br/>Edit Form]
        S7[S-007<br/>Update]
        S8[S-008<br/>Delete Confirm]
        S9[S-009<br/>Delete]
        S10[S-010<br/>Persistence]
    end
    
    subgraph "EPIC-002: UI/Design"
        S11[S-011<br/>Responsive]
        S12[S-012<br/>Visual Design]
        S13[S-013<br/>Form UI]
        S14[S-014<br/>Feedback]
        S15[S-015<br/>A11y]
        S16[S-016<br/>Mobile]
    end
    
    subgraph "EPIC-004: Testing"
        S21[S-021<br/>Framework]
        S22[S-022<br/>Unit Tests]
        S23[S-023<br/>Integration]
    end
    
    S17 --> S18
    S17 --> S19
    S18 --> S20
    S19 --> S20
    S17 --> S10
    
    S1 --> S2
    S2 --> S10
    S10 --> S3
    S3 --> S4
    S3 --> S5
    S1 --> S6
    S3 --> S6
    S6 --> S7
    S3 --> S8
    S8 --> S9
    
    S11 --> S12
    S11 --> S13
    S12 --> S14
    S13 --> S14
    S14 --> S15
    S12 --> S16
    
    S21 --> S22
    S21 --> S23
    S10 --> S22
    S10 --> S23
    
    S1 -.->|Uses| S11
    S3 -.->|Uses| S11
    S1 -.->|Uses| S13
    S6 -.->|Uses| S13
    
    style S17 fill:#e1f5ff,stroke:#0066cc,stroke-width:3px
    style S18 fill:#e1f5ff
    style S19 fill:#e1f5ff
    style S20 fill:#e1f5ff
    style S1 fill:#ffe1e1
    style S2 fill:#ffe1e1
    style S3 fill:#ffe1e1
    style S4 fill:#ffe1e1
    style S5 fill:#ffe1e1
    style S6 fill:#ffe1e1
    style S7 fill:#ffe1e1
    style S8 fill:#ffe1e1
    style S9 fill:#ffe1e1
    style S10 fill:#ffe1e1,stroke:#cc0000,stroke-width:2px
    style S11 fill:#fff4e1
    style S12 fill:#fff4e1
    style S13 fill:#fff4e1
    style S14 fill:#fff4e1
    style S15 fill:#fff4e1
    style S16 fill:#fff4e1
    style S21 fill:#f0e1ff
    style S22 fill:#f0e1ff
    style S23 fill:#f0e1ff
```

### Critical Path

The critical path through the dependencies is:
**S-017 → S-018/S-019 → S-010 → S-003 → S-005/S-006/S-008**

This path represents the minimum set of stories needed to have a working task management application:
1. Initialize storage (S-017)
2. Implement save/load (S-018, S-019)
3. Integrate persistence (S-010)
4. Display tasks (S-003)
5. Enable core operations (S-005, S-006, S-008)

---

## How to Use These Diagrams

### For Product Owners
- Use **Epic Dependencies** to understand epic relationships
- Use **MVP Timeline** for sprint planning and stakeholder communication
- Use **Priority Matrix** to make scope decisions

### For Developers
- Use **Story Flow** to understand implementation order
- Use **Architecture Overview** to understand system structure
- Use **Story Dependency Graph** to identify blockers

### For QA Team
- Use **Story Flow** to plan test development
- Use **Architecture Overview** to understand test layers
- Use **Requirements Traceability** to ensure test coverage

### For Stakeholders
- Use **MVP Timeline** to track progress
- Use **Priority Matrix** to understand prioritization
- Use **Requirements Traceability** to validate scope

---

## Related Documentation

- [Main Task Documentation](../README.md)
- [Business Requirements Document](../../requirements/business-requirements-document.md)
- [MVP Scope](../../requirements/mvp-scope.md)

---

**Last Updated:** 2025-11-18  
**Maintained By:** Product Owner Team
