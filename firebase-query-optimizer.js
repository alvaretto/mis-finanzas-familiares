// 🔥 OPTIMIZADOR DE CONSULTAS FIREBASE
// Sistema avanzado de optimización para consultas Firebase

class FirebaseQueryOptimizer {
    constructor() {
        this.initialized = false;
        this.queryCache = new Map();
        this.queryStats = new Map();
        this.batchOperations = [];
        this.connectionPool = new Map();
        
        // 📊 Configuración de optimización
        this.config = {
            cacheExpiration: 3 * 60 * 1000, // 3 minutos
            maxCacheSize: 100,
            batchSize: 10,
            batchDelay: 1000, // 1 segundo
            enablePersistence: true,
            enableOfflineSupport: true,
            queryTimeout: 10000 // 10 segundos
        };
        
        console.log('🔥 Optimizador de Consultas Firebase inicializado');
    }

    // 🚀 Inicializar optimizador
    async initialize() {
        if (this.initialized) return;
        
        console.log('🔥 Configurando optimizaciones Firebase...');
        
        // Configurar persistencia offline
        await this.setupPersistence();
        
        // Configurar interceptores de consultas
        this.setupQueryInterceptors();
        
        // Configurar operaciones batch
        this.setupBatchOperations();
        
        // Configurar monitoreo de conexión
        this.setupConnectionMonitoring();
        
        // Configurar limpieza automática
        this.setupAutomaticCleanup();
        
        this.initialized = true;
        console.log('✅ Optimizaciones Firebase configuradas');
    }

    // 💾 Configurar persistencia offline
    async setupPersistence() {
        if (!this.config.enablePersistence) return;
        
        try {
            if (window.firebase && window.firebase.firestore) {
                await firebase.firestore().enablePersistence({
                    synchronizeTabs: true
                });
                console.log('✅ Persistencia offline habilitada');
            }
        } catch (error) {
            if (error.code === 'failed-precondition') {
                console.warn('⚠️ Persistencia no disponible: múltiples pestañas');
            } else if (error.code === 'unimplemented') {
                console.warn('⚠️ Persistencia no soportada');
            } else {
                console.error('❌ Error configurando persistencia:', error);
            }
        }
    }

    // 🎯 Configurar interceptores de consultas
    setupQueryInterceptors() {
        // Interceptar consultas de transacciones
        window.getOptimizedTransactions = (options = {}) => {
            return this.optimizedQuery('transactions', {
                collection: `artifacts/${window.appId}/shared_transactions/family_data/transactions`,
                orderBy: { field: 'date', direction: 'desc' },
                limit: options.limit || 50,
                ...options
            });
        };

        // Interceptar consultas de presupuesto
        window.getOptimizedBudget = (options = {}) => {
            return this.optimizedQuery('budget', {
                doc: `artifacts/${window.appId}/shared_transactions/family_data/budget/monthly`,
                ...options
            });
        };

        // Interceptar consultas de IA
        window.getOptimizedAIData = (userId, options = {}) => {
            return this.optimizedQuery(`ai_data_${userId}`, {
                doc: `artifacts/${window.appId}/ai_memory_data/${userId}`,
                ...options
            });
        };

        // Interceptar consultas de insights
        window.getOptimizedInsights = (userId, options = {}) => {
            return this.optimizedQuery(`insights_${userId}`, {
                collection: `artifacts/${window.appId}/ai_memory_data/${userId}/insights`,
                orderBy: { field: 'timestamp', direction: 'desc' },
                limit: options.limit || 20,
                ...options
            });
        };
    }

    // 🎯 Consulta optimizada genérica
    async optimizedQuery(cacheKey, queryConfig) {
        // Verificar caché primero
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log(`💾 Usando datos desde caché: ${cacheKey}`);
            this.updateQueryStats(cacheKey, 'cache_hit');
            return cached;
        }

