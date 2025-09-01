// 🧪 SISTEMA DE PRUEBAS PARA FUNCIONALIDADES CONTABLES
// Validación completa del sistema contable familiar implementado

class AccountingSystemTests {
    constructor() {
        this.testResults = [];
        this.calculator = null;
        this.uiUtils = null;
    }

    // 🚀 Ejecutar todas las pruebas
    async runAllTests() {
        console.log('🧪 Iniciando pruebas del sistema contable...');
        
        this.testResults = [];
        
        // Inicializar componentes
        if (window.AccountingCalculator) {
            this.calculator = new window.AccountingCalculator();
        }
        if (window.TransactionUIUtils) {
            this.uiUtils = new window.TransactionUIUtils();
        }

        // Ejecutar pruebas
        await this.testTransactionTypes();
        await this.testTransferCalculations();
        await this.testLoanCalculations();
        await this.testLoanPaymentCalculations();
        await this.testBalanceReconciliation();
        await this.testUIRendering();
        await this.testAIIntegration();

        // Mostrar resultados
        this.displayTestResults();
        
        return this.testResults;
    }

    // ✅ Prueba de tipos de transacciones
    async testTransactionTypes() {
        console.log('🧪 Probando tipos de transacciones...');
        
        try {
            // Verificar que todos los tipos estén definidos
            const expectedTypes = ['income', 'expense', 'transfer', 'loan_given', 'loan_received', 'loan_payment_received', 'loan_payment_made'];
            
            for (const type of expectedTypes) {
                if (!window.TRANSACTION_TYPES || !window.TRANSACTION_TYPES[type]) {
                    throw new Error(`Tipo de transacción '${type}' no está definido`);
                }
                
                const config = window.TRANSACTION_TYPES[type];
                if (!config.name || !config.icon || !config.color) {
                    throw new Error(`Configuración incompleta para tipo '${type}'`);
                }
            }
            
            this.addTestResult('Tipos de Transacciones', true, 'Todos los tipos están correctamente definidos');
            
        } catch (error) {
            this.addTestResult('Tipos de Transacciones', false, error.message);
        }
    }

    // 🔄 Prueba de cálculos de transferencias
    async testTransferCalculations() {
        console.log('🧪 Probando cálculos de transferencias...');
        
        try {
            if (!this.calculator) {
                throw new Error('AccountingCalculator no disponible');
            }

            const transferTransaction = {
                id: 'test-transfer-1',
                type: 'transfer',
                amount: 100000,
                description: 'Transferencia de prueba',
                transferDetails: {
                    fromMethod: { id: 'nequi', displayName: 'Nequi' },
                    toMethod: { id: 'davivienda_transfer', displayName: 'Davivienda' }
                }
            };

            const impact = this.calculator.calculateTransactionImpact(transferTransaction);
            
            // Verificar que las transferencias no afecten ingresos/gastos
            if (impact.income !== 0 || impact.expense !== 0) {
                throw new Error('Las transferencias no deben afectar ingresos/gastos');
            }
            
            // Verificar que el flujo de caja total sea 0
            if (impact.cashFlow !== 0) {
                throw new Error('Las transferencias no deben afectar el flujo de caja total');
            }
            
            // Verificar que afecte correctamente los métodos de pago
            if (impact.paymentMethods['nequi'] !== -100000 || impact.paymentMethods['davivienda_transfer'] !== 100000) {
                throw new Error('Las transferencias deben afectar correctamente los saldos por método');
            }
            
            this.addTestResult('Cálculos de Transferencias', true, 'Transferencias calculadas correctamente');
            
        } catch (error) {
            this.addTestResult('Cálculos de Transferencias', false, error.message);
        }
    }

