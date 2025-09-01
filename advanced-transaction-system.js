// 🏦 SISTEMA AVANZADO DE TRANSACCIONES CONTABLES
// Implementación completa de funcionalidades contables para finanzas familiares

// 📊 TIPOS DE TRANSACCIONES EXPANDIDOS
const TRANSACTION_TYPES = {
    // Tipos básicos existentes
    income: {
        id: 'income',
        name: 'Ingreso',
        icon: 'trending-up',
        color: '#10B981',
        description: 'Dinero que entra',
        affectsBalance: true,
        affectsIncome: true,
        affectsExpense: false
    },
    expense: {
        id: 'expense', 
        name: 'Gasto',
        icon: 'trending-down',
        color: '#EF4444',
        description: 'Dinero que sale',
        affectsBalance: true,
        affectsIncome: false,
        affectsExpense: true
    },
    
    // NUEVOS TIPOS CONTABLES
    transfer: {
        id: 'transfer',
        name: 'Transferencia',
        icon: 'arrow-left-right',
        color: '#6366F1',
        description: 'Movimiento entre cuentas propias',
        affectsBalance: false, // ❌ NO afecta totales de ingresos/gastos
        affectsIncome: false,
        affectsExpense: false,
        requiresTwoMethods: true
    },
    loan_given: {
        id: 'loan_given',
        name: 'Préstamo Otorgado',
        icon: 'hand-coins',
        color: '#F59E0B',
        description: 'Dinero prestado a otros',
        affectsBalance: false, // Es intercambio: efectivo → cuenta por cobrar
        affectsIncome: false,
        affectsExpense: false,
        createsAsset: true, // Crea activo (cuenta por cobrar)
        requiresBorrower: true
    },
    loan_received: {
        id: 'loan_received',
        name: 'Préstamo Recibido',
        icon: 'piggy-bank',
        color: '#8B5CF6',
        description: 'Dinero recibido en préstamo',
        affectsBalance: true, // Aumenta efectivo disponible
        affectsIncome: false, // No es ingreso, es deuda
        affectsExpense: false,
        createsLiability: true, // Crea pasivo (cuenta por pagar)
        requiresLender: true
    },
    loan_payment_received: {
        id: 'loan_payment_received',
        name: 'Pago de Préstamo Recibido',
        icon: 'coins',
        color: '#059669',
        description: 'Pago recibido de préstamo otorgado',
        affectsBalance: true, // Aumenta efectivo
        affectsIncome: false, // No es ingreso nuevo, es recuperación
        affectsExpense: false,
        reducesAsset: true, // Reduce cuenta por cobrar
        requiresLoanReference: true
    },
    loan_payment_made: {
        id: 'loan_payment_made',
        name: 'Pago de Préstamo Realizado',
        icon: 'credit-card',
        color: '#DC2626',
        description: 'Pago realizado de préstamo recibido',
        affectsBalance: true, // Reduce efectivo disponible
        affectsIncome: false,
        affectsExpense: false, // No es gasto, es pago de deuda
        reducesLiability: true, // Reduce cuenta por pagar
        requiresLoanReference: true
    }
};

// 🏗️ ESTRUCTURA DE TRANSACCIÓN EXPANDIDA
const advancedTransactionStructure = {
    // Campos básicos existentes
    id: "transaction_id",
    description: "Descripción de la transacción",
    amount: 0,
    type: "income", // Uno de los tipos de TRANSACTION_TYPES
    category: "Categoría",
    subcategory: "Subcategoría",
    date: "2025-09-01",
    paymentMethod: {
        id: "nequi",
        displayName: "Nequi",
        // ... resto de campos del método de pago
    },
    
    // 🆕 CAMPOS PARA TRANSFERENCIAS
    transferDetails: {
        fromMethod: {
            id: "davivienda_transfer",
            displayName: "Davivienda"
        },
        toMethod: {
            id: "nequi",
            displayName: "Nequi"
        },
        transferType: "internal", // internal, external
        fees: 0 // Comisiones de transferencia
    },
    
    // 🆕 CAMPOS PARA PRÉSTAMOS
    loanDetails: {
        // Para préstamos otorgados
        borrower: {
            name: "Juan Pérez",
            relationship: "Hermano",
            contact: "3001234567",
            identification: "12345678" // Opcional
        },
        // Para préstamos recibidos
        lender: {
            name: "Banco Davivienda",
            type: "bank", // bank, person, institution
            contact: "018000123456",
            accountNumber: "****1234"
        },
        terms: {
            principalAmount: 500000, // Monto principal
            interestRate: 0, // Tasa de interés anual (0% para familiares)
            dueDate: "2025-12-31",
            installments: 1, // Número de cuotas
            installmentAmount: 500000, // Valor de cada cuota
            paymentFrequency: "monthly" // monthly, biweekly, weekly, once
        },
        status: "active", // active, paid, overdue, cancelled
        balance: 500000, // Saldo pendiente
        originalLoanId: null // Para pagos de préstamos
    },
    
    // Metadatos existentes
    userId: "user_uid",
    timestamp: "2025-09-01T10:30:00Z",
    createdAt: "timestamp",
    updatedAt: "timestamp"
};

