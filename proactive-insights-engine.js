// 🎯 MOTOR DE INSIGHTS PROACTIVOS
// Sistema complementario para generar insights automáticos y proactivos

class ProactiveInsightsEngine {
    constructor(memorySystem = null, learningEngine = null) {
        this.memorySystem = memorySystem;
        this.learningEngine = learningEngine;
        this.insights = [];
        this.rules = new Map();
        this.initialized = false;
        
        // Configurar reglas por defecto
        this.setupDefaultRules();
        
        console.log('🎯 Motor de Insights Proactivos inicializado');
    }

    // 🚀 Inicializar motor
    async initialize(userId = null) {
        try {
            this.userId = userId;
            await this.loadInsights();
            this.initialized = true;
            console.log('✅ Motor de Insights Proactivos listo');
        } catch (error) {
            console.error('❌ Error inicializando motor de insights:', error);
        }
    }

    // ⚙️ CONFIGURAR REGLAS INTELIGENTES MEJORADAS
    setupDefaultRules() {
        // 🚨 REGLA MEJORADA: Gastos excesivos con análisis inteligente
        this.rules.set('excessive_spending', {
            condition: (data) => {
                const monthlyExpenses = this.calculateMonthlyExpenses(data.transactions);
                const budget = data.budget || 0;
                const historicalAvg = this.calculateHistoricalAverage(data.transactions);

                // Múltiples condiciones para mayor precisión
                return (budget > 0 && monthlyExpenses > budget * 1.1) ||
                       (historicalAvg > 0 && monthlyExpenses > historicalAvg * 1.3);
            },
            insight: (data) => {
                const monthlyExpenses = this.calculateMonthlyExpenses(data.transactions);
                const budget = data.budget || 0;
                const excess = monthlyExpenses - budget;
                const percentage = budget > 0 ? ((excess / budget) * 100).toFixed(1) : 0;

                return {
                    type: 'warning',
                    priority: 'high',
                    title: '🚨 Alerta de Gastos Elevados',
                    message: `Tus gastos este mes (${this.formatCurrency(monthlyExpenses)}) superan tu presupuesto en ${percentage}%. Esto representa ${this.formatCurrency(excess)} adicionales.`,
                    actions: [
                        'Revisar gastos por categoría',
                        'Identificar gastos innecesarios',
                        'Ajustar presupuesto si es necesario',
                        'Establecer alertas automáticas'
                    ],
                    category: 'budget',
                    urgency: excess > budget * 0.2 ? 'critical' : 'high'
                };
            }
        });

        // Regla: Oportunidad de ahorro
        this.rules.set('saving_opportunity', {
            condition: (data) => {
                const income = this.calculateMonthlyIncome(data.transactions);
                const expenses = this.calculateMonthlyExpenses(data.transactions);
                const savingRate = income > 0 ? (income - expenses) / income : 0;
                return savingRate > 0.2; // Más del 20% de ahorro
            },
            insight: (data) => ({
                type: 'opportunity',
                priority: 'medium',
                title: '💰 Excelente capacidad de ahorro',
                message: 'Tienes un buen margen de ahorro. Considera invertir o crear un fondo de emergencia.',
                actions: ['Explorar inversiones', 'Crear fondo de emergencia', 'Establecer metas de ahorro'],
                category: 'savings'
            })
        });

        // Regla: Patrón de gastos inusual
        this.rules.set('unusual_spending', {
            condition: (data) => {
                const recentExpenses = this.getRecentExpenses(data.transactions, 7);
                const avgExpenses = this.getAverageExpenses(data.transactions, 30);
                return recentExpenses > avgExpenses * 1.5;
            },
            insight: (data) => ({
                type: 'alert',
                priority: 'medium',
                title: '📊 Patrón de gastos inusual',
                message: 'Tus gastos recientes son significativamente más altos que tu promedio.',
                actions: ['Revisar transacciones recientes', 'Identificar gastos extraordinarios'],
                category: 'spending'
            })
        });

        // Regla: Categoría dominante
        this.rules.set('dominant_category', {
            condition: (data) => {
                const categoryExpenses = this.getCategoryExpenses(data.transactions);
                const totalExpenses = Object.values(categoryExpenses).reduce((sum, amount) => sum + amount, 0);
                const maxCategory = Object.entries(categoryExpenses).reduce((max, [cat, amount]) => 
                    amount > max.amount ? { category: cat, amount } : max, { category: '', amount: 0 });
                return maxCategory.amount > totalExpenses * 0.4; // Más del 40% en una categoría
            },
            insight: (data) => {
                const categoryExpenses = this.getCategoryExpenses(data.transactions);
                const maxCategory = Object.entries(categoryExpenses).reduce((max, [cat, amount]) => 
                    amount > max.amount ? { category: cat, amount } : max, { category: '', amount: 0 });
                return {
                    type: 'info',
                    priority: 'low',
                    title: '📈 Categoría dominante detectada',
                    message: `La mayoría de tus gastos (${((maxCategory.amount / Object.values(categoryExpenses).reduce((sum, amount) => sum + amount, 0)) * 100).toFixed(1)}%) están en: ${maxCategory.category}`,
                    actions: ['Analizar gastos de esta categoría', 'Considerar diversificar gastos'],
                    category: 'analysis'
                };
            }
        });

        // 📊 NUEVA REGLA: Patrón de gasto irregular mejorado
        this.rules.set('irregular_spending_pattern', {
            condition: (data) => {
                const expenses = this.getLastMonthsExpenses(data.transactions, 3);
                if (expenses.length < 3) return false;

                const avg = expenses.reduce((sum, exp) => sum + exp, 0) / expenses.length;
                const variance = expenses.reduce((sum, exp) => sum + Math.pow(exp - avg, 2), 0) / expenses.length;
                const stdDev = Math.sqrt(variance);
                const coefficientOfVariation = avg > 0 ? stdDev / avg : 0;

                return coefficientOfVariation > 0.3; // Variabilidad alta
            },
            insight: (data) => ({
                type: 'info',
                priority: 'medium',
                title: '📊 Patrón de Gastos Irregular Detectado',
                message: 'Tus gastos varían significativamente mes a mes. Esto puede dificultar la planificación financiera.',
                actions: [
                    'Revisar gastos variables',
                    'Crear presupuesto más flexible',
                    'Identificar gastos estacionales',
                    'Establecer fondo para gastos variables'
                ],
                category: 'planning'
            })
        });

        // 🎯 NUEVA REGLA: Meta de ahorro alcanzable
        this.rules.set('achievable_savings_goal', {
            condition: (data) => {
                const monthlyExpenses = this.calculateMonthlyExpenses(data.transactions);
                const income = this.calculateMonthlyIncome(data.transactions);
                const savingsRate = income > 0 ? (income - monthlyExpenses) / income : 0;

                return savingsRate > 0.1 && savingsRate < 0.2; // Entre 10% y 20%
            },
            insight: (data) => {
                const monthlyExpenses = this.calculateMonthlyExpenses(data.transactions);
                const income = this.calculateMonthlyIncome(data.transactions);
                const currentSavings = income - monthlyExpenses;
                const savingsRate = income > 0 ? (currentSavings / income * 100).toFixed(1) : 0;

                return {
                    type: 'success',
                    priority: 'low',
                    title: '🎯 Meta de Ahorro Alcanzable',
                    message: `Estás ahorrando ${savingsRate}% de tus ingresos (${this.formatCurrency(currentSavings)}). ¡Podrías aumentar gradualmente hasta 20%!`,
                    actions: [
                        'Aumentar ahorro en $50,000 mensual',
                        'Automatizar transferencias a ahorros',
                        'Revisar gastos no esenciales',
                        'Establecer meta de ahorro específica'
                    ],
                    category: 'goals'
                };
            }
        });

        // ⚡ NUEVA REGLA: Gastos impulsivos detectados
        this.rules.set('impulse_spending_detection', {
            condition: (data) => {
                const recentTransactions = this.getRecentTransactions(data.transactions, 7); // Última semana
                const smallFrequentExpenses = recentTransactions.filter(t =>
                    t.amount < 50000 && t.type === 'expense'
                ).length;

                return smallFrequentExpenses > 10; // Más de 10 gastos pequeños en una semana
            },
            insight: (data) => ({
                type: 'warning',
                priority: 'medium',
                title: '⚡ Posibles Gastos Impulsivos Detectados',
                message: 'Has realizado muchos gastos pequeños recientemente. Esto podría indicar compras impulsivas.',
                actions: [
                    'Revisar gastos pequeños de la última semana',
                    'Implementar regla de espera 24h para compras',
                    'Usar lista de compras',
                    'Establecer límite diario de gastos menores'
                ],
                category: 'behavior'
            })
        });

        console.log('✅ Reglas inteligentes mejoradas configuradas');
    }

