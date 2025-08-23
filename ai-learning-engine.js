// 🎓 MOTOR DE APRENDIZAJE AVANZADO PARA FinGenius
// Complemento del Sistema de Memoria - Predicciones y Aprendizaje Automático

class AILearningEngine {
    constructor(memorySystem) {
        this.memorySystem = memorySystem;
        this.predictionModels = {
            spendingPredictor: new SpendingPredictor(),
            behaviorAnalyzer: new BehaviorAnalyzer(),
            adviceOptimizer: new AdviceOptimizer()
        };
        this.proactiveInsights = [];
        this.adaptationRules = new Map();
    }

    // 🔮 Predecir necesidades futuras del usuario
    async predictFutureNeeds() {
        if (!this.memorySystem.initialized) return [];

        const predictions = [];
        const userProfile = this.memorySystem.userProfile;
        const conversationHistory = this.memorySystem.conversationHistory;

        // Predicción basada en patrones de gasto
        const spendingPrediction = await this.predictionModels.spendingPredictor
            .predictNextMonthSpending(userProfile.spendingPatterns);
        
        if (spendingPrediction.riskLevel > 0.7) {
            predictions.push({
                type: 'budget_warning',
                message: `Basándome en tus patrones, podrías exceder tu presupuesto en ${this.formatCurrency(spendingPrediction.excessAmount)} el próximo mes.`,
                priority: 'high',
                actionable: true,
                suggestedActions: [
                    'Revisar gastos en categorías frecuentes',
                    'Establecer alertas de presupuesto',
                    'Considerar ajustar límites mensuales'
                ]
            });
        }

        // Predicción basada en comportamiento conversacional
        const behaviorPrediction = this.predictionModels.behaviorAnalyzer
            .analyzeBehaviorTrends(conversationHistory);
        
        if (behaviorPrediction.needsAdvice) {
            predictions.push({
                type: 'proactive_advice',
                message: behaviorPrediction.suggestedTopic,
                priority: 'medium',
                actionable: true,
                context: behaviorPrediction.context
            });
        }

        // Predicción de momentos óptimos para consejos
        const timingPrediction = this.predictOptimalAdviceTiming();
        if (timingPrediction.shouldOfferAdvice) {
            predictions.push({
                type: 'timing_advice',
                message: timingPrediction.message,
                priority: 'low',
                timing: timingPrediction.optimalTime
            });
        }

        return predictions;
    }

    // ⏰ Predecir momento óptimo para dar consejos
    predictOptimalAdviceTiming() {
        const now = new Date();
        const dayOfMonth = now.getDate();
        const hour = now.getHours();
        
        // Lógica basada en patrones financieros comunes
        let shouldOfferAdvice = false;
        let message = '';
        let optimalTime = null;

        // Inicio de mes - planificación
        if (dayOfMonth <= 5) {
            shouldOfferAdvice = true;
            message = 'Es un buen momento para revisar tu presupuesto mensual y establecer metas.';
            optimalTime = 'early_month';
        }
        
        // Medio de mes - seguimiento
        else if (dayOfMonth >= 14 && dayOfMonth <= 16) {
            shouldOfferAdvice = true;
            message = 'Estamos a mitad de mes. ¿Quieres revisar cómo va tu presupuesto?';
            optimalTime = 'mid_month';
        }
        
        // Fin de mes - evaluación
        else if (dayOfMonth >= 28) {
            shouldOfferAdvice = true;
            message = 'Fin de mes se acerca. Es momento de evaluar tus gastos y planificar el próximo mes.';
            optimalTime = 'end_month';
        }

        return { shouldOfferAdvice, message, optimalTime };
    }

    // 🎯 Adaptar respuestas basándose en el comportamiento del usuario
    adaptToUserBehavior(userMessage, baseResponse) {
        const preferences = this.memorySystem.learningData.userPreferences;
        const conversationHistory = this.memorySystem.conversationHistory;
        
        let adaptedResponse = baseResponse;

        // Adaptar estilo de comunicación
        const commStyle = preferences.get('communication_style');
        if (commStyle === 'concise') {
            adaptedResponse = this.makeResponseConcise(adaptedResponse);
        } else if (commStyle === 'detailed') {
            adaptedResponse = this.makeResponseDetailed(adaptedResponse);
        }

        // Adaptar basándose en contexto previo
        const recentContext = this.extractRecentContext(conversationHistory);
        if (recentContext.includes('presupuesto') && !userMessage.toLowerCase().includes('presupuesto')) {
            adaptedResponse += '\n\n💡 *Recordatorio: Mencionaste el presupuesto antes. ¿Quieres que lo revisemos juntos?*';
        }

        // Adaptar basándose en frecuencia de preguntas
        const questionKey = this.memorySystem.normalizeQuestion(userMessage);
        const frequency = this.memorySystem.learningData.frequentQuestions.get(questionKey) || 0;
        
        if (frequency > 3) {
            adaptedResponse = `🔄 *Veo que esta es una pregunta recurrente para ti.*\n\n${adaptedResponse}\n\n💡 *¿Te gustaría que creemos un recordatorio o una guía rápida sobre este tema?*`;
        }

        return adaptedResponse;
    }

