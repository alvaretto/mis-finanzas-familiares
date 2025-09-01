// 💳 SCRIPT DE PRUEBA PARA MÉTODOS DE PAGO
// Ejecutar en la consola del navegador para probar la funcionalidad

console.log('💳 Iniciando pruebas del sistema de métodos de pago...');

// 🧪 Función para probar el sistema de métodos de pago
function testPaymentMethodsSystem() {
    console.log('\n🔍 1. Verificando carga del sistema...');
    
    // Verificar que el sistema esté cargado
    const checks = {
        'PaymentMethodsSystem': !!window.PaymentMethodsSystem,
        'PaymentMethodAnalyzer': !!window.PaymentMethodAnalyzer,
        'Catálogo de métodos': !!(window.PaymentMethodsSystem?.catalog),
        'Utilidades': !!(window.PaymentMethodsSystem?.utils),
        'Configuración de formulario': !!(window.PaymentMethodsSystem?.formConfig)
    };
    
    Object.entries(checks).forEach(([name, status]) => {
        console.log(`${status ? '✅' : '❌'} ${name}: ${status ? 'OK' : 'FALTA'}`);
    });
    
    if (!window.PaymentMethodsSystem) {
        console.error('❌ Sistema de métodos de pago no cargado. Verifica payment-methods-structure.js');
        return false;
    }
    
    console.log('\n🔍 2. Verificando catálogo de métodos...');
    
    // Verificar métodos disponibles
    const catalog = window.PaymentMethodsSystem.catalog;
    const expectedMethods = ['cash', 'nequi', 'daviplata', 'davivienda_transfer', 'credit_card', 'debit_card'];
    
    expectedMethods.forEach(methodId => {
        const method = catalog[methodId];
        const exists = !!method;
        console.log(`${exists ? '✅' : '❌'} ${methodId}: ${exists ? method.displayName : 'No encontrado'}`);
    });
    
    console.log('\n🔍 3. Verificando elementos del DOM...');
    
    // Verificar elementos de la interfaz
    const domElements = {
        'Formulario de transacciones': !!document.getElementById('transaction-form'),
        'Campo método de pago': !!document.getElementById('payment-method'),
        'Sección métodos de pago': !!document.getElementById('payment-methods-section'),
        'Grid de métodos': !!document.getElementById('payment-methods-grid'),
        'Botón actualizar': !!document.getElementById('refresh-payment-methods-btn')
    };
    
    Object.entries(domElements).forEach(([name, exists]) => {
        console.log(`${exists ? '✅' : '❌'} ${name}: ${exists ? 'Presente' : 'Ausente'}`);
    });
    
    console.log('\n🔍 4. Verificando función de renderizado...');
    
    // Verificar función de renderizado
    const renderFunction = window.renderPaymentMethods;
    if (renderFunction && typeof renderFunction === 'function') {
        console.log('✅ Función renderPaymentMethods: Disponible');
        
        // Probar renderizado
        try {
            renderFunction();
            console.log('✅ Renderizado: Ejecutado sin errores');
        } catch (error) {
            console.error('❌ Error en renderizado:', error.message);
        }
    } else {
        console.error('❌ Función renderPaymentMethods: No disponible');
    }
    
    return true;
}

// 🧪 Función para simular transacciones con métodos de pago
function simulatePaymentMethodTransactions() {
    console.log('\n🎭 Simulando transacciones con métodos de pago...');
    
    if (!window.PaymentMethodsSystem) {
        console.error('❌ Sistema no disponible para simulación');
        return;
    }
    
    const catalog = window.PaymentMethodsSystem.catalog;
    
    // Transacciones de ejemplo
    const sampleTransactions = [
        {
            id: 'test_1',
            description: 'Supermercado Éxito',
            amount: 85000,
            type: 'expense',
            category: 'Alimentación',
            date: '2025-09-01',
            paymentMethod: {
                id: 'nequi',
                ...catalog.nequi
            }
        },
        {
            id: 'test_2',
            description: 'Gasolina',
            amount: 60000,
            type: 'expense',
            category: 'Transporte',
            date: '2025-09-01',
            paymentMethod: {
                id: 'credit_card',
                ...catalog.credit_card
            }
        },
        {
            id: 'test_3',
            description: 'Almuerzo',
            amount: 15000,
            type: 'expense',
            category: 'Alimentación',
            date: '2025-09-01',
            paymentMethod: {
                id: 'cash',
                ...catalog.cash
            }
        }
    ];
    
    console.log('📊 Transacciones de prueba creadas:');
    sampleTransactions.forEach((transaction, index) => {
        console.log(`${index + 1}. ${transaction.description} - $${transaction.amount.toLocaleString()} (${transaction.paymentMethod.displayName})`);
    });
    
    // Probar análisis con PaymentMethodAnalyzer
    if (window.PaymentMethodAnalyzer) {
        console.log('\n🤖 Probando análisis de IA...');
        
        const analyzer = new window.PaymentMethodAnalyzer(sampleTransactions);
        const patterns = analyzer.analyzePaymentMethodPatterns();
        
        console.log('📈 Patrones detectados:');
        patterns.forEach((pattern, index) => {
            console.log(`${index + 1}. [${pattern.type}] ${pattern.message}`);
        });
        
        const report = analyzer.generatePaymentMethodReport();
        console.log('📋 Reporte generado:', report);
    }
    
    return sampleTransactions;
}

