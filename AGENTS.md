# AGENTS.md

## AI Agent Collaboration Guidelines

This document outlines the guidelines and best practices for AI agents collaborating on the ToDoApp project.

## Purpose

This file serves as a guide for AI-powered development tools and agents working on this repository. It ensures consistent code quality, maintainable architecture, and adherence to project standards.

## Project Overview

ToDoApp is a Java-based task management application following industry best practices for:
- Clean code architecture
- Test-driven development
- Comprehensive documentation
- Version control best practices

## Development Guidelines for AI Agents

### Code Standards

1. **Java Version**: Target Java 11 or higher
2. **Coding Style**: Follow Oracle's Java Code Conventions
3. **Naming Conventions**:
   - Classes: PascalCase (e.g., `TaskManager`)
   - Methods: camelCase (e.g., `addTask()`)
   - Constants: UPPER_SNAKE_CASE (e.g., `MAX_TASKS`)
   - Packages: lowercase (e.g., `com.todoapp.service`)

### Architecture Principles

1. **Separation of Concerns**: Keep business logic, data access, and presentation layers separate
2. **SOLID Principles**: Adhere to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion
3. **Design Patterns**: Use appropriate patterns (Factory, Strategy, Observer, etc.) where beneficial
4. **Dependency Management**: Minimize coupling and maximize cohesion

### Testing Requirements

1. **Unit Tests**: Write tests for all business logic using JUnit 5
2. **Test Coverage**: Aim for at least 80% code coverage
3. **Test Naming**: Use descriptive names (e.g., `shouldAddTaskWhenValidInput()`)
4. **Integration Tests**: Include tests for component interactions
5. **Test Organization**: Mirror the source code structure in the tests directory

### Documentation Standards

1. **JavaDoc**: Document all public classes, methods, and interfaces
2. **Comments**: Use inline comments sparingly and only for complex logic
3. **README Updates**: Keep the README.md current with feature changes
4. **Code Examples**: Provide usage examples in documentation

### Version Control Practices

1. **Commit Messages**: Use clear, descriptive commit messages
   - Format: `<type>: <subject>` (e.g., `feat: add task deletion feature`)
   - Types: feat, fix, docs, style, refactor, test, chore
2. **Branch Strategy**: Create feature branches from main
3. **Pull Requests**: Include description, test results, and review checklist
4. **Code Review**: Ensure all changes are reviewed before merging

### File Organization

```
src/
├── main/
│   └── java/
│       └── com/
│           └── todoapp/
│               ├── model/      # Domain models
│               ├── service/    # Business logic
│               ├── repository/ # Data access
│               ├── controller/ # Application controllers
│               └── util/       # Utility classes

tests/
└── java/
    └── com/
        └── todoapp/
            ├── model/
            ├── service/
            └── repository/

docs/
├── requirements/   # Functional and non-functional requirements
├── roles/          # User roles and permissions
└── tasks/          # Task breakdowns and planning
```

### Security Considerations

1. **Input Validation**: Always validate and sanitize user inputs
2. **Error Handling**: Use proper exception handling, avoid exposing sensitive information
3. **Dependencies**: Keep dependencies up-to-date and scan for vulnerabilities
4. **Credentials**: Never commit credentials or API keys to the repository

### Performance Guidelines

1. **Efficiency**: Optimize algorithms for time and space complexity
2. **Resource Management**: Properly close resources (files, connections, etc.)
3. **Caching**: Implement caching where appropriate
4. **Profiling**: Profile code for performance bottlenecks when needed

## Agent-Specific Instructions

### When Adding Features

1. Review existing code structure
2. Write tests first (TDD approach)
3. Implement feature following SOLID principles
4. Update documentation
5. Run all tests to ensure no regressions
6. Update CHANGELOG if applicable

### When Fixing Bugs

1. Write a failing test that reproduces the bug
2. Fix the bug with minimal changes
3. Ensure the test passes
4. Check for similar issues elsewhere
5. Document the fix in commit messages

### When Refactoring

1. Ensure comprehensive test coverage exists
2. Make small, incremental changes
3. Run tests after each change
4. Update documentation if public APIs change
5. Maintain backward compatibility when possible

## Collaboration Expectations

- **Communication**: Document decisions and rationale in code comments or commit messages
- **Consistency**: Follow existing patterns and conventions in the codebase
- **Quality**: Prioritize code quality over speed
- **Learning**: Share knowledge through clear documentation and examples

## Resources

- [Java Code Conventions](https://www.oracle.com/java/technologies/javase/codeconventions-contents.html)
- [Effective Java by Joshua Bloch](https://www.oreilly.com/library/view/effective-java/9780134686097/)
- [JUnit 5 Documentation](https://junit.org/junit5/docs/current/user-guide/)
- [Maven Documentation](https://maven.apache.org/guides/)
- [Git Best Practices](https://git-scm.com/book/en/v2)

## Version History

- v1.0.0 - Initial guidelines established
- Future versions will be documented here as the project evolves

## Questions or Suggestions

For questions about these guidelines or suggestions for improvements, please open an issue or discussion in the repository.
