// 🎨 INTERFAZ DE USUARIO PARA TESTING
// Panel de control completo para ejecutar y monitorear tests

class TestingUI {
    constructor() {
        this.testRunner = null;
        this.currentModal = null;
        this.isVisible = false;
        this.refreshInterval = null;
        
        console.log('🎨 Interfaz de Testing inicializada');
    }

    // 🚀 Inicializar con test runner
    initialize(testRunner) {
        this.testRunner = testRunner;
        console.log('✅ Interfaz de Testing conectada al runner');
    }

    // 📊 Mostrar panel de testing
    showTestingPanel() {
        if (this.isVisible) {
            console.log('⚠️ Panel de testing ya está visible');
            return;
        }

        const modal = this.createTestingModal();
        document.body.appendChild(modal);
        this.currentModal = modal;
        this.isVisible = true;
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Cargar datos iniciales
        this.loadTestingData();
        
        // Inicializar iconos
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Configurar actualización automática
        this.startAutoRefresh();
        
        console.log('📊 Panel de testing mostrado');
    }

    // 🎨 Crear modal del panel de testing
    createTestingModal() {
        const modal = document.createElement('div');
        modal.id = 'testing-panel-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 w-full max-w-7xl m-4 rounded-2xl shadow-xl flex flex-col max-h-[95vh]">
                <!-- Header -->
                <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <div class="flex items-center gap-3">
                        <i data-lucide="flask" class="text-blue-500 w-6 h-6"></i>
                        <div>
                            <h3 class="text-2xl font-bold">Sistema de Testing Avanzado</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Pruebas unitarias, integración y E2E</p>
                        </div>
                    </div>
                    <button class="js-close-testing-panel p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto">
                    <!-- Tabs -->
                    <div class="border-b dark:border-gray-700">
                        <nav class="flex space-x-8 px-6">
                            <button class="testing-tab active py-4 px-1 border-b-2 border-blue-500 font-medium text-blue-600" data-tab="dashboard">
                                <i data-lucide="gauge" class="w-4 h-4 inline mr-2"></i>Dashboard
                            </button>
                            <button class="testing-tab py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700" data-tab="runner">
                                <i data-lucide="play" class="w-4 h-4 inline mr-2"></i>Ejecutar Tests
                            </button>
                            <button class="testing-tab py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700" data-tab="results">
                                <i data-lucide="bar-chart-3" class="w-4 h-4 inline mr-2"></i>Resultados
                            </button>
                            <button class="testing-tab py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700" data-tab="coverage">
                                <i data-lucide="shield-check" class="w-4 h-4 inline mr-2"></i>Cobertura
                            </button>
                            <button class="testing-tab py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700" data-tab="config">
                                <i data-lucide="settings" class="w-4 h-4 inline mr-2"></i>Configuración
                            </button>
                        </nav>
                    </div>

                    <!-- Tab Content -->
                    <div class="p-6">
                        <!-- Dashboard Tab -->
                        <div id="tab-dashboard" class="tab-content">
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <div class="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-green-600 dark:text-green-400 text-sm font-medium">Tests Pasados</p>
                                            <p id="tests-passed" class="text-2xl font-bold text-green-800 dark:text-green-200">0</p>
                                        </div>
                                        <i data-lucide="check-circle" class="w-8 h-8 text-green-500"></i>
                                    </div>
                                </div>
                                <div class="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-red-600 dark:text-red-400 text-sm font-medium">Tests Fallidos</p>
                                            <p id="tests-failed" class="text-2xl font-bold text-red-800 dark:text-red-200">0</p>
                                        </div>
                                        <i data-lucide="x-circle" class="w-8 h-8 text-red-500"></i>
                                    </div>
                                </div>
                                <div class="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Tests Omitidos</p>
                                            <p id="tests-skipped" class="text-2xl font-bold text-yellow-800 dark:text-yellow-200">0</p>
                                        </div>
                                        <i data-lucide="skip-forward" class="w-8 h-8 text-yellow-500"></i>
                                    </div>
                                </div>
                                <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-blue-600 dark:text-blue-400 text-sm font-medium">Tasa de Éxito</p>
                                            <p id="success-rate" class="text-2xl font-bold text-blue-800 dark:text-blue-200">0%</p>
                                        </div>
                                        <i data-lucide="trending-up" class="w-8 h-8 text-blue-500"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">📊 Estado del Sistema</h4>
                                    <div id="system-status" class="space-y-2">
                                        <div class="flex justify-between">
                                            <span>Framework de Testing:</span>
                                            <span id="framework-status" class="font-medium">Cargando...</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Test Runner:</span>
                                            <span id="runner-status" class="font-medium">Cargando...</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Última Ejecución:</span>
                                            <span id="last-run" class="font-medium">Nunca</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Tests Automáticos:</span>
                                            <span id="auto-tests" class="font-medium">Deshabilitados</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">⚡ Acciones Rápidas</h4>
                                    <div class="space-y-3">
                                        <button id="run-all-tests-btn" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                            <i data-lucide="play" class="w-4 h-4 inline mr-2"></i>Ejecutar Todos los Tests
                                        </button>
                                        <button id="run-unit-tests-btn" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                            <i data-lucide="zap" class="w-4 h-4 inline mr-2"></i>Solo Tests Unitarios
                                        </button>
                                        <button id="run-integration-tests-btn" class="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                                            <i data-lucide="link" class="w-4 h-4 inline mr-2"></i>Solo Tests de Integración
                                        </button>
                                        <button id="generate-report-btn" class="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                                            <i data-lucide="file-text" class="w-4 h-4 inline mr-2"></i>Generar Reporte
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Runner Tab -->
                        <div id="tab-runner" class="tab-content hidden">
                            <div class="space-y-6">
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">🎯 Seleccionar Tests</h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium mb-2">Suite de Tests</label>
                                            <select id="test-suite-select" class="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500">
                                                <option value="all">Todas las Suites</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium mb-2">Tipo de Ejecución</label>
                                            <select id="execution-type" class="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500">
                                                <option value="sequential">Secuencial</option>
                                                <option value="parallel">Paralelo</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mt-4 space-y-2">
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="include-performance" checked class="rounded">
                                            <span>Incluir métricas de rendimiento</span>
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="generate-coverage" checked class="rounded">
                                            <span>Generar reporte de cobertura</span>
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="stop-on-failure" class="rounded">
                                            <span>Detener en primer fallo</span>
                                        </label>
                                    </div>
                                </div>

                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">▶️ Ejecutar Tests</h4>
                                    <div class="flex gap-3">
                                        <button id="start-tests-btn" class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                                            <i data-lucide="play" class="w-5 h-5 inline mr-2"></i>Iniciar Ejecución
                                        </button>
                                        <button id="stop-tests-btn" class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" disabled>
                                            <i data-lucide="square" class="w-5 h-5"></i>
                                        </button>
                                    </div>
                                </div>

                                <div id="test-progress" class="hidden bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">📊 Progreso de Ejecución</h4>
                                    <div class="space-y-3">
                                        <div class="flex justify-between text-sm">
                                            <span>Progreso:</span>
                                            <span id="progress-text">0/0</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-2">
                                            <div id="progress-bar" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                                        </div>
                                        <div id="current-test" class="text-sm text-gray-600 dark:text-gray-400">
                                            Esperando inicio...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Results Tab -->
                        <div id="tab-results" class="tab-content hidden">
                            <div class="space-y-6">
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">📊 Resultados de la Última Ejecución</h4>
                                    <div id="latest-results" class="space-y-2">
                                        <p class="text-gray-500 text-sm">No hay resultados disponibles</p>
                                    </div>
                                </div>

                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">📈 Historial de Ejecuciones</h4>
                                    <div id="execution-history" class="space-y-2 max-h-64 overflow-y-auto">
                                        <p class="text-gray-500 text-sm">No hay historial disponible</p>
                                    </div>
                                </div>

                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">❌ Errores Detallados</h4>
                                    <div id="detailed-errors" class="space-y-2 max-h-64 overflow-y-auto">
                                        <p class="text-gray-500 text-sm">No hay errores recientes</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Coverage Tab -->
                        <div id="tab-coverage" class="tab-content hidden">
                            <div class="space-y-6">
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">📊 Cobertura de Código</h4>
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div class="text-center">
                                            <div class="text-2xl font-bold text-green-600">85%</div>
                                            <div class="text-sm text-gray-500">Líneas</div>
                                        </div>
                                        <div class="text-center">
                                            <div class="text-2xl font-bold text-blue-600">78%</div>
                                            <div class="text-sm text-gray-500">Funciones</div>
                                        </div>
                                        <div class="text-center">
                                            <div class="text-2xl font-bold text-purple-600">92%</div>
                                            <div class="text-sm text-gray-500">Ramas</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">📁 Cobertura por Archivo</h4>
                                    <div id="file-coverage" class="space-y-2">
                                        <p class="text-gray-500 text-sm">Ejecuta tests para ver cobertura detallada</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Configuration Tab -->
                        <div id="tab-config" class="tab-content hidden">
                            <div class="space-y-6">
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">⚙️ Configuración General</h4>
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium mb-2">Timeout por Test (ms)</label>
                                            <input type="number" id="test-timeout" min="1000" max="60000" class="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium mb-2">Reintentos por Test</label>
                                            <input type="number" id="test-retries" min="0" max="5" class="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500">
                                        </div>
                                        <div class="flex items-center space-x-3">
                                            <input type="checkbox" id="auto-run-enabled" class="rounded">
                                            <span>Habilitar ejecución automática</span>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium mb-2">Intervalo de ejecución automática (minutos)</label>
                                            <input type="number" id="auto-run-interval" min="1" max="60" class="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500">
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">🔔 Notificaciones</h4>
                                    <div class="space-y-2">
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="notify-on-failure" checked class="rounded">
                                            <span>Notificar en fallos</span>
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="notify-on-success" class="rounded">
                                            <span>Notificar en éxito</span>
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="browser-notifications" class="rounded">
                                            <span>Usar notificaciones del navegador</span>
                                        </label>
                                    </div>
                                </div>

                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">💾 Guardar Configuración</h4>
                                    <button id="save-config-btn" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                        <i data-lucide="save" class="w-4 h-4 inline mr-2"></i>Guardar Configuración
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return modal;
    }