    // 💰 Prueba de cálculos de préstamos
    async testLoanCalculations() {
        console.log('🧪 Probando cálculos de préstamos...');
        
        try {
            if (!this.calculator) {
                throw new Error('AccountingCalculator no disponible');
            }

            // Prueba préstamo otorgado
            const loanGivenTransaction = {
                id: 'test-loan-given-1',
                type: 'loan_given',
                amount: 500000,
                description: 'Préstamo a hermano',
                loanDetails: {
                    borrower: { name: 'Juan Pérez', relationship: 'Hermano' },
                    terms: { principalAmount: 500000, interestRate: 0 },
                    status: 'active',
                    balance: 500000
                }
            };

            const impactGiven = this.calculator.calculateTransactionImpact(loanGivenTransaction);
            
            // Verificar que reduce efectivo y aumenta activos
            if (impactGiven.cashFlow !== -500000 || impactGiven.assets !== 500000) {
                throw new Error('Préstamo otorgado debe reducir efectivo y aumentar activos');
            }
            
            // Prueba préstamo recibido
            const loanReceivedTransaction = {
                id: 'test-loan-received-1',
                type: 'loan_received',
                amount: 300000,
                description: 'Préstamo del banco',
                loanDetails: {
                    lender: { name: 'Banco Davivienda', type: 'bank' },
                    terms: { principalAmount: 300000, interestRate: 12 },
                    status: 'active',
                    balance: 300000
                }
            };

            const impactReceived = this.calculator.calculateTransactionImpact(loanReceivedTransaction);
            
            // Verificar que aumenta efectivo y pasivos
            if (impactReceived.cashFlow !== 300000 || impactReceived.liabilities !== 300000) {
                throw new Error('Préstamo recibido debe aumentar efectivo y pasivos');
            }
            
            this.addTestResult('Cálculos de Préstamos', true, 'Préstamos calculados correctamente');
            
        } catch (error) {
            this.addTestResult('Cálculos de Préstamos', false, error.message);
        }
    }

    // 💸 Prueba de cálculos de pagos de préstamos
    async testLoanPaymentCalculations() {
        console.log('🧪 Probando cálculos de pagos de préstamos...');
        
        try {
            if (!this.calculator) {
                throw new Error('AccountingCalculator no disponible');
            }

            // Prueba pago de préstamo recibido
            const loanPaymentReceived = {
                id: 'test-payment-received-1',
                type: 'loan_payment_received',
                amount: 100000,
                description: 'Pago recibido de Juan',
                loanDetails: {
                    originalLoanId: 'original-loan-1',
                    paymentAmount: 100000,
                    remainingBalance: 400000
                }
            };

            const impactReceived = this.calculator.calculateTransactionImpact(loanPaymentReceived);
            
            // Verificar que aumenta efectivo y reduce activos
            if (impactReceived.cashFlow !== 100000 || impactReceived.assets !== -100000) {
                throw new Error('Pago recibido debe aumentar efectivo y reducir activos por cobrar');
            }
            
            // Prueba pago de préstamo realizado
            const loanPaymentMade = {
                id: 'test-payment-made-1',
                type: 'loan_payment_made',
                amount: 50000,
                description: 'Pago a banco',
                loanDetails: {
                    originalLoanId: 'original-loan-2',
                    paymentAmount: 50000,
                    remainingBalance: 250000
                }
            };

            const impactMade = this.calculator.calculateTransactionImpact(loanPaymentMade);
            
            // Verificar que reduce efectivo y pasivos
            if (impactMade.cashFlow !== -50000 || impactMade.liabilities !== -50000) {
                throw new Error('Pago realizado debe reducir efectivo y pasivos');
            }
            
            this.addTestResult('Cálculos de Pagos de Préstamos', true, 'Pagos de préstamos calculados correctamente');
            
        } catch (error) {
            this.addTestResult('Cálculos de Pagos de Préstamos', false, error.message);
        }
    }

    // 🔍 Prueba de conciliación de saldos
    async testBalanceReconciliation() {
        console.log('🧪 Probando conciliación de saldos...');
        
        try {
            // Verificar que las funciones de conciliación estén disponibles
            if (typeof window.renderBalanceReconciliation !== 'function') {
                throw new Error('Función renderBalanceReconciliation no disponible');
            }
            
            if (typeof window.detectDiscrepancies !== 'function') {
                throw new Error('Función detectDiscrepancies no disponible');
            }
            
            if (typeof window.createAdjustmentTransaction !== 'function') {
                throw new Error('Función createAdjustmentTransaction no disponible');
            }
            
            this.addTestResult('Conciliación de Saldos', true, 'Funciones de conciliación disponibles');
            
        } catch (error) {
            this.addTestResult('Conciliación de Saldos', false, error.message);
        }
    }