        // Ejecutar consulta con timeout
        try {
            const startTime = Date.now();
            const result = await Promise.race([
                this.executeQuery(queryConfig),
                this.createTimeout(this.config.queryTimeout)
            ]);

            const duration = Date.now() - startTime;
            
            // Guardar en caché
            this.setCache(cacheKey, result);
            
            // Actualizar estadísticas
            this.updateQueryStats(cacheKey, 'success', duration);
            
            console.log(`🔥 Consulta ejecutada: ${cacheKey} (${duration}ms)`);
            return result;

        } catch (error) {
            this.updateQueryStats(cacheKey, 'error');
            console.error(`❌ Error en consulta ${cacheKey}:`, error);
            
            // Intentar obtener datos offline
            return this.getOfflineData(cacheKey) || [];
        }
    }

    // 🚀 Ejecutar consulta Firebase
    async executeQuery(config) {
        const db = firebase.firestore();

        if (config.doc) {
            // Consulta de documento
            const docRef = db.doc(config.doc);
            const snapshot = await docRef.get();
            
            return snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null;
            
        } else if (config.collection) {
            // Consulta de colección
            let query = db.collection(config.collection);
            
            // Aplicar filtros
            if (config.where) {
                config.where.forEach(filter => {
                    query = query.where(filter.field, filter.operator, filter.value);
                });
            }
            
            // Aplicar ordenamiento
            if (config.orderBy) {
                query = query.orderBy(config.orderBy.field, config.orderBy.direction);
            }
            
            // Aplicar límite
            if (config.limit) {
                query = query.limit(config.limit);
            }
            
            // Aplicar paginación
            if (config.startAfter) {
                query = query.startAfter(config.startAfter);
            }
            
            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        }
        
        throw new Error('Configuración de consulta inválida');
    }

    // ⏰ Crear timeout para consultas
    createTimeout(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Consulta timeout después de ${ms}ms`));
            }, ms);
        });
    }

    // 💾 Gestión de caché
    setCache(key, data) {
        // Limpiar caché si está lleno
        if (this.queryCache.size >= this.config.maxCacheSize) {
            this.cleanupCache();
        }
        
        this.queryCache.set(key, {
            data,
            timestamp: Date.now(),
            hits: 0
        });
    }

    getFromCache(key) {
        const cached = this.queryCache.get(key);
        
        if (!cached) return null;
        
        // Verificar expiración
        if (Date.now() - cached.timestamp > this.config.cacheExpiration) {
            this.queryCache.delete(key);
            return null;
        }
        
        // Incrementar contador de hits
        cached.hits++;
        
        return cached.data;
    }

    // 🧹 Limpiar caché
    cleanupCache() {
        const now = Date.now();
        let cleaned = 0;
        
        // Eliminar entradas expiradas
        for (const [key, value] of this.queryCache.entries()) {
            if (now - value.timestamp > this.config.cacheExpiration) {
                this.queryCache.delete(key);
                cleaned++;
            }
        }
        
        // Si aún está lleno, eliminar las menos usadas
        if (this.queryCache.size >= this.config.maxCacheSize) {
            const entries = Array.from(this.queryCache.entries())
                .sort((a, b) => a[1].hits - b[1].hits);
            
            const toRemove = Math.floor(this.config.maxCacheSize * 0.2); // Remover 20%
            for (let i = 0; i < toRemove && i < entries.length; i++) {
                this.queryCache.delete(entries[i][0]);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Caché limpiado: ${cleaned} entradas eliminadas`);
        }
    }

    // 📊 Actualizar estadísticas de consultas
    updateQueryStats(key, type, duration = 0) {
        if (!this.queryStats.has(key)) {
            this.queryStats.set(key, {
                total: 0,
                cache_hits: 0,
                success: 0,
                errors: 0,
                totalDuration: 0,
                avgDuration: 0
            });
        }
        
        const stats = this.queryStats.get(key);
        stats.total++;
        stats[type]++;
        
        if (duration > 0) {
            stats.totalDuration += duration;
            stats.avgDuration = stats.totalDuration / stats.success;
        }
    }

    // 📦 OPERACIONES BATCH
    setupBatchOperations() {
        // Procesar batch periódicamente
        setInterval(() => {
            if (this.batchOperations.length > 0) {
                this.processBatch();
            }
        }, this.config.batchDelay);
    }

    // 📝 Agregar operación a batch
    addToBatch(operation) {
        this.batchOperations.push({
            ...operation,
            timestamp: Date.now()
        });
        
        // Procesar inmediatamente si el batch está lleno
        if (this.batchOperations.length >= this.config.batchSize) {
            this.processBatch();
        }
    }

    // 🚀 Procesar batch
    async processBatch() {
        if (this.batchOperations.length === 0) return;
        
        const operations = this.batchOperations.splice(0, this.config.batchSize);
        const batch = firebase.firestore().batch();
        
        try {
            operations.forEach(op => {
                const ref = firebase.firestore().doc(op.path);
                
                switch (op.type) {
                    case 'set':
                        batch.set(ref, op.data);
                        break;
                    case 'update':
                        batch.update(ref, op.data);
                        break;
                    case 'delete':
                        batch.delete(ref);
                        break;
                }
            });
            
            await batch.commit();
            console.log(`✅ Batch procesado: ${operations.length} operaciones`);
            
        } catch (error) {
            console.error('❌ Error procesando batch:', error);
            // Reintroducir operaciones fallidas
            this.batchOperations.unshift(...operations);
        }
    }

    // 🌐 Monitoreo de conexión
    setupConnectionMonitoring() {
        if (window.navigator && 'onLine' in window.navigator) {
            window.addEventListener('online', () => {
                console.log('🌐 Conexión restaurada');
                this.syncOfflineData();
            });
            
            window.addEventListener('offline', () => {
                console.log('📴 Conexión perdida - modo offline');
            });
        }
    }

    // 📴 Obtener datos offline
    getOfflineData(key) {
        // Intentar obtener de localStorage como fallback
        try {
            const stored = localStorage.getItem(`firebase_offline_${key}`);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('❌ Error obteniendo datos offline:', error);
            return null;
        }
    }

    // 🔄 Sincronizar datos offline
    async syncOfflineData() {
        // Implementar sincronización cuando se restaure la conexión
        console.log('🔄 Sincronizando datos offline...');
        
        // Procesar operaciones batch pendientes
        if (this.batchOperations.length > 0) {
            await this.processBatch();
        }
        
        // Limpiar caché para forzar nuevas consultas
        this.queryCache.clear();
    }

    // 🧹 Configurar limpieza automática
    setupAutomaticCleanup() {
        // Limpiar caché cada 5 minutos
        setInterval(() => {
            this.cleanupCache();
        }, 5 * 60 * 1000);
        
        // Limpiar estadísticas cada hora
        setInterval(() => {
            this.cleanupStats();
        }, 60 * 60 * 1000);
    }

    // 📊 Limpiar estadísticas
    cleanupStats() {
        // Mantener solo las estadísticas más recientes
        if (this.queryStats.size > 50) {
            const entries = Array.from(this.queryStats.entries());
            const toKeep = entries.slice(-30); // Mantener últimas 30
            
            this.queryStats.clear();
            toKeep.forEach(([key, value]) => {
                this.queryStats.set(key, value);
            });
            
            console.log('📊 Estadísticas de consultas limpiadas');
        }
    }

    // 📈 Obtener reporte de rendimiento
    getPerformanceReport() {
        const cacheHitRate = this.calculateCacheHitRate();
        const avgQueryTime = this.calculateAverageQueryTime();
        
        return {
            cache: {
                size: this.queryCache.size,
                hitRate: cacheHitRate,
                maxSize: this.config.maxCacheSize
            },
            queries: {
                total: Array.from(this.queryStats.values()).reduce((sum, stat) => sum + stat.total, 0),
                avgTime: avgQueryTime,
                stats: Object.fromEntries(this.queryStats)
            },
            batch: {
                pending: this.batchOperations.length,
                maxSize: this.config.batchSize
            },
            recommendations: this.generateRecommendations()
        };
    }

    // 📊 Calcular tasa de aciertos de caché
    calculateCacheHitRate() {
        const stats = Array.from(this.queryStats.values());
        const totalQueries = stats.reduce((sum, stat) => sum + stat.total, 0);
        const totalHits = stats.reduce((sum, stat) => sum + stat.cache_hits, 0);
        
        return totalQueries > 0 ? (totalHits / totalQueries) * 100 : 0;
    }

    // ⏱️ Calcular tiempo promedio de consulta
    calculateAverageQueryTime() {
        const stats = Array.from(this.queryStats.values());
        const totalTime = stats.reduce((sum, stat) => sum + stat.totalDuration, 0);
        const totalSuccess = stats.reduce((sum, stat) => sum + stat.success, 0);
        
        return totalSuccess > 0 ? totalTime / totalSuccess : 0;
    }

    // 💡 Generar recomendaciones
    generateRecommendations() {
        const recommendations = [];
        const hitRate = this.calculateCacheHitRate();
        const avgTime = this.calculateAverageQueryTime();
        
        if (hitRate < 50) {
            recommendations.push({
                type: 'cache',
                priority: 'medium',
                message: 'Tasa de aciertos de caché baja',
                action: 'Aumentar tiempo de expiración de caché'
            });
        }
        
        if (avgTime > 2000) {
            recommendations.push({
                type: 'performance',
                priority: 'high',
                message: 'Consultas lentas detectadas',
                action: 'Optimizar índices de Firestore'
            });
        }
        
        if (this.batchOperations.length > 20) {
            recommendations.push({
                type: 'batch',
                priority: 'medium',
                message: 'Cola de operaciones batch grande',
                action: 'Reducir tamaño de batch o aumentar frecuencia'
            });
        }
        
        return recommendations;
    }
}

// 🚀 Inicializar automáticamente
document.addEventListener('DOMContentLoaded', () => {
    window.firebaseQueryOptimizer = new FirebaseQueryOptimizer();
    
    // Inicializar después de Firebase
    setTimeout(() => {
        if (window.firebase) {
            window.firebaseQueryOptimizer.initialize();
        }
    }, 2000);
});

// 📊 Exportar para uso global
window.FirebaseQueryOptimizer = FirebaseQueryOptimizer;