    // ✂️ Hacer respuesta más concisa
    makeResponseConcise(response) {
        // Eliminar explicaciones extensas y mantener puntos clave
        return response
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => {
                // Mantener solo la información esencial
                if (line.includes('Por ejemplo') || line.includes('Es decir')) {
                    return null;
                }
                return line.length > 100 ? line.substring(0, 97) + '...' : line;
            })
            .filter(line => line !== null)
            .slice(0, 3) // Máximo 3 líneas
            .join('\n');
    }

    // 📝 Hacer respuesta más detallada
    makeResponseDetailed(response) {
        // Agregar contexto adicional y ejemplos
        const detailedResponse = response;
        
        // Agregar sección de contexto si no existe
        if (!response.includes('contexto') && !response.includes('ejemplo')) {
            return `${detailedResponse}\n\n📊 **Contexto adicional:** Basándome en tu historial financiero, esta recomendación se alinea con tus patrones de gasto habituales.`;
        }
        
        return detailedResponse;
    }

    // 🔍 Extraer contexto reciente de conversaciones
    extractRecentContext(conversationHistory) {
        const recentConversations = conversationHistory.slice(-5);
        const contexts = [];
        
        recentConversations.forEach(conv => {
            if (conv.context) {
                contexts.push(...conv.context);
            }
        });
        
        return [...new Set(contexts)]; // Eliminar duplicados
    }

    // 🎯 Generar consejos proactivos
    async generateProactiveAdvice() {
        const predictions = await this.predictFutureNeeds();
        const proactiveAdvice = [];

        predictions.forEach(prediction => {
            if (prediction.actionable) {
                proactiveAdvice.push({
                    title: this.getPredictionTitle(prediction.type),
                    message: prediction.message,
                    actions: prediction.suggestedActions || [],
                    priority: prediction.priority,
                    timestamp: new Date().toISOString()
                });
            }
        });

        // Guardar consejos proactivos
        this.proactiveInsights = proactiveAdvice;
        await this.saveProactiveInsights();

        return proactiveAdvice;
    }

    // 🏷️ Obtener título para tipo de predicción
    getPredictionTitle(type) {
        const titles = {
            'budget_warning': '⚠️ Alerta de Presupuesto',
            'proactive_advice': '💡 Consejo Personalizado',
            'timing_advice': '⏰ Momento Oportuno',
            'spending_pattern': '📊 Patrón de Gasto Detectado',
            'saving_opportunity': '💰 Oportunidad de Ahorro'
        };
        return titles[type] || '🤖 Insight de IA';
    }

    // 💾 Guardar insights proactivos
    async saveProactiveInsights() {
        try {
            await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory/${this.memorySystem.userId}/proactive_insights`)
                .set({
                    insights: this.proactiveInsights,
                    lastGenerated: new Date().toISOString()
                });
        } catch (error) {
            console.error('❌ Error guardando insights proactivos:', error);
        }
    }

    // 📊 Cargar insights proactivos
    async loadProactiveInsights() {
        try {
            const doc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory/${this.memorySystem.userId}/proactive_insights`)
                .get();
            
            if (doc.exists) {
                this.proactiveInsights = doc.data().insights || [];
                return this.proactiveInsights;
            }
        } catch (error) {
            console.error('❌ Error cargando insights proactivos:', error);
        }
        return [];
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

// 📈 Predictor de gastos
class SpendingPredictor {
    async predictNextMonthSpending(spendingPatterns) {
        if (!spendingPatterns || spendingPatterns.length === 0) {
            return { riskLevel: 0, excessAmount: 0 };
        }

        // Calcular promedio de gastos de los últimos 3 meses
        const recentPatterns = spendingPatterns.slice(-3);
        const avgExpense = recentPatterns.reduce((sum, pattern) => sum + pattern.expense, 0) / recentPatterns.length;
        
        // Detectar tendencia
        const trend = this.calculateTrend(recentPatterns);
        const predictedExpense = avgExpense * (1 + trend);
        
        // Calcular riesgo basándose en el presupuesto actual
        const currentBudget = window.monthlyBudget || avgExpense;
        const riskLevel = predictedExpense > currentBudget ? (predictedExpense - currentBudget) / currentBudget : 0;
        const excessAmount = Math.max(0, predictedExpense - currentBudget);

        return { riskLevel, excessAmount, predictedExpense, trend };
    }

