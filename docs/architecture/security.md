# Security Architecture - ToDoApp

**Document Version:** 1.0  
**Date:** 2025-11-19  
**Status:** Active  
**Author:** Tech Architect Team  

---

## Executive Summary

ToDoApp MVP is a client-side application with no backend server, which significantly simplifies the security landscape. However, security considerations remain important, particularly around input validation, XSS prevention, and user data privacy. This document outlines the security architecture for the MVP and provides guidance for future backend integration.

---

## Security Principles

### Core Principles for ToDoApp:

1. **Defense in Depth**: Multiple layers of security controls
2. **Least Privilege**: Minimize permissions and access
3. **Secure by Default**: Security built in from the start
4. **Privacy First**: User data stays on their device (MVP)
5. **Input Validation**: Never trust user input
6. **Transparency**: Clear communication about data handling

---

## Threat Model

### MVP Threat Landscape

Since ToDoApp MVP is client-side only with no backend, the threat surface is limited.

**In-Scope Threats:**

| Threat | Likelihood | Impact | Mitigation |
|--------|-----------|--------|------------|
| **Cross-Site Scripting (XSS)** | Medium | High | Input sanitization, HTML escaping |
| **Data Loss (User Error)** | Medium | Medium | Clear warnings, confirmation dialogs |
| **Browser Data Theft** | Low | Medium | User education, localStorage limitations |
| **Malicious Input** | Medium | Low | Input validation, length limits |

**Out-of-Scope Threats (No Backend):**

- SQL Injection (no database)
- Server-side attacks (no server)
- Authentication bypass (no authentication)
- API abuse (no API)
- DDoS attacks (no server)
- Man-in-the-Middle during data transmission (data never transmitted)

---

## Security Controls

### 1. Input Validation and Sanitization

**Goal:** Prevent malicious input from compromising the application or user data.

#### Client-Side Input Validation

```javascript
// Validate all user inputs before processing
function validateTaskInput(taskData) {
    const errors = [];
    
    // Title validation
    if (!taskData.title || taskData.title.trim() === '') {
        errors.push({ field: 'title', message: 'Title is required' });
    }
    
    if (taskData.title && taskData.title.length > 200) {
        errors.push({ field: 'title', message: 'Title too long (max 200 characters)' });
    }
    
    // Description validation
    if (taskData.description && taskData.description.length > 1000) {
        errors.push({ field: 'description', message: 'Description too long (max 1000 characters)' });
    }
    
    return errors;
}
```

#### HTML Escaping (XSS Prevention)

**Critical:** Always escape user-generated content before rendering.

```javascript
// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Alternative using a map
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Usage in rendering
function renderTask(task) {
    return `
        <div class="task-item">
            <h3>${escapeHtml(task.title)}</h3>
            <p>${escapeHtml(task.description)}</p>
        </div>
    `;
}
```

#### Input Sanitization

```javascript
// Sanitize inputs before storing
function sanitizeTaskData(taskData) {
    return {
        title: taskData.title?.trim() || '',
        description: taskData.description?.trim() || ''
    };
}
```

---

### 2. Content Security Policy (CSP)

**Goal:** Prevent XSS and other code injection attacks.

#### Recommended CSP Headers

When deploying to a server (GitHub Pages, Netlify, etc.):

```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:; 
               font-src 'self'; 
               connect-src 'self';">
```

**Or via HTTP Header:**
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';
```

**CSP Directive Breakdown:**

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Default policy: only same-origin |
| `script-src` | `'self'` | Only allow scripts from same origin |
| `style-src` | `'self' 'unsafe-inline'` | Allow inline styles for MVP |
| `img-src` | `'self' data:` | Allow images from same origin and data URLs |
| `font-src` | `'self'` | Only fonts from same origin |
| `connect-src` | `'self'` | API calls only to same origin |

**Note:** `'unsafe-inline'` for styles is a temporary allowance for MVP. Should move to external CSS files or use nonces in production.

---

### 3. Data Privacy and Storage

**Goal:** Protect user data and respect privacy.

#### localStorage Security

**Characteristics:**
- Data stored in plain text (not encrypted by default)
- Accessible only to same origin (domain)
- Persists until explicitly cleared
- Subject to browser security policies

**Security Measures:**

```javascript
// 1. Check localStorage availability
function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// 2. Validate data before writing
function saveTasksSecurely(tasks) {
    // Validate data structure
    if (!Array.isArray(tasks)) {
        throw new Error('Invalid data structure');
    }
    
    // Validate each task
    tasks.forEach(task => {
        if (!isValidTask(task)) {
            throw new Error('Invalid task data');
        }
    });
    
    // Save to storage
    try {
        const data = {
            version: '1.0',
            tasks: tasks,
            lastModified: new Date().toISOString()
        };
        localStorage.setItem('todoapp_tasks', JSON.stringify(data));
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            throw new StorageQuotaError('Storage quota exceeded');
        }
        throw error;
    }
}

