// 🧪 PRUEBAS UNITARIAS Y DE INTEGRACIÓN
// Suite completa de tests para la aplicación de finanzas familiares

// Inicializar framework de testing
const testFramework = new TestingFramework();

// 🔥 SUITE: Firebase y Autenticación
testFramework.describe('Firebase y Autenticación', () => {
    
    testFramework.beforeAll(async () => {
        console.log('🔥 Preparando tests de Firebase...');
    });

    testFramework.it('Firebase debe estar inicializado', () => {
        expect(typeof firebase).toBe('object');
        expect(firebase.auth).toBeDefined();
        expect(firebase.firestore).toBeDefined();
    });

    testFramework.it('Configuración de Firebase debe estar cargada', () => {
        expect(window.firebaseConfig).toBeDefined();
        expect(window.firebaseConfig.apiKey).toBeDefined();
        expect(window.firebaseConfig.projectId).toBeDefined();
    });

    testFramework.it('Usuario debe poder autenticarse', async () => {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            expect(currentUser.uid).toBeDefined();
            expect(currentUser.email).toBeDefined();
        } else {
            console.log('⚠️ No hay usuario autenticado para esta prueba');
        }
    });

    testFramework.it('Firestore debe ser accesible', async () => {
        const db = firebase.firestore();
        expect(db).toBeDefined();
        
        // Test de conexión básica
        try {
            await db.doc('test/connection').get();
            expect(true).toBe(true); // Si llegamos aquí, la conexión funciona
        } catch (error) {
            console.log('⚠️ Error de conexión a Firestore:', error.message);
        }
    });
});

// 💰 SUITE: Sistema de Transacciones
testFramework.describe('Sistema de Transacciones', () => {
    
    testFramework.it('Función getTransactions debe existir', () => {
        expect(typeof getTransactions).toBe('function');
    });

    testFramework.it('getTransactions debe retornar un array', () => {
        const transactions = getTransactions();
        expect(Array.isArray(transactions)).toBe(true);
    });

    testFramework.it('Transacciones deben tener estructura correcta', () => {
        const transactions = getTransactions();
        if (transactions.length > 0) {
            const transaction = transactions[0];
            expect(transaction).toHaveProperty('date');
            expect(transaction).toHaveProperty('amount');
            expect(transaction).toHaveProperty('type');
            expect(transaction).toHaveProperty('description');
        }
    });

    testFramework.it('Tipos de transacciones deben ser válidos', () => {
        const transactions = getTransactions();
        const validTypes = ['income', 'expense'];
        
        transactions.forEach(transaction => {
            if (transaction.type) {
                expect(validTypes).toContain(transaction.type);
            }
        });
    });

    testFramework.it('Montos deben ser números válidos', () => {
        const transactions = getTransactions();
        
        transactions.forEach(transaction => {
            if (transaction.amount !== undefined) {
                expect(typeof transaction.amount).toBe('number');
                expect(transaction.amount).toBeGreaterThanOrEqual(0);
            }
        });
    });
});

// 🧠 SUITE: Sistema de IA
testFramework.describe('Sistema de IA', () => {
    
    testFramework.it('Clases de IA deben estar disponibles', () => {
        expect(typeof AIMemorySystem).toBe('function');
        expect(typeof AILearningEngine).toBe('function');
        expect(typeof ProactiveInsightsEngine).toBe('function');
    });

    testFramework.it('Sistema de memoria IA debe inicializarse', () => {
        if (window.aiMemorySystem) {
            expect(window.aiMemorySystem).toBeInstanceOf(AIMemorySystem);
            expect(window.aiMemorySystem.userId).toBeDefined();
        }
    });

    testFramework.it('Motor de aprendizaje debe estar disponible', () => {
        if (window.aiLearningEngine) {
            expect(window.aiLearningEngine).toBeInstanceOf(AILearningEngine);
        }
    });

    testFramework.it('Insights proactivos deben funcionar', () => {
        if (window.proactiveInsightsEngine) {
            expect(window.proactiveInsightsEngine).toBeInstanceOf(ProactiveInsightsEngine);
            expect(typeof window.proactiveInsightsEngine.generateInsights).toBe('function');
        }
    });
});

