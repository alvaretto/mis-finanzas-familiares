// 🧠 SISTEMA DE MEMORIA AVANZADO PARA FinGenius
// Desafío 1: Asistente IA Conversacional Avanzado

class AIMemorySystem {
    constructor() {
        this.userProfile = {
            spendingPatterns: [],
            financialGoals: [],
            riskTolerance: 'moderate',
            familySize: 2,
            monthlyIncome: 0,
            preferredCategories: new Map(),
            behaviorInsights: [],
            lastUpdated: new Date().toISOString()
        };
        
        this.conversationHistory = [];
        this.contextMemory = new Map(); // Memoria de contexto por temas
        this.learningData = {
            frequentQuestions: new Map(),
            userPreferences: new Map(),
            successfulAdvice: [],
            feedbackHistory: []
        };
        
        this.initialized = false;
    }

    // 🔄 Inicializar sistema de memoria
    async initialize(userId) {
        this.userId = userId;
        await this.loadUserProfile();
        await this.loadConversationHistory();
        await this.loadLearningData();
        this.initialized = true;
        console.log('🧠 Sistema de memoria IA inicializado para usuario:', userId);
    }

    // 💾 Cargar perfil del usuario desde Firebase
    async loadUserProfile() {
        try {
            const profileDoc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory_data/${this.userId}`)
                .get();
            
            if (profileDoc.exists) {
                this.userProfile = { ...this.userProfile, ...profileDoc.data() };
                console.log('✅ Perfil de usuario cargado desde memoria');
            } else {
                // Crear perfil inicial basado en datos existentes
                await this.createInitialProfile();
            }
        } catch (error) {
            console.error('❌ Error cargando perfil:', error);
        }
    }

    // 🎯 Crear perfil inicial analizando transacciones existentes
    async createInitialProfile() {
        try {
            // Analizar transacciones para crear perfil inicial
            const transactions = window.transactions || [];
            const analysis = this.analyzeTransactionPatterns(transactions);
            
            this.userProfile = {
                ...this.userProfile,
                spendingPatterns: analysis.patterns,
                preferredCategories: analysis.topCategories,
                monthlyIncome: analysis.avgIncome,
                behaviorInsights: analysis.insights,
                lastUpdated: new Date().toISOString()
            };

            await this.saveUserProfile();
            console.log('🎯 Perfil inicial creado basado en transacciones');
        } catch (error) {
            console.error('❌ Error creando perfil inicial:', error);
        }
    }

    // 📊 Analizar patrones de transacciones
    analyzeTransactionPatterns(transactions) {
        const patterns = [];
        const categoryCount = new Map();
        const monthlyTotals = new Map();
        let totalIncome = 0;
        let incomeCount = 0;

        transactions.forEach(t => {
            const date = new Date(t.date || t.createdAt?.toDate?.() || Date.now());
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            
            // Contar categorías
            const categoryKey = `${t.category}${t.subcategory ? ` › ${t.subcategory}` : ''}`;
            categoryCount.set(categoryKey, (categoryCount.get(categoryKey) || 0) + 1);
            
            // Calcular ingresos promedio
            if (t.type === 'income') {
                totalIncome += t.amount;
                incomeCount++;
            }
            
            // Totales mensuales
            if (!monthlyTotals.has(monthKey)) {
                monthlyTotals.set(monthKey, { income: 0, expense: 0 });
            }
            monthlyTotals.get(monthKey)[t.type] += t.amount;
        });

        // Generar insights
        const insights = [];
        const topCategories = Array.from(categoryCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([category, count]) => ({ category, frequency: count }));

        if (topCategories.length > 0) {
            insights.push(`Tu categoría más frecuente es "${topCategories[0].category}"`);
        }

        const avgIncome = incomeCount > 0 ? totalIncome / incomeCount : 0;
        if (avgIncome > 0) {
            insights.push(`Tu ingreso promedio por transacción es ${this.formatCurrency(avgIncome)}`);
        }

        return {
            patterns: Array.from(monthlyTotals.entries()).map(([month, totals]) => ({
                month,
                income: totals.income,
                expense: totals.expense,
                balance: totals.income - totals.expense
            })),
            topCategories: new Map(topCategories.map(item => [item.category, item.frequency])),
            avgIncome,
            insights
        };
    }

    // 💬 Cargar historial de conversaciones
    async loadConversationHistory() {
        try {
            const historyDoc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory_data/${this.userId}`)
                .get();
            
            if (historyDoc.exists) {
                const data = historyDoc.data();
                this.conversationHistory = data.conversations?.history || [];
                this.contextMemory = new Map(data.contextMemory || []);
                console.log('💬 Historial de conversaciones cargado');
            }
        } catch (error) {
            console.error('❌ Error cargando historial:', error);
        }
    }

    // 🎓 Cargar datos de aprendizaje
    async loadLearningData() {
        try {
            const learningDoc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory_data/${this.userId}`)
                .get();
            
            if (learningDoc.exists) {
                const data = learningDoc.data();
                const learningData = data.learning || {};
                this.learningData = {
                    frequentQuestions: new Map(learningData.frequentQuestions || []),
                    userPreferences: new Map(learningData.userPreferences || []),
                    successfulAdvice: learningData.successfulAdvice || [],
                    feedbackHistory: learningData.feedbackHistory || []
                };
                console.log('🎓 Datos de aprendizaje cargados');
            }
        } catch (error) {
            console.error('❌ Error cargando datos de aprendizaje:', error);
        }
    }

    // 💾 Guardar perfil de usuario
    async saveUserProfile() {
        try {
            await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory_data/${this.userId}`)
                .set({ profile: this.userProfile }, { merge: true });
        } catch (error) {
            console.error('❌ Error guardando perfil:', error);
        }
    }

    // 💾 Guardar historial de conversaciones
    async saveConversationHistory() {
        try {
            await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory_data/${this.userId}`)
                .set({
                    conversations: {
                        history: this.conversationHistory.slice(-50), // Mantener últimas 50 conversaciones
                        contextMemory: Array.from(this.contextMemory.entries()),
                        lastUpdated: new Date().toISOString()
                    }
                }, { merge: true });
        } catch (error) {
            console.error('❌ Error guardando historial:', error);
        }
    }

    // 💾 Guardar datos de aprendizaje
    async saveLearningData() {
        try {
            await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory_data/${this.userId}`)
                .set({
                    learning: {
                        frequentQuestions: Array.from(this.learningData.frequentQuestions.entries()),
                        userPreferences: Array.from(this.learningData.userPreferences.entries()),
                        successfulAdvice: this.learningData.successfulAdvice,
                        feedbackHistory: this.learningData.feedbackHistory,
                        lastUpdated: new Date().toISOString()
                    }
                }, { merge: true });
        } catch (error) {
            console.error('❌ Error guardando datos de aprendizaje:', error);
        }
    }

    // 🧠 Procesar nueva conversación
    async processConversation(userMessage, aiResponse) {
        if (!this.initialized) return;

        const conversation = {
            timestamp: new Date().toISOString(),
            userMessage,
            aiResponse,
            context: this.extractContext(userMessage)
        };

        this.conversationHistory.push(conversation);
        
        // Actualizar memoria de contexto
        this.updateContextMemory(conversation);
        
        // Aprender de la conversación
        this.learnFromConversation(conversation);
        
        // Guardar cambios
        await this.saveConversationHistory();
        await this.saveLearningData();
    }

    // 🎯 Extraer contexto de la conversación
    extractContext(message) {
        const contexts = [];
        const lowerMessage = message.toLowerCase();
        
        // Detectar temas financieros
        if (lowerMessage.includes('presupuesto') || lowerMessage.includes('budget')) {
            contexts.push('presupuesto');
        }
        if (lowerMessage.includes('ahorro') || lowerMessage.includes('ahorrar')) {
            contexts.push('ahorro');
        }
        if (lowerMessage.includes('gasto') || lowerMessage.includes('gastar')) {
            contexts.push('gastos');
        }
        if (lowerMessage.includes('inversión') || lowerMessage.includes('invertir')) {
            contexts.push('inversiones');
        }
        if (lowerMessage.includes('deuda') || lowerMessage.includes('préstamo')) {
            contexts.push('deudas');
        }
        
        return contexts;
    }

    // 🔄 Actualizar memoria de contexto
    updateContextMemory(conversation) {
        conversation.context.forEach(context => {
            if (!this.contextMemory.has(context)) {
                this.contextMemory.set(context, []);
            }
            
            const contextHistory = this.contextMemory.get(context);
            contextHistory.push({
                timestamp: conversation.timestamp,
                userMessage: conversation.userMessage,
                aiResponse: conversation.aiResponse
            });
            
            // Mantener solo las últimas 10 conversaciones por contexto
            if (contextHistory.length > 10) {
                contextHistory.shift();
            }
        });
    }

    // 🎓 Aprender de la conversación
    learnFromConversation(conversation) {
        // Contar preguntas frecuentes
        const questionKey = this.normalizeQuestion(conversation.userMessage);
        const currentCount = this.learningData.frequentQuestions.get(questionKey) || 0;
        this.learningData.frequentQuestions.set(questionKey, currentCount + 1);
        
        // Detectar preferencias del usuario
        this.detectUserPreferences(conversation);
    }

    // 🔍 Detectar preferencias del usuario
    detectUserPreferences(conversation) {
        const message = conversation.userMessage.toLowerCase();
        
        // Detectar preferencias de comunicación
        if (message.includes('detallado') || message.includes('explicación')) {
            this.learningData.userPreferences.set('communication_style', 'detailed');
        } else if (message.includes('rápido') || message.includes('resumen')) {
            this.learningData.userPreferences.set('communication_style', 'concise');
        }
        
        // Detectar intereses financieros
        if (message.includes('inversión') || message.includes('invertir')) {
            const currentInterest = this.learningData.userPreferences.get('investment_interest') || 0;
            this.learningData.userPreferences.set('investment_interest', currentInterest + 1);
        }
    }

    // 🔧 Normalizar pregunta para detección de patrones
    normalizeQuestion(question) {
        return question.toLowerCase()
            .replace(/[¿?¡!]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 50); // Primeras 50 caracteres
    }

    // 💰 Formatear moneda
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // 🎯 Generar contexto personalizado para IA
    generatePersonalizedContext() {
        if (!this.initialized) return '';

        let context = `Información del usuario:\n`;
        
        // Perfil básico
        context += `- Tamaño familiar: ${this.userProfile.familySize} personas\n`;
        context += `- Tolerancia al riesgo: ${this.userProfile.riskTolerance}\n`;
        
        if (this.userProfile.monthlyIncome > 0) {
            context += `- Ingreso promedio: ${this.formatCurrency(this.userProfile.monthlyIncome)}\n`;
        }
        
        // Patrones de gasto
        if (this.userProfile.preferredCategories.size > 0) {
            context += `- Categorías más frecuentes: ${Array.from(this.userProfile.preferredCategories.keys()).slice(0, 3).join(', ')}\n`;
        }
        
        // Insights de comportamiento
        if (this.userProfile.behaviorInsights.length > 0) {
            context += `- Insights: ${this.userProfile.behaviorInsights.slice(0, 2).join('; ')}\n`;
        }
        
        // Historial de conversaciones relevantes
        const recentConversations = this.conversationHistory.slice(-3);
        if (recentConversations.length > 0) {
            context += `\nConversaciones recientes:\n`;
            recentConversations.forEach((conv, index) => {
                context += `${index + 1}. Usuario: "${conv.userMessage.substring(0, 50)}..."\n`;
                context += `   FinGenius: "${conv.aiResponse.substring(0, 50)}..."\n`;
            });
        }
        
        // Preferencias de comunicación
        const commStyle = this.learningData.userPreferences.get('communication_style');
        if (commStyle) {
            context += `\nEstilo de comunicación preferido: ${commStyle === 'detailed' ? 'detallado' : 'conciso'}\n`;
        }
        
        return context;
    }

    // 📊 Obtener estadísticas de memoria
    getMemoryStats() {
        return {
            conversationsCount: this.conversationHistory.length,
            contextsTracked: this.contextMemory.size,
            frequentQuestionsCount: this.learningData.frequentQuestions.size,
            userPreferencesCount: this.learningData.userPreferences.size,
            profileLastUpdated: this.userProfile.lastUpdated,
            isInitialized: this.initialized
        };
    }
}

// 🌟 Instancia global del sistema de memoria
window.AIMemorySystem = AIMemorySystem;
