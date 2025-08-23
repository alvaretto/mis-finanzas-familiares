// 📤 SISTEMA DE EXPORTACIÓN MÚLTIPLE
// Exportación de datos en múltiples formatos con diferentes niveles de detalle

class MultiExportSystem {
    constructor() {
        this.supportedFormats = ['json', 'csv', 'excel', 'pdf'];
        this.exportHistory = [];
        
        console.log('📤 Sistema de Exportación Múltiple inicializado');
    }

    // 📊 Exportar datos completos
    async exportCompleteData(format = 'json', options = {}) {
        try {
            console.log(`📊 Iniciando exportación completa en formato ${format.toUpperCase()}`);
            
            // Recopilar todos los datos
            const data = await this.collectExportData(options);
            
            // Exportar según el formato
            let result;
            switch (format.toLowerCase()) {
                case 'json':
                    result = await this.exportToJSON(data, options);
                    break;
                case 'csv':
                    result = await this.exportToCSV(data, options);
                    break;
                case 'excel':
                    result = await this.exportToExcel(data, options);
                    break;
                case 'pdf':
                    result = await this.exportToPDF(data, options);
                    break;
                default:
                    throw new Error(`Formato no soportado: ${format}`);
            }
            
            // Registrar exportación
            this.recordExport(format, result.size, true);
            
            console.log(`✅ Exportación ${format.toUpperCase()} completada`);
            return result;
            
        } catch (error) {
            console.error(`❌ Error en exportación ${format}:`, error);
            this.recordExport(format, 0, false, error.message);
            throw error;
        }
    }

