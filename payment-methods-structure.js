// 💳 ESTRUCTURA DE DATOS PARA MÉTODOS DE PAGO
// Diseño técnico para implementar sistema de métodos de pago

// 🏗️ ESTRUCTURA DE TRANSACCIÓN EXPANDIDA
const expandedTransactionStructure = {
    // Campos existentes
    id: "transaction_id",
    description: "Supermercado Éxito",
    amount: 85000,
    type: "expense", // income | expense
    category: "Alimentación",
    subcategory: "Supermercado",
    subsubcategory: "Productos básicos",
    date: "2025-09-01",
    specificDetails: {
        store: "Éxito Calle 80",
        items: "Productos básicos del hogar"
    },
    
    // 🆕 NUEVO: Información del método de pago
    paymentMethod: {
        type: "digital_wallet", // cash, bank_transfer, credit_card, debit_card, digital_wallet
        provider: "nequi", // efectivo, davivienda, bancolombia, nequi, daviplata, etc.
        displayName: "Nequi", // Nombre para mostrar en UI
        accountLast4: "1234", // Últimos 4 dígitos para identificación
        icon: "smartphone", // Icono Lucide para UI
        color: "#FF6B35" // Color representativo del método
    },
    
    // Metadatos existentes
    userId: "user_uid",
    timestamp: "2025-09-01T10:30:00Z"
};

// 🏦 CATÁLOGO DE MÉTODOS DE PAGO COLOMBIANOS
const paymentMethodsCatalog = {
    // 💵 Efectivo
    cash: {
        type: "cash",
        provider: "efectivo",
        displayName: "Efectivo",
        icon: "banknote",
        color: "#10B981",
        description: "Dinero en efectivo",
        requiresAccount: false
    },
    
    // 🏦 Transferencias bancarias
    davivienda_transfer: {
        type: "bank_transfer",
        provider: "davivienda",
        displayName: "Transferencia Davivienda",
        icon: "building-2",
        color: "#DC2626",
        description: "Transferencia desde cuenta Davivienda",
        requiresAccount: true
    },
    
    bancolombia_transfer: {
        type: "bank_transfer",
        provider: "bancolombia",
        displayName: "Transferencia Bancolombia",
        icon: "building-2",
        color: "#FBBF24",
        description: "Transferencia desde cuenta Bancolombia",
        requiresAccount: true
    },
    
    // 💳 Tarjetas de crédito
    credit_card: {
        type: "credit_card",
        provider: "credit_card",
        displayName: "Tarjeta de Crédito",
        icon: "credit-card",
        color: "#8B5CF6",
        description: "Tarjeta de crédito (cualquier banco)",
        requiresAccount: true
    },
    
    // 💳 Tarjetas débito
    debit_card: {
        type: "debit_card",
        provider: "debit_card",
        displayName: "Tarjeta Débito",
        icon: "credit-card",
        color: "#06B6D4",
        description: "Tarjeta débito (cualquier banco)",
        requiresAccount: true
    },
    
    // 📱 Billeteras digitales
    nequi: {
        type: "digital_wallet",
        provider: "nequi",
        displayName: "Nequi",
        icon: "smartphone",
        color: "#FF6B35",
        description: "Billetera digital Nequi",
        requiresAccount: true
    },
    
    daviplata: {
        type: "digital_wallet",
        provider: "daviplata",
        displayName: "DaviPlata",
        icon: "smartphone",
        color: "#DC2626",
        description: "Billetera digital DaviPlata",
        requiresAccount: true
    },
    
    // 🔄 Otros métodos
    other: {
        type: "other",
        provider: "other",
        displayName: "Otro Método",
        icon: "more-horizontal",
        color: "#6B7280",
        description: "Otro método de pago no listado",
        requiresAccount: false
    }
};

// 📊 ESTRUCTURA PARA DASHBOARD DE SALDOS
const paymentMethodBalance = {
    methodId: "nequi", // Referencia al catálogo
    currentBalance: 150000, // Saldo actual
    lastUpdated: "2025-09-01T10:30:00Z",
    transactions: [
        {
            transactionId: "trans_123",
            amount: -85000, // Negativo para gastos, positivo para ingresos
            balanceAfter: 150000,
            date: "2025-09-01T10:30:00Z"
        }
    ],
    monthlyStats: {
        totalIncome: 500000,
        totalExpenses: 350000,
        transactionCount: 15,
        avgTransactionAmount: 23333
    }
};

