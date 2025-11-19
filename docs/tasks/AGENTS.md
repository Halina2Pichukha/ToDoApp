# AI Agents Task Creation and Description Best Practices

This document provides guidelines and best practices for AI agents when creating and describing tasks, user stories, and requirements.

---

## 1. Task Creation Principles

### User Story Format
- Follow the standard format: **"As a [role], I want [feature/capability], so that [benefit/value]"**
- Ensure each story delivers clear user value
- Keep stories independent and testable

### Task Granularity
- Break down large features into manageable, deliverable increments
- Each task should be completable within a single sprint
- Avoid creating tasks that are too broad or too narrow

### Prioritization Criteria
- **Business Value**: Impact on user satisfaction and business goals
- **User Impact**: Number of users affected and frequency of use
- **Technical Complexity**: Effort, risk, and dependencies
- **Dependencies**: Identify and document blockers and prerequisites

---

## 2. Task Description Structure

### Title
- Clear, concise, and action-oriented
- Start with a verb (e.g., "Implement", "Create", "Fix", "Update")
- Include the key feature or component being addressed

### Description
A well-structured description should include:

1. **Context/Background**
   - Why this task is needed
   - Related business goals or user needs
   - Links to relevant documentation or previous discussions

2. **Objective**
   - What needs to be accomplished
   - Expected outcome or deliverable
   - Success criteria

3. **Scope**
   - What is included in this task
   - What is explicitly out of scope
   - Boundaries and constraints

4. **Technical Considerations** (if applicable)
   - Architectural decisions
   - Technology stack or tools
   - Performance requirements
   - Security considerations

---

## 3. Acceptance Criteria

### SMART Criteria
- **Specific**: Clearly defined outcomes
- **Measurable**: Quantifiable success metrics
- **Achievable**: Realistic within constraints
- **Relevant**: Aligned with objectives
- **Time-bound**: Clear deadlines or sprint goals

### Format
Use a checklist format for clarity:
- [ ] Criterion 1: Specific condition to be met
- [ ] Criterion 2: Expected behavior or output
- [ ] Criterion 3: Quality or performance threshold

### Examples of Good Acceptance Criteria
- User can successfully log in with valid credentials
- System responds within 2 seconds under normal load
- All unit tests pass with 90%+ code coverage
- UI matches approved design mockups
- Feature works on Chrome, Firefox, Safari, and Edge browsers

---

## 4. Dependencies and Relationships

### Document Dependencies
- **Blocked by**: Tasks that must be completed first
- **Blocks**: Tasks that depend on this task
- **Related to**: Tasks with conceptual or technical connections

### Cross-functional Coordination
- Tag relevant team members (developers, designers, QA)
- Link to design files, API documentation, or architecture diagrams
- Note required approvals or reviews

---

## 5. Estimation and Effort

### Story Points or Time Estimates
- Use team-agreed estimation methods (Fibonacci, T-shirt sizes, hours)
- Include development, testing, and review time
- Account for uncertainty and risk

### Complexity Assessment
- **Low**: Well-understood, minimal dependencies, straightforward implementation
- **Medium**: Some unknowns, moderate dependencies, requires design decisions
- **High**: Significant unknowns, multiple dependencies, architectural impact

---

## 6. Labels and Categorization

### Recommended Labels
- **Type**: feature, bug, enhancement, technical-debt, documentation
- **Priority**: critical, high, medium, low
- **Component**: frontend, backend, database, API, infrastructure
- **Status**: backlog, ready, in-progress, in-review, done

### Use Labels Consistently
- Align labels with team workflow and tooling
- Ensure labels are meaningful and actionable

---

## 7. Quality Checklist for Task Creation

Before finalizing a task, verify:
- [ ] User value is clearly articulated
- [ ] Title is descriptive and action-oriented
- [ ] Description provides sufficient context
- [ ] Acceptance criteria are specific and testable
- [ ] Dependencies are identified and documented
- [ ] Priority and labels are assigned
- [ ] Estimation reflects realistic effort
- [ ] Task is properly linked to epics or milestones

---

## 8. Collaboration and Communication

### Engage Stakeholders Early
- Share drafts for feedback before finalizing
- Clarify ambiguities through discussion
- Ensure alignment with product vision and roadmap

### Document Decisions
- Capture rationale for scope, approach, and priorities
- Update tasks as new information emerges
- Use comments to track discussion and resolutions

### Maintain Transparency
- Keep tasks visible to all relevant team members
- Update status regularly
- Communicate blockers or changes promptly

---

## 9. Continuous Improvement

### Retrospective Reviews
- Evaluate task quality and clarity after sprints
- Identify patterns in unclear or poorly scoped tasks
- Refine templates and processes based on feedback

### Learn from Examples
- Reference well-written tasks as templates
- Share best practices across teams
- Encourage peer review of task descriptions

---

## Summary

Effective task creation and description is critical to team productivity, clarity, and alignment. By following these best practices, AI agents can produce high-quality, actionable tasks that enable teams to deliver value efficiently and collaboratively.

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-18 13:45:18  
**Maintained By**: PO AI Agent Team