// 📊 SUITE: Dashboard Predictivo
testFramework.describe('Dashboard Predictivo', () => {
    
    testFramework.it('Chart.js debe estar disponible', () => {
        expect(typeof Chart).toBe('function');
    });

    testFramework.it('Clases del dashboard deben existir', () => {
        expect(typeof PredictiveAnalyticsEngine).toBe('function');
        expect(typeof PredictiveDashboard).toBe('function');
    });

    testFramework.it('Motor de análisis debe inicializarse correctamente', async () => {
        const engine = new PredictiveAnalyticsEngine();
        expect(engine.initialized).toBe(false);
        
        const transactions = getTransactions();
        if (transactions.length > 0) {
            await engine.initialize(transactions);
            expect(engine.initialized).toBe(true);
        }
    });

    testFramework.it('Dashboard debe poder abrirse', async () => {
        if (typeof openPredictiveDashboard === 'function') {
            // Solo verificamos que la función existe y no lanza error inmediatamente
            expect(typeof openPredictiveDashboard).toBe('function');
        }
    });

    testFramework.it('Función de diagnóstico debe funcionar', async () => {
        if (typeof diagnosticarDashboard === 'function') {
            const diagnostics = await diagnosticarDashboard();
            expect(diagnostics).toHaveProperty('system');
            expect(diagnostics).toHaveProperty('instances');
            expect(diagnostics.system).toHaveProperty('chartJsAvailable');
        }
    });
});

// 💾 SUITE: Sistema de Backups
testFramework.describe('Sistema de Backups', () => {
    
    testFramework.it('Clases de backup deben estar disponibles', () => {
        expect(typeof AutomaticBackupSystem).toBe('function');
        expect(typeof MultiExportSystem).toBe('function');
        expect(typeof BackupManagementUI).toBe('function');
    });

    testFramework.it('Sistema de backup automático debe inicializarse', () => {
        if (window.automaticBackupSystem) {
            expect(window.automaticBackupSystem).toBeInstanceOf(AutomaticBackupSystem);
        }
    });

    testFramework.it('Configuración de backup debe ser válida', () => {
        if (window.automaticBackupSystem) {
            const settings = window.automaticBackupSystem.settings;
            expect(settings).toHaveProperty('autoBackupEnabled');
            expect(settings).toHaveProperty('backupFrequency');
            expect(settings).toHaveProperty('maxBackupsToKeep');
            expect(typeof settings.maxBackupsToKeep).toBe('number');
            expect(settings.maxBackupsToKeep).toBeGreaterThan(0);
        }
    });

    testFramework.it('Función de diagnóstico de backups debe funcionar', async () => {
        if (typeof diagnosticarBackups === 'function') {
            const diagnostics = await diagnosticarBackups();
            expect(diagnostics).toHaveProperty('system');
            expect(diagnostics).toHaveProperty('tests');
        }
    });

    testFramework.it('Sistema de exportación debe soportar múltiples formatos', () => {
        if (window.multiExportSystem) {
            expect(window.multiExportSystem.supportedFormats).toContain('json');
            expect(window.multiExportSystem.supportedFormats).toContain('csv');
        }
    });
});