    // 📋 Recopilar datos para exportación
    async collectExportData(options = {}) {
        const data = {
            metadata: {
                exportDate: new Date().toISOString(),
                appVersion: '2.0',
                exportedBy: firebase.auth().currentUser?.email || 'Usuario',
                options: options
            }
        };

        try {
            // Transacciones (siempre incluidas)
            data.transactions = await this.getTransactionsForExport(options);
            
            // Presupuesto
            if (options.includeBudget !== false) {
                data.budget = await this.getBudgetForExport();
            }
            
            // Categorías
            if (options.includeCategories !== false) {
                data.categories = await this.getCategoriesForExport();
            }
            
            // Activos y Pasivos
            if (options.includeAssets !== false) {
                data.assets = await this.getAssetsForExport();
                data.liabilities = await this.getLiabilitiesForExport();
            }
            
            // Datos de IA (opcional)
            if (options.includeAIData === true) {
                data.aiData = await this.getAIDataForExport();
            }
            
            // Estadísticas resumidas
            if (options.includeStats !== false) {
                data.statistics = this.generateStatistics(data);
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Error recopilando datos para exportación:', error);
            throw error;
        }
    }

    // 📋 Obtener transacciones para exportación
    async getTransactionsForExport(options = {}) {
        try {
            let query = firebase.firestore()
                .collection(`artifacts/${window.appId}/shared_transactions/family_data/transactions`);
            
            // Filtrar por fechas si se especifica
            if (options.startDate) {
                query = query.where('date', '>=', options.startDate);
            }
            if (options.endDate) {
                query = query.where('date', '<=', options.endDate);
            }
            
            // Ordenar por fecha
            query = query.orderBy('date', 'desc');
            
            // Limitar cantidad si se especifica
            if (options.limit) {
                query = query.limit(options.limit);
            }
            
            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Formatear fecha para exportación
                dateFormatted: new Date(doc.data().date).toLocaleDateString('es-ES'),
                amountFormatted: this.formatCurrency(doc.data().amount)
            }));
            
        } catch (error) {
            console.error('❌ Error obteniendo transacciones:', error);
            return [];
        }
    }

    // 💰 Obtener presupuesto para exportación
    async getBudgetForExport() {
        try {
            const doc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/shared_transactions/family_data/budget/monthly`)
                .get();
            
            if (doc.exists) {
                const budget = doc.data();
                // Agregar totales calculados
                budget.totalBudget = Object.values(budget).reduce((sum, val) => 
                    typeof val === 'number' ? sum + val : sum, 0
                );
                return budget;
            }
            return {};
        } catch (error) {
            console.error('❌ Error obteniendo presupuesto:', error);
            return {};
        }
    }

    // 🏷️ Obtener categorías para exportación
    async getCategoriesForExport() {
        try {
            const doc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/shared_transactions/family_data/categories/structure`)
                .get();
            
            return doc.exists ? doc.data() : {};
        } catch (error) {
            console.error('❌ Error obteniendo categorías:', error);
            return {};
        }
    }

    // 📈 Obtener activos para exportación
    async getAssetsForExport() {
        try {
            const snapshot = await firebase.firestore()
                .collection(`artifacts/${window.appId}/shared_transactions/family_data/assets`)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                valueFormatted: this.formatCurrency(doc.data().value || 0)
            }));
        } catch (error) {
            console.error('❌ Error obteniendo activos:', error);
            return [];
        }
    }

    // 📉 Obtener pasivos para exportación
    async getLiabilitiesForExport() {
        try {
            const snapshot = await firebase.firestore()
                .collection(`artifacts/${window.appId}/shared_transactions/family_data/liabilities`)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                amountFormatted: this.formatCurrency(doc.data().amount || 0)
            }));
        } catch (error) {
            console.error('❌ Error obteniendo pasivos:', error);
            return [];
        }
    }

    // 🧠 Obtener datos de IA para exportación
    async getAIDataForExport() {
        try {
            if (!window.aiMemorySystem || !window.aiMemorySystem.userId) {
                return {};
            }
            
            const userId = window.aiMemorySystem.userId;
            const aiData = {};
            
            // Solo exportar resumen de datos de IA por privacidad
            aiData.summary = {
                profileExists: false,
                conversationsCount: 0,
                insightsCount: 0,
                lastActivity: null
            };
            
            // Verificar perfil
            const profileDoc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory/${userId}/profile`)
                .get();
            if (profileDoc.exists) {
                aiData.summary.profileExists = true;
                aiData.summary.lastActivity = profileDoc.data().lastUpdated;
            }
            
            // Contar conversaciones
            const conversationsDoc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory/${userId}/conversations`)
                .get();
            if (conversationsDoc.exists) {
                aiData.summary.conversationsCount = conversationsDoc.data().history?.length || 0;
            }
            
            // Contar insights
            const insightsDoc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory/${userId}/proactive_insights`)
                .get();
            if (insightsDoc.exists) {
                aiData.summary.insightsCount = insightsDoc.data().insights?.length || 0;
            }
            
            return aiData;
        } catch (error) {
            console.error('❌ Error obteniendo datos de IA:', error);
            return {};
        }
    }

    // 📊 Generar estadísticas
    generateStatistics(data) {
        const stats = {
            summary: {
                totalTransactions: data.transactions?.length || 0,
                totalIncome: 0,
                totalExpenses: 0,
                netFlow: 0,
                categoriesCount: Object.keys(data.categories || {}).length,
                assetsCount: data.assets?.length || 0,
                liabilitiesCount: data.liabilities?.length || 0
            },
            byCategory: {},
            byMonth: {},
            trends: {}
        };
        
        // Calcular totales
        if (data.transactions) {
            data.transactions.forEach(transaction => {
                if (transaction.type === 'income') {
                    stats.summary.totalIncome += transaction.amount;
                } else if (transaction.type === 'expense') {
                    stats.summary.totalExpenses += transaction.amount;
                }
                
                // Por categoría
                const category = transaction.category || 'Sin categoría';
                if (!stats.byCategory[category]) {
                    stats.byCategory[category] = { income: 0, expenses: 0, count: 0 };
                }
                stats.byCategory[category].count++;
                if (transaction.type === 'income') {
                    stats.byCategory[category].income += transaction.amount;
                } else {
                    stats.byCategory[category].expenses += transaction.amount;
                }
                
                // Por mes
                const month = new Date(transaction.date).toISOString().substring(0, 7);
                if (!stats.byMonth[month]) {
                    stats.byMonth[month] = { income: 0, expenses: 0, count: 0 };
                }
                stats.byMonth[month].count++;
                if (transaction.type === 'income') {
                    stats.byMonth[month].income += transaction.amount;
                } else {
                    stats.byMonth[month].expenses += transaction.amount;
                }
            });
        }
        
        stats.summary.netFlow = stats.summary.totalIncome - stats.summary.totalExpenses;
        
        return stats;
    }

    // 📄 Exportar a JSON
    async exportToJSON(data, options = {}) {
        const jsonData = JSON.stringify(data, null, options.minified ? 0 : 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        
        const filename = this.generateFilename('json', options);
        this.downloadBlob(blob, filename);
        
        return {
            format: 'json',
            filename: filename,
            size: blob.size,
            recordsCount: data.transactions?.length || 0
        };
    }

    // 📊 Exportar a CSV
    async exportToCSV(data, options = {}) {
        let csvContent = '';
        
        if (options.exportType === 'transactions' || !options.exportType) {
            // CSV de transacciones
            csvContent = this.transactionsToCSV(data.transactions || []);
        } else if (options.exportType === 'summary') {
            // CSV de resumen
            csvContent = this.summaryToCSV(data.statistics || {});
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const filename = this.generateFilename('csv', options);
        this.downloadBlob(blob, filename);
        
        return {
            format: 'csv',
            filename: filename,
            size: blob.size,
            recordsCount: data.transactions?.length || 0
        };
    }

    // 📋 Convertir transacciones a CSV
    transactionsToCSV(transactions) {
        if (!transactions || transactions.length === 0) {
            return 'No hay transacciones para exportar';
        }
        
        // Encabezados
        const headers = [
            'Fecha',
            'Descripción',
            'Categoría',
            'Tipo',
            'Monto',
            'Método de Pago',
            'Notas'
        ];
        
        let csv = headers.join(',') + '\n';
        
        // Datos
        transactions.forEach(transaction => {
            const row = [
                `"${transaction.dateFormatted || new Date(transaction.date).toLocaleDateString()}"`,
                `"${(transaction.description || '').replace(/"/g, '""')}"`,
                `"${transaction.category || ''}"`,
                `"${transaction.type || ''}"`,
                `"${transaction.amountFormatted || transaction.amount || 0}"`,
                `"${transaction.paymentMethod || ''}"`,
                `"${(transaction.notes || '').replace(/"/g, '""')}"`
            ];
            csv += row.join(',') + '\n';
        });
        
        return csv;
    }

    // 📊 Convertir resumen a CSV
    summaryToCSV(statistics) {
        let csv = 'Resumen Financiero\n\n';
        
        // Resumen general
        csv += 'Métrica,Valor\n';
        csv += `"Total Transacciones","${statistics.summary?.totalTransactions || 0}"\n`;
        csv += `"Total Ingresos","${this.formatCurrency(statistics.summary?.totalIncome || 0)}"\n`;
        csv += `"Total Gastos","${this.formatCurrency(statistics.summary?.totalExpenses || 0)}"\n`;
        csv += `"Flujo Neto","${this.formatCurrency(statistics.summary?.netFlow || 0)}"\n\n`;
        
        // Por categoría
        if (statistics.byCategory) {
            csv += 'Categoría,Ingresos,Gastos,Transacciones\n';
            Object.entries(statistics.byCategory).forEach(([category, data]) => {
                csv += `"${category}","${this.formatCurrency(data.income)}","${this.formatCurrency(data.expenses)}","${data.count}"\n`;
            });
        }
        
        return csv;
    }

    // 📊 Exportar a Excel (simulado - requeriría librería como SheetJS)
    async exportToExcel(data, options = {}) {
        // Por ahora, exportar como CSV con extensión .xlsx
        // En producción, usarías una librería como SheetJS
        console.warn('⚠️ Exportación Excel simulada como CSV');
        
        const csvContent = this.transactionsToCSV(data.transactions || []);
        const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const filename = this.generateFilename('xlsx', options);
        this.downloadBlob(blob, filename);
        
        return {
            format: 'excel',
            filename: filename,
            size: blob.size,
            recordsCount: data.transactions?.length || 0,
            note: 'Exportación Excel simulada como CSV'
        };
    }

    // 📄 Exportar a PDF (simulado - requeriría librería como jsPDF)
    async exportToPDF(data, options = {}) {
        // Por ahora, crear un HTML simple y convertir
        // En producción, usarías jsPDF o similar
        console.warn('⚠️ Exportación PDF simulada como HTML');
        
        const htmlContent = this.generateHTMLReport(data);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        
        const filename = this.generateFilename('html', options);
        this.downloadBlob(blob, filename);
        
        return {
            format: 'pdf',
            filename: filename,
            size: blob.size,
            recordsCount: data.transactions?.length || 0,
            note: 'Exportación PDF simulada como HTML'
        };
    }

    // 📄 Generar reporte HTML
    generateHTMLReport(data) {
        const stats = data.statistics || {};
        const transactions = data.transactions || [];
        
        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte Financiero - ${new Date().toLocaleDateString()}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; }
        .positive { color: green; }
        .negative { color: red; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Reporte Financiero Familiar</h1>
        <p>Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
    </div>
    
    <div class="summary">
        <h2>📈 Resumen General</h2>
        <p><strong>Total de transacciones:</strong> ${stats.summary?.totalTransactions || 0}</p>
        <p><strong>Total ingresos:</strong> <span class="positive">${this.formatCurrency(stats.summary?.totalIncome || 0)}</span></p>
        <p><strong>Total gastos:</strong> <span class="negative">${this.formatCurrency(stats.summary?.totalExpenses || 0)}</span></p>
        <p><strong>Flujo neto:</strong> <span class="${(stats.summary?.netFlow || 0) >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(stats.summary?.netFlow || 0)}</span></p>
    </div>
    
    <h2>📋 Últimas Transacciones</h2>
    <table class="table">
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Monto</th>
            </tr>
        </thead>
        <tbody>
            ${transactions.slice(0, 50).map(t => `
                <tr>
                    <td>${t.dateFormatted || new Date(t.date).toLocaleDateString()}</td>
                    <td>${t.description || ''}</td>
                    <td>${t.category || ''}</td>
                    <td>${t.type || ''}</td>
                    <td class="${t.type === 'income' ? 'positive' : 'negative'}">${t.amountFormatted || this.formatCurrency(t.amount || 0)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
        <p>Reporte generado por Finanzas Familiares v2.0</p>
    </div>
</body>
</html>`;
    }

    // 📁 Generar nombre de archivo
    generateFilename(extension, options = {}) {
        const date = new Date().toISOString().split('T')[0];
        const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
        const prefix = options.prefix || 'finanzas-familiares';
        const suffix = options.suffix || '';
        
        return `${prefix}-${date}-${time}${suffix}.${extension}`;
    }

    // 💾 Descargar blob
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // 💰 Formatear moneda
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount || 0);
    }

    // 📝 Registrar exportación
    recordExport(format, size, success, error = null) {
        const record = {
            timestamp: new Date().toISOString(),
            format: format,
            size: size,
            success: success,
            error: error
        };
        
        this.exportHistory.unshift(record);
        
        // Mantener solo los últimos 50 registros
        if (this.exportHistory.length > 50) {
            this.exportHistory = this.exportHistory.slice(0, 50);
        }
        
        console.log('📝 Exportación registrada:', record);
    }

    // 📊 Obtener historial de exportaciones
    getExportHistory() {
        return this.exportHistory;
    }

    // 🧹 Limpiar historial
    clearExportHistory() {
        this.exportHistory = [];
        console.log('🧹 Historial de exportaciones limpiado');
    }
}

}

