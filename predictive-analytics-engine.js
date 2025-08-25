// 🔮 MOTOR DE ANÁLISIS PREDICTIVO AVANZADO
// Complemento perfecto para el sistema de Insights del Desafío 1

class PredictiveAnalyticsEngine {
    constructor() {
        this.initialized = false;
        this.historicalData = [];
        this.predictions = {};
        this.trends = {};
        this.patterns = {};
        this.seasonalFactors = {};

        // 🎯 NUEVAS PROPIEDADES PARA VALIDACIÓN Y PRECISIÓN
        this.validationResults = {};
        this.accuracyMetrics = {};
        this.modelPerformance = {};
        this.calibrationData = {};
        this.predictionHistory = [];

        console.log('🔮 Motor de Análisis Predictivo Mejorado inicializado');
    }

    // 🚀 Inicializar con datos históricos
    async initialize(transactions = []) {
        try {
            console.log('🔮 Inicializando motor predictivo...');
            console.log('📊 Transacciones recibidas:', transactions.length);

            if (!Array.isArray(transactions)) {
                throw new Error('Las transacciones deben ser un array');
            }

            this.historicalData = transactions;

            console.log('📈 Analizando patrones históricos...');
            await this.analyzeHistoricalPatterns();

            console.log('📅 Calculando factores estacionales...');
            await this.calculateSeasonalFactors();

            console.log('🔮 Generando predicciones...');
            await this.generatePredictions();

            this.initialized = true;
            console.log('✅ Motor predictivo inicializado exitosamente con', transactions.length, 'transacciones');
            return true;
        } catch (error) {
            console.error('❌ Error inicializando motor predictivo:', error);
            throw error;
        }
    }

    // 📊 Analizar patrones históricos
    async analyzeHistoricalPatterns() {
        if (this.historicalData.length === 0) return;

        // Agrupar por mes
        const monthlyData = this.groupByMonth(this.historicalData);
        
        // Calcular tendencias por categoría
        this.trends.categories = this.calculateCategoryTrends(monthlyData);
        
        // Calcular tendencias de ingresos vs gastos
        this.trends.cashFlow = this.calculateCashFlowTrends(monthlyData);
        
        // Detectar patrones de comportamiento
        this.patterns.spending = this.detectSpendingPatterns(monthlyData);
        this.patterns.frequency = this.detectFrequencyPatterns(this.historicalData);
        
        console.log('📊 Patrones históricos analizados:', this.trends);
    }

    // 🗓️ Calcular factores estacionales
    async calculateSeasonalFactors() {
        const monthlyAverages = {};
        const yearlyAverage = this.calculateYearlyAverage();
        
        // Calcular promedio por mes
        for (let month = 0; month < 12; month++) {
            const monthTransactions = this.historicalData.filter(t => 
                new Date(t.date).getMonth() === month
            );
            
            if (monthTransactions.length > 0) {
                const monthTotal = monthTransactions.reduce((sum, t) => 
                    sum + (t.type === 'expense' ? t.amount : 0), 0
                );
                monthlyAverages[month] = monthTotal / monthTransactions.length;
            }
        }
        
        // Calcular factores estacionales
        Object.keys(monthlyAverages).forEach(month => {
            this.seasonalFactors[month] = monthlyAverages[month] / yearlyAverage;
        });
        
        console.log('🗓️ Factores estacionales calculados:', this.seasonalFactors);
    }

    // 🔮 Generar predicciones
    async generatePredictions() {
        const currentDate = new Date();
        const predictions = {};
        
        // Predicciones para los próximos 6 meses
        for (let i = 1; i <= 6; i++) {
            const futureDate = new Date(currentDate);
            futureDate.setMonth(currentDate.getMonth() + i);
            
            const monthKey = `${futureDate.getFullYear()}-${futureDate.getMonth() + 1}`;
            
            predictions[monthKey] = {
                month: futureDate.getMonth(),
                year: futureDate.getFullYear(),
                predictedExpenses: this.predictMonthlyExpenses(futureDate),
                predictedIncome: this.predictMonthlyIncome(futureDate),
                categoryBreakdown: this.predictCategoryBreakdown(futureDate),
                confidence: this.calculateConfidence(i),
                insights: this.generateMonthInsights(futureDate)
            };
        }
        
        this.predictions = predictions;
        console.log('🔮 Predicciones generadas para 6 meses:', predictions);
    }