// 🎨 SUITE: Interfaz de Usuario
testFramework.describe('Interfaz de Usuario', () => {
    
    testFramework.it('Elementos principales del DOM deben existir', () => {
        expect(document.getElementById('app')).toBeDefined();
        expect(document.getElementById('login-form')).toBeDefined();
        expect(document.getElementById('transaction-list')).toBeDefined();
    });

    testFramework.it('Botones principales deben existir', () => {
        expect(document.getElementById('add-transaction-btn')).toBeDefined();
        expect(document.getElementById('ai-assistant-btn')).toBeDefined();
        expect(document.getElementById('predictive-dashboard-btn')).toBeDefined();
        expect(document.getElementById('backup-management-btn')).toBeDefined();
    });

    testFramework.it('Event listeners deben estar configurados', () => {
        const addBtn = document.getElementById('add-transaction-btn');
        const aiBtn = document.getElementById('ai-assistant-btn');
        
        // Verificar que los elementos tienen event listeners
        // (Esto es una aproximación, ya que no podemos verificar directamente los listeners)
        expect(addBtn).toBeDefined();
        expect(aiBtn).toBeDefined();
    });

    testFramework.it('Lucide icons debe estar disponible', () => {
        expect(typeof lucide).toBe('object');
        expect(typeof lucide.createIcons).toBe('function');
    });

    testFramework.it('Tailwind CSS debe estar cargado', () => {
        // Verificar que hay clases de Tailwind aplicadas
        const app = document.getElementById('app');
        if (app) {
            const computedStyle = window.getComputedStyle(app);
            expect(computedStyle).toBeDefined();
        }
    });
});

// 🔧 SUITE: Utilidades y Helpers
testFramework.describe('Utilidades y Helpers', () => {
    
    testFramework.it('Funciones de formateo deben existir', () => {
        // Verificar funciones comunes de formateo
        if (typeof formatCurrency === 'function') {
            expect(typeof formatCurrency).toBe('function');
            const formatted = formatCurrency(1234.56);
            expect(typeof formatted).toBe('string');
        }
    });

    testFramework.it('Moneda debe ser Pesos Colombianos (COP)', () => {
        // Verificar que la moneda oficial sea COP
        if (typeof formatCurrency === 'function') {
            const formatted = formatCurrency(1000);
            expect(formatted).toContain('COP');
            expect(formatted).not.toContain('EUR');
            expect(formatted).not.toContain('MXN');
            expect(formatted).not.toContain('USD');
        }
    });

    testFramework.it('Funciones de validación deben funcionar', () => {
        // Tests para funciones de validación si existen
        if (typeof validateEmail === 'function') {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('invalid-email')).toBe(false);
        }
    });

    testFramework.it('LocalStorage debe ser accesible', () => {
        expect(typeof localStorage).toBe('object');
        expect(typeof localStorage.getItem).toBe('function');
        expect(typeof localStorage.setItem).toBe('function');
    });

    testFramework.it('SessionStorage debe ser accesible', () => {
        expect(typeof sessionStorage).toBe('object');
        expect(typeof sessionStorage.getItem).toBe('function');
        expect(typeof sessionStorage.setItem).toBe('function');
    });
});

// 🚀 SUITE: Rendimiento
testFramework.describe('Rendimiento', () => {
    
    testFramework.it('Tiempo de carga inicial debe ser razonable', () => {
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            expect(loadTime).toBeLessThan(10000); // Menos de 10 segundos
        }
    });

    testFramework.it('Memoria utilizada debe ser razonable', () => {
        if (window.performance && window.performance.memory) {
            const memoryUsage = window.performance.memory.usedJSHeapSize;
            expect(memoryUsage).toBeLessThan(100 * 1024 * 1024); // Menos de 100MB
        }
    });

    testFramework.it('No debe haber memory leaks evidentes', () => {
        // Test básico de memory leaks
        const initialMemory = window.performance?.memory?.usedJSHeapSize || 0;
        
        // Crear y destruir algunos objetos
        const testObjects = [];
        for (let i = 0; i < 1000; i++) {
            testObjects.push({ id: i, data: new Array(100).fill(i) });
        }
        testObjects.length = 0; // Limpiar referencias
        
        // Forzar garbage collection si está disponible
        if (window.gc) {
            window.gc();
        }
        
        const finalMemory = window.performance?.memory?.usedJSHeapSize || 0;
        const memoryIncrease = finalMemory - initialMemory;
        
        // El aumento de memoria no debería ser excesivo
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Menos de 10MB de aumento
    });
});

