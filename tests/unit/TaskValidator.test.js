/**
 * Unit tests for TaskValidator
 */

import { TaskValidator } from '../../src/business/validators/TaskValidator.js';

describe('TaskValidator', () => {
    describe('validate', () => {
        test('should validate a valid task', () => {
            const taskData = {
                title: 'Valid Task',
                description: 'Valid description'
            };

            const result = TaskValidator.validate(taskData);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('should reject task without title', () => {
            const taskData = {
                description: 'Description without title'
            };

            const result = TaskValidator.validate(taskData);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Title is required');
        });

        test('should reject task with empty title', () => {
            const taskData = {
                title: '   ',
                description: 'Description'
            };

            const result = TaskValidator.validate(taskData);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Title cannot be empty');
        });

        test('should reject title exceeding max length', () => {
            const taskData = {
                title: 'a'.repeat(201)
            };

            const result = TaskValidator.validate(taskData);
            expect(result.valid).toBe(false);
            expect(result.errors[0]).toContain('must not exceed 200 characters');
        });

        test('should reject description exceeding max length', () => {
            const taskData = {
                title: 'Valid title',
                description: 'a'.repeat(1001)
            };

            const result = TaskValidator.validate(taskData);
            expect(result.valid).toBe(false);
            expect(result.errors[0]).toContain('must not exceed 1000 characters');
        });

        test('should allow task with only title', () => {
            const taskData = {
                title: 'Title only'
            };

            const result = TaskValidator.validate(taskData);
            expect(result.valid).toBe(true);
        });

        test('should reject non-string title', () => {
            const taskData = {
                title: 123
            };

            const result = TaskValidator.validate(taskData);
            expect(result.valid).toBe(false);
        });

        test('should reject non-string description', () => {
            const taskData = {
                title: 'Valid title',
                description: 123
            };

            const result = TaskValidator.validate(taskData);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Description must be a string');
        });
    });

    describe('validateTitle', () => {
        test('should validate a valid title', () => {
            const result = TaskValidator.validateTitle('Valid Title');
            expect(result.valid).toBe(true);
            expect(result.remaining).toBe(189);
        });

        test('should reject empty title', () => {
            const result = TaskValidator.validateTitle('');
            expect(result.valid).toBe(false);
        });

        test('should calculate remaining characters', () => {
            const title = 'Test';
            const result = TaskValidator.validateTitle(title);
            expect(result.remaining).toBe(196);
        });
    });

    describe('validateDescription', () => {
        test('should validate a valid description', () => {
            const result = TaskValidator.validateDescription('Valid description');
            expect(result.valid).toBe(true);
        });

        test('should validate empty description', () => {
            const result = TaskValidator.validateDescription('');
            expect(result.valid).toBe(true);
        });

        test('should calculate remaining characters', () => {
            const desc = 'Test description';
            const result = TaskValidator.validateDescription(desc);
            expect(result.remaining).toBe(984);
        });
    });

    describe('sanitize', () => {
        test('should escape HTML in title', () => {
            const taskData = {
                title: '<script>alert("xss")</script>',
                description: 'Safe description'
            };

            const sanitized = TaskValidator.sanitize(taskData);
            expect(sanitized.title).not.toContain('<script>');
            expect(sanitized.title).toContain('&lt;script&gt;');
        });

        test('should escape HTML in description', () => {
            const taskData = {
                title: 'Safe title',
                description: '<img src=x onerror=alert("xss")>'
            };

            const sanitized = TaskValidator.sanitize(taskData);
            expect(sanitized.description).not.toContain('<img');
            expect(sanitized.description).toContain('&lt;img');
        });

        test('should handle empty strings', () => {
            const taskData = {
                title: '',
                description: ''
            };

            const sanitized = TaskValidator.sanitize(taskData);
            expect(sanitized.title).toBe('');
            expect(sanitized.description).toBe('');
        });
    });

    describe('escapeHTML', () => {
        test('should escape HTML special characters', () => {
            const input = '<div>Test & "quotes"</div>';
            const escaped = TaskValidator.escapeHTML(input);
            
            expect(escaped).not.toContain('<div>');
            expect(escaped).toContain('&lt;div&gt;');
        });

        test('should handle non-string input', () => {
            const escaped = TaskValidator.escapeHTML(123);
            expect(escaped).toBe('');
        });

        test('should handle null and undefined', () => {
            expect(TaskValidator.escapeHTML(null)).toBe('');
            expect(TaskValidator.escapeHTML(undefined)).toBe('');
        });
    });
});
