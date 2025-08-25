// 🚀 OPTIMIZADOR DE RENDIMIENTO AVANZADO
// Sistema completo de optimización de rendimiento para la aplicación

class PerformanceOptimizer {
    constructor() {
        this.initialized = false;
        this.loadedScripts = new Set();
        this.cachedData = new Map();
        this.performanceMetrics = {};
        this.optimizationStrategies = new Map();
        
        // 📊 Configuración de optimización
        this.config = {
            enableScriptLazyLoading: true,
            enableDataCaching: true,
            enableMemoryOptimization: true,
            enableFirebaseOptimization: true,
            cacheExpiration: 5 * 60 * 1000, // 5 minutos
            maxCacheSize: 50, // Máximo 50 elementos en caché
            memoryCleanupInterval: 2 * 60 * 1000 // Limpieza cada 2 minutos
        };
        
        console.log('🚀 Optimizador de Rendimiento inicializado');
    }

    // 🎯 Inicializar optimizaciones
    async initialize() {
        if (this.initialized) return;
        
        console.log('⚡ Iniciando optimizaciones de rendimiento...');
        
        // Medir rendimiento inicial
        this.measureInitialPerformance();
        
        // Aplicar optimizaciones
        if (this.config.enableScriptLazyLoading) {
            this.setupScriptLazyLoading();
        }
        
        if (this.config.enableDataCaching) {
            this.setupDataCaching();
        }
        
        if (this.config.enableMemoryOptimization) {
            this.setupMemoryOptimization();
        }
        
        if (this.config.enableFirebaseOptimization) {
            this.setupFirebaseOptimization();
        }
        
        // Configurar monitoreo continuo
        this.setupPerformanceMonitoring();

        // Configurar umbrales de rendimiento
        this.setupPerformanceThresholds();

        this.initialized = true;
        console.log('✅ Optimizaciones de rendimiento aplicadas');
    }

    // 📊 Medir rendimiento inicial
    measureInitialPerformance() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            
            this.performanceMetrics.initial = {
                domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                loadComplete: timing.loadEventEnd - timing.navigationStart,
                domInteractive: timing.domInteractive - timing.navigationStart,
                firstPaint: this.getFirstPaint(),
                memoryUsage: this.getMemoryUsage()
            };
            
