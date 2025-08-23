// dashboard-predictivo.js

const PredictiveDashboard = {
    /**
     * Abre el modal del dashboard predictivo.
     * @param {Array} transactions - Array de transacciones.
     * @param {number} budget - Presupuesto mensual.
     */
    open: (transactions, budget) => {
        const modalEl = document.getElementById('predictive-dashboard-modal');
        if (!modalEl) return;

        // Realizar todos los análisis
        const cashFlow = PredictiveAnalytics.cashFlowForecast(transactions);
        const expensePatterns = PredictiveAnalytics.expensePatternAnalysis(transactions);
        const budgetSuggestions = PredictiveAnalytics.budgetOptimizationSuggestions(transactions, budget);
        const seasonalPredictions = PredictiveAnalytics.seasonalSpendingPredictions(transactions);

        modalEl.innerHTML = `
            <div class="bg-white dark:bg-gray-800 w-full max-w-4xl m-4 rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
                <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h3 class="text-xl font-semibold flex items-center gap-2">
                        <i data-lucide="bar-chart-3" class="text-indigo-500"></i>
                        Dashboard Predictivo
                    </h3>
                    <button class="js-close-modal p-1 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700">
                        <i data-lucide="x"></i>
                    </button>
                </div>

                <div class="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Columna Izquierda -->
                    <div class="space-y-6">
                        <!-- Previsión de Flujo de Caja -->
                        <div class="bg-slate-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <h4 class="font-semibold mb-3 flex items-center gap-2">
                                <i data-lucide="trending-up" class="w-5 h-5 text-green-500"></i>
                                Previsión de Flujo de Caja (Próximos 6 meses)
                            </h4>
                            <div class="h-48 relative">
                                <canvas id="cash-flow-chart"></canvas>
                            </div>
                        </div>

                        <!-- Sugerencias de Optimización -->
                        <div class="bg-slate-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <h4 class="font-semibold mb-3 flex items-center gap-2">
                                <i data-lucide="lightbulb" class="w-5 h-5 text-yellow-500"></i>
                                Sugerencias de Optimización
                            </h4>
                            <ul class="space-y-2 text-sm">
                                ${budgetSuggestions.map(s => `<li class="flex items-start gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-green-500 mt-1 flex-shrink-0"></i><span>${s}</span></li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <!-- Columna Derecha -->
                    <div class="space-y-6">
                        <!-- Patrones de Gasto -->
                        <div class="bg-slate-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <h4 class="font-semibold mb-3 flex items-center gap-2">
                                <i data-lucide="pie-chart" class="w-5 h-5 text-blue-500"></i>
                                Patrones de Gasto por Categoría
                            </h4>
                            <div class="space-y-3">
                                ${expensePatterns.slice(0, 5).map(p => `
                                    <div class="text-sm">
                                        <div class="flex justify-between mb-1">
                                            <span>${p.category}</span>
                                            <span class="font-medium">${formatCurrency(p.total)}</span>
                                        </div>
                                        <div class="w-full bg-slate-200 dark:bg-gray-600 rounded-full h-2">
                                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${p.total / expensePatterns[0].total * 100}%"></div>
                                        </div>
                                        <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Promedio: ${formatCurrency(p.average)} | Volatilidad: ${p.volatility}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Predicciones Estacionales -->
                        <div class="bg-slate-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <h4 class="font-semibold mb-3 flex items-center gap-2">
                                <i data-lucide="calendar-days" class="w-5 h-5 text-red-500"></i>
                                Predicciones Estacionales
                            </h4>
                            <ul class="space-y-2 text-sm">
                                ${seasonalPredictions.length > 0 ? seasonalPredictions.map(p => `
                                    <li class="flex items-start gap-2">
                                        <i data-lucide="alert-triangle" class="w-4 h-4 text-red-500 mt-1 flex-shrink-0"></i>
                                        <div>
                                            <strong>${p.month}:</strong> ${p.reason} 
                                            <span class="text-red-500 font-medium">(Aumento esperado: ${p.expectedIncrease})</span>
                                        </div>
                                    </li>`).join('') : '<li>No se detectan grandes picos de gastos estacionales en tus datos.</li>'}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modalEl.classList.remove('hidden');
        lucide.createIcons();

        modalEl.querySelector('.js-close-modal').addEventListener('click', () => {
            modalEl.classList.add('hidden');
        });

        // Renderizar el gráfico de flujo de caja
        this.renderCashFlowChart(cashFlow);
    },

    /**
     * Renderiza el gráfico de previsión de flujo de caja.
     * @param {Array} cashFlowData - Datos de la previsión.
     */
    renderCashFlowChart: (cashFlowData) => {
        const ctx = document.getElementById('cash-flow-chart')?.getContext('2d');
        if (!ctx) return;

        const labels = cashFlowData.map(d => d.month);
        const data = cashFlowData.map(d => d.forecast);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Flujo de Caja Neto Previsto',
                    data: data,
                    borderColor: 'rgb(79, 70, 229)',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
};

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
