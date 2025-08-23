// 💾 SISTEMA DE BACKUPS AUTOMÁTICOS
// Protección completa de datos financieros familiares

class AutomaticBackupSystem {
    constructor() {
        this.initialized = false;
        this.backupSchedule = null;
        this.lastBackupTime = null;
        this.backupHistory = [];
        this.settings = {
            autoBackupEnabled: true,
            backupFrequency: 'daily', // daily, weekly, monthly
            maxBackupsToKeep: 30,
            includeAIData: true,
            compressionEnabled: true,
            cloudBackupEnabled: true
        };
        
        console.log('💾 Sistema de Backups Automáticos inicializado');
    }

    // 🚀 Inicializar sistema de backups
    async initialize() {
        try {
            // Verificar que Firebase esté disponible
            if (typeof firebase === 'undefined' || !firebase.firestore) {
                throw new Error('Firebase no está disponible');
            }

            // Verificar que window.appId esté definido
            if (!window.appId) {
                throw new Error('window.appId no está definido');
            }

            await this.loadSettings();
            await this.loadBackupHistory();
            this.setupAutomaticBackups();

            this.initialized = true;
            console.log('✅ Sistema de backups automáticos listo');
            return true;
        } catch (error) {
            console.error('❌ Error inicializando sistema de backups:', error);
            this.showBackupNotification('Error inicializando sistema de backups: ' + error.message, 'error');
            return false;
        }
    }