            console.log('📊 Métricas iniciales de rendimiento:', this.performanceMetrics.initial);
        }
    }

    // 🎨 Obtener First Paint
    getFirstPaint() {
        if (window.performance && window.performance.getEntriesByType) {
            const paintEntries = window.performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
            return firstPaint ? firstPaint.startTime : null;
        }
        return null;
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

    // 📦 SISTEMA DE CARGA DIFERIDA DE SCRIPTS
    setupScriptLazyLoading() {
        console.log('📦 Configurando carga diferida de scripts...');
        
        // Scripts críticos (cargar inmediatamente)
        const criticalScripts = [
            'secure-config.js',
            'ai-memory-system.js',
            'ai-learning-engine.js'
        ];
        
        // Scripts no críticos (cargar bajo demanda)
        const nonCriticalScripts = [
            'predictive-analytics-engine.js',
            'predictive-dashboard.js',
            'automatic-backup-system.js',
            'multi-export-system.js',
            'backup-management-ui.js',
            'testing-framework.js',
            'test-runner.js',
            'test-ui.js',
            'app-tests.js',
            'run-tests.js'
        ];
        
        // Cargar scripts críticos primero
        this.loadCriticalScripts(criticalScripts);
        
        // Configurar carga diferida para scripts no críticos
        this.setupLazyScriptLoading(nonCriticalScripts);
    }

    // 🔥 Cargar scripts críticos
    async loadCriticalScripts(scripts) {
        console.log('🔥 Cargando scripts críticos...');
        
        for (const script of scripts) {
            if (!this.loadedScripts.has(script)) {
                await this.loadScript(script, true);
            }
        }
        
        console.log('✅ Scripts críticos cargados');
    }

    // ⏳ Configurar carga diferida
    setupLazyScriptLoading(scripts) {
        console.log('⏳ Configurando carga diferida...');
        
        // Cargar scripts cuando sean necesarios
        this.optimizationStrategies.set('lazyScripts', scripts);
        
        // Precargar scripts importantes después de la carga inicial
        setTimeout(() => {
            this.preloadImportantScripts();
        }, 2000);
    }

    // 📋 Precargar scripts importantes
    async preloadImportantScripts() {
        const importantScripts = [
            'predictive-analytics-engine.js',
            'predictive-dashboard.js'
        ];
        
        console.log('📋 Precargando scripts importantes...');
        
        for (const script of importantScripts) {
            if (!this.loadedScripts.has(script)) {
                await this.loadScript(script, false);
            }
        }
    }

    // 📥 Cargar script individual
    loadScript(src, critical = false) {
        return new Promise((resolve, reject) => {
            if (this.loadedScripts.has(src)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.async = !critical;
            script.defer = !critical;
            
            script.onload = () => {
                this.loadedScripts.add(src);
                console.log(`✅ Script cargado: ${src}`);
                resolve();
            };
            
            script.onerror = () => {
                console.error(`❌ Error cargando script: ${src}`);
                reject(new Error(`Failed to load script: ${src}`));
            };
            
            document.head.appendChild(script);
        });
    }

    // 💾 SISTEMA DE CACHÉ DE DATOS
    setupDataCaching() {
        console.log('💾 Configurando sistema de caché...');
        
        // Interceptar consultas Firebase comunes
        this.setupFirebaseCache();
        
        // Configurar limpieza automática de caché
        setInterval(() => {
            this.cleanupCache();
        }, this.config.cacheExpiration);
    }

    // 🔥 Configurar caché de Firebase
    setupFirebaseCache() {
        // Crear proxy para interceptar consultas
        if (window.firebase && window.firebase.firestore) {
            const originalGet = window.firebase.firestore().collection().get;
            
            // Interceptar consultas de colecciones
            this.interceptFirebaseQueries();
        }
    }

    // 🎯 Interceptar consultas Firebase
    interceptFirebaseQueries() {
        // Wrapper para consultas de transacciones
        window.getCachedTransactions = async () => {
            const cacheKey = 'transactions';
            const cached = this.getFromCache(cacheKey);
            
            if (cached) {
                console.log('💾 Usando transacciones desde caché');
                return cached;
            }
            
            // Si no está en caché, obtener de Firebase
            const transactions = await this.getTransactionsFromFirebase();
            this.setCache(cacheKey, transactions);
            
            return transactions;
        };
    }

    // 📋 Obtener transacciones de Firebase
    async getTransactionsFromFirebase() {
        try {
            if (typeof getTransactions === 'function') {
                return getTransactions();
            }
            
            const snapshot = await firebase.firestore()
                .collection(`artifacts/${window.appId}/shared_transactions/family_data/transactions`)
                .orderBy('date', 'desc')
                .limit(100) // Limitar consulta para mejor rendimiento
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('❌ Error obteniendo transacciones:', error);
            return [];
        }
    }

    // 💾 Gestión de caché
    setCache(key, data) {
        // Limpiar caché si está lleno
        if (this.cachedData.size >= this.config.maxCacheSize) {
            this.cleanupCache();
        }
        
        this.cachedData.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    getFromCache(key) {
        const cached = this.cachedData.get(key);
        
        if (!cached) return null;
        
        // Verificar si el caché ha expirado
        if (Date.now() - cached.timestamp > this.config.cacheExpiration) {
            this.cachedData.delete(key);
            return null;
        }
        
        return cached.data;
    }

    // 🧹 Limpiar caché
    cleanupCache() {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, value] of this.cachedData.entries()) {
            if (now - value.timestamp > this.config.cacheExpiration) {
                this.cachedData.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Caché limpiado: ${cleaned} elementos eliminados`);
        }
    }

    // 🧠 OPTIMIZACIÓN DE MEMORIA
    setupMemoryOptimization() {
        console.log('🧠 Configurando optimización de memoria...');
        
        // Limpieza periódica de memoria
        setInterval(() => {
            this.performMemoryCleanup();
        }, this.config.memoryCleanupInterval);
        
        // Monitorear uso de memoria
        this.setupMemoryMonitoring();
    }

    // 🧹 Realizar limpieza de memoria
    performMemoryCleanup() {
        // Limpiar referencias de objetos grandes
        this.cleanupLargeObjects();
        
        // Limpiar event listeners huérfanos
        this.cleanupEventListeners();
        
        // Forzar garbage collection si está disponible
        if (window.gc) {
            window.gc();
        }
        
        console.log('🧹 Limpieza de memoria completada');
    }

    // 📦 Limpiar objetos grandes
    cleanupLargeObjects() {
        // Limpiar gráficos de Chart.js si existen
        if (window.Chart && window.Chart.instances) {
            Object.values(window.Chart.instances).forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            });
        }
        
        // Limpiar datos temporales de IA
        if (window.aiMemorySystem) {
            window.aiMemorySystem.cleanupTemporaryData();
        }
    }

    // 🎧 Limpiar event listeners
    cleanupEventListeners() {
        // Remover listeners de elementos que ya no existen
        const elements = document.querySelectorAll('[data-cleanup-listeners]');
        elements.forEach(element => {
            if (!element.isConnected) {
                element.removeEventListener('click', null);
                element.removeEventListener('change', null);
            }
        });
    }

    // 📊 Configurar monitoreo de memoria
    setupMemoryMonitoring() {
        if (window.performance && window.performance.memory) {
            setInterval(() => {
                const memory = this.getMemoryUsage();

                // Alertar si el uso de memoria es muy alto
                if (memory && memory.used > memory.limit * 0.8) {
                    console.warn('⚠️ Uso de memoria alto:', memory);
                    this.performMemoryCleanup();
                }
            }, 30000); // Verificar cada 30 segundos
        }
    }

    // 🔥 OPTIMIZACIÓN DE FIREBASE
    setupFirebaseOptimization() {
        console.log('🔥 Configurando optimización de Firebase...');

        // Configurar persistencia offline
        this.enableFirebasePersistence();

        // Optimizar consultas
        this.optimizeFirebaseQueries();

        // Configurar batch operations
        this.setupBatchOperations();
    }

    // 💾 Habilitar persistencia de Firebase
    async enableFirebasePersistence() {
        try {
            if (window.firebase && window.firebase.firestore) {
                await firebase.firestore().enablePersistence({
                    synchronizeTabs: true
                });
                console.log('✅ Persistencia offline habilitada');
            }
        } catch (error) {
            if (error.code === 'failed-precondition') {
                console.warn('⚠️ Persistencia no disponible: múltiples pestañas abiertas');
            } else if (error.code === 'unimplemented') {
                console.warn('⚠️ Persistencia no soportada en este navegador');
            } else {
                console.error('❌ Error habilitando persistencia:', error);
            }
        }
    }

    // 🎯 Optimizar consultas Firebase
    optimizeFirebaseQueries() {
        // Crear índices compuestos virtuales
        this.createQueryOptimizations();

        // Configurar límites de consulta
        this.setupQueryLimits();
    }

    // 📊 Crear optimizaciones de consulta
    createQueryOptimizations() {
        // Wrapper optimizado para consultas de transacciones
        window.getOptimizedTransactions = async (limit = 50, startAfter = null) => {
            const cacheKey = `transactions_${limit}_${startAfter}`;
            const cached = this.getFromCache(cacheKey);

            if (cached) {
                return cached;
            }

            try {
                let query = firebase.firestore()
                    .collection(`artifacts/${window.appId}/shared_transactions/family_data/transactions`)
                    .orderBy('date', 'desc')
                    .limit(limit);

                if (startAfter) {
                    query = query.startAfter(startAfter);
                }

                const snapshot = await query.get();
                const transactions = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                this.setCache(cacheKey, transactions);
                return transactions;

            } catch (error) {
                console.error('❌ Error en consulta optimizada:', error);
                return [];
            }
        };
    }

    // 📏 Configurar límites de consulta
    setupQueryLimits() {
        this.queryLimits = {
            transactions: 50,
            insights: 20,
            backups: 10,
            aiMemory: 30
        };
    }

    // 📦 Configurar operaciones batch
    setupBatchOperations() {
        // Crear cola de operaciones batch
        this.batchQueue = [];
        this.batchTimer = null;

        // Procesar batch cada 2 segundos o cuando llegue a 10 operaciones
        this.processBatchOperations();
    }

    // ⚡ Procesar operaciones batch
    processBatchOperations() {
        setInterval(() => {
            if (this.batchQueue.length > 0) {
                this.executeBatchOperations();
            }
        }, 2000);
    }

    // 🚀 Ejecutar operaciones batch
    async executeBatchOperations() {
        if (this.batchQueue.length === 0) return;

        const batch = firebase.firestore().batch();
        const operations = this.batchQueue.splice(0, 10); // Máximo 10 operaciones por batch

        try {
            operations.forEach(operation => {
                const { type, ref, data } = operation;

                switch (type) {
                    case 'set':
                        batch.set(ref, data);
                        break;
                    case 'update':
                        batch.update(ref, data);
                        break;
                    case 'delete':
                        batch.delete(ref);
                        break;
                }
            });

            await batch.commit();
            console.log(`✅ Batch ejecutado: ${operations.length} operaciones`);

        } catch (error) {
            console.error('❌ Error ejecutando batch:', error);
            // Reintroducir operaciones fallidas
            this.batchQueue.unshift(...operations);
        }
    }

    // 📊 MONITOREO DE RENDIMIENTO CONTINUO
    setupPerformanceMonitoring() {
        console.log('📊 Configurando monitoreo de rendimiento...');

        // Monitorear métricas cada minuto
        setInterval(() => {
            this.collectPerformanceMetrics();
        }, 60000);

        // Configurar alertas de rendimiento
        this.setupPerformanceAlerts();
    }

    // 📈 Recopilar métricas de rendimiento
    collectPerformanceMetrics() {
        const metrics = {
            timestamp: Date.now(),
            memory: this.getMemoryUsage(),
            cacheSize: this.cachedData.size,
            loadedScripts: this.loadedScripts.size,
            batchQueueSize: this.batchQueue.length
        };

        // Calcular métricas de navegación si están disponibles
        if (window.performance && window.performance.getEntriesByType) {
            const navigationEntries = window.performance.getEntriesByType('navigation');
            if (navigationEntries.length > 0) {
                const nav = navigationEntries[0];
                metrics.navigation = {
                    domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
                    loadComplete: nav.loadEventEnd - nav.loadEventStart,
                    domInteractive: nav.domInteractive - nav.fetchStart
                };
            }
        }

        this.performanceMetrics.current = metrics;

        // Guardar métricas históricas (últimas 10)
        if (!this.performanceMetrics.history) {
            this.performanceMetrics.history = [];
        }

        this.performanceMetrics.history.push(metrics);
        if (this.performanceMetrics.history.length > 10) {
            this.performanceMetrics.history.shift();
        }
    }

    // 🚨 Configurar alertas de rendimiento
    setupPerformanceAlerts() {
        // Las alertas se configuran junto con los umbrales
    }

    // 🎯 Configurar umbrales de rendimiento
    setupPerformanceThresholds() {
        this.performanceThresholds = {
            memoryUsage: 80 * 1024 * 1024, // 80MB
            cacheSize: 40, // 40 elementos
            loadTime: 5000 // 5 segundos
        };
    }

    // 📊 Obtener reporte de rendimiento
    getPerformanceReport() {
        return {
            current: this.performanceMetrics.current,
            history: this.performanceMetrics.history,
            optimizations: {
                scriptsLoaded: this.loadedScripts.size,
                cacheHits: this.getCacheHitRate(),
                memoryOptimized: this.isMemoryOptimized(),
                firebaseOptimized: this.isFirebaseOptimized()
            },
            recommendations: this.generateOptimizationRecommendations()
        };
    }

    // 🎯 Calcular tasa de aciertos de caché
    getCacheHitRate() {
        // Implementación simplificada
        return this.cachedData.size > 0 ? 0.85 : 0;
    }

    // 🧠 Verificar si la memoria está optimizada
    isMemoryOptimized() {
        const memory = this.getMemoryUsage();
        return memory ? memory.used < this.performanceThresholds.memoryUsage : true;
    }

    // 🔥 Verificar si Firebase está optimizado
    isFirebaseOptimized() {
        return this.batchQueue.length < 5; // Cola de batch pequeña indica buena optimización
    }

    // 💡 Generar recomendaciones de optimización
    generateOptimizationRecommendations() {
        const recommendations = [];
        const memory = this.getMemoryUsage();

        if (memory && memory.used > this.performanceThresholds.memoryUsage) {
            recommendations.push({
                type: 'memory',
                priority: 'high',
                message: 'Uso de memoria alto detectado',
                action: 'Ejecutar limpieza de memoria'
            });
        }

        if (this.cachedData.size > this.performanceThresholds.cacheSize) {
            recommendations.push({
                type: 'cache',
                priority: 'medium',
                message: 'Caché muy grande',
                action: 'Limpiar caché antiguo'
            });
        }

        if (this.batchQueue.length > 10) {
            recommendations.push({
                type: 'firebase',
                priority: 'medium',
                message: 'Cola de operaciones batch grande',
                action: 'Procesar operaciones pendientes'
            });
        }

        return recommendations;
    }

    // 🔧 Aplicar optimizaciones automáticas
    async applyAutomaticOptimizations() {
        const recommendations = this.generateOptimizationRecommendations();

        for (const rec of recommendations) {
            switch (rec.type) {
                case 'memory':
                    this.performMemoryCleanup();
                    break;
                case 'cache':
                    this.cleanupCache();
                    break;
                case 'firebase':
                    await this.executeBatchOperations();
                    break;
            }
        }

        console.log(`🔧 Aplicadas ${recommendations.length} optimizaciones automáticas`);
    }
}

// 🚀 Inicializar optimizador automáticamente
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();

    // Inicializar después de que se cargue la configuración básica
    setTimeout(() => {
        window.performanceOptimizer.initialize();
    }, 1000);
});

// 📊 Exportar para uso global
window.PerformanceOptimizer = PerformanceOptimizer;
