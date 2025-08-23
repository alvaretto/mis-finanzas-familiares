// 🏃‍♂️ SISTEMA DE EJECUCIÓN DE TESTS
// Runner automático y manual para todas las pruebas

class TestRunner {
    constructor() {
        this.testFramework = null;
        this.isRunning = false;
        this.currentRun = null;
        this.scheduledRuns = [];
        this.config = {
            autoRun: false,
            interval: 300000, // 5 minutos
            onFailure: 'notify',
            maxRetries: 3,
            parallel: false,
            coverage: true,
            performance: true,
            generateReport: true
        };
        
        console.log('🏃‍♂️ Test Runner inicializado');
    }

    // 🚀 Inicializar con framework de testing
    initialize(testFramework) {
        this.testFramework = testFramework;
        console.log('✅ Test Runner conectado al framework');
        
        // Configurar ejecución automática si está habilitada
        if (this.config.autoRun) {
            this.scheduleAutomaticRuns();
        }
    }

    // ▶️ Ejecutar todas las pruebas manualmente
    async runAllTests(options = {}) {
        if (this.isRunning) {
            console.warn('⚠️ Ya hay una ejecución de tests en progreso');
            return this.currentRun;
        }

        console.log('🚀 Iniciando ejecución manual de todas las pruebas...');
        this.isRunning = true;
        
        const runConfig = { ...this.config, ...options };
        const startTime = performance.now();
        
        try {
            // Crear registro de ejecución
            this.currentRun = {
                id: this.generateRunId(),
                type: 'manual',
                startTime: new Date().toISOString(),
                config: runConfig,
                results: null,
                duration: 0,
                status: 'running'
            };

            // Pre-ejecución: Verificar estado del sistema
            await this.preRunChecks();

            // Ejecutar tests
            const results = await this.testFramework.runAllTests();
            
            // Post-ejecución: Generar reportes
            await this.postRunActions(results, runConfig);
            
            const endTime = performance.now();
            this.currentRun.duration = endTime - startTime;
            this.currentRun.results = results;
            this.currentRun.status = results.failed > 0 ? 'failed' : 'passed';
            this.currentRun.endTime = new Date().toISOString();
            
            console.log(`✅ Ejecución completada en ${this.currentRun.duration.toFixed(2)}ms`);
            
            // Notificar resultados
            this.notifyResults(this.currentRun);
            
            return this.currentRun;
            
        } catch (error) {
            console.error('❌ Error durante ejecución de tests:', error);
            
            if (this.currentRun) {
                this.currentRun.status = 'error';
                this.currentRun.error = error.message;
                this.currentRun.endTime = new Date().toISOString();
            }
            
            throw error;
        } finally {
            this.isRunning = false;
        }
    }

    // 🔄 Ejecutar suite específica
    async runSuite(suiteName, options = {}) {
        if (!this.testFramework.suites.has(suiteName)) {
            throw new Error(`Suite "${suiteName}" no encontrada`);
        }

        console.log(`🔄 Ejecutando suite: ${suiteName}`);
        
        const suite = this.testFramework.suites.get(suiteName);
        const results = await this.testFramework.runSuite(suite);
        
        console.log(`✅ Suite ${suiteName} completada`);
        return results;
    }

    // 🧪 Ejecutar test específico
    async runTest(testName, options = {}) {
        const testKey = Object.keys(this.testFramework.tests).find(key => 
            key.includes(testName)
        );
        
        if (!testKey) {
            throw new Error(`Test "${testName}" no encontrado`);
        }

        console.log(`🧪 Ejecutando test: ${testName}`);
        
        const test = this.testFramework.tests.get(testKey);
        const suite = this.testFramework.suites.get(test.suite);
        
        await this.testFramework.runTest(test, suite);
        
        console.log(`✅ Test ${testName} completado`);
        return test;
    }

    // ⏰ Programar ejecuciones automáticas
    scheduleAutomaticRuns() {
        console.log(`⏰ Programando ejecuciones automáticas cada ${this.config.interval}ms`);
        
        const intervalId = setInterval(async () => {
            try {
                console.log('🤖 Ejecutando tests automáticos programados...');
                await this.runAllTests({ type: 'automatic' });
            } catch (error) {
                console.error('❌ Error en ejecución automática:', error);
            }
        }, this.config.interval);
        
        this.scheduledRuns.push(intervalId);
    }

    // 🛑 Detener ejecuciones automáticas
    stopAutomaticRuns() {
        this.scheduledRuns.forEach(intervalId => {
            clearInterval(intervalId);
        });
        this.scheduledRuns = [];
        console.log('🛑 Ejecuciones automáticas detenidas');
    }

    // 🔍 Verificaciones pre-ejecución
    async preRunChecks() {
        console.log('🔍 Ejecutando verificaciones pre-ejecución...');
        
        const checks = {
            firebase: typeof firebase !== 'undefined',
            testFramework: !!this.testFramework,
            dom: !!document.getElementById('app'),
            dependencies: this.checkDependencies()
        };
        
        const failedChecks = Object.entries(checks)
            .filter(([key, value]) => !value)
            .map(([key]) => key);
        
        if (failedChecks.length > 0) {
            console.warn('⚠️ Verificaciones fallidas:', failedChecks);
        }
        
        return checks;
    }

