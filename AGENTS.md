# AGENTS.md

## Purpose

This document serves as a registry and reference for all **agents** (autonomous components or services) within this application. In this project, an "agent" refers to a specialized module or service that handles a specific domain of responsibility, such as task management, notifications, data synchronization, or external integrations.

Each agent operates independently and communicates with other parts of the system through well-defined interfaces. This document helps developers understand the role, responsibilities, and technical details of each agent in the system.

---

## Agent Registry

### Example Agent: TaskProcessingAgent

| **Attribute**              | **Details**                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| **Agent Name**            | TaskProcessingAgent                                                         |
| **Description/Purpose**   | Handles all task-related operations including creation, updates, and deletion |
| **Responsibilities**      | - Validate task inputs<br>- Process task state transitions<br>- Trigger notifications on task completion |
| **Key Classes/Modules**   | `TaskProcessor.java`, `TaskValidator.java`, `TaskRepository.java`         |
| **Configuration**         | - `TASK_MAX_SIZE`: Maximum task description length (env variable)<br>- `task.processing.enabled`: Enable/disable flag (application.properties) |
| **Dependencies**          | - Database connection (via DataSource)<br>- NotificationAgent for alerts   |
| **Logging/Metrics**       | - Logs to `logs/task-agent.log`<br>- Metrics: task creation rate, processing time |
| **Future Enhancements**   | - Add batch processing support<br>- Implement priority-based task queuing  |

---

### Agent Template: [Agent Name]

| **Attribute**              | **Details**                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| **Agent Name**            | [Name of the agent, e.g., NotificationAgent, DataSyncAgent]                |
| **Description/Purpose**   | [Brief description of what this agent does and why it exists]              |
| **Responsibilities**      | - [Primary responsibility 1]<br>- [Primary responsibility 2]<br>- [Primary responsibility 3] |
| **Key Classes/Modules**   | [List main classes, interfaces, or packages, e.g., `NotificationService.java`, `EmailSender.java`] |
| **Configuration**         | - [Environment variable or property name]: [Description]<br>- [Another config]: [Description] |
| **Dependencies**          | - [External service or library]<br>- [Internal agent or module dependency] |
| **Logging/Metrics**       | - [Log file location or logging framework]<br>- [Key metrics tracked]      |
| **Future Enhancements**   | - [Planned improvement 1]<br>- [Planned improvement 2]                     |

---

## How to Document a New Agent

When creating a new agent in this application, follow these guidelines to document it properly:

1. **Create an entry in the Agent Registry**
   - Copy the "Agent Template" section above
   - Replace all placeholder text with actual details about your agent

2. **Naming Conventions**
   - Use descriptive names that clearly indicate the agent's purpose (e.g., `EmailNotificationAgent`, `DataSyncAgent`)
   - Follow the existing naming patterns in the codebase

3. **Be Specific and Concise**
   - Clearly state the agent's purpose in 1-2 sentences
   - List concrete responsibilities, not vague descriptions
   - Include actual file names, class names, and configuration keys

4. **Document Configuration**
   - List all environment variables, application properties, or configuration files
   - Include default values and acceptable ranges where applicable

5. **List Dependencies**
   - Identify both external (libraries, services) and internal (other agents, modules) dependencies
   - Note any circular dependencies or special initialization order requirements

6. **Include Observability Details**
   - Specify log file locations and log levels
   - Document key metrics, counters, or performance indicators
   - Note any monitoring dashboards or alerting rules

7. **Plan for the Future**
   - Add known limitations or technical debt
   - List planned enhancements or features under consideration

8. **Keep It Updated**
   - Update this document whenever agent responsibilities change
   - Remove entries for deprecated or removed agents
   - Version significant changes if needed

---

## Additional Notes

- Agents should be loosely coupled and independently deployable where possible
- All inter-agent communication should go through defined interfaces or messaging systems
- Each agent should have its own test suite and documentation
- Consider creating sequence diagrams for complex agent interactions

---

**Last Updated:** [Date]  
**Document Owner:** [Team/Person responsible for maintaining this file]