    // 🔍 Generar insights basados en datos actuales
    async generateInsights(data = null) {
        if (!data) {
            data = await this.gatherData();
        }

        const newInsights = [];

        // Evaluar cada regla
        for (const [ruleId, rule] of this.rules) {
            try {
                if (rule.condition(data)) {
                    const insight = typeof rule.insight === 'function' ? rule.insight(data) : rule.insight;
                    newInsights.push({
                        id: this.generateInsightId(),
                        ruleId,
                        timestamp: new Date().toISOString(),
                        ...insight
                    });
                }
            } catch (error) {
                console.warn(`⚠️ Error evaluando regla ${ruleId}:`, error);
            }
        }

        // Agregar insights únicos
        newInsights.forEach(insight => {
            if (!this.insights.some(existing => existing.ruleId === insight.ruleId)) {
                this.insights.push(insight);
            }
        });

        // Mantener solo los últimos 20 insights
        if (this.insights.length > 20) {
            this.insights = this.insights.slice(-20);
        }

        await this.saveInsights();
        return newInsights;
    }

    // 📊 Recopilar datos para análisis
    async gatherData() {
        const data = {
            transactions: window.transactions || [],
            budget: window.monthlyBudget || 0,
            timestamp: new Date().toISOString()
        };

        // Agregar datos del sistema de memoria si está disponible
        if (this.memorySystem && this.memorySystem.initialized) {
            data.userProfile = this.memorySystem.userProfile;
            data.conversationHistory = this.memorySystem.conversationHistory;
        }

        return data;
    }

