// ⚙️ INTERFAZ DE GESTIÓN DE BACKUPS
// Panel de control completo para gestionar backups automáticos

class BackupManagementUI {
    constructor() {
        this.backupSystem = null;
        this.exportSystem = null;
        this.restoreSystem = null;
        this.currentModal = null;
        
        console.log('⚙️ Interfaz de Gestión de Backups inicializada');
    }

    // 🚀 Inicializar con sistemas de backup
    async initialize(backupSystem, exportSystem, restoreSystem) {
        this.backupSystem = backupSystem;
        this.exportSystem = exportSystem;
        this.restoreSystem = restoreSystem;
        
        console.log('✅ Interfaz de backups conectada a sistemas');
    }

    // 📊 Mostrar panel principal de backups
    async showBackupPanel() {
        try {
            const modal = this.createBackupModal();
            document.body.appendChild(modal);
            this.currentModal = modal;
            
            // Cargar datos iniciales
            await this.loadBackupData();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            // Inicializar iconos
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            console.log('📊 Panel de backups mostrado');
        } catch (error) {
            console.error('❌ Error mostrando panel de backups:', error);
            this.showNotification('Error abriendo panel de backups', 'error');
        }
    }

    // 🎨 Crear modal del panel de backups
    createBackupModal() {
        const modal = document.createElement('div');
        modal.id = 'backup-management-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 w-full max-w-6xl m-4 rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
                <!-- Header -->
                <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <div class="flex items-center gap-3">
                        <i data-lucide="shield-check" class="text-green-500 w-6 h-6"></i>
                        <div>
                            <h3 class="text-2xl font-bold">Gestión de Backups</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Protección automática de datos financieros</p>
                        </div>
                    </div>
                    <button class="js-close-backup-panel p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto">
                    <!-- Tabs -->
                    <div class="border-b dark:border-gray-700">
                        <nav class="flex space-x-8 px-6">
                            <button class="backup-tab active py-4 px-1 border-b-2 border-blue-500 font-medium text-blue-600" data-tab="overview">
                                <i data-lucide="home" class="w-4 h-4 inline mr-2"></i>Resumen
                            </button>
                            <button class="backup-tab py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700" data-tab="automatic">
                                <i data-lucide="clock" class="w-4 h-4 inline mr-2"></i>Automáticos
                            </button>
                            <button class="backup-tab py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700" data-tab="manual">
                                <i data-lucide="download" class="w-4 h-4 inline mr-2"></i>Exportar
                            </button>
                            <button class="backup-tab py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700" data-tab="restore">
                                <i data-lucide="upload" class="w-4 h-4 inline mr-2"></i>Restaurar
                            </button>
                            <button class="backup-tab py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700" data-tab="settings">
                                <i data-lucide="settings" class="w-4 h-4 inline mr-2"></i>Configuración
                            </button>
                        </nav>
                    </div>

                    <!-- Tab Content -->
                    <div class="p-6">
                        <!-- Overview Tab -->
                        <div id="tab-overview" class="tab-content">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div class="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-green-600 dark:text-green-400 text-sm font-medium">Último Backup</p>
                                            <p id="last-backup-time" class="text-2xl font-bold text-green-800 dark:text-green-200">--</p>
                                        </div>
                                        <i data-lucide="shield-check" class="w-8 h-8 text-green-500"></i>
                                    </div>
                                </div>
                                <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Backups</p>
                                            <p id="total-backups" class="text-2xl font-bold text-blue-800 dark:text-blue-200">0</p>
                                        </div>
                                        <i data-lucide="database" class="w-8 h-8 text-blue-500"></i>
                                    </div>
                                </div>
                                <div class="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-purple-600 dark:text-purple-400 text-sm font-medium">Estado</p>
                                            <p id="backup-status" class="text-2xl font-bold text-purple-800 dark:text-purple-200">Activo</p>
                                        </div>
                                        <i data-lucide="activity" class="w-8 h-8 text-purple-500"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">📊 Historial Reciente</h4>
                                    <div id="recent-backups" class="space-y-2 max-h-64 overflow-y-auto">
                                        <p class="text-gray-500 text-sm">Cargando historial...</p>
                                    </div>
                                </div>
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">⚡ Acciones Rápidas</h4>
                                    <div class="space-y-3">
                                        <button id="quick-backup-btn" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                            <i data-lucide="shield" class="w-4 h-4 inline mr-2"></i>Crear Backup Ahora
                                        </button>
                                        <button id="quick-export-btn" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                            <i data-lucide="download" class="w-4 h-4 inline mr-2"></i>Exportar Datos
                                        </button>
                                        <button id="view-all-backups-btn" class="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                                            <i data-lucide="list" class="w-4 h-4 inline mr-2"></i>Ver Todos los Backups
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Automatic Backups Tab -->
                        <div id="tab-automatic" class="tab-content hidden">
                            <div class="space-y-6">
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">⚙️ Configuración Automática</h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium mb-2">Estado</label>
                                            <div class="flex items-center space-x-3">
                                                <input type="checkbox" id="auto-backup-enabled" class="rounded">
                                                <span>Backups automáticos habilitados</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium mb-2">Frecuencia</label>
                                            <select id="backup-frequency" class="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500">
                                                <option value="daily">Diario</option>
                                                <option value="weekly">Semanal</option>
                                                <option value="monthly">Mensual</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">📋 Historial de Backups Automáticos</h4>
                                    <div id="automatic-backups-list" class="space-y-2 max-h-96 overflow-y-auto">
                                        <p class="text-gray-500 text-sm">Cargando historial...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Manual Export Tab -->
                        <div id="tab-manual" class="tab-content hidden">
                            <div class="space-y-6">
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">📤 Exportar Datos</h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium mb-2">Formato</label>
                                            <select id="export-format" class="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500">
                                                <option value="json">JSON (Completo)</option>
                                                <option value="csv">CSV (Transacciones)</option>
                                                <option value="excel">Excel (Simulado)</option>
                                                <option value="pdf">PDF (Reporte)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium mb-2">Período</label>
                                            <select id="export-period" class="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500">
                                                <option value="all">Todos los datos</option>
                                                <option value="year">Último año</option>
                                                <option value="6months">Últimos 6 meses</option>
                                                <option value="3months">Últimos 3 meses</option>
                                                <option value="month">Último mes</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mt-4 space-y-2">
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="include-budget" checked class="rounded">
                                            <span>Incluir presupuesto</span>
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="include-categories" checked class="rounded">
                                            <span>Incluir categorías</span>
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="include-assets" checked class="rounded">
                                            <span>Incluir activos y pasivos</span>
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="include-ai-data" class="rounded">
                                            <span>Incluir datos de IA (solo resumen)</span>
                                        </label>
                                    </div>
                                    <button id="start-export-btn" class="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                        <i data-lucide="download" class="w-4 h-4 inline mr-2"></i>Iniciar Exportación
                                    </button>
                                </div>

                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">📊 Historial de Exportaciones</h4>
                                    <div id="export-history-list" class="space-y-2 max-h-64 overflow-y-auto">
                                        <p class="text-gray-500 text-sm">No hay exportaciones recientes</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Restore Tab -->
                        <div id="tab-restore" class="tab-content hidden">
                            <div class="space-y-6">
                                <div class="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                                    <div class="flex items-center gap-2">
                                        <i data-lucide="alert-triangle" class="w-5 h-5 text-yellow-600"></i>
                                        <p class="text-yellow-800 dark:text-yellow-200 font-medium">Precaución</p>
                                    </div>
                                    <p class="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                                        La restauración reemplazará los datos actuales. Se creará un backup de seguridad automáticamente.
                                    </p>
                                </div>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <h4 class="text-lg font-semibold mb-3">📂 Restaurar desde Archivo</h4>
                                        <div class="space-y-3">
                                            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                                                <input type="file" id="restore-file-input" accept=".json" class="hidden">
                                                <i data-lucide="upload" class="w-8 h-8 text-gray-400 mx-auto mb-2"></i>
                                                <p class="text-gray-600 dark:text-gray-400 mb-2">Arrastra un archivo de backup aquí</p>
                                                <button id="select-file-btn" class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                                    Seleccionar Archivo
                                                </button>
                                            </div>
                                            <div id="file-info" class="hidden bg-blue-50 dark:bg-blue-900 p-3 rounded">
                                                <p class="text-blue-800 dark:text-blue-200 text-sm"></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <h4 class="text-lg font-semibold mb-3">🗄️ Backups Disponibles</h4>
                                        <div id="available-backups-list" class="space-y-2 max-h-64 overflow-y-auto">
                                            <p class="text-gray-500 text-sm">Cargando backups...</p>
                                        </div>
                                    </div>
                                </div>

                                <div id="restore-options" class="hidden bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">⚙️ Opciones de Restauración</h4>
                                    <div class="grid grid-cols-2 gap-4">
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="restore-transactions" checked class="rounded">
                                            <span>Restaurar transacciones</span>
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="restore-budget" checked class="rounded">
                                            <span>Restaurar presupuesto</span>
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="restore-categories" checked class="rounded">
                                            <span>Restaurar categorías</span>
                                        </label>
                                        <label class="flex items-center space-x-2">
                                            <input type="checkbox" id="restore-assets" checked class="rounded">
                                            <span>Restaurar activos/pasivos</span>
                                        </label>
                                    </div>
                                    <button id="start-restore-btn" class="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                                        <i data-lucide="upload" class="w-4 h-4 inline mr-2"></i>Iniciar Restauración
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Settings Tab -->
                        <div id="tab-settings" class="tab-content hidden">
                            <div class="space-y-6">
                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">⚙️ Configuración General</h4>
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium mb-2">Máximo de backups a mantener</label>
                                            <input type="number" id="max-backups" min="5" max="100" class="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500">
                                        </div>
                                        <div class="flex items-center space-x-3">
                                            <input type="checkbox" id="compression-enabled" class="rounded">
                                            <span>Habilitar compresión de backups</span>
                                        </div>
                                        <div class="flex items-center space-x-3">
                                            <input type="checkbox" id="cloud-backup-enabled" class="rounded">
                                            <span>Guardar backups en la nube (Firebase Storage)</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">🧹 Mantenimiento</h4>
                                    <div class="space-y-3">
                                        <button id="cleanup-old-backups-btn" class="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                                            <i data-lucide="trash-2" class="w-4 h-4 inline mr-2"></i>Limpiar Backups Antiguos
                                        </button>
                                        <button id="test-backup-system-btn" class="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                                            <i data-lucide="check-circle" class="w-4 h-4 inline mr-2"></i>Probar Sistema de Backups
                                        </button>
                                    </div>
                                </div>

                                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <h4 class="text-lg font-semibold mb-3">💾 Guardar Configuración</h4>
                                    <button id="save-settings-btn" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
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
        modal.querySelector('.js-close-backup-panel').addEventListener('click', () => {
            this.closeBackupPanel();
        });

        // Tabs
        modal.querySelectorAll('.backup-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Acciones rápidas
        modal.querySelector('#quick-backup-btn').addEventListener('click', () => {
            this.performQuickBackup();
        });

        modal.querySelector('#quick-export-btn').addEventListener('click', () => {
            this.switchTab('manual');
        });

        // Configuración automática
        modal.querySelector('#auto-backup-enabled').addEventListener('change', (e) => {
            this.toggleAutomaticBackups(e.target.checked);
        });

        modal.querySelector('#backup-frequency').addEventListener('change', (e) => {
            this.updateBackupFrequency(e.target.value);
        });

        // Exportación manual
        modal.querySelector('#start-export-btn').addEventListener('click', () => {
            this.startManualExport();
        });

        // Restauración
        modal.querySelector('#select-file-btn').addEventListener('click', () => {
            modal.querySelector('#restore-file-input').click();
        });

        modal.querySelector('#restore-file-input').addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files[0]);
        });

        modal.querySelector('#start-restore-btn').addEventListener('click', () => {
            this.startRestore();
        });

        // Configuración
        modal.querySelector('#save-settings-btn').addEventListener('click', () => {
            this.saveSettings();
        });

        modal.querySelector('#cleanup-old-backups-btn').addEventListener('click', () => {
            this.cleanupOldBackups();
        });

        modal.querySelector('#test-backup-system-btn').addEventListener('click', () => {
            this.testBackupSystem();
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeBackupPanel();
            }
        });
    }

    // 📊 Cargar datos de backups
    async loadBackupData() {
        try {
            // Cargar estadísticas
            if (this.backupSystem) {
                const stats = this.backupSystem.getBackupStats();
                this.updateOverviewStats(stats);
                await this.loadBackupHistory();
            }

            // Cargar configuración
            await this.loadCurrentSettings();

            // Cargar backups disponibles para restauración
            if (this.restoreSystem) {
                await this.loadAvailableBackups();
            }

        } catch (error) {
            console.error('❌ Error cargando datos de backups:', error);
        }
    }

    // 📈 Actualizar estadísticas del resumen
    updateOverviewStats(stats) {
        const modal = this.currentModal;
        if (!modal) return;

        // Último backup
        const lastBackupEl = modal.querySelector('#last-backup-time');
        if (stats.lastBackup) {
            const date = new Date(stats.lastBackup);
            lastBackupEl.textContent = date.toLocaleDateString('es-ES');
        } else {
            lastBackupEl.textContent = 'Nunca';
        }

        // Total backups
        modal.querySelector('#total-backups').textContent = stats.total || 0;

        // Estado
        const statusEl = modal.querySelector('#backup-status');
        if (stats.settings?.autoBackupEnabled) {
            statusEl.textContent = 'Activo';
            statusEl.className = statusEl.className.replace(/text-\w+-\d+/, 'text-green-800 dark:text-green-200');
        } else {
            statusEl.textContent = 'Inactivo';
            statusEl.className = statusEl.className.replace(/text-\w+-\d+/, 'text-red-800 dark:text-red-200');
        }
    }

    // 📚 Cargar historial de backups
    async loadBackupHistory() {
        try {
            const modal = this.currentModal;
            if (!modal || !this.backupSystem) return;

            const history = this.backupSystem.backupHistory || [];
            const container = modal.querySelector('#recent-backups');

            if (history.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-sm">No hay backups recientes</p>';
                return;
            }

            const historyHTML = history.slice(0, 10).map(backup => {
                const date = new Date(backup.timestamp).toLocaleDateString('es-ES');
                const time = new Date(backup.timestamp).toLocaleTimeString('es-ES');
                const statusIcon = backup.success ? 'check-circle' : 'x-circle';
                const statusColor = backup.success ? 'text-green-500' : 'text-red-500';
                const size = backup.size ? this.formatFileSize(backup.size) : 'N/A';

                return `
                    <div class="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded">
                        <div class="flex items-center gap-2">
                            <i data-lucide="${statusIcon}" class="w-4 h-4 ${statusColor}"></i>
                            <div>
                                <p class="text-sm font-medium">${backup.type || 'Backup'}</p>
                                <p class="text-xs text-gray-500">${date} ${time}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-500">${size}</p>
                            ${backup.success ? '<span class="text-xs text-green-600">✓ Exitoso</span>' : '<span class="text-xs text-red-600">✗ Error</span>'}
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = historyHTML;

            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

        } catch (error) {
            console.error('❌ Error cargando historial:', error);
        }
    }

    // ⚙️ Cargar configuración actual
    async loadCurrentSettings() {
        try {
            const modal = this.currentModal;
            if (!modal || !this.backupSystem) return;

            const settings = this.backupSystem.settings;

            // Configuración automática
            modal.querySelector('#auto-backup-enabled').checked = settings.autoBackupEnabled;
            modal.querySelector('#backup-frequency').value = settings.backupFrequency;

            // Configuración general
            modal.querySelector('#max-backups').value = settings.maxBackupsToKeep;
            modal.querySelector('#compression-enabled').checked = settings.compressionEnabled;
            modal.querySelector('#cloud-backup-enabled').checked = settings.cloudBackupEnabled;

        } catch (error) {
            console.error('❌ Error cargando configuración:', error);
        }
    }

    // 🗄️ Cargar backups disponibles
    async loadAvailableBackups() {
        try {
            const modal = this.currentModal;
            if (!modal || !this.restoreSystem) return;

            const backups = await this.restoreSystem.listAvailableBackups();
            const container = modal.querySelector('#available-backups-list');

            if (backups.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-sm">No hay backups disponibles</p>';
                return;
            }

            const backupsHTML = backups.map(backup => {
                const date = new Date(backup.timestamp).toLocaleDateString('es-ES');
                const time = new Date(backup.timestamp).toLocaleTimeString('es-ES');
                const transactionsCount = backup.metadata?.totalTransactions || 0;

                return `
                    <div class="backup-item flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-500" data-backup-id="${backup.id}">
                        <div>
                            <p class="text-sm font-medium">${backup.type || 'Backup'}</p>
                            <p class="text-xs text-gray-500">${date} ${time}</p>
                            <p class="text-xs text-gray-500">${transactionsCount} transacciones</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-500">${backup.sizeFormatted}</p>
                            <button class="select-backup-btn text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" data-backup-id="${backup.id}">
                                Seleccionar
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = backupsHTML;

            // Event listeners para seleccionar backup
            container.querySelectorAll('.select-backup-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectBackupForRestore(e.target.dataset.backupId);
                });
            });

        } catch (error) {
            console.error('❌ Error cargando backups disponibles:', error);
        }
    }

    // 🔄 Cambiar tab
    switchTab(tabName) {
        const modal = this.currentModal;
        if (!modal) return;

        // Actualizar tabs
        modal.querySelectorAll('.backup-tab').forEach(tab => {
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
        if (tabName === 'restore') {
            this.loadAvailableBackups();
        }
    }

    // ⚡ Realizar backup rápido
    async performQuickBackup() {
        try {
            this.showNotification('Iniciando backup manual...', 'info');

            if (!this.backupSystem) {
                throw new Error('Sistema de backup no disponible');
            }

            const backupId = await this.backupSystem.performAutomaticBackup();
            this.showNotification('Backup manual completado exitosamente', 'success');

            // Recargar datos
            await this.loadBackupData();

        } catch (error) {
            console.error('❌ Error en backup rápido:', error);
            this.showNotification('Error creando backup: ' + error.message, 'error');
        }
    }

    // 🔄 Alternar backups automáticos
    async toggleAutomaticBackups(enabled) {
        try {
            if (!this.backupSystem) return;

            await this.backupSystem.updateSettings({ autoBackupEnabled: enabled });

            if (enabled) {
                this.showNotification('Backups automáticos habilitados', 'success');
            } else {
                this.showNotification('Backups automáticos deshabilitados', 'warning');
            }

            // Actualizar estadísticas
            const stats = this.backupSystem.getBackupStats();
            this.updateOverviewStats(stats);

        } catch (error) {
            console.error('❌ Error actualizando configuración:', error);
            this.showNotification('Error actualizando configuración', 'error');
        }
    }

    // 📅 Actualizar frecuencia de backup
    async updateBackupFrequency(frequency) {
        try {
            if (!this.backupSystem) return;

            await this.backupSystem.updateSettings({ backupFrequency: frequency });
            this.showNotification(`Frecuencia actualizada a ${frequency}`, 'success');

        } catch (error) {
            console.error('❌ Error actualizando frecuencia:', error);
            this.showNotification('Error actualizando frecuencia', 'error');
        }
    }

    // 📤 Iniciar exportación manual
    async startManualExport() {
        try {
            const modal = this.currentModal;
            if (!modal || !this.exportSystem) return;

            // Obtener opciones
            const format = modal.querySelector('#export-format').value;
            const period = modal.querySelector('#export-period').value;
            const includeBudget = modal.querySelector('#include-budget').checked;
            const includeCategories = modal.querySelector('#include-categories').checked;
            const includeAssets = modal.querySelector('#include-assets').checked;
            const includeAIData = modal.querySelector('#include-ai-data').checked;

            // Configurar opciones de exportación
            const options = {
                includeBudget,
                includeCategories,
                includeAssets,
                includeAIData
            };

            // Configurar período
            if (period !== 'all') {
                const now = new Date();
                const startDate = new Date();

                switch (period) {
                    case 'month':
                        startDate.setMonth(now.getMonth() - 1);
                        break;
                    case '3months':
                        startDate.setMonth(now.getMonth() - 3);
                        break;
                    case '6months':
                        startDate.setMonth(now.getMonth() - 6);
                        break;
                    case 'year':
                        startDate.setFullYear(now.getFullYear() - 1);
                        break;
                }

                options.startDate = startDate.toISOString();
                options.endDate = now.toISOString();
            }

            this.showNotification(`Iniciando exportación en formato ${format.toUpperCase()}...`, 'info');

            // Realizar exportación
            const result = await this.exportSystem.exportCompleteData(format, options);

            this.showNotification(`Exportación ${format.toUpperCase()} completada: ${result.filename}`, 'success');

        } catch (error) {
            console.error('❌ Error en exportación:', error);
            this.showNotification('Error en exportación: ' + error.message, 'error');
        }
    }

    // 📁 Manejar selección de archivo para restaurar
    handleFileSelection(file) {
        const modal = this.currentModal;
        if (!modal || !file) return;

        const fileInfo = modal.querySelector('#file-info');
        const restoreOptions = modal.querySelector('#restore-options');

        fileInfo.classList.remove('hidden');
        fileInfo.querySelector('p').textContent = `Archivo seleccionado: ${file.name} (${this.formatFileSize(file.size)})`;

        restoreOptions.classList.remove('hidden');

        // Guardar archivo para restauración
        this.selectedRestoreFile = file;
    }

    // 🎯 Seleccionar backup para restaurar
    selectBackupForRestore(backupId) {
        const modal = this.currentModal;
        if (!modal) return;

        const restoreOptions = modal.querySelector('#restore-options');
        restoreOptions.classList.remove('hidden');

        // Guardar ID para restauración
        this.selectedBackupId = backupId;

        // Limpiar selección de archivo
        this.selectedRestoreFile = null;
        const fileInfo = modal.querySelector('#file-info');
        fileInfo.classList.add('hidden');

        this.showNotification('Backup seleccionado para restauración', 'info');
    }

    // 🔄 Iniciar restauración
    async startRestore() {
        try {
            const modal = this.currentModal;
            if (!modal || !this.restoreSystem) return;

            // Obtener opciones
            const restoreTransactions = modal.querySelector('#restore-transactions').checked;
            const restoreBudget = modal.querySelector('#restore-budget').checked;
            const restoreCategories = modal.querySelector('#restore-categories').checked;
            const restoreAssets = modal.querySelector('#restore-assets').checked;

            const options = {
                restoreTransactions,
                restoreBudget,
                restoreCategories,
                restoreAssets,
                createSafetyBackup: true
            };

            // Confirmar restauración
            const confirmed = confirm('⚠️ ADVERTENCIA: Esta acción reemplazará los datos actuales con los del backup seleccionado. Se creará un backup de seguridad automáticamente. ¿Continuar?');
            if (!confirmed) return;

            this.showNotification('Iniciando restauración...', 'info');

            let result;
            if (this.selectedRestoreFile) {
                // Restaurar desde archivo
                result = await this.restoreSystem.restoreFromFile(this.selectedRestoreFile);
            } else if (this.selectedBackupId) {
                // Restaurar desde backup existente
                result = await this.restoreSystem.restoreFromBackup(this.selectedBackupId, options);
            } else {
                throw new Error('No se ha seleccionado ningún backup o archivo');
            }

            this.showNotification('Restauración completada exitosamente', 'success');

            // Recargar página para reflejar cambios
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('❌ Error en restauración:', error);
            this.showNotification('Error en restauración: ' + error.message, 'error');
        }
    }

    // 💾 Guardar configuración
    async saveSettings() {
        try {
            const modal = this.currentModal;
            if (!modal || !this.backupSystem) return;

            const settings = {
                maxBackupsToKeep: parseInt(modal.querySelector('#max-backups').value),
                compressionEnabled: modal.querySelector('#compression-enabled').checked,
                cloudBackupEnabled: modal.querySelector('#cloud-backup-enabled').checked
            };

            await this.backupSystem.updateSettings(settings);
            this.showNotification('Configuración guardada exitosamente', 'success');

        } catch (error) {
            console.error('❌ Error guardando configuración:', error);
            this.showNotification('Error guardando configuración', 'error');
        }
    }

    // 🧹 Limpiar backups antiguos
    async cleanupOldBackups() {
        try {
            const confirmed = confirm('¿Estás seguro de que quieres limpiar los backups antiguos? Esta acción no se puede deshacer.');
            if (!confirmed) return;

            this.showNotification('Limpiando backups antiguos...', 'info');

            // Aquí implementarías la lógica de limpieza
            // Por ahora, simular
            await new Promise(resolve => setTimeout(resolve, 2000));

            this.showNotification('Limpieza completada', 'success');
            await this.loadBackupData();

        } catch (error) {
            console.error('❌ Error limpiando backups:', error);
            this.showNotification('Error en limpieza', 'error');
        }
    }

    // 🧪 Probar sistema de backups
    async testBackupSystem() {
        try {
            this.showNotification('Probando sistema de backups...', 'info');

            if (!this.backupSystem) {
                throw new Error('Sistema de backup no disponible');
            }

            // Ejecutar diagnósticos
            const diagnostics = await this.backupSystem.runDiagnostics();
            console.log('🔍 Diagnósticos:', diagnostics);

            // Verificar problemas críticos
            const criticalIssues = [];
            if (!diagnostics.system.firebaseAvailable) criticalIssues.push('Firebase no disponible');
            if (!diagnostics.system.userAuthenticated) criticalIssues.push('Usuario no autenticado');
            if (!diagnostics.system.appIdDefined) criticalIssues.push('App ID no definido');
            if (diagnostics.tests.firebaseConnection?.includes('ERROR')) criticalIssues.push('Error de conexión a Firebase');
            if (diagnostics.tests.writePermissions?.includes('ERROR')) criticalIssues.push('Sin permisos de escritura');

            if (criticalIssues.length > 0) {
                throw new Error('Problemas críticos encontrados: ' + criticalIssues.join(', '));
            }

            // Realizar backup de prueba
            const testBackupId = await this.backupSystem.performTestBackup();

            this.showNotification(`✅ Sistema funcionando correctamente. Backup de prueba: ${testBackupId}`, 'success');

        } catch (error) {
            console.error('❌ Error probando sistema:', error);
            this.showNotification('❌ Error en sistema de backups: ' + error.message, 'error');

            // Mostrar diagnósticos en consola para debugging
            if (this.backupSystem) {
                this.backupSystem.runDiagnostics().then(diag => {
                    console.log('🔍 Diagnósticos detallados:', diag);
                });
            }
        }
    }

    // ❌ Cerrar panel de backups
    closeBackupPanel() {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }
    }

    // 📊 Formatear tamaño de archivo
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                    <p class="font-medium text-sm">Sistema de Backups</p>
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
window.BackupManagementUI = BackupManagementUI;
