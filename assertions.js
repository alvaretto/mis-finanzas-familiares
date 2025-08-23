// ✅ SISTEMA DE ASERCIONES AVANZADO
// Biblioteca completa de aserciones para testing riguroso

class AssertionError extends Error {
    constructor(message, actual, expected, operator) {
        super(message);
        this.name = 'AssertionError';
        this.actual = actual;
        this.expected = expected;
        this.operator = operator;
    }
}

class Assertions {
    constructor(actual) {
        this.actual = actual;
    }

    // ✅ Igualdad estricta
    toBe(expected) {
        if (this.actual !== expected) {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} to be ${this.formatValue(expected)}`,
                this.actual,
                expected,
                'toBe'
            );
        }
        return this;
    }

    // ✅ Igualdad profunda
    toEqual(expected) {
        if (!this.deepEqual(this.actual, expected)) {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} to equal ${this.formatValue(expected)}`,
                this.actual,
                expected,
                'toEqual'
            );
        }
        return this;
    }

    // ✅ Negación
    get not() {
        return new NotAssertions(this.actual);
    }

    // ✅ Truthiness
    toBeTruthy() {
        if (!this.actual) {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} to be truthy`,
                this.actual,
                true,
                'toBeTruthy'
            );
        }
        return this;
    }

    toBeFalsy() {
        if (this.actual) {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} to be falsy`,
                this.actual,
                false,
                'toBeFalsy'
            );
        }
        return this;
    }

    // ✅ Null/Undefined
    toBeNull() {
        if (this.actual !== null) {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} to be null`,
                this.actual,
                null,
                'toBeNull'
            );
        }
        return this;
    }

    toBeUndefined() {
        if (this.actual !== undefined) {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} to be undefined`,
                this.actual,
                undefined,
                'toBeUndefined'
            );
        }
        return this;
    }

    toBeDefined() {
        if (this.actual === undefined) {
            throw new AssertionError(
                `Expected value to be defined`,
                this.actual,
                'defined',
                'toBeDefined'
            );
        }
        return this;
    }

    // ✅ Tipos
    toBeInstanceOf(expectedClass) {
        if (!(this.actual instanceof expectedClass)) {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} to be instance of ${expectedClass.name}`,
                this.actual,
                expectedClass,
                'toBeInstanceOf'
            );
        }
        return this;
    }

    toBeTypeOf(expectedType) {
        const actualType = typeof this.actual;
        if (actualType !== expectedType) {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} to be of type ${expectedType}, but got ${actualType}`,
                actualType,
                expectedType,
                'toBeTypeOf'
            );
        }
        return this;
    }

    // ✅ Números
    toBeGreaterThan(expected) {
        if (this.actual <= expected) {
            throw new AssertionError(
                `Expected ${this.actual} to be greater than ${expected}`,
                this.actual,
                expected,
                'toBeGreaterThan'
            );
        }
        return this;
    }

    toBeGreaterThanOrEqual(expected) {
        if (this.actual < expected) {
            throw new AssertionError(
                `Expected ${this.actual} to be greater than or equal to ${expected}`,
                this.actual,
                expected,
                'toBeGreaterThanOrEqual'
            );
        }
        return this;
    }

    toBeLessThan(expected) {
        if (this.actual >= expected) {
            throw new AssertionError(
                `Expected ${this.actual} to be less than ${expected}`,
                this.actual,
                expected,
                'toBeLessThan'
            );
        }
        return this;
    }

    toBeLessThanOrEqual(expected) {
        if (this.actual > expected) {
            throw new AssertionError(
                `Expected ${this.actual} to be less than or equal to ${expected}`,
                this.actual,
                expected,
                'toBeLessThanOrEqual'
            );
        }
        return this;
    }

    toBeCloseTo(expected, precision = 2) {
        const diff = Math.abs(this.actual - expected);
        const threshold = Math.pow(10, -precision) / 2;
        
        if (diff >= threshold) {
            throw new AssertionError(
                `Expected ${this.actual} to be close to ${expected} (precision: ${precision})`,
                this.actual,
                expected,
                'toBeCloseTo'
            );
        }
        return this;
    }

    // ✅ Strings
    toContain(expected) {
        if (typeof this.actual === 'string') {
            if (!this.actual.includes(expected)) {
                throw new AssertionError(
                    `Expected "${this.actual}" to contain "${expected}"`,
                    this.actual,
                    expected,
                    'toContain'
                );
            }
        } else if (Array.isArray(this.actual)) {
            if (!this.actual.includes(expected)) {
                throw new AssertionError(
                    `Expected array to contain ${this.formatValue(expected)}`,
                    this.actual,
                    expected,
                    'toContain'
                );
            }
        } else {
            throw new AssertionError(
                `toContain() can only be used with strings or arrays`,
                this.actual,
                expected,
                'toContain'
            );
        }
        return this;
    }

    toMatch(regex) {
        if (typeof this.actual !== 'string') {
            throw new AssertionError(
                `toMatch() can only be used with strings`,
                this.actual,
                regex,
                'toMatch'
            );
        }
        
        if (!regex.test(this.actual)) {
            throw new AssertionError(
                `Expected "${this.actual}" to match ${regex}`,
                this.actual,
                regex,
                'toMatch'
            );
        }
        return this;
    }

    // ✅ Arrays
    toHaveLength(expected) {
        if (!this.actual || typeof this.actual.length !== 'number') {
            throw new AssertionError(
                `Expected value to have a length property`,
                this.actual,
                expected,
                'toHaveLength'
            );
        }
        
        if (this.actual.length !== expected) {
            throw new AssertionError(
                `Expected length ${this.actual.length} to be ${expected}`,
                this.actual.length,
                expected,
                'toHaveLength'
            );
        }
        return this;
    }

    // ✅ Objects
    toHaveProperty(property, value) {
        if (typeof this.actual !== 'object' || this.actual === null) {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} to be an object`,
                this.actual,
                'object',
                'toHaveProperty'
            );
        }
        
        if (!(property in this.actual)) {
            throw new AssertionError(
                `Expected object to have property "${property}"`,
                this.actual,
                property,
                'toHaveProperty'
            );
        }
        
        if (value !== undefined && this.actual[property] !== value) {
            throw new AssertionError(
                `Expected property "${property}" to have value ${this.formatValue(value)}, but got ${this.formatValue(this.actual[property])}`,
                this.actual[property],
                value,
                'toHaveProperty'
            );
        }
        
        return this;
    }

    // ✅ Funciones
    toThrow(expectedError) {
        if (typeof this.actual !== 'function') {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} to be a function`,
                this.actual,
                'function',
                'toThrow'
            );
        }
        
        let thrownError = null;
        try {
            this.actual();
        } catch (error) {
            thrownError = error;
        }
        
        if (!thrownError) {
            throw new AssertionError(
                `Expected function to throw an error`,
                null,
                'error',
                'toThrow'
            );
        }
        
        if (expectedError) {
            if (typeof expectedError === 'string') {
                if (!thrownError.message.includes(expectedError)) {
                    throw new AssertionError(
                        `Expected error message to contain "${expectedError}", but got "${thrownError.message}"`,
                        thrownError.message,
                        expectedError,
                        'toThrow'
                    );
                }
            } else if (expectedError instanceof RegExp) {
                if (!expectedError.test(thrownError.message)) {
                    throw new AssertionError(
                        `Expected error message to match ${expectedError}, but got "${thrownError.message}"`,
                        thrownError.message,
                        expectedError,
                        'toThrow'
                    );
                }
            } else if (typeof expectedError === 'function') {
                if (!(thrownError instanceof expectedError)) {
                    throw new AssertionError(
                        `Expected error to be instance of ${expectedError.name}`,
                        thrownError,
                        expectedError,
                        'toThrow'
                    );
                }
            }
        }
        
        return this;
    }

    // 🔧 Utilidades
    deepEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (typeof a !== typeof b) return false;
        
        if (typeof a === 'object') {
            if (Array.isArray(a) !== Array.isArray(b)) return false;
            
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            
            if (keysA.length !== keysB.length) return false;
            
            for (const key of keysA) {
                if (!keysB.includes(key)) return false;
                if (!this.deepEqual(a[key], b[key])) return false;
            }
            
            return true;
        }
        
        return false;
    }

    formatValue(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return `"${value}"`;
        if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }
}