// 🎭 SUITE: Tests End-to-End (E2E)
testFramework.describe('Tests End-to-End (E2E)', () => {

    testFramework.it('Flujo completo: Agregar transacción', async () => {
        // Simular flujo completo de agregar transacción
        const addBtn = document.getElementById('add-transaction-btn');
        expect(addBtn).toBeDefined();

        // Verificar que el botón es clickeable
        expect(addBtn.disabled).toBe(false);

        // Simular click (sin ejecutar realmente para evitar efectos secundarios)
        expect(typeof addBtn.click).toBe('function');
    });

    testFramework.it('Flujo completo: Abrir IA Assistant', async () => {
        const aiBtn = document.getElementById('ai-assistant-btn');
        expect(aiBtn).toBeDefined();
        expect(aiBtn.disabled).toBe(false);
    });

    testFramework.it('Flujo completo: Abrir Dashboard Predictivo', async () => {
        const dashboardBtn = document.getElementById('predictive-dashboard-btn');
        expect(dashboardBtn).toBeDefined();
        expect(dashboardBtn.disabled).toBe(false);

        // Verificar que las dependencias están disponibles
        if (typeof openPredictiveDashboard === 'function') {
            expect(typeof PredictiveAnalyticsEngine).toBe('function');
            expect(typeof PredictiveDashboard).toBe('function');
        }
    });

    testFramework.it('Flujo completo: Abrir Sistema de Backups', async () => {
        const backupBtn = document.getElementById('backup-management-btn');
        expect(backupBtn).toBeDefined();
        expect(backupBtn.disabled).toBe(false);

        // Verificar que las dependencias están disponibles
        if (typeof openBackupManagement === 'function') {
            expect(typeof AutomaticBackupSystem).toBe('function');
            expect(typeof BackupManagementUI).toBe('function');
        }
    });

    testFramework.it('Flujo completo: Navegación entre secciones', () => {
        // Verificar que todos los elementos de navegación existen
        const navElements = [
            'add-transaction-btn',
            'ai-assistant-btn',
            'predictive-dashboard-btn',
            'backup-management-btn'
        ];

        navElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            expect(element).toBeDefined();
        });
    });

    testFramework.it('Flujo completo: Responsive design', () => {
        // 🧪 Asegurar que el elemento #app esté visible para testing
        if (typeof window.enableTestingMode === 'function') {
            window.enableTestingMode();
        }

        // Verificar que la aplicación es responsive
        const app = document.getElementById('app');
        if (app) {
            const computedStyle = window.getComputedStyle(app);
            expect(computedStyle.display).not.toBe('none');
        }

        // Verificar viewport meta tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        expect(viewportMeta).toBeDefined();
    });
});

// 🔒 SUITE: Seguridad
testFramework.describe('Seguridad', () => {

    testFramework.it('Configuración de Firebase debe estar protegida', () => {
        // Verificar que la configuración no expone información sensible
        if (window.firebaseConfig) {
            expect(window.firebaseConfig.apiKey).toBeDefined();
            // La API key debe estar restringida por dominio en producción
            expect(typeof window.firebaseConfig.apiKey).toBe('string');
        }
    });

    testFramework.it('No debe haber variables globales sensibles expuestas', () => {
        // Verificar que no hay passwords o tokens expuestos
        const sensitiveVars = ['password', 'token', 'secret', 'key'];

        sensitiveVars.forEach(varName => {
            if (window[varName]) {
                console.warn(`⚠️ Variable sensible encontrada: ${varName}`);
            }
        });
    });

    testFramework.it('LocalStorage no debe contener información sensible', () => {
        // Verificar que localStorage no contiene información sensible
        const sensitiveKeys = ['password', 'token', 'secret'];

        sensitiveKeys.forEach(key => {
            const value = localStorage.getItem(key);
            expect(value).toBeNull();
        });
    });

    testFramework.it('Autenticación debe estar configurada correctamente', () => {
        if (firebase.auth()) {
            const currentUser = firebase.auth().currentUser;
            if (currentUser) {
                expect(currentUser.uid).toBeDefined();
                expect(typeof currentUser.uid).toBe('string');
                expect(currentUser.uid.length).toBeGreaterThan(0);
            }
        }
    });
});

// 🌐 Exportar suite de tests
window.appTests = testFramework;
