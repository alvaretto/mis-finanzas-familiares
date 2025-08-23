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
            await this.loadSettings();
            await this.loadBackupHistory();
            this.setupAutomaticBackups();
            
            this.initialized = true;
            console.log('✅ Sistema de backups automáticos listo');
            return true;
        } catch (error) {
            console.error('❌ Error inicializando sistema de backups:', error);
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
        try {
            console.log('💾 Iniciando backup automático...');
            
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
                    compressed: this.settings.compressionEnabled
                }
            };

            // Comprimir si está habilitado
            if (this.settings.compressionEnabled) {
                backup.data = this.compressData(backup.data);
                backup.compressed = true;
            }

            // Guardar backup
            await this.saveBackup(backup);
            
            // Actualizar historial
            this.backupHistory.unshift({
                id: backupId,
                timestamp: timestamp,
                type: 'automatic',
                size: JSON.stringify(backup).length,
                success: true
            });

            // Mantener solo los últimos N backups
            if (this.backupHistory.length > this.settings.maxBackupsToKeep) {
                const oldBackups = this.backupHistory.splice(this.settings.maxBackupsToKeep);
                await this.cleanupOldBackups(oldBackups);
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
            
            await this.saveBackupHistory();
            this.showBackupNotification('Error en backup automático', 'error');
            throw error;
        }
    }

    // 📊 Recopilar todos los datos
    async collectAllData() {
        const data = {};
        
        try {
            // Transacciones
            data.transactions = await this.getTransactions();
            console.log('📊 Transacciones recopiladas:', data.transactions.length);

            // Presupuesto
            data.budget = await this.getBudget();
            console.log('💰 Presupuesto recopilado');

            // Categorías
            data.categories = await this.getCategories();
            console.log('🏷️ Categorías recopiladas');

            // Activos
            data.assets = await this.getAssets();
            console.log('📈 Activos recopilados:', data.assets.length);

            // Pasivos
            data.liabilities = await this.getLiabilities();
            console.log('📉 Pasivos recopilados:', data.liabilities.length);

            // Datos de IA (si está habilitado)
            if (this.settings.includeAIData) {
                data.aiData = await this.getAIData();
                console.log('🧠 Datos de IA recopilados');
            }

            // Configuración de la aplicación
            data.appSettings = await this.getAppSettings();
            console.log('⚙️ Configuración recopilada');

        } catch (error) {
            console.error('❌ Error recopilando datos:', error);
            throw error;
        }

        return data;
    }

    // 📋 Obtener transacciones
    async getTransactions() {
        try {
            const snapshot = await firebase.firestore()
                .collection(`artifacts/${window.appId}/shared_transactions/family_data/transactions`)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.warn('⚠️ Error obteniendo transacciones:', error);
            return [];
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
}

// 🌐 Exportar para uso global
window.AutomaticBackupSystem = AutomaticBackupSystem;