// ❌ Aserciones negadas
class NotAssertions extends Assertions {
    toBe(expected) {
        if (this.actual === expected) {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} not to be ${this.formatValue(expected)}`,
                this.actual,
                expected,
                'not.toBe'
            );
        }
        return this;
    }

    toEqual(expected) {
        if (this.deepEqual(this.actual, expected)) {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} not to equal ${this.formatValue(expected)}`,
                this.actual,
                expected,
                'not.toEqual'
            );
        }
        return this;
    }

    toBeTruthy() {
        if (this.actual) {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} not to be truthy`,
                this.actual,
                false,
                'not.toBeTruthy'
            );
        }
        return this;
    }

    toContain(expected) {
        if (typeof this.actual === 'string') {
            if (this.actual.includes(expected)) {
                throw new AssertionError(
                    `Expected "${this.actual}" not to contain "${expected}"`,
                    this.actual,
                    expected,
                    'not.toContain'
                );
            }
        } else if (Array.isArray(this.actual)) {
            if (this.actual.includes(expected)) {
                throw new AssertionError(
                    `Expected array not to contain ${this.formatValue(expected)}`,
                    this.actual,
                    expected,
                    'not.toContain'
                );
            }
        }
        return this;
    }

    toThrow() {
        if (typeof this.actual !== 'function') {
            throw new AssertionError(
                `Expected ${this.formatValue(this.actual)} to be a function`,
                this.actual,
                'function',
                'not.toThrow'
            );
        }
        
        try {
            this.actual();
        } catch (error) {
            throw new AssertionError(
                `Expected function not to throw an error, but it threw: ${error.message}`,
                error,
                null,
                'not.toThrow'
            );
        }
        
        return this;
    }
}

// 🎯 Función principal expect
function expect(actual) {
    return new Assertions(actual);
}

// 🌐 Exportar para uso global
window.expect = expect;
window.AssertionError = AssertionError;