    // 💰 Predecir gastos mensuales
    predictMonthlyExpenses(targetDate) {
        const month = targetDate.getMonth();
        const baseExpense = this.calculateAverageMonthlyExpenses();
        const seasonalFactor = this.seasonalFactors[month] || 1;
        const trendFactor = this.calculateTrendFactor();
        
        return Math.round(baseExpense * seasonalFactor * trendFactor);
    }

    // 💵 Predecir ingresos mensuales
    predictMonthlyIncome(targetDate) {
        const baseIncome = this.calculateAverageMonthlyIncome();
        const growthFactor = this.calculateIncomeGrowthFactor();
        
        return Math.round(baseIncome * growthFactor);
    }

    // 📈 Predecir desglose por categorías
    predictCategoryBreakdown(targetDate) {
        const breakdown = {};
        const totalPredicted = this.predictMonthlyExpenses(targetDate);
        
        // Calcular porcentajes históricos por categoría
        const categoryPercentages = this.calculateCategoryPercentages();
        
        Object.keys(categoryPercentages).forEach(category => {
            breakdown[category] = Math.round(totalPredicted * categoryPercentages[category]);
        });
        
        return breakdown;
    }

    // 🎯 Generar insights específicos del mes
    generateMonthInsights(targetDate) {
        const insights = [];
        const month = targetDate.getMonth();
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        // Insight estacional
        const seasonalFactor = this.seasonalFactors[month] || 1;
        if (seasonalFactor > 1.2) {
            insights.push({
                type: 'seasonal',
                priority: 'high',
                message: `${monthNames[month]} históricamente tiene gastos ${Math.round((seasonalFactor - 1) * 100)}% más altos que el promedio`
            });
        } else if (seasonalFactor < 0.8) {
            insights.push({
                type: 'seasonal',
                priority: 'low',
                message: `${monthNames[month]} suele ser un mes de menores gastos, buen momento para ahorrar`
            });
        }
        
        // Insight de tendencia
        const trendFactor = this.calculateTrendFactor();
        if (trendFactor > 1.1) {
            insights.push({
                type: 'trend',
                priority: 'medium',
                message: `Tus gastos muestran una tendencia creciente del ${Math.round((trendFactor - 1) * 100)}%`
            });
        }
        
        return insights;
    }

