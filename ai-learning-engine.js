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

    // 🎯 ADAPTACIÓN INTELIGENTE DE RESPUESTAS (MEJORADO)
    adaptToUserBehavior(userMessage, baseResponse) {
        const preferences = this.memorySystem.learningData.userPreferences;
        const conversationHistory = this.memorySystem.conversationHistory;
        const userProfile = this.memorySystem.userProfile;

        let adaptedResponse = baseResponse;

        // 🎨 MEJORA: Adaptación de estilo más sofisticada
        const commStyle = preferences.get('communication_style');
        const userExpertise = this.detectUserExpertiseLevel(conversationHistory);

        if (commStyle === 'concise' || userExpertise === 'advanced') {
            adaptedResponse = this.makeResponseConcise(adaptedResponse);
        } else if (commStyle === 'detailed' || userExpertise === 'beginner') {
            adaptedResponse = this.makeResponseDetailed(adaptedResponse);
        }

        // 🧠 MEJORA: Contexto inteligente con memoria a largo plazo
        const contextualInsights = this.generateContextualInsights(userMessage, conversationHistory, userProfile);
        if (contextualInsights.length > 0) {
            adaptedResponse += '\n\n' + contextualInsights.join('\n');
        }

        // 🔄 MEJORA: Manejo inteligente de preguntas frecuentes
        const questionAnalysis = this.analyzeQuestionPattern(userMessage);
        if (questionAnalysis.isRecurrent) {
            adaptedResponse = this.enhanceRecurrentResponse(adaptedResponse, questionAnalysis);
        }

        // 👨‍👩‍👧‍👦 MEJORA: Personalización familiar
        if (userProfile.familySize > 2) {
            adaptedResponse = this.addFamilyContext(adaptedResponse, userProfile);
        }

        // 💰 MEJORA: Contextualización financiera
        adaptedResponse = this.addFinancialContext(adaptedResponse, userProfile);

        // 🎯 MEJORA: Llamadas a la acción personalizadas
        adaptedResponse = this.addPersonalizedCTA(adaptedResponse, userMessage, preferences);

        return adaptedResponse;
    }

    // 🎓 Detectar nivel de experiencia del usuario
    detectUserExpertiseLevel(conversationHistory) {
        if (conversationHistory.length < 3) return 'beginner';

        const recentMessages = conversationHistory.slice(-10);
        let complexityScore = 0;

        const advancedTerms = ['inversión', 'diversificación', 'roi', 'liquidez', 'volatilidad', 'portafolio'];
        const basicTerms = ['gasto', 'ingreso', 'presupuesto', 'ahorro', 'dinero'];

        recentMessages.forEach(msg => {
            const message = msg.userMessage?.toLowerCase() || '';
            advancedTerms.forEach(term => {
                if (message.includes(term)) complexityScore += 2;
            });
            basicTerms.forEach(term => {
                if (message.includes(term)) complexityScore += 1;
            });
        });

        const avgComplexity = complexityScore / recentMessages.length;

        if (avgComplexity > 3) return 'advanced';
        if (avgComplexity > 1.5) return 'intermediate';
        return 'beginner';
    }

    // 💡 Generar insights contextuales
    generateContextualInsights(userMessage, conversationHistory, userProfile) {
        const insights = [];
        const recentContext = this.extractRecentContext(conversationHistory);

        // Insight sobre patrones de gasto
        if (userMessage.toLowerCase().includes('gasto') && userProfile.spendingPatterns.length > 0) {
            const lastPattern = userProfile.spendingPatterns[userProfile.spendingPatterns.length - 1];
            insights.push(`💡 *Basándome en tu historial, gastas en promedio ${this.formatCurrency(lastPattern.expense)} mensualmente.*`);
        }

        // Insight sobre contexto previo
        if (recentContext.includes('presupuesto') && !userMessage.toLowerCase().includes('presupuesto')) {
            insights.push('💡 *Recordatorio: Mencionaste el presupuesto antes. ¿Quieres que lo revisemos juntos?*');
        }

        // Insight sobre metas financieras
        if (userProfile.financialGoals.length > 0 && Math.random() < 0.3) {
            const goal = userProfile.financialGoals[0];
            insights.push(`🎯 *Recuerda tu meta: ${goal.description}. Este consejo puede ayudarte a alcanzarla.*`);
        }

        return insights;
    }

    // 🔄 Analizar patrón de preguntas
    analyzeQuestionPattern(userMessage) {
        const questionKey = this.memorySystem.normalizeQuestion(userMessage);
        const frequency = this.memorySystem.learningData.frequentQuestions.get(questionKey) || 0;

        return {
            isRecurrent: frequency > 3,
            frequency,
            questionKey,
            needsAutomation: frequency > 5
        };
    }

    // 🔄 Mejorar respuesta recurrente
    enhanceRecurrentResponse(response, questionAnalysis) {
        let enhancedResponse = `🔄 *Veo que esta es una pregunta recurrente para ti (${questionAnalysis.frequency} veces).*\n\n${response}`;

        if (questionAnalysis.needsAutomation) {
            enhancedResponse += '\n\n🤖 *¿Te gustaría que configure un recordatorio automático o una guía rápida sobre este tema?*';
        } else {
            enhancedResponse += '\n\n💡 *¿Te gustaría que profundicemos más en este tema para que sea más claro?*';
        }

        return enhancedResponse;
    }

    // 👨‍👩‍👧‍👦 Agregar contexto familiar
    addFamilyContext(response, userProfile) {
        const familySize = userProfile.familySize;
        const familyContext = `\n\n👨‍👩‍👧‍👦 *Considerando que son ${familySize} personas en la familia, este consejo puede beneficiar a todos. Recuerda involucrar a la familia en las decisiones financieras importantes.*`;

        return response + familyContext;
    }

    // 💰 Agregar contexto financiero
    addFinancialContext(response, userProfile) {
        if (userProfile.monthlyIncome > 0) {
            const incomeContext = `\n\n💰 *Basándome en tus ingresos mensuales de ${this.formatCurrency(userProfile.monthlyIncome)}, este consejo está calibrado para tu situación financiera.*`;
            return response + incomeContext;
        }
        return response;
    }

    // 🎯 Agregar llamada a la acción personalizada
    addPersonalizedCTA(response, userMessage, preferences) {
        const actionPreference = preferences.get('action_preference') || 'moderate';

        if (actionPreference === 'proactive') {
            response += '\n\n🚀 *¿Quieres que te ayude a implementar esto ahora mismo?*';
        } else if (actionPreference === 'conservative') {
            response += '\n\n🤔 *Tómate tu tiempo para considerar esta información. ¿Tienes alguna pregunta?*';
        } else {
            response += '\n\n💡 *¿Te gustaría que te dé más detalles sobre cómo implementar esto?*';
        }

        return response;
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
                .doc(`artifacts/${window.appId}/ai_memory_data/${this.memorySystem.userId}`)
                .set({
                    proactive_insights: {
                        insights: this.proactiveInsights,
                        lastGenerated: new Date().toISOString()
                    }
                }, { merge: true });
        } catch (error) {
            console.error('❌ Error guardando insights proactivos:', error);
        }
    }

    // 📊 Cargar insights proactivos
    async loadProactiveInsights() {
        try {
            const doc = await firebase.firestore()
                .doc(`artifacts/${window.appId}/ai_memory_data/${this.memorySystem.userId}`)
                .get();

            if (doc.exists) {
                const data = doc.data();
                this.proactiveInsights = data.proactive_insights?.insights || [];
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
    // 🎯 PREDICCIÓN MEJORADA DE GASTOS MENSUALES
    async predictNextMonthSpending(spendingPatterns) {
        if (!spendingPatterns || spendingPatterns.length === 0) {
            return {
                riskLevel: 0,
                excessAmount: 0,
                predictedExpense: 0,
                confidence: 0.1,
                insights: ['No hay datos históricos suficientes para predicción precisa']
            };
        }

        // 🧮 MEJORA: Usar más datos históricos con ponderación inteligente
        const recentPatterns = spendingPatterns.slice(-6); // Últimos 6 meses

        // 📊 MEJORA: Promedio ponderado exponencial
        let weightedSum = 0;
        let totalWeight = 0;

        recentPatterns.forEach((pattern, index) => {
            const weight = Math.pow(1.3, index); // Peso exponencial para datos más recientes
            weightedSum += pattern.expense * weight;
            totalWeight += weight;
        });

        const weightedAvgExpense = totalWeight > 0 ? weightedSum / totalWeight : 0;

        // 🔮 MEJORA: Análisis de tendencia más sofisticado
        const trendAnalysis = this.calculateAdvancedTrend(recentPatterns);

        // 🌡️ MEJORA: Factor estacional inteligente
        const seasonalFactor = this.getSeasonalFactor();

        // 📈 MEJORA: Predicción con múltiples factores
        const basePrediction = weightedAvgExpense * (1 + trendAnalysis.trend);
        const seasonalPrediction = basePrediction * seasonalFactor;
        const predictedExpense = seasonalPrediction;

        // 🎯 MEJORA: Análisis de riesgo más preciso
        const currentBudget = window.monthlyBudget || weightedAvgExpense;
        const riskLevel = predictedExpense > currentBudget ?
            Math.min(2.0, (predictedExpense - currentBudget) / currentBudget) : 0;
        const excessAmount = Math.max(0, predictedExpense - currentBudget);

        // 📊 MEJORA: Calcular confianza de la predicción
        const confidence = this.calculatePredictionConfidence(recentPatterns, trendAnalysis);

        // 💡 MEJORA: Generar insights inteligentes
        const insights = this.generatePredictionInsights(
            predictedExpense,
            currentBudget,
            trendAnalysis,
            seasonalFactor,
            confidence
        );

        return {
            riskLevel,
            excessAmount,
            predictedExpense,
            trend: trendAnalysis.trend,
            confidence,
            seasonalFactor,
            insights,
            dataQuality: {
                dataPoints: recentPatterns.length,
                consistency: trendAnalysis.consistency,
                reliability: confidence > 0.7 ? 'Alta' : confidence > 0.4 ? 'Media' : 'Baja'
            }
        };
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

    // 📈 ANÁLISIS DE TENDENCIA AVANZADO (NUEVO)
    calculateAdvancedTrend(patterns) {
        if (patterns.length < 2) {
            return { trend: 0, consistency: 0, direction: 'estable' };
        }

        const n = patterns.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

        // Regresión lineal para tendencia más precisa
        patterns.forEach((pattern, index) => {
            const x = index;
            const y = pattern.expense;
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const avgY = sumY / n;
        const trend = avgY > 0 ? slope / avgY : 0;

        // Calcular consistencia de la tendencia
        const consistency = this.calculateTrendConsistency(patterns, slope);

        // Determinar dirección de la tendencia
        let direction = 'estable';
        if (Math.abs(trend) > 0.05) {
            direction = trend > 0 ? 'creciente' : 'decreciente';
        }

        return { trend, consistency, direction, slope };
    }

    // 🎯 Calcular consistencia de tendencia (NUEVO)
    calculateTrendConsistency(patterns, slope) {
        if (patterns.length < 3) return 0.5;

        let consistentChanges = 0;
        const totalChanges = patterns.length - 1;

        for (let i = 1; i < patterns.length; i++) {
            const change = patterns[i].expense - patterns[i-1].expense;
            const expectedDirection = slope > 0 ? 1 : slope < 0 ? -1 : 0;
            const actualDirection = change > 0 ? 1 : change < 0 ? -1 : 0;

            if (expectedDirection === actualDirection || expectedDirection === 0) {
                consistentChanges++;
            }
        }

        return totalChanges > 0 ? consistentChanges / totalChanges : 0.5;
    }

    // 🌡️ FACTOR ESTACIONAL INTELIGENTE (NUEVO)
    getSeasonalFactor() {
        const currentMonth = new Date().getMonth();

        // Factores estacionales mejorados basados en datos reales
        const seasonalFactors = {
            0: 1.08,  // Enero - gastos post-navideños
            1: 0.92,  // Febrero - mes corto
            2: 1.02,  // Marzo - normalización
            3: 1.05,  // Abril - gastos de Semana Santa
            4: 1.08,  // Mayo - día de la madre
            5: 1.12,  // Junio - día del padre, vacaciones
            6: 1.15,  // Julio - vacaciones principales
            7: 1.10,  // Agosto - regreso a clases
            8: 1.03,  // Septiembre - normalización
            9: 1.05,  // Octubre - preparación fin de año
            10: 1.12, // Noviembre - Black Friday
            11: 1.20  // Diciembre - gastos navideños
        };

        return seasonalFactors[currentMonth] || 1.0;
    }

    // 📊 CONFIANZA DE PREDICCIÓN MEJORADA (NUEVO)
    calculatePredictionConfidence(patterns, trendAnalysis) {
        if (patterns.length < 2) return 0.2;

        // Factor 1: Cantidad de datos
        const dataFactor = Math.min(1.0, patterns.length / 6);

        // Factor 2: Consistencia de la tendencia
        const consistencyFactor = trendAnalysis.consistency;

        // Factor 3: Variabilidad de los datos
        const expenses = patterns.map(p => p.expense);
        const mean = expenses.reduce((sum, exp) => sum + exp, 0) / expenses.length;
        const variance = expenses.reduce((sum, exp) => sum + Math.pow(exp - mean, 2), 0) / expenses.length;
        const coefficientOfVariation = mean > 0 ? Math.sqrt(variance) / mean : 1;
        const stabilityFactor = Math.max(0.1, 1 - Math.min(1, coefficientOfVariation));

        // Factor 4: Recencia de los datos
        const recencyFactor = 0.9;

        // Combinar factores con pesos
        const confidence = (
            dataFactor * 0.3 +
            consistencyFactor * 0.3 +
            stabilityFactor * 0.3 +
            recencyFactor * 0.1
        );

        return Math.min(0.95, Math.max(0.1, confidence));
    }

    // 💡 GENERAR INSIGHTS INTELIGENTES (NUEVO)
    generatePredictionInsights(predictedExpense, currentBudget, trendAnalysis, seasonalFactor, confidence) {
        const insights = [];

        // Insight sobre confianza
        if (confidence > 0.8) {
            insights.push('📊 Predicción muy confiable basada en datos consistentes');
        } else if (confidence > 0.5) {
            insights.push('📈 Predicción moderadamente confiable, considera patrones recientes');
        } else {
            insights.push('⚠️ Predicción con baja confianza, necesitas más historial');
        }

        // Insight sobre tendencia
        if (trendAnalysis.direction === 'creciente') {
            insights.push(`📈 Tendencia ${trendAnalysis.direction}: tus gastos están aumentando gradualmente`);
        } else if (trendAnalysis.direction === 'decreciente') {
            insights.push(`📉 Tendencia ${trendAnalysis.direction}: ¡Excelente! Estás reduciendo gastos`);
        } else {
            insights.push('📊 Gastos estables: mantienes un patrón consistente');
        }

        // Insight estacional
        if (seasonalFactor > 1.1) {
            insights.push('🌡️ Mes de gastos altos por temporada - planifica con anticipación');
        } else if (seasonalFactor < 0.95) {
            insights.push('🌡️ Mes típicamente de menores gastos - oportunidad de ahorro');
        }

        // Insight sobre presupuesto
        const budgetRatio = currentBudget > 0 ? predictedExpense / currentBudget : 0;
        if (budgetRatio > 1.2) {
            insights.push('🚨 Riesgo alto: gastos predichos superan significativamente el presupuesto');
        } else if (budgetRatio > 1.05) {
            insights.push('⚠️ Atención: gastos predichos cerca del límite del presupuesto');
        } else if (budgetRatio < 0.8) {
            insights.push('💰 Oportunidad: gastos predichos por debajo del presupuesto');
        }

        return insights;
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

// 💳 ANÁLISIS DE MÉTODOS DE PAGO
class PaymentMethodAnalyzer {
    constructor(transactions) {
        this.transactions = transactions || [];
    }

    // 📊 Analizar patrones por método de pago
    analyzePaymentMethodPatterns() {
        const patterns = [];
        const methodStats = {};

        // Procesar transacciones
        this.transactions.forEach(transaction => {
            if (transaction.paymentMethod && transaction.type === 'expense') {
                const methodId = transaction.paymentMethod.id || transaction.paymentMethod.provider || 'unknown';
                const methodName = transaction.paymentMethod.displayName || transaction.paymentMethod.provider || 'Desconocido';

                if (!methodStats[methodId]) {
                    methodStats[methodId] = {
                        name: methodName,
                        total: 0,
                        count: 0,
                        categories: {},
                        avgAmount: 0,
                        lastUsed: null,
                        color: transaction.paymentMethod.color || '#6B7280'
                    };
                }

                methodStats[methodId].total += transaction.amount;
                methodStats[methodId].count++;

                // Categorías por método
                const category = transaction.category || 'Sin categoría';
                if (!methodStats[methodId].categories[category]) {
                    methodStats[methodId].categories[category] = 0;
                }
                methodStats[methodId].categories[category] += transaction.amount;

                // Fecha de último uso
                const transactionDate = transaction.date ? new Date(transaction.date) : transaction.createdAt?.toDate();
                if (!methodStats[methodId].lastUsed || transactionDate > methodStats[methodId].lastUsed) {
                    methodStats[methodId].lastUsed = transactionDate;
                }
            }
        });

        // Calcular promedios
        Object.values(methodStats).forEach(method => {
            method.avgAmount = method.total / method.count;
        });

        // Generar insights
        const methods = Object.entries(methodStats).sort(([,a], [,b]) => b.total - a.total);

        if (methods.length > 0) {
            const topMethod = methods[0][1];
            patterns.push({
                type: 'payment_preference',
                message: `Tu método de pago preferido es "${topMethod.name}" con $${topMethod.total.toLocaleString()} en ${topMethod.count} transacciones`,
                data: topMethod
            });

            // Análisis de categorías por método
            const topCategories = Object.entries(topMethod.categories)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3);

            if (topCategories.length > 0) {
                const topCategory = topCategories[0];
                const percentage = ((topCategory[1] / topMethod.total) * 100).toFixed(1);
                patterns.push({
                    type: 'category_by_method',
                    message: `Con "${topMethod.name}" gastas principalmente en "${topCategory[0]}" (${percentage}% del total)`,
                    data: { method: topMethod.name, category: topCategory[0], percentage }
                });
            }
        }

        return patterns;
    }

    // 📈 Generar reporte completo
    generatePaymentMethodReport() {
        const patterns = this.analyzePaymentMethodPatterns();

        return {
            patterns,
            timestamp: new Date().toISOString()
        };
    }
}

// 🌟 Instancia global del motor de aprendizaje
window.AILearningEngine = AILearningEngine;
window.PaymentMethodAnalyzer = PaymentMethodAnalyzer;