// 🎯 ESTRUCTURA PARA ANÁLISIS DE IA
const paymentMethodAnalytics = {
    userId: "user_uid",
    period: "2025-09", // Año-mes
    methodAnalysis: {
        nequi: {
            totalSpent: 350000,
            transactionCount: 15,
            avgAmount: 23333,
            topCategories: [
                { category: "Alimentación", amount: 150000, percentage: 42.8 },
                { category: "Transporte", amount: 100000, percentage: 28.6 },
                { category: "Entretenimiento", amount: 100000, percentage: 28.6 }
            ],
            patterns: [
                "Usas Nequi principalmente para gastos pequeños y medianos",
                "42% de tus gastos en Nequi son para alimentación",
                "Promedio de transacción: $23,333"
            ]
        },
        efectivo: {
            totalSpent: 200000,
            transactionCount: 8,
            avgAmount: 25000,
            topCategories: [
                { category: "Transporte", amount: 120000, percentage: 60 },
                { category: "Alimentación", amount: 80000, percentage: 40 }
            ],
            patterns: [
                "Prefieres efectivo para transporte público",
                "Gastos en efectivo son más pequeños en promedio"
            ]
        }
    },
    insights: [
        "Nequi es tu método preferido para compras en supermercados",
        "Usas efectivo principalmente para transporte",
        "Podrías ahorrar comisiones usando más transferencias bancarias"
    ]
};

// 🔧 FUNCIONES DE UTILIDAD
const paymentMethodUtils = {
    // Obtener método por ID
    getMethodById: (methodId) => paymentMethodsCatalog[methodId],
    
    // Obtener métodos por tipo
    getMethodsByType: (type) => {
        return Object.entries(paymentMethodsCatalog)
            .filter(([_, method]) => method.type === type)
            .map(([id, method]) => ({ id, ...method }));
    },
    
    // Formatear para UI
    formatForUI: (methodId) => {
        const method = paymentMethodsCatalog[methodId];
        return {
            id: methodId,
            label: method.displayName,
            icon: method.icon,
            color: method.color,
            description: method.description
        };
    },
    
    // Validar método de pago
    validatePaymentMethod: (methodData) => {
        const { type, provider } = methodData;
        const method = paymentMethodsCatalog[provider];
        
        return {
            isValid: !!method && method.type === type,
            method: method || null,
            errors: !method ? ['Método de pago no válido'] : []
        };
    }
};

// 📱 CONFIGURACIÓN PARA FORMULARIO UI
const paymentMethodFormConfig = {
    fieldName: "paymentMethod",
    required: true,
    label: "Método de Pago",
    placeholder: "¿Cómo pagaste?",
    helpText: "Selecciona el método que usaste para esta transacción",
    
    // Agrupación para UI
    groups: [
        {
            label: "💵 Efectivo",
            methods: ["cash"]
        },
        {
            label: "🏦 Transferencias Bancarias",
            methods: ["davivienda_transfer", "bancolombia_transfer"]
        },
        {
            label: "💳 Tarjetas",
            methods: ["credit_card", "debit_card"]
        },
        {
            label: "📱 Billeteras Digitales",
            methods: ["nequi", "daviplata"]
        },
        {
            label: "🔄 Otros",
            methods: ["other"]
        }
    ]
};

// 🚀 EXPORTAR PARA USO EN LA APLICACIÓN
if (typeof window !== 'undefined') {
    window.PaymentMethodsSystem = {
        catalog: paymentMethodsCatalog,
        utils: paymentMethodUtils,
        formConfig: paymentMethodFormConfig,
        expandedTransactionStructure,
        paymentMethodBalance,
        paymentMethodAnalytics
    };
    
    console.log('💳 Sistema de Métodos de Pago cargado correctamente');
}

// Para Node.js (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        paymentMethodsCatalog,
        paymentMethodUtils,
        paymentMethodFormConfig,
        expandedTransactionStructure,
        paymentMethodBalance,
        paymentMethodAnalytics
    };
}