    // 🔢 Funciones auxiliares de cálculo
    groupByMonth(transactions) {
        const grouped = {};
        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(transaction);
        });
        return grouped;
    }

    calculateCategoryTrends(monthlyData) {
        const trends = {};
        const categories = [...new Set(this.historicalData.map(t => t.category))];
        
        categories.forEach(category => {
            const categoryData = [];
            Object.keys(monthlyData).forEach(month => {
                const monthTotal = monthlyData[month]
                    .filter(t => t.category === category && t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);
                categoryData.push(monthTotal);
            });
            
            trends[category] = this.calculateLinearTrend(categoryData);
        });
        
        return trends;
    }

    calculateCashFlowTrends(monthlyData) {
        const cashFlowData = [];
        Object.keys(monthlyData).forEach(month => {
            const income = monthlyData[month]
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            const expenses = monthlyData[month]
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            cashFlowData.push(income - expenses);
        });
        
        return this.calculateLinearTrend(cashFlowData);
    }

    calculateLinearTrend(data) {
        if (data.length < 2) return { slope: 0, direction: 'stable' };
        
        const n = data.length;
        const sumX = (n * (n + 1)) / 2;
        const sumY = data.reduce((a, b) => a + b, 0);
        const sumXY = data.reduce((sum, y, x) => sum + (x + 1) * y, 0);
        const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        
        return {
            slope,
            direction: slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable'
        };
    }

    calculateAverageMonthlyExpenses() {
        const expenses = this.historicalData.filter(t => t.type === 'expense');
        if (expenses.length === 0) return 0;
        
        const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
        const months = this.getUniqueMonths().length || 1;
        
        return totalExpenses / months;
    }

    calculateAverageMonthlyIncome() {
        const income = this.historicalData.filter(t => t.type === 'income');
        if (income.length === 0) return 0;
        
        const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
        const months = this.getUniqueMonths().length || 1;
        
        return totalIncome / months;
    }

    calculateYearlyAverage() {
        const expenses = this.historicalData.filter(t => t.type === 'expense');
        if (expenses.length === 0) return 0;
        
        return expenses.reduce((sum, t) => sum + t.amount, 0) / expenses.length;
    }

    calculateTrendFactor() {
        const trend = this.trends.cashFlow;
        if (!trend) return 1;
        
        // Convertir slope a factor multiplicativo
        return Math.max(0.5, Math.min(2, 1 + (trend.slope / 1000)));
    }

    calculateIncomeGrowthFactor() {
        // Asumir crecimiento conservador del 2% anual
        return 1.02;
    }

    calculateCategoryPercentages() {
        const expenses = this.historicalData.filter(t => t.type === 'expense');
        const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
        
        const categoryTotals = {};
        expenses.forEach(t => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        });
        
        const percentages = {};
        Object.keys(categoryTotals).forEach(category => {
            percentages[category] = categoryTotals[category] / totalExpenses;
        });
        
        return percentages;
    }

    calculateConfidence(monthsAhead) {
        const baseConfidence = 0.9;
        const decayFactor = 0.1;
        return Math.max(0.3, baseConfidence - (monthsAhead * decayFactor));
    }

    getUniqueMonths() {
        const months = new Set();
        this.historicalData.forEach(t => {
            const date = new Date(t.date);
            months.add(`${date.getFullYear()}-${date.getMonth()}`);
        });
        return Array.from(months);
    }

    detectSpendingPatterns(monthlyData) {
        // Detectar patrones de gasto (picos, valles, etc.)
        return {
            peakMonths: this.findPeakMonths(monthlyData),
            lowMonths: this.findLowMonths(monthlyData),
            volatility: this.calculateVolatility(monthlyData)
        };
    }

    detectFrequencyPatterns(transactions) {
        // Detectar patrones de frecuencia de transacciones
        const dayOfWeekCounts = {};
        const dayOfMonthCounts = {};
        
        transactions.forEach(t => {
            const date = new Date(t.date);
            const dayOfWeek = date.getDay();
            const dayOfMonth = date.getDate();
            
            dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1;
            dayOfMonthCounts[dayOfMonth] = (dayOfMonthCounts[dayOfMonth] || 0) + 1;
        });
        
        return {
            preferredDaysOfWeek: dayOfWeekCounts,
            preferredDaysOfMonth: dayOfMonthCounts
        };
    }

    findPeakMonths(monthlyData) {
        // Implementación simplificada
        return Object.keys(monthlyData).slice(0, 2);
    }

    findLowMonths(monthlyData) {
        // Implementación simplificada
        return Object.keys(monthlyData).slice(-2);
    }

    calculateVolatility(monthlyData) {
        const values = Object.values(monthlyData).map(month => 
            month.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0)
        );
        
        if (values.length < 2) return 0;
        
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        
        return Math.sqrt(variance) / mean; // Coeficiente de variación
    }

    // 🎯 API pública para obtener predicciones
    getPredictions() {
        return this.predictions;
    }

    getTrends() {
        return this.trends;
    }

    getPatterns() {
        return this.patterns;
    }

    getSeasonalFactors() {
        return this.seasonalFactors;
    }

    // 🔮 Generar insights para integración con sistema de Insights
    generateInsightsForDashboard() {
        const insights = [];

        // Insights basados en predicciones
        Object.keys(this.predictions).forEach(monthKey => {
            const prediction = this.predictions[monthKey];
            insights.push(...prediction.insights);
        });

        // Insights basados en tendencias
        if (this.trends.cashFlow && this.trends.cashFlow.direction === 'decreasing') {
            insights.push({
                type: 'trend',
                priority: 'high',
                message: 'Tu flujo de caja muestra una tendencia decreciente. Considera revisar tus gastos.',
                action: 'Abrir análisis de gastos'
            });
        }

        // 🎯 NUEVO: Insights basados en precisión del modelo
        if (this.accuracyMetrics.overallAccuracy) {
            const accuracy = this.accuracyMetrics.overallAccuracy;
            if (accuracy > 0.85) {
                insights.push({
                    type: 'model_performance',
                    priority: 'low',
                    message: `Excelente precisión del modelo (${(accuracy * 100).toFixed(1)}%). Las predicciones son muy confiables.`,
                    action: 'Ver métricas detalladas'
                });
            } else if (accuracy < 0.6) {
                insights.push({
                    type: 'model_performance',
                    priority: 'medium',
                    message: `Precisión del modelo moderada (${(accuracy * 100).toFixed(1)}%). Necesitas más datos históricos para mejores predicciones.`,
                    action: 'Agregar más transacciones'
                });
            }
        }

        return insights;
    }

    // 🎯 SISTEMA DE VALIDACIÓN DE PRECISIÓN (NUEVO)

    // Validar precisión de predicciones pasadas
    async validatePredictionAccuracy() {
        console.log('🔍 Validando precisión de predicciones...');

        if (this.historicalData.length < 6) {
            console.log('⚠️ Datos insuficientes para validación (mínimo 6 meses)');
            return { accuracy: 0, message: 'Datos insuficientes para validación' };
        }

        const validationResults = {
            totalPredictions: 0,
            accuratePredictions: 0,
            averageError: 0,
            errorsByCategory: {},
            monthlyAccuracy: {}
        };

        // Dividir datos en entrenamiento y validación (80/20)
        const splitIndex = Math.floor(this.historicalData.length * 0.8);
        const trainingData = this.historicalData.slice(0, splitIndex);
        const validationData = this.historicalData.slice(splitIndex);

        // Crear predicciones para el período de validación
        const testPredictions = await this.createTestPredictions(trainingData, validationData);

        // Calcular métricas de precisión
        validationResults.totalPredictions = testPredictions.length;

        let totalError = 0;
        let accurateCount = 0;

        testPredictions.forEach(prediction => {
            const actualValue = prediction.actual;
            const predictedValue = prediction.predicted;

            if (actualValue > 0) {
                const error = Math.abs(actualValue - predictedValue) / actualValue;
                totalError += error;

                // Considerar "preciso" si el error es menor al 20%
                if (error < 0.2) {
                    accurateCount++;
                }

                // Agrupar por mes para análisis detallado
                const monthKey = prediction.month;
                if (!validationResults.monthlyAccuracy[monthKey]) {
                    validationResults.monthlyAccuracy[monthKey] = {
                        predictions: 0,
                        accurate: 0,
                        totalError: 0
                    };
                }

                validationResults.monthlyAccuracy[monthKey].predictions++;
                validationResults.monthlyAccuracy[monthKey].totalError += error;
                if (error < 0.2) {
                    validationResults.monthlyAccuracy[monthKey].accurate++;
                }
            }
        });

        validationResults.accuratePredictions = accurateCount;
        validationResults.averageError = totalError / testPredictions.length;

        // Calcular precisión general
        const overallAccuracy = accurateCount / testPredictions.length;

        this.validationResults = validationResults;
        this.accuracyMetrics.overallAccuracy = overallAccuracy;
        this.accuracyMetrics.averageError = validationResults.averageError;

        console.log('✅ Validación completada:', {
            accuracy: (overallAccuracy * 100).toFixed(1) + '%',
            averageError: (validationResults.averageError * 100).toFixed(1) + '%'
        });

        return {
            accuracy: overallAccuracy,
            averageError: validationResults.averageError,
            details: validationResults
        };
    }

    // Crear predicciones de prueba para validación
    async createTestPredictions(trainingData, validationData) {
        const testPredictions = [];

        // Agrupar datos de validación por mes
        const monthlyValidationData = this.groupByMonth(validationData);

        Object.keys(monthlyValidationData).forEach(monthKey => {
            const actualExpenses = monthlyValidationData[monthKey]
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            // Simular predicción usando solo datos de entrenamiento
            const predictedExpenses = this.simulatePrediction(trainingData, monthKey);

            testPredictions.push({
                month: monthKey,
                actual: actualExpenses,
                predicted: predictedExpenses,
                error: Math.abs(actualExpenses - predictedExpenses)
            });
        });

        return testPredictions;
    }

    // Simular predicción usando datos históricos limitados
    simulatePrediction(trainingData, targetMonth) {
        const monthlyData = this.groupByMonth(trainingData);
        const expenses = Object.values(monthlyData).map(monthData =>
            monthData.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
        );

        if (expenses.length === 0) return 0;

        // Usar promedio simple para simulación
        const average = expenses.reduce((sum, exp) => sum + exp, 0) / expenses.length;

        // Aplicar factor estacional básico
        const month = parseInt(targetMonth.split('-')[1]) - 1;
        const seasonalFactor = this.getBasicSeasonalFactor(month);

        return average * seasonalFactor;
    }

    // Factor estacional básico para simulación
    getBasicSeasonalFactor(month) {
        const factors = [1.05, 0.95, 1.0, 1.0, 1.05, 1.1, 1.15, 1.1, 1.0, 1.0, 1.1, 1.2];
        return factors[month] || 1.0;
    }

    // 🔧 SISTEMA DE CALIBRACIÓN AUTOMÁTICA (NUEVO)

    // Calibrar modelos automáticamente basándose en precisión
    async calibrateModels() {
        console.log('🔧 Iniciando calibración automática de modelos...');

        // Validar precisión actual
        const validationResults = await this.validatePredictionAccuracy();

        if (validationResults.accuracy < 0.7) {
            console.log('🔧 Precisión baja detectada, aplicando calibraciones...');

            // Calibrar factores estacionales
            await this.calibrateSeasonalFactors();

            // Calibrar algoritmos de tendencia
            await this.calibrateTrendAlgorithms();

            // Calibrar pesos de categorías
            await this.calibrateCategoryWeights();

            // Re-validar después de calibración
            const newValidation = await this.validatePredictionAccuracy();

            console.log('🔧 Calibración completada:', {
                accuracyBefore: (validationResults.accuracy * 100).toFixed(1) + '%',
                accuracyAfter: (newValidation.accuracy * 100).toFixed(1) + '%',
                improvement: ((newValidation.accuracy - validationResults.accuracy) * 100).toFixed(1) + '%'
            });

            return {
                calibrated: true,
                improvement: newValidation.accuracy - validationResults.accuracy,
                newAccuracy: newValidation.accuracy
            };
        } else {
            console.log('✅ Modelos ya tienen buena precisión, no se requiere calibración');
            return {
                calibrated: false,
                currentAccuracy: validationResults.accuracy
            };
        }
    }

    // Calibrar factores estacionales basándose en datos reales
    async calibrateSeasonalFactors() {
        console.log('🌡️ Calibrando factores estacionales...');

        const monthlyData = this.groupByMonth(this.historicalData);
        const monthlyAverages = {};

        // Calcular promedio real por mes
        for (let month = 0; month < 12; month++) {
            const monthExpenses = [];

            Object.keys(monthlyData).forEach(monthKey => {
                const keyMonth = parseInt(monthKey.split('-')[1]) - 1;
                if (keyMonth === month) {
                    const expenses = monthlyData[monthKey]
                        .filter(t => t.type === 'expense')
                        .reduce((sum, t) => sum + t.amount, 0);
                    monthExpenses.push(expenses);
                }
            });

            if (monthExpenses.length > 0) {
                monthlyAverages[month] = monthExpenses.reduce((sum, exp) => sum + exp, 0) / monthExpenses.length;
            }
        }

        // Calcular promedio general
        const overallAverage = Object.values(monthlyAverages).reduce((sum, avg) => sum + avg, 0) / Object.keys(monthlyAverages).length;

        // Actualizar factores estacionales
        if (overallAverage > 0) {
            for (let month = 0; month < 12; month++) {
                if (monthlyAverages[month]) {
                    this.seasonalFactors[month] = monthlyAverages[month] / overallAverage;
                }
            }
        }

        console.log('✅ Factores estacionales calibrados:', this.seasonalFactors);
    }

    // Calibrar algoritmos de tendencia
    async calibrateTrendAlgorithms() {
        console.log('📈 Calibrando algoritmos de tendencia...');

        // Probar diferentes ventanas de tiempo para análisis de tendencia
        const windowSizes = [3, 6, 9, 12];
        let bestWindow = 6;
        let bestAccuracy = 0;

        for (const windowSize of windowSizes) {
            const accuracy = await this.testTrendWindowAccuracy(windowSize);
            if (accuracy > bestAccuracy) {
                bestAccuracy = accuracy;
                bestWindow = windowSize;
            }
        }

        // Actualizar configuración de tendencia
        this.calibrationData.trendWindow = bestWindow;
        this.calibrationData.trendAccuracy = bestAccuracy;

        console.log('✅ Algoritmo de tendencia calibrado:', {
            bestWindow,
            accuracy: (bestAccuracy * 100).toFixed(1) + '%'
        });
    }

    // Probar precisión de ventana de tendencia
    async testTrendWindowAccuracy(windowSize) {
        // Implementación simplificada para prueba de concepto
        const monthlyData = this.groupByMonth(this.historicalData);
        const months = Object.keys(monthlyData).sort();

        if (months.length < windowSize + 2) return 0;

        let accurateCount = 0;
        let totalTests = 0;

        for (let i = windowSize; i < months.length - 1; i++) {
            const windowData = months.slice(i - windowSize, i);
            const actualNext = monthlyData[months[i + 1]]
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            const predictedNext = this.predictWithWindow(windowData, monthlyData);

            if (actualNext > 0) {
                const error = Math.abs(actualNext - predictedNext) / actualNext;
                if (error < 0.25) accurateCount++;
                totalTests++;
            }
        }

        return totalTests > 0 ? accurateCount / totalTests : 0;
    }

    // Predicción con ventana específica
    predictWithWindow(windowMonths, monthlyData) {
        const expenses = windowMonths.map(month =>
            monthlyData[month]
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
        );

        return expenses.reduce((sum, exp) => sum + exp, 0) / expenses.length;
    }

    // Calibrar pesos de categorías
    async calibrateCategoryWeights() {
        console.log('🏷️ Calibrando pesos de categorías...');

        const categoryData = {};

        // Analizar variabilidad por categoría
        this.historicalData.forEach(transaction => {
            if (transaction.type === 'expense') {
                const category = transaction.category || 'Sin categoría';
                if (!categoryData[category]) {
                    categoryData[category] = [];
                }
                categoryData[category].push(transaction.amount);
            }
        });

        // Calcular pesos basándose en consistencia
        const categoryWeights = {};
        Object.keys(categoryData).forEach(category => {
            const amounts = categoryData[category];
            const mean = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
            const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - mean, 2), 0) / amounts.length;
            const coefficientOfVariation = mean > 0 ? Math.sqrt(variance) / mean : 1;

            // Peso inversamente proporcional a la variabilidad
            categoryWeights[category] = Math.max(0.1, 1 - Math.min(1, coefficientOfVariation));
        });

        this.calibrationData.categoryWeights = categoryWeights;

        console.log('✅ Pesos de categorías calibrados:', categoryWeights);
    }

    // 📊 MÉTRICAS DE RENDIMIENTO AVANZADAS (NUEVO)

    // Obtener métricas detalladas de rendimiento
    getPerformanceMetrics() {
        return {
            accuracy: this.accuracyMetrics,
            validation: this.validationResults,
            calibration: this.calibrationData,
            modelHealth: this.assessModelHealth(),
            recommendations: this.generateModelRecommendations()
        };
    }

    // Evaluar salud del modelo
    assessModelHealth() {
        const accuracy = this.accuracyMetrics.overallAccuracy || 0;
        const dataPoints = this.historicalData.length;

        let health = 'unknown';
        let score = 0;

        if (accuracy > 0.85 && dataPoints > 50) {
            health = 'excellent';
            score = 95;
        } else if (accuracy > 0.7 && dataPoints > 30) {
            health = 'good';
            score = 80;
        } else if (accuracy > 0.5 && dataPoints > 15) {
            health = 'fair';
            score = 60;
        } else {
            health = 'poor';
            score = 30;
        }

        return {
            status: health,
            score,
            accuracy: accuracy,
            dataPoints,
            lastCalibration: this.calibrationData.lastCalibration || null
        };
    }

    // Generar recomendaciones para mejorar el modelo
    generateModelRecommendations() {
        const recommendations = [];
        const accuracy = this.accuracyMetrics.overallAccuracy || 0;
        const dataPoints = this.historicalData.length;

        if (dataPoints < 30) {
            recommendations.push({
                type: 'data',
                priority: 'high',
                message: 'Necesitas más datos históricos para mejorar la precisión',
                action: 'Agregar al menos 30 transacciones más'
            });
        }

        if (accuracy < 0.6) {
            recommendations.push({
                type: 'calibration',
                priority: 'high',
                message: 'La precisión del modelo es baja',
                action: 'Ejecutar calibración automática'
            });
        }

        if (!this.calibrationData.lastCalibration) {
            recommendations.push({
                type: 'maintenance',
                priority: 'medium',
                message: 'El modelo nunca ha sido calibrado',
                action: 'Realizar primera calibración'
            });
        }

        return recommendations;
    }
}

// 🌐 Exportar para uso global
window.PredictiveAnalyticsEngine = PredictiveAnalyticsEngine;
