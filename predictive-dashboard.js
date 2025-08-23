// 📊 DASHBOARD PREDICTIVO INTERACTIVO
// Visualizaciones que complementan perfectamente el sistema de Insights

class PredictiveDashboard {
    constructor() {
        this.charts = {};
        this.analyticsEngine = null;
        this.currentData = null;
        this.insights = [];
        
        console.log('📊 Dashboard Predictivo inicializado');
    }

    // 🚀 Inicializar dashboard con motor de análisis
    async initialize(analyticsEngine, transactions = []) {
        try {
            this.analyticsEngine = analyticsEngine;
            this.currentData = transactions;
            
            // Asegurar que el motor esté inicializado
            if (!analyticsEngine.initialized) {
                await analyticsEngine.initialize(transactions);
            }
            
            console.log('✅ Dashboard Predictivo listo con', transactions.length, 'transacciones');
            return true;
        } catch (error) {
            console.error('❌ Error inicializando dashboard:', error);
            return false;
        }
    }

    // 🎨 Crear modal del dashboard
    createDashboardModal() {
        const modal = document.createElement('div');
        modal.id = 'predictive-dashboard-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 w-full max-w-6xl m-4 rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
                <!-- Header -->
                <div class="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <div class="flex items-center gap-3">
                        <i data-lucide="trending-up" class="text-blue-500 w-6 h-6"></i>
                        <div>
                            <h3 class="text-2xl font-bold">Dashboard Predictivo</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Análisis inteligente y predicciones financieras</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="dashboard-insights-btn" class="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            <i data-lucide="brain-circuit" class="w-4 h-4"></i>
                            <span>Generar Insights</span>
                        </button>
                        <button class="js-close-dashboard p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>

                <!-- Content -->
                <div class="flex-1 p-6 overflow-y-auto">
                    <!-- Métricas principales -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-blue-100 text-sm">Próximo Mes</p>
                                    <p id="next-month-prediction" class="text-2xl font-bold">$0</p>
                                </div>
                                <i data-lucide="calendar" class="w-8 h-8 text-blue-200"></i>
                            </div>
                        </div>
                        <div class="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-green-100 text-sm">Tendencia</p>
                                    <p id="trend-indicator" class="text-2xl font-bold">Estable</p>
                                </div>
                                <i data-lucide="trending-up" class="w-8 h-8 text-green-200"></i>
                            </div>
                        </div>
                        <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-purple-100 text-sm">Confianza</p>
                                    <p id="confidence-level" class="text-2xl font-bold">85%</p>
                                </div>
                                <i data-lucide="target" class="w-8 h-8 text-purple-200"></i>
                            </div>
                        </div>
                        <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-orange-100 text-sm">Alertas</p>
                                    <p id="alerts-count" class="text-2xl font-bold">0</p>
                                </div>
                                <i data-lucide="alert-triangle" class="w-8 h-8 text-orange-200"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Gráficos principales -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <!-- Predicción de flujo de caja -->
                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h4 class="text-lg font-semibold mb-3 flex items-center gap-2">
                                <i data-lucide="line-chart" class="w-5 h-5 text-blue-500"></i>
                                Predicción de Flujo de Caja
                            </h4>
                            <canvas id="cashflow-chart" width="400" height="200"></canvas>
                        </div>

                        <!-- Gastos por categoría -->
                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h4 class="text-lg font-semibold mb-3 flex items-center gap-2">
                                <i data-lucide="pie-chart" class="w-5 h-5 text-green-500"></i>
                                Predicción por Categorías
                            </h4>
                            <canvas id="categories-chart" width="400" height="200"></canvas>
                        </div>
                    </div>

                    <!-- Tendencias y patrones -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Tendencias mensuales -->
                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h4 class="text-lg font-semibold mb-3 flex items-center gap-2">
                                <i data-lucide="bar-chart" class="w-5 h-5 text-purple-500"></i>
                                Tendencias Mensuales
                            </h4>
                            <canvas id="trends-chart" width="400" height="200"></canvas>
                        </div>

                        <!-- Insights automáticos -->
                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h4 class="text-lg font-semibold mb-3 flex items-center gap-2">
                                <i data-lucide="lightbulb" class="w-5 h-5 text-yellow-500"></i>
                                Insights Automáticos
                            </h4>
                            <div id="dashboard-insights" class="space-y-2 max-h-48 overflow-y-auto">
                                <p class="text-gray-500 dark:text-gray-400 text-sm">Generando insights...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer con acciones -->
                <div class="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <div class="flex justify-between items-center">
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                            <i data-lucide="info" class="w-4 h-4 inline mr-1"></i>
                            Predicciones basadas en ${this.currentData?.length || 0} transacciones históricas
                        </div>
                        <div class="flex gap-2">
                            <button id="export-predictions" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <i data-lucide="download" class="w-4 h-4 inline mr-1"></i>
                                Exportar
                            </button>
                            <button id="refresh-predictions" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                <i data-lucide="refresh-cw" class="w-4 h-4 inline mr-1"></i>
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return modal;
    }