    // 🎯 Configurar event listeners
    setupEventListeners() {
        const modal = this.currentModal;
        if (!modal) return;

        // Cerrar modal
        modal.querySelector('.js-close-testing-panel').addEventListener('click', () => {
            this.closeTestingPanel();
        });

        // Tabs
        modal.querySelectorAll('.testing-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Acciones rápidas del dashboard
        modal.querySelector('#run-all-tests-btn').addEventListener('click', () => {
            this.runAllTests();
        });

        modal.querySelector('#run-unit-tests-btn').addEventListener('click', () => {
            this.runTestSuite('Firebase y Autenticación');
        });

        modal.querySelector('#run-integration-tests-btn').addEventListener('click', () => {
            this.runTestSuite('Tests End-to-End (E2E)');
        });

        modal.querySelector('#generate-report-btn').addEventListener('click', () => {
            this.generateReport();
        });

        // Controles del runner
        modal.querySelector('#start-tests-btn').addEventListener('click', () => {
            this.startTestExecution();
        });

        modal.querySelector('#stop-tests-btn').addEventListener('click', () => {
            this.stopTestExecution();
        });

        // Configuración
        modal.querySelector('#save-config-btn').addEventListener('click', () => {
            this.saveConfiguration();
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.closeTestingPanel();
            }
        });
    }

