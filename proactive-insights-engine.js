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

    // ⚙️ Configurar reglas por defecto
    setupDefaultRules() {
        // Regla: Gastos excesivos
        this.rules.set('excessive_spending', {
            condition: (data) => {
                const monthlyExpenses = this.calculateMonthlyExpenses(data.transactions);
                const budget = data.budget || 0;
                return budget > 0 && monthlyExpenses > budget * 1.1;
            },
            insight: (data) => ({
                type: 'warning',
                priority: 'high',
                title: '⚠️ Gastos por encima del presupuesto',
                message: 'Tus gastos este mes superan tu presupuesto en más del 10%.',
                actions: ['Revisar gastos', 'Ajustar presupuesto', 'Identificar gastos innecesarios'],
                category: 'budget'
            })
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
}

// 🌐 Exportar para uso global
window.ProactiveInsightsEngine = ProactiveInsightsEngine;