    // 📊 Mostrar dashboard
    async showDashboard() {
        if (!this.analyticsEngine || !this.analyticsEngine.initialized) {
            console.error('❌ Motor de análisis no inicializado');
            return;
        }

        // Crear y mostrar modal
        const modal = this.createDashboardModal();
        document.body.appendChild(modal);
        
        // Inicializar iconos
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Configurar event listeners
        this.setupEventListeners(modal);

        // Cargar datos y crear gráficos
        await this.loadDashboardData();
        await this.createCharts();
        
        console.log('📊 Dashboard mostrado correctamente');
    }

    // 🎯 Configurar event listeners
    setupEventListeners(modal) {
        // Cerrar modal
        modal.querySelector('.js-close-dashboard').addEventListener('click', () => {
            this.closeDashboard();
        });

        // Generar insights
        modal.querySelector('#dashboard-insights-btn').addEventListener('click', () => {
            this.generateAndShowInsights();
        });

        // Exportar predicciones
        modal.querySelector('#export-predictions').addEventListener('click', () => {
            this.exportPredictions();
        });

        // Actualizar predicciones
        modal.querySelector('#refresh-predictions').addEventListener('click', () => {
            this.refreshPredictions();
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDashboard();
            }
        });
    }

    // 📈 Cargar datos del dashboard
    async loadDashboardData() {
        const predictions = this.analyticsEngine.getPredictions();
        const trends = this.analyticsEngine.getTrends();
        
        // Actualizar métricas principales
        this.updateMainMetrics(predictions, trends);
        
        // Generar insights automáticos
        this.insights = this.analyticsEngine.generateInsightsForDashboard();
        this.displayInsights();
    }

    // 🔢 Actualizar métricas principales
    updateMainMetrics(predictions, trends) {
        const nextMonthKey = Object.keys(predictions)[0];
        const nextMonthPrediction = predictions[nextMonthKey];
        
        if (nextMonthPrediction) {
            // Próximo mes
            document.getElementById('next-month-prediction').textContent = 
                this.formatCurrency(nextMonthPrediction.predictedExpenses);
            
            // Tendencia
            const trendText = trends.cashFlow?.direction === 'increasing' ? '↗️ Creciente' :
                             trends.cashFlow?.direction === 'decreasing' ? '↘️ Decreciente' : '➡️ Estable';
            document.getElementById('trend-indicator').textContent = trendText;
            
            // Confianza
            document.getElementById('confidence-level').textContent = 
                Math.round(nextMonthPrediction.confidence * 100) + '%';
            
            // Alertas
            const highPriorityInsights = this.insights.filter(i => i.priority === 'high');
            document.getElementById('alerts-count').textContent = highPriorityInsights.length;
        }
    }

    // 📊 Crear gráficos
    async createCharts() {
        await this.createCashFlowChart();
        await this.createCategoriesChart();
        await this.createTrendsChart();
    }

    // 💰 Crear gráfico de flujo de caja
    async createCashFlowChart() {
        const ctx = document.getElementById('cashflow-chart').getContext('2d');
        const predictions = this.analyticsEngine.getPredictions();
        
        const labels = [];
        const incomeData = [];
        const expenseData = [];
        const netData = [];
        
        Object.keys(predictions).forEach(monthKey => {
            const prediction = predictions[monthKey];
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                               'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            
            labels.push(monthNames[prediction.month]);
            incomeData.push(prediction.predictedIncome);
            expenseData.push(prediction.predictedExpenses);
            netData.push(prediction.predictedIncome - prediction.predictedExpenses);
        });

        this.charts.cashflow = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Ingresos Predichos',
                    data: incomeData,
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Gastos Predichos',
                    data: expenseData,
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Flujo Neto',
                    data: netData,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Predicción de Flujo de Caja (6 meses)'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // 🥧 Crear gráfico de categorías
    async createCategoriesChart() {
        const ctx = document.getElementById('categories-chart').getContext('2d');
        const predictions = this.analyticsEngine.getPredictions();
        const nextMonthKey = Object.keys(predictions)[0];
        const categoryBreakdown = predictions[nextMonthKey]?.categoryBreakdown || {};
        
        const labels = Object.keys(categoryBreakdown);
        const data = Object.values(categoryBreakdown);
        const colors = [
            '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
            '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'
        ];

        this.charts.categories = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Predicción por Categorías (Próximo Mes)'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // 📈 Crear gráfico de tendencias
    async createTrendsChart() {
        const ctx = document.getElementById('trends-chart').getContext('2d');
        const trends = this.analyticsEngine.getTrends();
        
        // Datos simulados para demostración
        const categories = Object.keys(trends.categories || {});
        const trendData = categories.map(cat => {
            const trend = trends.categories[cat];
            return trend?.slope || 0;
        });

        this.charts.trends = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Tendencia de Crecimiento',
                    data: trendData,
                    backgroundColor: trendData.map(val => 
                        val > 0 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(34, 197, 94, 0.7)'
                    ),
                    borderColor: trendData.map(val => 
                        val > 0 ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)'
                    ),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencias por Categoría'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cambio Mensual ($)'
                        }
                    }
                }
            }
        });
    }

    // 💡 Mostrar insights
    displayInsights() {
        const container = document.getElementById('dashboard-insights');
        if (!container) return;

        if (this.insights.length === 0) {
            container.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-sm">No hay insights disponibles</p>';
            return;
        }

        const insightsHTML = this.insights.map(insight => {
            const priorityColor = insight.priority === 'high' ? 'text-red-600' :
                                 insight.priority === 'medium' ? 'text-yellow-600' : 'text-green-600';
            const priorityIcon = insight.priority === 'high' ? 'alert-triangle' :
                                insight.priority === 'medium' ? 'info' : 'check-circle';
            
            return `
                <div class="flex items-start gap-2 p-2 bg-white dark:bg-gray-600 rounded">
                    <i data-lucide="${priorityIcon}" class="w-4 h-4 ${priorityColor} mt-0.5"></i>
                    <p class="text-sm">${insight.message}</p>
                </div>
            `;
        }).join('');

        container.innerHTML = insightsHTML;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // 🧠 Generar y mostrar insights adicionales
    async generateAndShowInsights() {
        if (window.aiLearningEngine && window.proactiveInsights) {
            // Generar insights basados en el dashboard
            const dashboardInsights = await window.aiLearningEngine.generateProactiveAdvice();
            
            // Agregar a insights proactivos
            window.proactiveInsights.push(...dashboardInsights);
            
            // Actualizar badge de insights
            if (typeof updateInsightsBadge === 'function') {
                updateInsightsBadge(window.proactiveInsights.length);
            }
            
            // Mostrar notificación
            this.showInsightNotification('Nuevos insights generados basándose en las predicciones');
        }
    }

    // 📤 Exportar predicciones
    exportPredictions() {
        const predictions = this.analyticsEngine.getPredictions();
        const dataStr = JSON.stringify(predictions, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `predicciones-financieras-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showInsightNotification('Predicciones exportadas correctamente');
    }

    // 🔄 Actualizar predicciones
    async refreshPredictions() {
        this.showInsightNotification('Actualizando predicciones...');
        
        // Reinicializar motor de análisis
        await this.analyticsEngine.initialize(this.currentData);
        
        // Recargar datos y gráficos
        await this.loadDashboardData();
        
        // Destruir gráficos existentes
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
        
        // Recrear gráficos
        await this.createCharts();
        
        this.showInsightNotification('Predicciones actualizadas correctamente');
    }

    // 🔔 Mostrar notificación
    showInsightNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center gap-2">
                <i data-lucide="info" class="w-4 h-4"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // ❌ Cerrar dashboard
    closeDashboard() {
        const modal = document.getElementById('predictive-dashboard-modal');
        if (modal) {
            // Destruir gráficos
            Object.values(this.charts).forEach(chart => {
                if (chart) chart.destroy();
            });
            this.charts = {};
            
            modal.remove();
        }
    }

    // 💰 Formatear moneda
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }
}

// 🌐 Exportar para uso global
window.PredictiveDashboard = PredictiveDashboard;