    // 📊 Cargar datos de testing
    async loadTestingData() {
        try {
            // Cargar estado del sistema
            this.updateSystemStatus();

            // Cargar estadísticas
            this.updateStatistics();

            // Cargar configuración
            this.loadConfiguration();

            // Cargar suites disponibles
            this.loadAvailableTestSuites();

        } catch (error) {
            console.error('❌ Error cargando datos de testing:', error);
        }
    }

    // 🔄 Actualizar estado del sistema
    updateSystemStatus() {
        const modal = this.currentModal;
        if (!modal) return;

        // Estado del framework
        const frameworkStatus = modal.querySelector('#framework-status');
        frameworkStatus.textContent = this.testRunner?.testFramework ? '✅ Activo' : '❌ No disponible';
        frameworkStatus.className = this.testRunner?.testFramework ? 'font-medium text-green-600' : 'font-medium text-red-600';

        // Estado del runner
        const runnerStatus = modal.querySelector('#runner-status');
        runnerStatus.textContent = this.testRunner ? '✅ Listo' : '❌ No inicializado';
        runnerStatus.className = this.testRunner ? 'font-medium text-green-600' : 'font-medium text-red-600';

        // Última ejecución
        const lastRun = modal.querySelector('#last-run');
        if (this.testRunner?.currentRun) {
            const date = new Date(this.testRunner.currentRun.startTime);
            lastRun.textContent = date.toLocaleString('es-ES');
        }

        // Tests automáticos
        const autoTests = modal.querySelector('#auto-tests');
        const isAutoEnabled = this.testRunner?.config?.autoRun;
        autoTests.textContent = isAutoEnabled ? '✅ Habilitados' : '❌ Deshabilitados';
        autoTests.className = isAutoEnabled ? 'font-medium text-green-600' : 'font-medium text-red-600';
    }