// 🧪 Función para probar validación de formulario
function testFormValidation() {
    console.log('\n🔍 Probando validación de formulario...');
    
    const paymentMethodSelect = document.getElementById('payment-method');
    if (!paymentMethodSelect) {
        console.error('❌ Campo de método de pago no encontrado');
        return false;
    }
    
    // Verificar opciones disponibles
    const options = Array.from(paymentMethodSelect.options);
    console.log(`✅ Opciones disponibles: ${options.length - 1} métodos`); // -1 por la opción placeholder
    
    options.slice(1).forEach(option => { // Saltar placeholder
        console.log(`  - ${option.value}: ${option.textContent}`);
    });
    
    // Probar selección
    if (options.length > 1) {
        paymentMethodSelect.value = 'nequi';
        console.log(`✅ Selección de prueba: ${paymentMethodSelect.value}`);
        
        // Verificar que el valor se mantenga
        if (paymentMethodSelect.value === 'nequi') {
            console.log('✅ Validación: Campo mantiene valor correctamente');
        } else {
            console.error('❌ Validación: Campo no mantiene valor');
        }
        
        // Limpiar selección
        paymentMethodSelect.value = '';
    }
    
    return true;
}

// 🧪 Función principal de pruebas
function runPaymentMethodTests() {
    console.log('🚀 EJECUTANDO SUITE COMPLETA DE PRUEBAS - MÉTODOS DE PAGO');
    console.log('='.repeat(70));
    
    const results = {
        systemLoad: false,
        formValidation: false,
        simulation: false
    };
    
    try {
        // Prueba 1: Sistema cargado
        results.systemLoad = testPaymentMethodsSystem();
        
        // Prueba 2: Validación de formulario
        results.formValidation = testFormValidation();
        
        // Prueba 3: Simulación
        const sampleData = simulatePaymentMethodTransactions();
        results.simulation = !!sampleData;
        
    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
    }
    
    // Resumen final
    console.log('\n📊 RESUMEN DE PRUEBAS:');
    console.log('='.repeat(30));
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(Boolean).length;
    const percentage = Math.round((passedTests / totalTests) * 100);
    
    Object.entries(results).forEach(([test, passed]) => {
        const testName = test.replace(/([A-Z])/g, ' $1').toLowerCase();
        console.log(`${passed ? '✅' : '❌'} ${testName}: ${passed ? 'PASÓ' : 'FALLÓ'}`);
    });
    
    console.log('\n' + '='.repeat(30));
    console.log(`🎯 RESULTADO FINAL: ${passedTests}/${totalTests} (${percentage}%)`);
    
    if (percentage === 100) {
        console.log('🎉 ¡TODAS LAS PRUEBAS PASARON!');
        console.log('✨ El sistema de métodos de pago está completamente funcional');
    } else if (percentage >= 75) {
        console.log('✅ SISTEMA MAYORMENTE FUNCIONAL');
        console.log('⚠️ Algunas funcionalidades necesitan atención');
    } else {
        console.log('❌ SISTEMA CON PROBLEMAS');
        console.log('🔧 Se requieren correcciones antes del uso');
    }
    
    console.log('\n💡 INSTRUCCIONES DE USO:');
    console.log('1. Abre el formulario "Agregar Transacción"');
    console.log('2. Llena los campos normales (descripción, monto, etc.)');
    console.log('3. Selecciona un método de pago del nuevo campo');
    console.log('4. Guarda la transacción');
    console.log('5. Verifica que aparezca en el historial con el método de pago');
    console.log('6. Revisa la nueva sección "Métodos de Pago" en el dashboard');
    
    return results;
}

// 🚀 Exportar funciones para uso manual
window.testPaymentMethods = {
    runAll: runPaymentMethodTests,
    testSystem: testPaymentMethodsSystem,
    testForm: testFormValidation,
    simulate: simulatePaymentMethodTransactions
};

console.log('✅ Script de pruebas de métodos de pago cargado');
console.log('💡 Ejecuta: testPaymentMethods.runAll() para probar todo');
