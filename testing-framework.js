// 🧪 FRAMEWORK DE TESTING AVANZADO
// Sistema completo de pruebas unitarias, integración y E2E

class TestingFramework {
    constructor() {
        this.tests = new Map();
        this.suites = new Map();
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
            errors: [],
            performance: {},
            coverage: {}
        };
        this.config = {
            timeout: 10000,
            retries: 3,
            parallel: false,
            verbose: true,
            coverage: true,
            performance: true
        };
        this.hooks = {
            beforeAll: [],
            afterAll: [],
            beforeEach: [],
            afterEach: []
        };
        
        console.log('🧪 Framework de Testing Avanzado inicializado');
    }

    // 📋 Crear suite de pruebas
    describe(suiteName, callback) {
        const suite = {
            name: suiteName,
            tests: [],
            hooks: {
                beforeAll: [],
                afterAll: [],
                beforeEach: [],
                afterEach: []
            },
            results: {
                total: 0,
                passed: 0,
                failed: 0,
                skipped: 0,
                duration: 0
            }
        };
        
        this.suites.set(suiteName, suite);
        
        // Contexto temporal para agregar tests
        this.currentSuite = suite;
        callback();
        this.currentSuite = null;
        
        return suite;
    }

    // 🧪 Definir test individual
    it(testName, testFunction, options = {}) {
        if (!this.currentSuite) {
            throw new Error('Los tests deben estar dentro de un describe()');
        }
        
        const test = {
            name: testName,
            function: testFunction,
            suite: this.currentSuite.name,
            options: {
                timeout: options.timeout || this.config.timeout,
                retries: options.retries || this.config.retries,
                skip: options.skip || false,
                only: options.only || false
            },
            result: null,
            duration: 0,
            error: null
        };
        
        this.currentSuite.tests.push(test);
        this.tests.set(`${this.currentSuite.name}::${testName}`, test);
        
        return test;
    }

    // 🎯 Hooks de ciclo de vida
    beforeAll(callback) {
        if (this.currentSuite) {
            this.currentSuite.hooks.beforeAll.push(callback);
        } else {
            this.hooks.beforeAll.push(callback);
        }
    }

    afterAll(callback) {
        if (this.currentSuite) {
            this.currentSuite.hooks.afterAll.push(callback);
        } else {
            this.hooks.afterAll.push(callback);
        }
    }

    beforeEach(callback) {
        if (this.currentSuite) {
            this.currentSuite.hooks.beforeEach.push(callback);
        } else {
            this.hooks.beforeEach.push(callback);
        }
    }

    afterEach(callback) {
        if (this.currentSuite) {
            this.currentSuite.hooks.afterEach.push(callback);
        } else {
            this.hooks.afterEach.push(callback);
        }
    }

    // ▶️ Ejecutar todas las pruebas
    async runAllTests() {
        console.log('🚀 Iniciando ejecución de todas las pruebas...');
        const startTime = performance.now();
        
        try {
            // Ejecutar hooks globales beforeAll
            await this.executeHooks(this.hooks.beforeAll);
            
            // Ejecutar suites
            for (const [suiteName, suite] of this.suites) {
                await this.runSuite(suite);
            }
            
            // Ejecutar hooks globales afterAll
            await this.executeHooks(this.hooks.afterAll);
            
            const endTime = performance.now();
            this.results.duration = endTime - startTime;
            
            // Generar reporte final
            this.generateReport();
            
            return this.results;
            
        } catch (error) {
            console.error('❌ Error ejecutando pruebas:', error);
            throw error;
        }
    }

    // 📋 Ejecutar suite específica
    async runSuite(suite) {
        console.log(`📋 Ejecutando suite: ${suite.name}`);
        const startTime = performance.now();
        
        try {
            // Ejecutar hooks beforeAll de la suite
            await this.executeHooks(suite.hooks.beforeAll);
            
            // Ejecutar tests de la suite
            for (const test of suite.tests) {
                if (test.options.skip) {
                    test.result = 'skipped';
                    suite.results.skipped++;
                    this.results.skipped++;
                    continue;
                }
                
                await this.runTest(test, suite);
            }
            
            // Ejecutar hooks afterAll de la suite
            await this.executeHooks(suite.hooks.afterAll);
            
            const endTime = performance.now();
            suite.results.duration = endTime - startTime;
            
            console.log(`✅ Suite ${suite.name} completada: ${suite.results.passed}/${suite.results.total} pruebas pasaron`);
            
        } catch (error) {
            console.error(`❌ Error en suite ${suite.name}:`, error);
            throw error;
        }
    }

    // 🧪 Ejecutar test individual
    async runTest(test, suite) {
        console.log(`  🧪 Ejecutando: ${test.name}`);
        const startTime = performance.now();
        
        let attempts = 0;
        let lastError = null;
        
        while (attempts <= test.options.retries) {
            try {
                // Ejecutar hooks beforeEach
                await this.executeHooks(this.hooks.beforeEach);
                await this.executeHooks(suite.hooks.beforeEach);
                
                // Ejecutar el test con timeout
                await this.executeWithTimeout(test.function, test.options.timeout);
                
                // Ejecutar hooks afterEach
                await this.executeHooks(suite.hooks.afterEach);
                await this.executeHooks(this.hooks.afterEach);
                
                // Test pasó
                test.result = 'passed';
                test.duration = performance.now() - startTime;
                suite.results.passed++;
                suite.results.total++;
                this.results.passed++;
                this.results.total++;
                
                console.log(`    ✅ ${test.name} - PASÓ (${test.duration.toFixed(2)}ms)`);
                return;
                
            } catch (error) {
                lastError = error;
                attempts++;
                
                if (attempts <= test.options.retries) {
                    console.log(`    ⚠️ ${test.name} - Intento ${attempts} falló, reintentando...`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1s antes de reintentar
                }
            }
        }
        
        // Test falló después de todos los intentos
        test.result = 'failed';
        test.error = lastError;
        test.duration = performance.now() - startTime;
        suite.results.failed++;
        suite.results.total++;
        this.results.failed++;
        this.results.total++;
        this.results.errors.push({
            test: `${suite.name}::${test.name}`,
            error: lastError.message,
            stack: lastError.stack
        });
        
        console.log(`    ❌ ${test.name} - FALLÓ: ${lastError.message}`);
    }

    // ⏱️ Ejecutar función con timeout
    async executeWithTimeout(func, timeout) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Test timeout después de ${timeout}ms`));
            }, timeout);
            
            Promise.resolve(func()).then(
                result => {
                    clearTimeout(timer);
                    resolve(result);
                },
                error => {
                    clearTimeout(timer);
                    reject(error);
                }
            );
        });
    }

    // 🎯 Ejecutar hooks
    async executeHooks(hooks) {
        for (const hook of hooks) {
            await hook();
        }
    }

    // 📊 Generar reporte de resultados
    generateReport() {
        const passRate = this.results.total > 0 ? (this.results.passed / this.results.total * 100).toFixed(2) : 0;
        
        console.log('\n📊 REPORTE DE PRUEBAS');
        console.log('='.repeat(50));
        console.log(`📋 Total de pruebas: ${this.results.total}`);
        console.log(`✅ Pasaron: ${this.results.passed}`);
        console.log(`❌ Fallaron: ${this.results.failed}`);
        console.log(`⏭️ Omitidas: ${this.results.skipped}`);
        console.log(`📈 Tasa de éxito: ${passRate}%`);
        console.log(`⏱️ Duración total: ${this.results.duration.toFixed(2)}ms`);
        
        if (this.results.errors.length > 0) {
            console.log('\n❌ ERRORES ENCONTRADOS:');
            this.results.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error.test}: ${error.error}`);
            });
        }
        
        // Reporte por suite
        console.log('\n📋 RESULTADOS POR SUITE:');
        for (const [suiteName, suite] of this.suites) {
            const suitePassRate = suite.results.total > 0 ? (suite.results.passed / suite.results.total * 100).toFixed(2) : 0;
            console.log(`  ${suiteName}: ${suite.results.passed}/${suite.results.total} (${suitePassRate}%) - ${suite.results.duration.toFixed(2)}ms`);
        }
    }

    // 🎨 Generar reporte HTML
    generateHTMLReport() {
        const passRate = this.results.total > 0 ? (this.results.passed / this.results.total * 100).toFixed(2) : 0;
        const timestamp = new Date().toISOString();
        
        let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Pruebas - ${timestamp}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #ffc107; }
        .suite { margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .suite-header { background: #e9ecef; padding: 15px; font-weight: bold; }
        .test { padding: 10px 15px; border-bottom: 1px solid #eee; }
        .test:last-child { border-bottom: none; }
        .test-passed { background: #d4edda; }
        .test-failed { background: #f8d7da; }
        .test-skipped { background: #fff3cd; }
        .error-details { font-family: monospace; font-size: 0.9em; color: #666; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Reporte de Pruebas</h1>
            <p>Generado el ${new Date(timestamp).toLocaleString('es-ES')}</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${this.results.total}</div>
                <div>Total de Pruebas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value passed">${this.results.passed}</div>
                <div>Pasaron</div>
            </div>
            <div class="stat-card">
                <div class="stat-value failed">${this.results.failed}</div>
                <div>Fallaron</div>
            </div>
            <div class="stat-card">
                <div class="stat-value skipped">${this.results.skipped}</div>
                <div>Omitidas</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${passRate}%</div>
                <div>Tasa de Éxito</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.results.duration.toFixed(0)}ms</div>
                <div>Duración Total</div>
            </div>
        </div>`;
        
        // Agregar suites
        for (const [suiteName, suite] of this.suites) {
            html += `
        <div class="suite">
            <div class="suite-header">
                📋 ${suiteName} (${suite.results.passed}/${suite.results.total} - ${suite.results.duration.toFixed(2)}ms)
            </div>`;
            
            for (const test of suite.tests) {
                const statusClass = `test-${test.result}`;
                const statusIcon = test.result === 'passed' ? '✅' : test.result === 'failed' ? '❌' : '⏭️';
                
                html += `
            <div class="test ${statusClass}">
                <div>${statusIcon} ${test.name} (${test.duration.toFixed(2)}ms)</div>`;
                
                if (test.error) {
                    html += `<div class="error-details">${test.error.message}</div>`;
                }
                
                html += `</div>`;
            }
            
            html += `</div>`;
        }
        
        html += `
    </div>
</body>
</html>`;
        
        return html;
    }

    // 💾 Guardar reporte HTML
    saveHTMLReport() {
        const html = this.generateHTMLReport();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `test-report-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('💾 Reporte HTML guardado');
    }
}

// 🌐 Exportar para uso global
window.TestingFramework = TestingFramework;