// 🧮 CALCULADORA CONTABLE
class AccountingCalculator {
    constructor() {
        this.transactionTypes = TRANSACTION_TYPES;
    }

    // 📊 Calcular impacto de transacción en balances
    calculateTransactionImpact(transaction) {
        const type = this.transactionTypes[transaction.type];
        if (!type) {
            throw new Error(`Tipo de transacción no válido: ${transaction.type}`);
        }

        const impact = {
            cashFlow: 0, // Impacto en flujo de caja
            income: 0,   // Impacto en ingresos totales
            expense: 0,  // Impacto en gastos totales
            assets: 0,   // Impacto en activos
            liabilities: 0, // Impacto en pasivos
            paymentMethods: {} // Impacto por método de pago
        };

        // Calcular impacto según tipo de transacción
        switch (transaction.type) {
            case 'income':
                impact.cashFlow = transaction.amount;
                impact.income = transaction.amount;
                impact.paymentMethods[transaction.paymentMethod.id] = transaction.amount;
                break;

            case 'expense':
                impact.cashFlow = -transaction.amount;
                impact.expense = transaction.amount;
                impact.paymentMethods[transaction.paymentMethod.id] = -transaction.amount;
                break;

            case 'transfer':
                // Las transferencias no afectan el flujo de caja total
                impact.cashFlow = 0;
                impact.income = 0;
                impact.expense = 0;
                // Pero sí afectan los saldos por método
                if (transaction.transferDetails) {
                    impact.paymentMethods[transaction.transferDetails.fromMethod.id] = -transaction.amount;
                    impact.paymentMethods[transaction.transferDetails.toMethod.id] = transaction.amount;
                }
                break;

            case 'loan_given':
                // Prestar dinero: reduce efectivo, aumenta cuentas por cobrar
                impact.cashFlow = -transaction.amount; // Sale efectivo
                impact.assets = transaction.amount; // Aumenta activos (cuenta por cobrar)
                impact.paymentMethods[transaction.paymentMethod.id] = -transaction.amount;
                break;

            case 'loan_received':
                // Recibir préstamo: aumenta efectivo, aumenta deudas
                impact.cashFlow = transaction.amount; // Entra efectivo
                impact.liabilities = transaction.amount; // Aumenta pasivos
                impact.paymentMethods[transaction.paymentMethod.id] = transaction.amount;
                break;

            case 'loan_payment_received':
                // Recibir pago de préstamo: aumenta efectivo, reduce cuentas por cobrar
                impact.cashFlow = transaction.amount;
                impact.assets = -transaction.amount; // Reduce activos por cobrar
                impact.paymentMethods[transaction.paymentMethod.id] = transaction.amount;
                break;

            case 'loan_payment_made':
                // Pagar préstamo: reduce efectivo, reduce deudas
                impact.cashFlow = -transaction.amount;
                impact.liabilities = -transaction.amount; // Reduce pasivos
                impact.paymentMethods[transaction.paymentMethod.id] = -transaction.amount;
                break;
        }

        return impact;
    }

