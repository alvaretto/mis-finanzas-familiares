// predictive-analytics.js

const PredictiveAnalytics = {
    /**
     * Previsión de flujo de caja para los próximos meses.
     * Utiliza una regresión lineal simple sobre los datos históricos de ingresos y gastos.
     * @param {Array} transactions - Array de transacciones históricas.
     * @param {number} months - Número de meses a predecir.
     * @returns {Array} - Array de objetos con la previsión para cada mes.
     */
    cashFlowForecast: (transactions, months = 6) => {
        if (transactions.length < 2) {
            return Array(months).fill({ month: 'N/A', forecast: 0, trend: 'flat' });
        }

        const monthlyData = {};

        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { income: 0, expense: 0, net: 0 };
            }
            if (tx.type === 'income') {
                monthlyData[monthKey].income += tx.amount;
            } else {
                monthlyData[monthKey].expense += tx.amount;
            }
            monthlyData[monthKey].net = monthlyData[monthKey].income - monthlyData[monthKey].expense;
        });

        const sortedMonths = Object.keys(monthlyData).sort();
        const historicalNet = sortedMonths.map(m => monthlyData[m].net);

        if (historicalNet.length < 2) {
             return Array(months).fill({ month: 'N/A', forecast: 0, trend: 'flat' });
        }

        // Regresión lineal simple (y = mx + c)
        const n = historicalNet.length;
        const sumX = historicalNet.reduce((acc, _, i) => acc + i, 0);
        const sumY = historicalNet.reduce((acc, y) => acc + y, 0);
        const sumXY = historicalNet.reduce((acc, y, i) => acc + i * y, 0);
        const sumX2 = historicalNet.reduce((acc, _, i) => acc + i * i, 0);

        const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX); // pendiente
        const c = (sumY - m * sumX) / n; // intercepción

        const forecast = [];
        const lastDate = new Date(sortedMonths[sortedMonths.length - 1] + '-01T12:00:00Z');

        for (let i = 1; i <= months; i++) {
            const nextMonthDate = new Date(lastDate);
            nextMonthDate.setUTCMonth(lastDate.getUTCMonth() + i);
            
            const monthName = nextMonthDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
            const predictedNet = m * (n + i - 1) + c;
            
            let trend = 'flat';
            if (m > 0.05 * Math.abs(c/n)) trend = 'positive'; // Crecimiento si la pendiente es significativa
            if (m < -0.05 * Math.abs(c/n)) trend = 'negative'; // Decrecimiento si la pendiente es significativa

            forecast.push({
                month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                forecast: predictedNet,
                trend: trend
            });
        }

        return forecast;
    },

    /**
     * Analiza los patrones de gasto por categoría.
     * @param {Array} transactions - Array de transacciones de gastos.
     * @returns {Array} - Array de objetos con el análisis por categoría.
     */
    expensePatternAnalysis: (transactions) => {
        const expenseTransactions = transactions.filter(tx => tx.type === 'expense');
        if (expenseTransactions.length === 0) return [];

        const categorySpending = {};
        expenseTransactions.forEach(tx => {
            if (!categorySpending[tx.category]) {
                categorySpending[tx.category] = { total: 0, count: 0, amounts: [] };
            }
            categorySpending[tx.category].total += tx.amount;
            categorySpending[tx.category].count++;
            categorySpending[tx.category].amounts.push(tx.amount);
        });

        const analysis = Object.keys(categorySpending).map(category => {
            const data = categorySpending[category];
            const average = data.total / data.count;
            const stdDev = Math.sqrt(data.amounts.map(x => Math.pow(x - average, 2)).reduce((a, b) => a + b, 0) / data.count);
            
            let volatility = 'estable';
            if (stdDev > average * 0.5) volatility = 'muy volátil';
            else if (stdDev > average * 0.2) volatility = 'volátil';

            return {
                category,
                total: data.total,
                average: average,
                count: data.count,
                volatility: volatility
            };
        });

        return analysis.sort((a, b) => b.total - a.total);
    },

    /**
     * Sugiere optimizaciones para el presupuesto.
     * @param {Array} transactions - Array de transacciones.
     * @param {number} budget - Presupuesto mensual.
     * @returns {Array} - Array de strings con sugerencias.
     */
    budgetOptimizationSuggestions: (transactions, budget) => {
        const suggestions = [];
        const expensePatterns = PredictiveAnalytics.expensePatternAnalysis(transactions);
        const totalExpenses = expensePatterns.reduce((acc, cat) => acc + cat.total, 0);

        if (totalExpenses > budget) {
            suggestions.push(`🚨 **Alerta de Presupuesto:** Has excedido tu presupuesto en ${formatCurrency(totalExpenses - budget)}.`);
        } else {
            suggestions.push(`✅ **Buen Trabajo:** Estás dentro de tu presupuesto por ${formatCurrency(budget - totalExpenses)}.`);
        }

        const topCategory = expensePatterns[0];
        if (topCategory) {
            suggestions.push(`🔍 **Foco Principal:** Tu mayor gasto es en **${topCategory.category}** ($${topCategory.total.toFixed(2)}). Considera revisar esta área para optimizar.`);
        }

        const volatileCategory = expensePatterns.find(c => c.volatility === 'muy volátil' || c.volatility === 'volátil');
        if (volatileCategory) {
            suggestions.push(`⚡ **Gasto Irregular:** Tus gastos en **${volatileCategory.category}** son ${volatileCategory.volatility}. Planificar estos costos podría mejorar tu estabilidad financiera.`);
        }
        
        const frequentSmallSpends = expensePatterns.find(c => c.count > 20 && c.average < 150);
        if(frequentSmallSpends) {
            suggestions.push(`🐜 **Gastos Hormiga:** Has realizado ${frequentSmallSpends.count} pequeñas compras en **${frequentSmallSpends.category}**. ¡Estos pequeños montos suman!`);
        }

        return suggestions;
    },

    /**
     * Predice gastos estacionales (ej. Navidad, vacaciones).
     * @param {Array} transactions - Array de transacciones.
     * @returns {Array} - Array de objetos con predicciones estacionales.
     */
    seasonalSpendingPredictions: (transactions) => {
        const predictions = [];
        const monthlyExpenses = {};

        transactions.filter(t => t.type === 'expense').forEach(tx => {
            const month = new Date(tx.date).getMonth(); // 0-11
            if (!monthlyExpenses[month]) {
                monthlyExpenses[month] = [];
            }
            monthlyExpenses[month].push(tx.amount);
        });

        const overallAverage = transactions.filter(t => t.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0) / 12;

        for (let i = 0; i < 12; i++) {
            const monthName = new Date(2025, i, 1).toLocaleString('es-ES', { month: 'long' });
            const monthData = monthlyExpenses[i] || [];
            const monthTotal = monthData.reduce((sum, amount) => sum + amount, 0);
            
            if (monthTotal > overallAverage * 1.3) { // 30% por encima del promedio
                 predictions.push({
                    month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                    reason: `Aumento histórico del gasto. Posibles eventos: ${getSeasonalEvent(i)}`,
                    expectedIncrease: `~${Math.round(((monthTotal / overallAverage) - 1) * 100)}%`
                });
            }
        }
        return predictions;
    }
};

function getSeasonalEvent(monthIndex) {
    switch(monthIndex) {
        case 11: return "Navidad, fin de año";
        case 6: case 7: return "Vacaciones de verano";
        case 3: return "Semana Santa";
        case 8: return "Regreso a clases";
        default: return "Eventos especiales";
    }
}

// Helper para formatear moneda, si no existe globalmente
if (typeof formatCurrency !== 'function') {
    window.formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };
}