    // 💰 Calcular gastos mensuales
    calculateMonthlyExpenses(transactions) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                return t.type === 'expense' && 
                       transactionDate.getMonth() === currentMonth && 
                       transactionDate.getFullYear() === currentYear;
            })
            .reduce((sum, t) => sum + (t.amount || 0), 0);
    }

    // 💵 Calcular ingresos mensuales
    calculateMonthlyIncome(transactions) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                return t.type === 'income' && 
                       transactionDate.getMonth() === currentMonth && 
                       transactionDate.getFullYear() === currentYear;
            })
            .reduce((sum, t) => sum + (t.amount || 0), 0);
    }

    // 📅 Obtener gastos recientes
    getRecentExpenses(transactions, days = 7) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return transactions
            .filter(t => t.type === 'expense' && new Date(t.date) >= cutoffDate)
            .reduce((sum, t) => sum + (t.amount || 0), 0);
    }

    // 📊 Obtener promedio de gastos
    getAverageExpenses(transactions, days = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const expenses = transactions
            .filter(t => t.type === 'expense' && new Date(t.date) >= cutoffDate)
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        return expenses / days;
    }

    // 🏷️ Obtener gastos por categoría
    getCategoryExpenses(transactions) {
        const categoryExpenses = {};
        
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const category = t.category || 'Sin categoría';
                categoryExpenses[category] = (categoryExpenses[category] || 0) + (t.amount || 0);
            });

        return categoryExpenses;
    }

    // 🆔 Generar ID único para insight
    generateInsightId() {
        return 'insight-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // 💾 Guardar insights
    async saveInsights() {
        if (!this.userId) return;

        try {
            await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory_data/${this.userId}`)
                .set({
                    proactive_insights: {
                        insights: this.insights,
                        lastGenerated: new Date().toISOString()
                    }
                }, { merge: true });
        } catch (error) {
            console.error('❌ Error guardando insights:', error);
        }
    }

    // 📚 Cargar insights
    async loadInsights() {
        if (!this.userId) return;

        try {
            const doc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory_data/${this.userId}`)
                .get();

            if (doc.exists) {
                const data = doc.data();
                this.insights = data.proactive_insights?.insights || [];
            }
        } catch (error) {
            console.error('❌ Error cargando insights:', error);
        }
    }

    // 📋 Obtener insights activos
    getActiveInsights() {
        return this.insights.filter(insight => {
            // Filtrar insights muy antiguos (más de 7 días)
            const insightDate = new Date(insight.timestamp);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return insightDate > weekAgo;
        });
    }

    // 🗑️ Limpiar insights antiguos
    cleanupOldInsights() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        this.insights = this.insights.filter(insight => {
            const insightDate = new Date(insight.timestamp);
            return insightDate > weekAgo;
        });
    }

    // 📊 NUEVAS FUNCIONES AUXILIARES PARA REGLAS MEJORADAS

    // Obtener gastos de los últimos N meses
    getLastMonthsExpenses(transactions, months) {
        const now = new Date();
        const monthsAgo = new Date(now.getFullYear(), now.getMonth() - months, 1);

        const monthlyExpenses = {};

        transactions.filter(t => t.type === 'expense' && new Date(t.date) >= monthsAgo)
            .forEach(t => {
                const monthKey = new Date(t.date).toISOString().substring(0, 7); // YYYY-MM
                monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + t.amount;
            });

        return Object.values(monthlyExpenses);
    }

    // Obtener transacciones recientes (últimos N días)
    getRecentTransactions(transactions, days) {
        const now = new Date();
        const daysAgo = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

        return transactions.filter(t => new Date(t.date) >= daysAgo);
    }

    // Calcular gastos del mes anterior
    getLastMonthExpenses(transactions) {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return transactions
            .filter(t => t.type === 'expense' &&
                    new Date(t.date) >= lastMonth &&
                    new Date(t.date) < thisMonth)
            .reduce((sum, t) => sum + t.amount, 0);
    }

    // Calcular promedio histórico de gastos
    calculateHistoricalAverage(transactions) {
        const monthlyExpenses = this.getLastMonthsExpenses(transactions, 6);
        return monthlyExpenses.length > 0 ?
            monthlyExpenses.reduce((sum, exp) => sum + exp, 0) / monthlyExpenses.length : 0;
    }

    // Calcular ingresos mensuales
    calculateMonthlyIncome(transactions) {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return transactions
            .filter(t => t.type === 'income' && new Date(t.date) >= thisMonth)
            .reduce((sum, t) => sum + t.amount, 0);
    }

    // 💰 Formatear moneda
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }
}

// 🌐 Exportar para uso global
window.ProactiveInsightsEngine = ProactiveInsightsEngine;