    // 📈 Calcular métricas financieras corregidas
    calculateCorrectedMetrics(transactions) {
        let totalIncome = 0;
        let totalExpense = 0;
        let totalAssets = 0;
        let totalLiabilities = 0;
        let paymentMethodBalances = {};

        transactions.forEach(transaction => {
            const impact = this.calculateTransactionImpact(transaction);
            
            totalIncome += impact.income;
            totalExpense += impact.expense;
            totalAssets += impact.assets;
            totalLiabilities += impact.liabilities;

            // Actualizar balances por método de pago
            Object.entries(impact.paymentMethods).forEach(([methodId, amount]) => {
                if (!paymentMethodBalances[methodId]) {
                    paymentMethodBalances[methodId] = 0;
                }
                paymentMethodBalances[methodId] += amount;
            });
        });

        return {
            totalIncome,
            totalExpense,
            netCashFlow: totalIncome - totalExpense,
            totalAssets,
            totalLiabilities,
            netWorth: totalAssets - totalLiabilities,
            paymentMethodBalances
        };
    }

    // 🔍 Filtrar transacciones por tipo
    filterTransactionsByType(transactions, types) {
        if (typeof types === 'string') {
            types = [types];
        }
        return transactions.filter(t => types.includes(t.type));
    }

    // 📊 Obtener resumen por tipo de transacción
    getTransactionSummaryByType(transactions) {
        const summary = {};
        
        Object.keys(this.transactionTypes).forEach(type => {
            const typeTransactions = this.filterTransactionsByType(transactions, type);
            summary[type] = {
                count: typeTransactions.length,
                totalAmount: typeTransactions.reduce((sum, t) => sum + t.amount, 0),
                transactions: typeTransactions
            };
        });

        return summary;
    }
}

// 🎨 UTILIDADES DE UI PARA TRANSACCIONES
class TransactionUIUtils {
    constructor() {
        this.transactionTypes = TRANSACTION_TYPES;
    }

    // 🎨 Obtener configuración visual para tipo de transacción
    getTypeConfig(type) {
        return this.transactionTypes[type] || this.transactionTypes.expense;
    }

    // 🏷️ Generar etiqueta visual para transacción
    generateTransactionLabel(transaction) {
        const config = this.getTypeConfig(transaction.type);
        
        let label = `
            <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" 
                  style="background-color: ${config.color}20; color: ${config.color}">
                <i data-lucide="${config.icon}" class="w-3 h-3"></i>
                ${config.name}
            </span>
        `;

        // Agregar información específica según el tipo
        if (transaction.type === 'transfer' && transaction.transferDetails) {
            label += `
                <span class="text-xs text-gray-500 ml-2">
                    ${transaction.transferDetails.fromMethod.displayName} → ${transaction.transferDetails.toMethod.displayName}
                </span>
            `;
        }

        if (transaction.type === 'loan_given' && transaction.loanDetails?.borrower) {
            label += `
                <span class="text-xs text-gray-500 ml-2">
                    a ${transaction.loanDetails.borrower.name}
                </span>
            `;
        }

        if (transaction.type === 'loan_received' && transaction.loanDetails?.lender) {
            label += `
                <span class="text-xs text-gray-500 ml-2">
                    de ${transaction.loanDetails.lender.name}
                </span>
            `;
        }

        return label;
    }

    // 💰 Formatear monto según tipo de transacción
    formatTransactionAmount(transaction) {
        const config = this.getTypeConfig(transaction.type);
        const amount = transaction.amount;
        
        let prefix = '';
        let className = 'font-semibold';

        switch (transaction.type) {
            case 'income':
            case 'loan_received':
            case 'loan_payment_received':
                prefix = '+';
                className += ' text-green-500';
                break;
            case 'expense':
            case 'loan_given':
            case 'loan_payment_made':
                prefix = '-';
                className += ' text-red-500';
                break;
            case 'transfer':
                prefix = '↔';
                className += ' text-indigo-500';
                break;
        }

        return `<span class="${className}">${prefix}${this.formatCurrency(amount)}</span>`;
    }

    // 💱 Formatear moneda
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
}

// 🚀 Exportar para uso global
if (typeof window !== 'undefined') {
    window.TRANSACTION_TYPES = TRANSACTION_TYPES;
    window.AccountingCalculator = AccountingCalculator;
    window.TransactionUIUtils = TransactionUIUtils;
    window.advancedTransactionStructure = advancedTransactionStructure;
    
    console.log('🏦 Sistema Avanzado de Transacciones Contables cargado correctamente');
}

// Para Node.js (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TRANSACTION_TYPES,
        AccountingCalculator,
        TransactionUIUtils,
        advancedTransactionStructure
    };
}