    calculateTrend(patterns) {
        if (patterns.length < 2) return 0;
        
        const changes = [];
        for (let i = 1; i < patterns.length; i++) {
            const change = (patterns[i].expense - patterns[i-1].expense) / patterns[i-1].expense;
            changes.push(change);
        }
        
        return changes.reduce((sum, change) => sum + change, 0) / changes.length;
    }
}

// 🧠 Analizador de comportamiento
class BehaviorAnalyzer {
    analyzeBehaviorTrends(conversationHistory) {
        if (conversationHistory.length < 3) {
            return { needsAdvice: false };
        }

        const recentConversations = conversationHistory.slice(-5);
        const topics = this.extractTopics(recentConversations);
        const sentiment = this.analyzeSentiment(recentConversations);
        
        // Detectar si el usuario necesita consejo proactivo
        const needsAdvice = this.detectAdviceNeed(topics, sentiment);
        
        if (needsAdvice) {
            return {
                needsAdvice: true,
                suggestedTopic: this.generateAdviceTopic(topics),
                context: topics,
                sentiment
            };
        }

        return { needsAdvice: false };
    }

    extractTopics(conversations) {
        const topics = [];
        conversations.forEach(conv => {
            if (conv.context) {
                topics.push(...conv.context);
            }
        });
        return [...new Set(topics)];
    }

    analyzeSentiment(conversations) {
        // Análisis básico de sentimiento basado en palabras clave
        const positiveWords = ['bien', 'bueno', 'excelente', 'perfecto', 'gracias'];
        const negativeWords = ['problema', 'mal', 'difícil', 'preocupado', 'ayuda'];
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        conversations.forEach(conv => {
            const message = conv.userMessage.toLowerCase();
            positiveWords.forEach(word => {
                if (message.includes(word)) positiveCount++;
            });
            negativeWords.forEach(word => {
                if (message.includes(word)) negativeCount++;
            });
        });
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    detectAdviceNeed(topics, sentiment) {
        // Si hay temas recurrentes y sentimiento negativo/neutral
        return topics.length > 2 && sentiment !== 'positive';
    }

    generateAdviceTopic(topics) {
        const topicAdvice = {
            'presupuesto': 'Veo que has preguntado sobre presupuesto varias veces. ¿Te gustaría que revisemos tu estrategia de presupuestación?',
            'ahorro': 'Noto tu interés en el ahorro. ¿Quieres que analicemos oportunidades específicas de ahorro basadas en tus gastos?',
            'gastos': 'Has consultado sobre gastos frecuentemente. ¿Te ayudo a identificar áreas donde podrías optimizar?',
            'inversiones': 'Veo tu interés en inversiones. ¿Quieres que evaluemos tu perfil de riesgo y opciones adecuadas?'
        };
        
        for (const topic of topics) {
            if (topicAdvice[topic]) {
                return topicAdvice[topic];
            }
        }
        
        return 'He notado patrones en nuestras conversaciones. ¿Te gustaría que analicemos tu situación financiera de manera integral?';
    }
}

// 🎯 Optimizador de consejos
class AdviceOptimizer {
    constructor() {
        this.successfulAdvice = [];
        this.feedbackHistory = [];
    }

    optimizeAdvice(baseAdvice, userProfile, conversationContext) {
        // Optimizar consejo basándose en el perfil y contexto
        let optimizedAdvice = baseAdvice;
        
        // Personalizar basándose en tolerancia al riesgo
        if (userProfile.riskTolerance === 'conservative') {
            optimizedAdvice = this.makeAdviceConservative(optimizedAdvice);
        } else if (userProfile.riskTolerance === 'aggressive') {
            optimizedAdvice = this.makeAdviceAggressive(optimizedAdvice);
        }
        
        // Agregar contexto familiar
        if (userProfile.familySize > 2) {
            optimizedAdvice += `\n\n👨‍👩‍👧‍👦 *Considerando que son ${userProfile.familySize} personas en la familia, este consejo puede beneficiar a todos.*`;
        }
        
        return optimizedAdvice;
    }

    makeAdviceConservative(advice) {
        return advice.replace(/riesgo/g, 'opción segura')
                    .replace(/invertir/g, 'considerar cuidadosamente')
                    + '\n\n🛡️ *Recomendación conservadora: Siempre prioriza la seguridad financiera.*';
    }

    makeAdviceAggressive(advice) {
        return advice + '\n\n🚀 *Oportunidad de crecimiento: Considera opciones que maximicen tu potencial financiero.*';
    }
}

// 🌟 Instancia global del motor de aprendizaje
window.AILearningEngine = AILearningEngine;