    // 🎨 Prueba de renderizado de UI
    async testUIRendering() {
        console.log('🧪 Probando renderizado de UI...');
        
        try {
            if (!this.uiUtils) {
                throw new Error('TransactionUIUtils no disponible');
            }

            // Probar formateo de transacciones
            const testTransaction = {
                type: 'transfer',
                amount: 150000,
                transferDetails: {
                    fromMethod: { displayName: 'Nequi' },
                    toMethod: { displayName: 'Davivienda' }
                }
            };

            const label = this.uiUtils.generateTransactionLabel(testTransaction);
            const amount = this.uiUtils.formatTransactionAmount(testTransaction);
            
            if (!label.includes('Transferencia') || !amount.includes('↔')) {
                throw new Error('Renderizado de transferencias incorrecto');
            }
            
            this.addTestResult('Renderizado de UI', true, 'UI renderizada correctamente');
            
        } catch (error) {
            this.addTestResult('Renderizado de UI', false, error.message);
        }
    }

    // 🧠 Prueba de integración con IA
    async testAIIntegration() {
        console.log('🧪 Probando integración con IA...');
        
        try {
            // Verificar que las funciones de análisis estén disponibles
            if (typeof window.getTransactionsForAnalysis !== 'function') {
                throw new Error('Función getTransactionsForAnalysis no disponible');
            }
            
            // Simular transacciones para análisis
            const mockTransactions = [
                { type: 'income', amount: 1000000 },
                { type: 'expense', amount: 500000 },
                { type: 'transfer', amount: 200000 }
            ];
            
            // Simular análisis (sin hacer llamada real a la IA)
            if (this.calculator) {
                const metrics = this.calculator.calculateCorrectedMetrics(mockTransactions);
                
                // Verificar que las transferencias no afecten los totales
                if (metrics.totalIncome !== 1000000 || metrics.totalExpense !== 500000) {
                    throw new Error('Métricas de IA incorrectas: transferencias afectan totales');
                }
            }
            
            this.addTestResult('Integración con IA', true, 'IA integrada correctamente con sistema contable');
            
        } catch (error) {
            this.addTestResult('Integración con IA', false, error.message);
        }
    }

    // 📊 Agregar resultado de prueba
    addTestResult(testName, passed, message) {
        this.testResults.push({
            name: testName,
            passed,
            message,
            timestamp: new Date().toISOString()
        });
        
        const status = passed ? '✅' : '❌';
        console.log(`${status} ${testName}: ${message}`);
    }

    // 📋 Mostrar resultados de pruebas
    displayTestResults() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log('\n🧪 RESULTADOS DE PRUEBAS DEL SISTEMA CONTABLE');
        console.log('='.repeat(50));
        console.log(`Total de pruebas: ${totalTests}`);
        console.log(`✅ Exitosas: ${passedTests}`);
        console.log(`❌ Fallidas: ${failedTests}`);
        console.log(`📊 Porcentaje de éxito: ${Math.round((passedTests / totalTests) * 100)}%`);
        
        if (failedTests > 0) {
            console.log('\n❌ PRUEBAS FALLIDAS:');
            this.testResults.filter(r => !r.passed).forEach(result => {
                console.log(`- ${result.name}: ${result.message}`);
            });
        }
        
        console.log('\n' + '='.repeat(50));
        
        // Mostrar en la UI si es posible
        if (typeof window.showSuccessMessage === 'function') {
            if (failedTests === 0) {
                window.showSuccessMessage(`🎉 Todas las pruebas pasaron exitosamente! (${passedTests}/${totalTests})`);
            } else {
                window.showErrorMessage(`⚠️ ${failedTests} pruebas fallaron de ${totalTests} total`);
            }
        }
    }
}

// 🚀 Función global para ejecutar pruebas
window.runAccountingSystemTests = async () => {
    const tester = new AccountingSystemTests();
    return await tester.runAllTests();
};

// 🧪 Auto-ejecutar pruebas en desarrollo
if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
    console.log('🧪 Modo desarrollo detectado - ejecutando pruebas automáticamente en 3 segundos...');
    setTimeout(() => {
        window.runAccountingSystemTests();
    }, 3000);
}

console.log('🧪 Sistema de pruebas contables cargado correctamente');