    // 📊 Actualizar estadísticas
    updateStatistics() {
        const modal = this.currentModal;
        if (!modal || !this.testRunner?.testFramework) return;

        const results = this.testRunner.testFramework.results;

        modal.querySelector('#tests-passed').textContent = results.passed || 0;
        modal.querySelector('#tests-failed').textContent = results.failed || 0;
        modal.querySelector('#tests-skipped').textContent = results.skipped || 0;

        const successRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : 0;
        modal.querySelector('#success-rate').textContent = `${successRate}%`;
    }

    // ⚙️ Cargar configuración
    loadConfiguration() {
        const modal = this.currentModal;
        if (!modal || !this.testRunner) return;

        const config = this.testRunner.config;

        modal.querySelector('#test-timeout').value = config.timeout || 10000;
        modal.querySelector('#test-retries').value = config.retries || 3;
        modal.querySelector('#auto-run-enabled').checked = config.autoRun || false;
        modal.querySelector('#auto-run-interval').value = (config.interval || 300000) / 60000; // Convertir a minutos
    }

    // 📋 Cargar suites de tests disponibles
    loadAvailableTestSuites() {
        const modal = this.currentModal;
        if (!modal || !this.testRunner?.testFramework) return;

        const select = modal.querySelector('#test-suite-select');
        const suites = Array.from(this.testRunner.testFramework.suites.keys());

        // Limpiar opciones existentes (excepto "Todas las Suites")
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }

        // Agregar suites disponibles
        suites.forEach(suiteName => {
            const option = document.createElement('option');
            option.value = suiteName;
            option.textContent = suiteName;
            select.appendChild(option);
        });
    }

    // 🔄 Cambiar tab
    switchTab(tabName) {
        const modal = this.currentModal;
        if (!modal) return;

        // Actualizar tabs
        modal.querySelectorAll('.testing-tab').forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active', 'border-blue-500', 'text-blue-600');
                tab.classList.remove('border-transparent', 'text-gray-500');
            } else {
                tab.classList.remove('active', 'border-blue-500', 'text-blue-600');
                tab.classList.add('border-transparent', 'text-gray-500');
            }
        });

        // Mostrar contenido
        modal.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === `tab-${tabName}`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });

        // Cargar datos específicos del tab si es necesario
        if (tabName === 'results') {
            this.loadTestResults();
        } else if (tabName === 'coverage') {
            this.loadCoverageData();
        }
    }

    // ▶️ Ejecutar todos los tests
    async runAllTests() {
        if (!this.testRunner) {
            this.showNotification('Test Runner no disponible', 'error');
            return;
        }

        try {
            this.showNotification('Iniciando ejecución de todos los tests...', 'info');
            this.showProgress(true);

            const results = await this.testRunner.runAllTests();

            this.updateStatistics();
            this.showNotification(`Tests completados: ${results.passed}/${results.total} pasaron`, 'success');

        } catch (error) {
            console.error('❌ Error ejecutando tests:', error);
            this.showNotification('Error ejecutando tests: ' + error.message, 'error');
        } finally {
            this.showProgress(false);
        }
    }

    // 📋 Ejecutar suite específica
    async runTestSuite(suiteName) {
        if (!this.testRunner) {
            this.showNotification('Test Runner no disponible', 'error');
            return;
        }

        try {
            this.showNotification(`Ejecutando suite: ${suiteName}...`, 'info');

            const results = await this.testRunner.runSuite(suiteName);

            this.updateStatistics();
            this.showNotification(`Suite completada: ${results.passed}/${results.total} tests pasaron`, 'success');

        } catch (error) {
            console.error('❌ Error ejecutando suite:', error);
            this.showNotification('Error ejecutando suite: ' + error.message, 'error');
        }
    }

    // 📊 Generar reporte
    generateReport() {
        if (!this.testRunner?.testFramework) {
            this.showNotification('No hay datos para generar reporte', 'warning');
            return;
        }

        try {
            this.testRunner.testFramework.saveHTMLReport();
            this.showNotification('Reporte HTML generado y descargado', 'success');
        } catch (error) {
            console.error('❌ Error generando reporte:', error);
            this.showNotification('Error generando reporte: ' + error.message, 'error');
        }
    }

    // ▶️ Iniciar ejecución de tests
    async startTestExecution() {
        const modal = this.currentModal;
        if (!modal) return;

        const selectedSuite = modal.querySelector('#test-suite-select').value;
        const executionType = modal.querySelector('#execution-type').value;
        const includePerformance = modal.querySelector('#include-performance').checked;
        const generateCoverage = modal.querySelector('#generate-coverage').checked;
        const stopOnFailure = modal.querySelector('#stop-on-failure').checked;

        const options = {
            parallel: executionType === 'parallel',
            performance: includePerformance,
            coverage: generateCoverage,
            stopOnFailure: stopOnFailure
        };

        try {
            this.showProgress(true);
            modal.querySelector('#start-tests-btn').disabled = true;
            modal.querySelector('#stop-tests-btn').disabled = false;

            if (selectedSuite === 'all') {
                await this.testRunner.runAllTests(options);
            } else {
                await this.testRunner.runSuite(selectedSuite, options);
            }

            this.updateStatistics();
            this.showNotification('Ejecución completada exitosamente', 'success');

        } catch (error) {
            console.error('❌ Error en ejecución:', error);
            this.showNotification('Error en ejecución: ' + error.message, 'error');
        } finally {
            this.showProgress(false);
            modal.querySelector('#start-tests-btn').disabled = false;
            modal.querySelector('#stop-tests-btn').disabled = true;
        }
    }

    // 🛑 Detener ejecución de tests
    stopTestExecution() {
        // Implementar lógica para detener tests si es necesario
        this.showNotification('Ejecución detenida por el usuario', 'warning');
        this.showProgress(false);
    }

    // 📊 Mostrar/ocultar progreso
    showProgress(show) {
        const modal = this.currentModal;
        if (!modal) return;

        const progressDiv = modal.querySelector('#test-progress');
        if (show) {
            progressDiv.classList.remove('hidden');
        } else {
            progressDiv.classList.add('hidden');
        }
    }

    // 📊 Cargar resultados de tests
    loadTestResults() {
        const modal = this.currentModal;
        if (!modal || !this.testRunner?.testFramework) return;

        const results = this.testRunner.testFramework.results;
        const latestResults = modal.querySelector('#latest-results');

        if (results.total > 0) {
            latestResults.innerHTML = `
                <div class="grid grid-cols-2 gap-4">
                    <div>Total: ${results.total}</div>
                    <div>Pasaron: ${results.passed}</div>
                    <div>Fallaron: ${results.failed}</div>
                    <div>Omitidos: ${results.skipped}</div>
                </div>
            `;
        }

        // Cargar errores detallados
        const errorsDiv = modal.querySelector('#detailed-errors');
        if (results.errors && results.errors.length > 0) {
            const errorsHTML = results.errors.map(error => `
                <div class="bg-red-50 dark:bg-red-900 p-3 rounded border-l-4 border-red-500">
                    <div class="font-medium text-red-800 dark:text-red-200">${error.test}</div>
                    <div class="text-sm text-red-600 dark:text-red-300 mt-1">${error.error}</div>
                </div>
            `).join('');
            errorsDiv.innerHTML = errorsHTML;
        }
    }

    // 📊 Cargar datos de cobertura
    loadCoverageData() {
        // Implementar carga de datos de cobertura
        console.log('📊 Cargando datos de cobertura...');
    }

    // 💾 Guardar configuración
    saveConfiguration() {
        const modal = this.currentModal;
        if (!modal || !this.testRunner) return;

        const config = {
            timeout: parseInt(modal.querySelector('#test-timeout').value),
            retries: parseInt(modal.querySelector('#test-retries').value),
            autoRun: modal.querySelector('#auto-run-enabled').checked,
            interval: parseInt(modal.querySelector('#auto-run-interval').value) * 60000 // Convertir a ms
        };

        this.testRunner.updateConfig(config);
        this.showNotification('Configuración guardada exitosamente', 'success');
    }

    // 🔄 Iniciar actualización automática
    startAutoRefresh() {
        this.refreshInterval = setInterval(() => {
            if (this.isVisible) {
                this.updateSystemStatus();
                this.updateStatistics();
            }
        }, 5000); // Actualizar cada 5 segundos
    }

    // 🛑 Detener actualización automática
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // ❌ Cerrar panel de testing
    closeTestingPanel() {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }

        this.isVisible = false;
        this.stopAutoRefresh();

        console.log('❌ Panel de testing cerrado');
    }

    // 🔔 Mostrar notificación
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: 'bg-green-600',
            error: 'bg-red-600',
            warning: 'bg-yellow-600',
            info: 'bg-blue-600'
        };
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        notification.className = `fixed top-4 right-4 ${colors[type]} text-white p-3 rounded-lg shadow-lg z-50 max-w-sm`;
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <i data-lucide="${icons[type]}" class="w-4 h-4"></i>
                <div>
                    <p class="font-medium text-sm">Sistema de Testing</p>
                    <p class="text-xs opacity-90">${message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 hover:bg-black hover:bg-opacity-20 rounded p-1">
                    <i data-lucide="x" class="w-3 h-3"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// 🌐 Exportar para uso global
window.TestingUI = TestingUI;