    // ⚙️ Cargar configuración de backups
    async loadSettings() {
        try {
            const settingsDoc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/backup_settings/config`)
                .get();
            
            if (settingsDoc.exists) {
                this.settings = { ...this.settings, ...settingsDoc.data() };
                console.log('⚙️ Configuración de backups cargada');
            }
        } catch (error) {
            console.warn('⚠️ Usando configuración por defecto de backups:', error);
        }
    }

    // 📚 Cargar historial de backups
    async loadBackupHistory() {
        try {
            const historyDoc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/backup_history/log`)
                .get();
            
            if (historyDoc.exists) {
                this.backupHistory = historyDoc.data().history || [];
                this.lastBackupTime = historyDoc.data().lastBackupTime;
                console.log('📚 Historial de backups cargado:', this.backupHistory.length, 'backups');
            }
        } catch (error) {
            console.warn('⚠️ No se pudo cargar historial de backups:', error);
        }
    }

    // ⏰ Configurar backups automáticos
    setupAutomaticBackups() {
        if (!this.settings.autoBackupEnabled) {
            console.log('⏸️ Backups automáticos deshabilitados');
            return;
        }

        // Limpiar schedule anterior si existe
        if (this.backupSchedule) {
            clearInterval(this.backupSchedule);
        }

        // Calcular intervalo según frecuencia
        const intervals = {
            'hourly': 60 * 60 * 1000,        // 1 hora
            'daily': 24 * 60 * 60 * 1000,    // 24 horas
            'weekly': 7 * 24 * 60 * 60 * 1000, // 7 días
            'monthly': 30 * 24 * 60 * 60 * 1000 // 30 días
        };

        const interval = intervals[this.settings.backupFrequency] || intervals.daily;

        // Programar backups automáticos
        this.backupSchedule = setInterval(async () => {
            await this.performAutomaticBackup();
        }, interval);

        // Realizar backup inicial si es necesario
        this.checkAndPerformInitialBackup();

        console.log(`⏰ Backups automáticos programados cada ${this.settings.backupFrequency}`);
    }

    // 🔍 Verificar si necesita backup inicial
    async checkAndPerformInitialBackup() {
        const now = new Date();
        const lastBackup = this.lastBackupTime ? new Date(this.lastBackupTime) : null;
        
        if (!lastBackup || (now - lastBackup) > 24 * 60 * 60 * 1000) {
            console.log('🔍 Realizando backup inicial...');
            setTimeout(() => this.performAutomaticBackup(), 5000); // Esperar 5 segundos
        }
    }

    // 💾 Realizar backup automático
    async performAutomaticBackup() {
        // Verificar que el sistema esté inicializado
        if (!this.initialized) {
            console.warn('⚠️ Sistema de backup no inicializado, intentando inicializar...');
            const initialized = await this.initialize();
            if (!initialized) {
                throw new Error('No se pudo inicializar el sistema de backups');
            }
        }

        try {
            console.log('💾 Iniciando backup automático...');

            // Verificar autenticación
            if (!firebase.auth().currentUser) {
                throw new Error('Usuario no autenticado para realizar backup');
            }

            const backupData = await this.collectAllData();
            const backupId = this.generateBackupId();
            const timestamp = new Date().toISOString();

            // Crear backup completo
            const backup = {
                id: backupId,
                timestamp: timestamp,
                type: 'automatic',
                version: '1.0',
                appVersion: '2.0', // Versión de la app
                data: backupData,
                metadata: {
                    totalTransactions: backupData.transactions?.length || 0,
                    totalCategories: Object.keys(backupData.categories || {}).length,
                    totalAssets: backupData.assets?.length || 0,
                    totalLiabilities: backupData.liabilities?.length || 0,
                    aiDataIncluded: this.settings.includeAIData,
                    compressed: this.settings.compressionEnabled,
                    userEmail: firebase.auth().currentUser?.email || 'unknown'
                }
            };

            // Comprimir si está habilitado
            if (this.settings.compressionEnabled) {
                try {
                    backup.data = this.compressData(backup.data);
                    backup.compressed = true;
                } catch (compressionError) {
                    console.warn('⚠️ Error comprimiendo, guardando sin comprimir:', compressionError);
                    backup.compressed = false;
                }
            }

            // Guardar backup
            await this.saveBackup(backup);

            // Actualizar historial
            this.backupHistory.unshift({
                id: backupId,
                timestamp: timestamp,
                type: 'automatic',
                size: JSON.stringify(backup).length,
                success: true,
                transactionsCount: backupData.transactions?.length || 0
            });

            // Mantener solo los últimos N backups
            if (this.backupHistory.length > this.settings.maxBackupsToKeep) {
                const oldBackups = this.backupHistory.splice(this.settings.maxBackupsToKeep);
                // Limpiar en background para no bloquear
                this.cleanupOldBackups(oldBackups).catch(error => {
                    console.warn('⚠️ Error limpiando backups antiguos:', error);
                });
            }

            // Guardar historial actualizado
            await this.saveBackupHistory();

            this.lastBackupTime = timestamp;
            console.log('✅ Backup automático completado:', backupId);

            // Mostrar notificación discreta
            this.showBackupNotification('Backup automático completado exitosamente');

            return backupId;
        } catch (error) {
            console.error('❌ Error en backup automático:', error);

            // Registrar error en historial
            this.backupHistory.unshift({
                id: 'error-' + Date.now(),
                timestamp: new Date().toISOString(),
                type: 'automatic',
                success: false,
                error: error.message
            });

            // Guardar historial incluso con error
            try {
                await this.saveBackupHistory();
            } catch (historyError) {
                console.error('❌ Error guardando historial de error:', historyError);
            }

            this.showBackupNotification('Error en backup automático: ' + error.message, 'error');
            throw error;
        }
    }

    // 📊 Recopilar todos los datos
    async collectAllData() {
        const data = {};

        try {
            // Verificar que estamos autenticados
            if (!firebase.auth().currentUser) {
                throw new Error('Usuario no autenticado');
            }

            // Transacciones (crítico)
            try {
                data.transactions = await this.getTransactions();
                console.log('📊 Transacciones recopiladas:', data.transactions.length);
            } catch (error) {
                console.error('❌ Error crítico obteniendo transacciones:', error);
                throw new Error('No se pudieron obtener las transacciones: ' + error.message);
            }

            // Presupuesto (no crítico)
            try {
                data.budget = await this.getBudget();
                console.log('💰 Presupuesto recopilado');
            } catch (error) {
                console.warn('⚠️ Error obteniendo presupuesto, continuando:', error);
                data.budget = {};
            }

            // Categorías (no crítico)
            try {
                data.categories = await this.getCategories();
                console.log('🏷️ Categorías recopiladas');
            } catch (error) {
                console.warn('⚠️ Error obteniendo categorías, continuando:', error);
                data.categories = {};
            }

            // Activos (no crítico)
            try {
                data.assets = await this.getAssets();
                console.log('📈 Activos recopilados:', data.assets.length);
            } catch (error) {
                console.warn('⚠️ Error obteniendo activos, continuando:', error);
                data.assets = [];
            }

            // Pasivos (no crítico)
            try {
                data.liabilities = await this.getLiabilities();
                console.log('📉 Pasivos recopilados:', data.liabilities.length);
            } catch (error) {
                console.warn('⚠️ Error obteniendo pasivos, continuando:', error);
                data.liabilities = [];
            }

            // Datos de IA (opcional)
            if (this.settings.includeAIData) {
                try {
                    data.aiData = await this.getAIData();
                    console.log('🧠 Datos de IA recopilados');
                } catch (error) {
                    console.warn('⚠️ Error obteniendo datos de IA, continuando:', error);
                    data.aiData = {};
                }
            }

            // Configuración de la aplicación (no crítico)
            try {
                data.appSettings = await this.getAppSettings();
                console.log('⚙️ Configuración recopilada');
            } catch (error) {
                console.warn('⚠️ Error obteniendo configuración, continuando:', error);
                data.appSettings = {};
            }

            // Verificar que tenemos al menos datos básicos
            if (!data.transactions || data.transactions.length === 0) {
                console.warn('⚠️ No se encontraron transacciones para respaldar');
            }

        } catch (error) {
            console.error('❌ Error crítico recopilando datos:', error);
            throw error;
        }

        return data;
    }

    // 📋 Obtener transacciones
    async getTransactions() {
        try {
            // Intentar usar la función global existente primero
            if (typeof getTransactions === 'function') {
                const transactions = getTransactions();
                if (transactions && transactions.length > 0) {
                    console.log('📋 Usando transacciones de función global');
                    return transactions;
                }
            }

            // Fallback: obtener directamente de Firebase
            const snapshot = await firebase.firestore()
                .collection(`artifacts/${window.appId}/shared_transactions/family_data/transactions`)
                .orderBy('date', 'desc')
                .get();

            const transactions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log('📋 Transacciones obtenidas de Firebase:', transactions.length);
            return transactions;
        } catch (error) {
            console.error('❌ Error obteniendo transacciones:', error);
            throw error; // Lanzar error para que sea manejado arriba
        }
    }

    // 💰 Obtener presupuesto
    async getBudget() {
        try {
            const doc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/shared_transactions/family_data/budget/monthly`)
                .get();
            
            return doc.exists ? doc.data() : {};
        } catch (error) {
            console.warn('⚠️ Error obteniendo presupuesto:', error);
            return {};
        }
    }

    // 🏷️ Obtener categorías
    async getCategories() {
        try {
            const doc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/shared_transactions/family_data/categories/structure`)
                .get();
            
            return doc.exists ? doc.data() : {};
        } catch (error) {
            console.warn('⚠️ Error obteniendo categorías:', error);
            return {};
        }
    }

    // 📈 Obtener activos
    async getAssets() {
        try {
            const snapshot = await firebase.firestore()
                .collection(`artifacts/${window.appId}/shared_transactions/family_data/assets`)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.warn('⚠️ Error obteniendo activos:', error);
            return [];
        }
    }

    // 📉 Obtener pasivos
    async getLiabilities() {
        try {
            const snapshot = await firebase.firestore()
                .collection(`artifacts/${window.appId}/shared_transactions/family_data/liabilities`)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.warn('⚠️ Error obteniendo pasivos:', error);
            return [];
        }
    }

    // 🧠 Obtener datos de IA
    async getAIData() {
        try {
            const aiData = {};
            
            // Obtener datos de memoria de IA si existen
            if (window.aiMemorySystem && window.aiMemorySystem.userId) {
                const userId = window.aiMemorySystem.userId;
                
                // Perfil de usuario
                const profileDoc = await firebase.firestore()
                    .doc(`artifacts/${window.appId}/ai_memory/${userId}/profile`)
                    .get();
                if (profileDoc.exists) aiData.profile = profileDoc.data();

                // Conversaciones
                const conversationsDoc = await firebase.firestore()
                    .doc(`artifacts/${window.appId}/ai_memory/${userId}/conversations`)
                    .get();
                if (conversationsDoc.exists) aiData.conversations = conversationsDoc.data();

                // Datos de aprendizaje
                const learningDoc = await firebase.firestore()
                    .doc(`artifacts/${window.appId}/ai_memory/${userId}/learning`)
                    .get();
                if (learningDoc.exists) aiData.learning = learningDoc.data();

                // Insights proactivos
                const insightsDoc = await firebase.firestore()
                    .doc(`artifacts/${window.appId}/ai_memory/${userId}/proactive_insights`)
                    .get();
                if (insightsDoc.exists) aiData.insights = insightsDoc.data();
            }
            
            return aiData;
        } catch (error) {
            console.warn('⚠️ Error obteniendo datos de IA:', error);
            return {};
        }
    }

    // ⚙️ Obtener configuración de la aplicación
    async getAppSettings() {
        try {
            const settings = {
                backupSettings: this.settings,
                theme: localStorage.getItem('theme'),
                language: localStorage.getItem('language') || 'es',
                lastLogin: localStorage.getItem('lastLogin'),
                appVersion: '2.0'
            };
            
            return settings;
        } catch (error) {
            console.warn('⚠️ Error obteniendo configuración:', error);
            return {};
        }
    }

    // 🗜️ Comprimir datos (simulado - en producción usarías una librería real)
    compressData(data) {
        try {
            // Simulación de compresión - en producción usarías pako.js o similar
            const jsonString = JSON.stringify(data);
            return {
                compressed: true,
                originalSize: jsonString.length,
                data: btoa(jsonString), // Base64 como simulación de compresión
                compressionRatio: 0.7 // Simulado
            };
        } catch (error) {
            console.warn('⚠️ Error comprimiendo datos:', error);
            return data;
        }
    }

    // 💾 Guardar backup
    async saveBackup(backup) {
        try {
            // Guardar en Firebase
            await firebase.firestore()
                .doc(`artifacts/${window.appId}/backups/${backup.id}`)
                .set(backup);
            
            console.log('💾 Backup guardado en Firebase:', backup.id);
            
            // Si está habilitado, también guardar en Firebase Storage
            if (this.settings.cloudBackupEnabled) {
                await this.saveToCloudStorage(backup);
            }
            
        } catch (error) {
            console.error('❌ Error guardando backup:', error);
            throw error;
        }
    }

    // ☁️ Guardar en almacenamiento en la nube
    async saveToCloudStorage(backup) {
        try {
            // Convertir a blob
            const backupBlob = new Blob([JSON.stringify(backup)], {
                type: 'application/json'
            });
            
            // Referencia a Firebase Storage
            const storageRef = firebase.storage().ref();
            const backupRef = storageRef.child(`backups/${window.appId}/${backup.id}.json`);
            
            // Subir archivo
            await backupRef.put(backupBlob);
            console.log('☁️ Backup guardado en Firebase Storage');
            
        } catch (error) {
            console.warn('⚠️ Error guardando en Storage (continuando):', error);
            // No lanzar error para no interrumpir el backup principal
        }
    }

    // 🧹 Limpiar backups antiguos
    async cleanupOldBackups(oldBackups) {
        for (const backup of oldBackups) {
            try {
                // Eliminar de Firestore
                await firebase.firestore()
                    .doc(`artifacts/${window.appId}/backups/${backup.id}`)
                    .delete();
                
                // Eliminar de Storage si existe
                if (this.settings.cloudBackupEnabled) {
                    const storageRef = firebase.storage().ref();
                    const backupRef = storageRef.child(`backups/${window.appId}/${backup.id}.json`);
                    await backupRef.delete().catch(() => {}); // Ignorar errores
                }
                
                console.log('🧹 Backup antiguo eliminado:', backup.id);
            } catch (error) {
                console.warn('⚠️ Error eliminando backup antiguo:', backup.id, error);
            }
        }
    }

    // 📚 Guardar historial de backups
    async saveBackupHistory() {
        try {
            await firebase.firestore()
                .doc(`artifacts/${window.appId}/backup_history/log`)
                .set({
                    history: this.backupHistory.slice(0, 100), // Mantener últimos 100
                    lastBackupTime: this.lastBackupTime,
                    lastUpdated: new Date().toISOString()
                });
        } catch (error) {
            console.error('❌ Error guardando historial de backups:', error);
        }
    }

    // 🆔 Generar ID único para backup
    generateBackupId() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const random = Math.random().toString(36).substring(2, 8);
        return `backup-${timestamp}-${random}`;
    }

    // 🔔 Mostrar notificación de backup
    showBackupNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';
        const icon = type === 'error' ? 'alert-circle' : 'shield-check';
        
        notification.className = `fixed top-4 right-4 ${bgColor} text-white p-3 rounded-lg shadow-lg z-50 max-w-sm`;
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <i data-lucide="${icon}" class="w-4 h-4"></i>
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

    // 📊 Obtener estadísticas de backups
    getBackupStats() {
        const successfulBackups = this.backupHistory.filter(b => b.success).length;
        const failedBackups = this.backupHistory.filter(b => !b.success).length;
        const totalSize = this.backupHistory.reduce((sum, b) => sum + (b.size || 0), 0);
        
        return {
            total: this.backupHistory.length,
            successful: successfulBackups,
            failed: failedBackups,
            totalSize: totalSize,
            lastBackup: this.lastBackupTime,
            settings: this.settings
        };
    }

    // ⚙️ Actualizar configuración
    async updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        
        try {
            await firebase.firestore()
                .doc(`artifacts/${window.appId}/backup_settings/config`)
                .set(this.settings);
            
            // Reconfigurar backups automáticos si cambió la frecuencia
            if (newSettings.backupFrequency || newSettings.autoBackupEnabled !== undefined) {
                this.setupAutomaticBackups();
            }
            
            console.log('⚙️ Configuración de backups actualizada');
            return true;
        } catch (error) {
            console.error('❌ Error actualizando configuración:', error);
            return false;
        }
    }

    // 🛑 Detener backups automáticos
    stopAutomaticBackups() {
        if (this.backupSchedule) {
            clearInterval(this.backupSchedule);
            this.backupSchedule = null;
            console.log('🛑 Backups automáticos detenidos');
        }
    }

    // ▶️ Reanudar backups automáticos
    resumeAutomaticBackups() {
        this.setupAutomaticBackups();
        console.log('▶️ Backups automáticos reanudados');
    }

    // 🔍 Diagnóstico del sistema
    async runDiagnostics() {
        const diagnostics = {
            timestamp: new Date().toISOString(),
            system: {
                initialized: this.initialized,
                firebaseAvailable: typeof firebase !== 'undefined',
                firestoreAvailable: typeof firebase !== 'undefined' && !!firebase.firestore,
                authAvailable: typeof firebase !== 'undefined' && !!firebase.auth,
                userAuthenticated: firebase.auth()?.currentUser ? true : false,
                appIdDefined: !!window.appId,
                appId: window.appId
            },
            settings: this.settings,
            history: {
                totalBackups: this.backupHistory.length,
                successfulBackups: this.backupHistory.filter(b => b.success).length,
                failedBackups: this.backupHistory.filter(b => !b.success).length,
                lastBackup: this.lastBackupTime
            },
            tests: {}
        };

        // Test de conexión a Firebase
        try {
            await firebase.firestore().doc('test/connection').get();
            diagnostics.tests.firebaseConnection = 'OK';
        } catch (error) {
            diagnostics.tests.firebaseConnection = 'ERROR: ' + error.message;
        }

        // Test de obtención de transacciones
        try {
            const transactions = await this.getTransactions();
            diagnostics.tests.transactionsAccess = `OK: ${transactions.length} transacciones`;
        } catch (error) {
            diagnostics.tests.transactionsAccess = 'ERROR: ' + error.message;
        }

        // Test de permisos de escritura
        try {
            const testDoc = firebase.firestore().doc(`artifacts/${window.appId}/backup_test/diagnostic`);
            await testDoc.set({ test: true, timestamp: new Date().toISOString() });
            await testDoc.delete();
            diagnostics.tests.writePermissions = 'OK';
        } catch (error) {
            diagnostics.tests.writePermissions = 'ERROR: ' + error.message;
        }

        console.log('🔍 Diagnóstico del sistema de backups:', diagnostics);
        return diagnostics;
    }

    // 🧪 Realizar backup de prueba
    async performTestBackup() {
        try {
            console.log('🧪 Iniciando backup de prueba...');

            // Crear datos de prueba mínimos
            const testData = {
                transactions: await this.getTransactions(),
                metadata: {
                    test: true,
                    timestamp: new Date().toISOString(),
                    userEmail: firebase.auth().currentUser?.email
                }
            };

            const backupId = 'test-' + this.generateBackupId();
            const backup = {
                id: backupId,
                timestamp: new Date().toISOString(),
                type: 'test',
                version: '1.0',
                data: testData,
                metadata: {
                    totalTransactions: testData.transactions?.length || 0,
                    isTest: true
                }
            };

            // Guardar backup de prueba
            await firebase.firestore()
                .doc(`artifacts/${window.appId}/backups/${backupId}`)
                .set(backup);

            console.log('✅ Backup de prueba completado:', backupId);

            // Limpiar backup de prueba después de 1 minuto
            setTimeout(async () => {
                try {
                    await firebase.firestore()
                        .doc(`artifacts/${window.appId}/backups/${backupId}`)
                        .delete();
                    console.log('🧹 Backup de prueba limpiado:', backupId);
                } catch (error) {
                    console.warn('⚠️ Error limpiando backup de prueba:', error);
                }
            }, 60000);

            return backupId;
        } catch (error) {
            console.error('❌ Error en backup de prueba:', error);
            throw error;
        }
    }
}

// 🌐 Exportar para uso global
window.AutomaticBackupSystem = AutomaticBackupSystem;
