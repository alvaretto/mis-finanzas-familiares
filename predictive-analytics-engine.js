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
        
        console.log('🔮 Motor de Análisis Predictivo inicializado');
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
        
        return insights;
    }
}

// 🌐 Exportar para uso global
window.PredictiveAnalyticsEngine = PredictiveAnalyticsEngine;