// 🔄 SISTEMA DE RESTAURACIÓN DE BACKUPS
// Restaurar datos desde backups con validación y confirmación

class BackupRestoreSystem {
    constructor() {
        this.restoreHistory = [];
        this.validationRules = {
            requiredFields: ['transactions', 'metadata'],
            maxFileSize: 50 * 1024 * 1024, // 50MB
            supportedVersions: ['1.0', '2.0']
        };

        console.log('🔄 Sistema de Restauración de Backups inicializado');
    }

    // 📂 Listar backups disponibles
    async listAvailableBackups() {
        try {
            const snapshot = await firebase.firestore()
                .collection(`artifacts/${window.appId}/backups`)
                .orderBy('timestamp', 'desc')
                .limit(50)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                sizeFormatted: this.formatFileSize(JSON.stringify(doc.data()).length)
            }));
        } catch (error) {
            console.error('❌ Error listando backups:', error);
            return [];
        }
    }

    // 🔍 Validar backup antes de restaurar
    async validateBackup(backupData) {
        const validation = {
            valid: true,
            errors: [],
            warnings: [],
            info: {}
        };

        try {
            // Verificar estructura básica
            if (!backupData.data) {
                validation.errors.push('Estructura de backup inválida: falta "data"');
                validation.valid = false;
            }

            if (!backupData.metadata) {
                validation.errors.push('Estructura de backup inválida: falta "metadata"');
                validation.valid = false;
            }

            // Verificar versión
            if (backupData.version && !this.validationRules.supportedVersions.includes(backupData.version)) {
                validation.warnings.push(`Versión de backup no probada: ${backupData.version}`);
            }

            // Verificar datos descomprimidos si es necesario
            let data = backupData.data;
            if (backupData.compressed && data.compressed) {
                try {
                    data = JSON.parse(atob(data.data));
                } catch (error) {
                    validation.errors.push('Error descomprimiendo datos del backup');
                    validation.valid = false;
                    return validation;
                }
            }

            // Verificar campos requeridos
            this.validationRules.requiredFields.forEach(field => {
                if (!data[field]) {
                    validation.warnings.push(`Campo recomendado faltante: ${field}`);
                }
            });

            // Información del backup
            validation.info = {
                transactionsCount: data.transactions?.length || 0,
                categoriesCount: Object.keys(data.categories || {}).length,
                assetsCount: data.assets?.length || 0,
                liabilitiesCount: data.liabilities?.length || 0,
                hasAIData: !!data.aiData,
                backupDate: backupData.timestamp,
                backupType: backupData.type || 'unknown'
            };

            console.log('🔍 Validación de backup completada:', validation);
            return validation;

        } catch (error) {
            validation.valid = false;
            validation.errors.push(`Error durante validación: ${error.message}`);
            return validation;
        }
    }

    // 🔄 Restaurar desde backup
    async restoreFromBackup(backupId, options = {}) {
        try {
            console.log('🔄 Iniciando restauración desde backup:', backupId);

            // Obtener backup
            const backupDoc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/backups/${backupId}`)
                .get();

            if (!backupDoc.exists) {
                throw new Error('Backup no encontrado');
            }

            const backupData = backupDoc.data();

            // Validar backup
            const validation = await this.validateBackup(backupData);
            if (!validation.valid && !options.forceRestore) {
                throw new Error(`Backup inválido: ${validation.errors.join(', ')}`);
            }

            // Descomprimir datos si es necesario
            let data = backupData.data;
            if (backupData.compressed && data.compressed) {
                data = JSON.parse(atob(data.data));
            }

            // Crear backup de seguridad antes de restaurar
            if (options.createSafetyBackup !== false) {
                await this.createSafetyBackup();
            }

            // Restaurar datos por secciones
            const results = {};

            if (data.transactions && options.restoreTransactions !== false) {
                results.transactions = await this.restoreTransactions(data.transactions);
            }

            if (data.budget && options.restoreBudget !== false) {
                results.budget = await this.restoreBudget(data.budget);
            }

            if (data.categories && options.restoreCategories !== false) {
                results.categories = await this.restoreCategories(data.categories);
            }

            if (data.assets && options.restoreAssets !== false) {
                results.assets = await this.restoreAssets(data.assets);
            }

            if (data.liabilities && options.restoreLiabilities !== false) {
                results.liabilities = await this.restoreLiabilities(data.liabilities);
            }

            if (data.aiData && options.restoreAIData === true) {
                results.aiData = await this.restoreAIData(data.aiData);
            }

            // Registrar restauración
            this.recordRestore(backupId, results, true);

            console.log('✅ Restauración completada:', results);
            return {
                success: true,
                backupId: backupId,
                results: results,
                validation: validation
            };

        } catch (error) {
            console.error('❌ Error en restauración:', error);
            this.recordRestore(backupId, {}, false, error.message);
            throw error;
        }
    }

    // 🛡️ Crear backup de seguridad antes de restaurar
    async createSafetyBackup() {
        try {
            console.log('🛡️ Creando backup de seguridad...');

            if (window.automaticBackupSystem) {
                const safetyBackupId = await window.automaticBackupSystem.performAutomaticBackup();
                console.log('🛡️ Backup de seguridad creado:', safetyBackupId);
                return safetyBackupId;
            } else {
                console.warn('⚠️ Sistema de backup automático no disponible');
                return null;
            }
        } catch (error) {
            console.error('❌ Error creando backup de seguridad:', error);
            throw new Error('No se pudo crear backup de seguridad. Restauración cancelada por seguridad.');
        }
    }

    // 📋 Restaurar transacciones
    async restoreTransactions(transactions) {
        try {
            const batch = firebase.firestore().batch();
            const collection = firebase.firestore()
                .collection(`artifacts/${window.appId}/shared_transactions/family_data/transactions`);

            let restored = 0;
            let skipped = 0;

            for (const transaction of transactions) {
                try {
                    // Limpiar datos de transacción
                    const cleanTransaction = {
                        date: transaction.date,
                        description: transaction.description || '',
                        amount: parseFloat(transaction.amount) || 0,
                        type: transaction.type || 'expense',
                        category: transaction.category || '',
                        paymentMethod: transaction.paymentMethod || '',
                        notes: transaction.notes || '',
                        createdAt: transaction.createdAt || firebase.firestore.FieldValue.serverTimestamp()
                    };

                    if (transaction.id) {
                        batch.set(collection.doc(transaction.id), cleanTransaction);
                    } else {
                        batch.set(collection.doc(), cleanTransaction);
                    }

                    restored++;
                } catch (error) {
                    console.warn('⚠️ Error restaurando transacción:', error);
                    skipped++;
                }
            }

            await batch.commit();
            console.log(`📋 Transacciones restauradas: ${restored}, omitidas: ${skipped}`);

            return { restored, skipped };
        } catch (error) {
            console.error('❌ Error restaurando transacciones:', error);
            throw error;
        }
    }

    // 💰 Restaurar presupuesto
    async restoreBudget(budget) {
        try {
            await firebase.firestore()
                .doc(`artifacts/${window.appId}/shared_transactions/family_data/budget/monthly`)
                .set(budget);

            console.log('💰 Presupuesto restaurado');
            return { restored: 1 };
        } catch (error) {
            console.error('❌ Error restaurando presupuesto:', error);
            throw error;
        }
    }

    // 🏷️ Restaurar categorías
    async restoreCategories(categories) {
        try {
            await firebase.firestore()
                .doc(`artifacts/${window.appId}/shared_transactions/family_data/categories/structure`)
                .set(categories);

            console.log('🏷️ Categorías restauradas');
            return { restored: Object.keys(categories).length };
        } catch (error) {
            console.error('❌ Error restaurando categorías:', error);
            throw error;
        }
    }

    // 📈 Restaurar activos
    async restoreAssets(assets) {
        try {
            const batch = firebase.firestore().batch();
            const collection = firebase.firestore()
                .collection(`artifacts/${window.appId}/shared_transactions/family_data/assets`);

            let restored = 0;
            for (const asset of assets) {
                if (asset.id) {
                    batch.set(collection.doc(asset.id), asset);
                } else {
                    batch.set(collection.doc(), asset);
                }
                restored++;
            }

            await batch.commit();
            console.log(`📈 Activos restaurados: ${restored}`);
            return { restored };
        } catch (error) {
            console.error('❌ Error restaurando activos:', error);
            throw error;
        }
    }

    // 📉 Restaurar pasivos
    async restoreLiabilities(liabilities) {
        try {
            const batch = firebase.firestore().batch();
            const collection = firebase.firestore()
                .collection(`artifacts/${window.appId}/shared_transactions/family_data/liabilities`);

            let restored = 0;
            for (const liability of liabilities) {
                if (liability.id) {
                    batch.set(collection.doc(liability.id), liability);
                } else {
                    batch.set(collection.doc(), liability);
                }
                restored++;
            }

            await batch.commit();
            console.log(`📉 Pasivos restaurados: ${restored}`);
            return { restored };
        } catch (error) {
            console.error('❌ Error restaurando pasivos:', error);
            throw error;
        }
    }

    // 🧠 Restaurar datos de IA
    async restoreAIData(aiData) {
        try {
            if (!window.aiMemorySystem || !window.aiMemorySystem.userId) {
                console.warn('⚠️ Sistema de IA no disponible para restauración');
                return { restored: 0, skipped: 1 };
            }

            const userId = window.aiMemorySystem.userId;
            let restored = 0;

            // Restaurar perfil
            if (aiData.profile) {
                await firebase.firestore()
                    .doc(`artifacts/${window.appId}/ai_memory/${userId}/profile`)
                    .set(aiData.profile);
                restored++;
            }

            // Restaurar conversaciones
            if (aiData.conversations) {
                await firebase.firestore()
                    .doc(`artifacts/${window.appId}/ai_memory/${userId}/conversations`)
                    .set(aiData.conversations);
                restored++;
            }

            // Restaurar datos de aprendizaje
            if (aiData.learning) {
                await firebase.firestore()
                    .doc(`artifacts/${window.appId}/ai_memory/${userId}/learning`)
                    .set(aiData.learning);
                restored++;
            }

            // Restaurar insights
            if (aiData.insights) {
                await firebase.firestore()
                    .doc(`artifacts/${window.appId}/ai_memory/${userId}/proactive_insights`)
                    .set(aiData.insights);
                restored++;
            }

            console.log(`🧠 Datos de IA restaurados: ${restored} documentos`);
            return { restored };
        } catch (error) {
            console.error('❌ Error restaurando datos de IA:', error);
            throw error;
        }
    }

    // 📁 Restaurar desde archivo
    async restoreFromFile(file) {
        try {
            console.log('📁 Restaurando desde archivo:', file.name);

            // Validar tamaño
            if (file.size > this.validationRules.maxFileSize) {
                throw new Error(`Archivo demasiado grande: ${this.formatFileSize(file.size)}`);
            }

            // Leer archivo
            const fileContent = await this.readFile(file);
            let backupData;

            try {
                backupData = JSON.parse(fileContent);
            } catch (error) {
                throw new Error('Archivo no es un JSON válido');
            }

            // Validar y restaurar
            const validation = await this.validateBackup(backupData);
            if (!validation.valid) {
                throw new Error(`Backup inválido: ${validation.errors.join(', ')}`);
            }

            // Crear ID temporal para el backup
            const tempId = 'file-restore-' + Date.now();

            // Restaurar usando el mismo método
            return await this.restoreFromBackup(tempId, {
                backupData: backupData,
                createSafetyBackup: true
            });

        } catch (error) {
            console.error('❌ Error restaurando desde archivo:', error);
            throw error;
        }
    }

    // 📖 Leer archivo
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Error leyendo archivo'));
            reader.readAsText(file);
        });
    }

    // 📊 Formatear tamaño de archivo
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 📝 Registrar restauración
    recordRestore(backupId, results, success, error = null) {
        const record = {
            timestamp: new Date().toISOString(),
            backupId: backupId,
            results: results,
            success: success,
            error: error
        };

        this.restoreHistory.unshift(record);

        // Mantener solo los últimos 20 registros
        if (this.restoreHistory.length > 20) {
            this.restoreHistory = this.restoreHistory.slice(0, 20);
        }

        console.log('📝 Restauración registrada:', record);
    }

    // 📊 Obtener historial de restauraciones
    getRestoreHistory() {
        return this.restoreHistory;
    }
}

// 🌐 Exportar para uso global
window.MultiExportSystem = MultiExportSystem;
window.BackupRestoreSystem = BackupRestoreSystem;