    // 📦 Verificar dependencias
    checkDependencies() {
        const dependencies = [
            'firebase',
            'lucide',
            'Chart',
            'expect',
            'TestingFramework'
        ];
        
        return dependencies.every(dep => typeof window[dep] !== 'undefined');
    }

    // 📊 Acciones post-ejecución
    async postRunActions(results, config) {
        console.log('📊 Ejecutando acciones post-ejecución...');
        
        // Generar reporte HTML si está configurado
        if (config.generateReport) {
            this.testFramework.saveHTMLReport();
        }
        
        // Enviar métricas de rendimiento
        if (config.performance) {
            this.collectPerformanceMetrics(results);
        }
        
        // Limpiar recursos si es necesario
        await this.cleanup();
    }

    // 📈 Recopilar métricas de rendimiento
    collectPerformanceMetrics(results) {
        const metrics = {
            timestamp: new Date().toISOString(),
            totalTests: results.total,
            passRate: results.total > 0 ? (results.passed / results.total * 100) : 0,
            averageTestDuration: this.calculateAverageTestDuration(),
            memoryUsage: this.getMemoryUsage(),
            browserInfo: this.getBrowserInfo()
        };
        
        console.log('📈 Métricas de rendimiento:', metrics);
        
        // Guardar métricas en localStorage para análisis histórico
        this.saveMetrics(metrics);
        
        return metrics;
    }

    // ⏱️ Calcular duración promedio de tests
    calculateAverageTestDuration() {
        const tests = Array.from(this.testFramework.tests.values());
        const totalDuration = tests.reduce((sum, test) => sum + (test.duration || 0), 0);
        return tests.length > 0 ? totalDuration / tests.length : 0;
    }

    // 💾 Obtener uso de memoria
    getMemoryUsage() {
        if (window.performance && window.performance.memory) {
            return {
                used: window.performance.memory.usedJSHeapSize,
                total: window.performance.memory.totalJSHeapSize,
                limit: window.performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }

    // 🌐 Obtener información del navegador
    getBrowserInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };
    }

    // 💾 Guardar métricas históricas
    saveMetrics(metrics) {
        try {
            const existingMetrics = JSON.parse(localStorage.getItem('testMetrics') || '[]');
            existingMetrics.push(metrics);
            
            // Mantener solo las últimas 100 métricas
            if (existingMetrics.length > 100) {
                existingMetrics.splice(0, existingMetrics.length - 100);
            }
            
            localStorage.setItem('testMetrics', JSON.stringify(existingMetrics));
        } catch (error) {
            console.warn('⚠️ No se pudieron guardar las métricas:', error);
        }
    }

    // 📊 Obtener métricas históricas
    getHistoricalMetrics() {
        try {
            return JSON.parse(localStorage.getItem('testMetrics') || '[]');
        } catch (error) {
            console.warn('⚠️ No se pudieron cargar las métricas históricas:', error);
            return [];
        }
    }

    // 🔔 Notificar resultados
    notifyResults(run) {
        const { results } = run;
        
        if (results.failed > 0) {
            console.error(`❌ ${results.failed} tests fallaron de ${results.total}`);
            
            if (this.config.onFailure === 'notify' && 'Notification' in window) {
                this.showNotification('Tests Fallaron', `${results.failed} de ${results.total} tests fallaron`);
            }
        } else {
            console.log(`✅ Todos los tests pasaron (${results.total}/${results.total})`);
            
            if ('Notification' in window) {
                this.showNotification('Tests Exitosos', `Todos los ${results.total} tests pasaron`);
            }
        }
    }

    // 🔔 Mostrar notificación del navegador
    showNotification(title, message) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, {
                        body: message,
                        icon: '/favicon.ico'
                    });
                }
            });
        }
    }

    // 🧹 Limpiar recursos
    async cleanup() {
        // Limpiar cualquier recurso temporal creado durante los tests
        console.log('🧹 Limpiando recursos de testing...');
        
        // Remover elementos DOM temporales
        const tempElements = document.querySelectorAll('[data-test-temp]');
        tempElements.forEach(element => element.remove());
        
        // Limpiar timers si los hay
        // (Los timers específicos se limpiarían aquí)
    }

    // 🆔 Generar ID único para ejecución
    generateRunId() {
        return 'run-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // ⚙️ Actualizar configuración
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('⚙️ Configuración actualizada:', this.config);
        
        // Reconfigurar ejecuciones automáticas si es necesario
        if (newConfig.autoRun !== undefined) {
            if (newConfig.autoRun) {
                this.scheduleAutomaticRuns();
            } else {
                this.stopAutomaticRuns();
            }
        }
    }

    // 📊 Obtener estado actual
    getStatus() {
        return {
            isRunning: this.isRunning,
            currentRun: this.currentRun,
            config: this.config,
            scheduledRuns: this.scheduledRuns.length,
            historicalMetrics: this.getHistoricalMetrics().length
        };
    }
}

// 🌐 Exportar para uso global
window.TestRunner = TestRunner;