// 3. Validate data when reading
function loadTasksSecurely() {
    try {
        const data = localStorage.getItem('todoapp_tasks');
        if (!data) return [];
        
        const parsed = JSON.parse(data);
        
        // Validate structure
        if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
            console.error('Invalid data structure in storage');
            return [];
        }
        
        // Filter out invalid tasks
        return parsed.tasks.filter(isValidTask);
        
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
}
```

#### Privacy Best Practices

1. **No External Data Transmission**
   - All data stays on user's device (MVP)
   - No analytics or tracking
   - No third-party scripts

2. **User Education**
   - Display clear message about data storage
   - Inform users data is not encrypted
   - Warn against storing sensitive information

3. **Data Control**
   - Provide "Clear All Data" function
   - Allow data export (post-MVP)
   - No hidden data collection

**Privacy Notice Example:**

```html
<div class="privacy-notice">
    <p><strong>Your Privacy:</strong> All your task data is stored locally in your browser. 
    We do not collect, transmit, or store your data on any server. 
    Please do not store sensitive or confidential information in tasks.</p>
</div>
```

---

### 4. Error Handling and Information Disclosure

**Goal:** Handle errors gracefully without exposing sensitive information.

#### Secure Error Messages

```javascript
// Bad: Exposes system details
function badErrorHandler(error) {
    alert(`Error: ${error.message}\nStack: ${error.stack}`);
}

// Good: User-friendly, no system details
function goodErrorHandler(error) {
    console.error('Error details:', error); // Log for debugging
    
    // Show generic message to user
    if (error instanceof ValidationError) {
        showUserMessage('Please check your input and try again.');
    } else if (error instanceof StorageError) {
        showUserMessage('Unable to save. Please try again or clear some tasks.');
    } else {
        showUserMessage('An error occurred. Please try again.');
    }
}
```

#### Error Logging

```javascript
// Secure error logging (development vs production)
function logError(error, context) {
    const isDevelopment = window.location.hostname === 'localhost';
    
    if (isDevelopment) {
        // Detailed logging in development
        console.error('Error:', {
            message: error.message,
            stack: error.stack,
            context: context
        });
    } else {
        // Minimal logging in production
        console.error('Error occurred:', error.message);
        // Could send to error tracking service (future)
    }
}
```

---

### 5. Secure Coding Practices

#### Avoid Dangerous Patterns

```javascript
// ❌ NEVER use eval()
eval(userInput); // Extremely dangerous!

// ❌ NEVER use innerHTML with unsanitized input
element.innerHTML = userInput; // XSS vulnerability!

// ✅ Use textContent or sanitize first
element.textContent = userInput; // Safe
element.innerHTML = escapeHtml(userInput); // Safe with sanitization
```

#### Use Modern, Safe APIs

```javascript
// ✅ Use template literals with escaping
function renderTask(task) {
    return `
        <div class="task">
            <span>${escapeHtml(task.title)}</span>
        </div>
    `;
}

// ✅ Use DOM methods
function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task';
    
    const span = document.createElement('span');
    span.textContent = task.title; // Automatically escaped
    
    div.appendChild(span);
    return div;
}
```

#### Principle of Least Privilege

```javascript
// ✅ Limit scope and access
class TaskManager {
    #tasks = []; // Private field
    #storageService; // Private field
    
    constructor(storageService) {
        this.#storageService = storageService;
    }
    
    // Public interface
    getTasks() {
        return [...this.#tasks]; // Return copy, not reference
    }
    
    // Private method
    #validateTask(task) {
        // Implementation
    }
}
```

---

### 6. Dependency Security

**Goal:** Minimize security risks from third-party dependencies.

#### MVP Approach: Zero Runtime Dependencies

**Benefits:**
- No dependency vulnerabilities
- No supply chain attacks
- Smaller attack surface
- Complete code control

#### Development Dependencies

**Testing and Build Tools:**
- Keep dependencies up to date
- Run `npm audit` regularly
- Use `npm audit fix` to address vulnerabilities
- Monitor GitHub security alerts

```bash
# Check for vulnerabilities
npm audit

# Fix automatically if possible
npm audit fix

# Force fix (may introduce breaking changes)
npm audit fix --force
```

#### Dependency Security Checklist

- [ ] Regular security audits
- [ ] Automated dependency updates (Dependabot)
- [ ] Review dependency licenses
- [ ] Minimize dependency count
- [ ] Pin dependency versions

---

## Security Testing

### 1. XSS Testing

**Test Cases:**

```javascript
// Test inputs
const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    'javascript:alert("XSS")',
    '<iframe src="javascript:alert(\'XSS\')">',
    '"><script>alert(String.fromCharCode(88,83,83))</script>'
];

