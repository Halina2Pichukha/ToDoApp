# ToDoApp

A simple and efficient ToDo application built with Java, designed to help you manage your tasks effectively.

## Description

ToDoApp is a task management application that allows users to create, read, update, and delete tasks. Built following Java best practices, this application provides a clean and maintainable codebase suitable for both learning and production use.

## Features

- Create new tasks with descriptions
- View all tasks
- Update existing tasks
- Delete completed tasks
- Persistent task storage

## Prerequisites

Before running this application, ensure you have the following installed:

- Java Development Kit (JDK) 11 or higher
- Maven 3.6+ or Gradle 6.0+ (depending on your build tool choice)
- Git for version control

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Halina2Pichukha/ToDoApp.git
   cd ToDoApp
   ```

2. Build the project:
   ```bash
   # If using Maven
   mvn clean install
   
   # If using Gradle
   gradle build
   ```

3. Run tests:
   ```bash
   # If using Maven
   mvn test
   
   # If using Gradle
   gradle test
   ```

## Usage

### Running the Application

```bash
# If using Maven
mvn exec:java -Dexec.mainClass="com.todoapp.Main"

# If using Gradle
gradle run

# Or run the JAR directly
java -jar target/todoapp-1.0.jar
```

### Basic Operations

```java
// Example usage (will be updated as the application develops)
ToDoApp app = new ToDoApp();
app.addTask("Complete project documentation");
app.listTasks();
app.markTaskComplete(1);
app.deleteTask(1);
```

## Project Structure

```
ToDoApp/
├── src/              # Source code
├── tests/            # Test files
├── docs/             # Documentation
│   ├── requirements/ # Requirements documentation
│   ├── roles/        # Role definitions and specifications
│   └── tasks/        # Task breakdowns and planning
├── README.md         # This file
├── AGENTS.md         # AI agent collaboration guidelines
└── .gitignore        # Git ignore patterns
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Follow Java coding conventions and best practices
- Write unit tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PRs

## License

This project is open source and available under the MIT License.

## Contact

For questions or suggestions, please open an issue on GitHub.

## Acknowledgments

- Thanks to all contributors who help improve this project
- Built with best practices in mind for maintainability and scalability