// Test function
function testXSSProtection() {
    xssPayloads.forEach(payload => {
        const task = createTask({ title: payload, description: payload });
        const rendered = renderTask(task);
        
        // Verify payload is escaped, not executed
        assert(!rendered.includes('<script>'));
        assert(rendered.includes('&lt;script&gt;') || !rendered.includes('script'));
    });
}
```

### 2. Input Validation Testing

```javascript
// Test validation
describe('Input Validation Security', () => {
    test('rejects overly long title', () => {
        const longTitle = 'a'.repeat(201);
        expect(() => createTask({ title: longTitle }))
            .toThrow(ValidationError);
    });
    
    test('sanitizes whitespace', () => {
        const task = createTask({ title: '  test  ' });
        expect(task.title).toBe('test');
    });
    
    test('handles special characters safely', () => {
        const specialChars = '<>&"\'';
        const task = createTask({ title: specialChars });
        const rendered = renderTask(task);
        expect(rendered).not.toContain('<');
    });
});
```

### 3. Storage Security Testing

```javascript
describe('Storage Security', () => {
    test('validates data before reading', () => {
        // Corrupt data in localStorage
        localStorage.setItem('todoapp_tasks', 'invalid json');
        
        // Should handle gracefully
        const tasks = loadTasks();
        expect(tasks).toEqual([]);
    });
    
    test('handles malicious data structure', () => {
        const malicious = {
            tasks: [
                { title: '<script>alert("xss")</script>' }
            ]
        };
        localStorage.setItem('todoapp_tasks', JSON.stringify(malicious));
        
        const tasks = loadTasks();
        // Should filter out invalid tasks
        expect(tasks).toEqual([]);
    });
});
```

---

## Deployment Security

### 1. HTTPS Enforcement

**Requirement:** All traffic must use HTTPS.

**Configuration:**

For GitHub Pages:
- HTTPS automatically enforced
- No additional configuration needed

For Netlify:
```toml
# netlify.toml
[[redirects]]
  from = "http://yourdomain.com/*"
  to = "https://yourdomain.com/:splat"
  status = 301
  force = true
```

### 2. Security Headers

**Recommended HTTP Security Headers:**

```
# Server configuration (e.g., _headers file for Netlify)
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Header Explanations:**

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | See above | Prevent XSS and injection attacks |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Enable browser XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer information |
| `Permissions-Policy` | Restrictive | Disable unnecessary browser features |

---

## Future Security (Post-MVP with Backend)

### Authentication & Authorization

When adding backend:

**Authentication:**
- JWT (JSON Web Tokens) for stateless authentication
- Secure password hashing (bcrypt with salt)
- Password complexity requirements
- Account lockout after failed attempts
- Secure session management

**Authorization:**
- Role-based access control (RBAC)
- User can only access their own tasks
- Admin roles for future team features

**Example Security Flow:**

```
User Login
    ↓
Validate Credentials
    ↓
Generate JWT Token
    ↓
Store Token (httpOnly cookie or localStorage)
    ↓
Include Token in API Requests
    ↓
Validate Token on Server
    ↓
Authorize Access to Resources
```

### API Security

**RESTful API Security:**

```javascript
// API authentication middleware
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
}

// Authorize task access
function authorizeTaskAccess(req, res, next) {
    const task = getTaskById(req.params.id);
    
    if (task.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    next();
}
```

### Data Encryption

**Future encryption strategy:**

- **At Rest**: Encrypt sensitive data in database
- **In Transit**: HTTPS/TLS for all communications
- **At Application**: Consider end-to-end encryption for sensitive tasks

### Additional Security Measures

1. **Rate Limiting**
   ```javascript
   // Prevent abuse
   rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100 // limit each IP to 100 requests per windowMs
   });
   ```

2. **CSRF Protection**
   ```javascript
   // Use CSRF tokens for state-changing operations
   app.use(csrf());
   ```

3. **SQL Injection Prevention**
   ```javascript
   // Use parameterized queries
   db.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
   ```

4. **Input Validation on Server**
   ```javascript
   // Never trust client-side validation alone
   function validateTaskOnServer(taskData) {
       // Validate on server as well
   }
   ```

---

## Security Checklist

### Pre-Deployment

- [ ] All user inputs sanitized and validated
- [ ] HTML escaping implemented for all user-generated content
- [ ] CSP headers configured
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] No sensitive data in client-side code
- [ ] Error messages don't expose system details
- [ ] `npm audit` passes with no critical vulnerabilities
- [ ] XSS testing completed
- [ ] Input validation testing completed

### Post-Deployment

- [ ] HTTPS certificate valid and working
- [ ] Security headers verified in production
- [ ] CSP policy working (no violations in console)
- [ ] Privacy notice displayed to users
- [ ] Error handling working as expected
- [ ] No sensitive data in browser console/network tab

---

## Incident Response Plan

### Security Incident Process

1. **Detection**
   - User reports security issue
   - Automated monitoring alerts
   - Security audit findings

2. **Assessment**
   - Evaluate severity
   - Determine scope of impact
   - Identify affected users

3. **Containment**
   - Fix vulnerability immediately
   - Deploy hotfix if necessary
   - Communicate with users if needed

4. **Recovery**
   - Verify fix is effective
   - Monitor for exploitation
   - Document incident

5. **Post-Incident**
   - Update security measures
   - Improve testing
   - Share learnings

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [Web Security Best Practices](https://developers.google.com/web/fundamentals/security)
- [System Architecture](./system-architecture.md)
- [NFR-015 to NFR-018: Security Requirements](../requirements/business-requirements-document.md#55-security)

---

**Last Updated:** 2025-11-19  
**Next Security Review:** 2026-02-19  
**Security Contact:** Create GitHub issue with label `security`
