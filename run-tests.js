// 🧪 Script para ejecutar tests desde la consola del navegador
// Ejecutar en la consola del navegador cuando la aplicación esté cargada

async function runTestsInConsole() {
    console.log('🧪 Iniciando ejecución de tests...');

    try {
        // 🧪 Activar explícitamente el modo de testing
        window.manualTestExecution = true;

        // 🧪 Habilitar modo de testing para hacer visible el elemento #app
        if (typeof window.enableTestingMode === 'function') {
            window.enableTestingMode();
            console.log('✅ Modo de testing habilitado');
        }

        // 💾 Inicializar sistemas necesarios para testing
        if (typeof window.initializeSystemsForTesting === 'function') {
            console.log('💾 Inicializando sistemas para testing...');
            await window.initializeSystemsForTesting();
            console.log('✅ Sistemas inicializados para testing');
        }

        // Verificar que el framework de testing esté disponible
        if (typeof TestingFramework === 'undefined') {
            console.error('❌ TestingFramework no está disponible');
            return;
        }

        if (typeof window.appTests === 'undefined') {
            console.error('❌ Los tests no están cargados');
            return;
        }

        // Crear y configurar el test runner
        const testRunner = new TestRunner();
        testRunner.initialize(window.appTests);

        // Ejecutar todos los tests
        console.log('🚀 Ejecutando todos los tests...');
        const results = await testRunner.runAllTests();
        
        // Mostrar resultados en la consola
        console.log('\n📊 RESULTADOS DE LOS TESTS:');
        console.log('='.repeat(50));
        console.log(`📋 Total: ${results.total}`);
        console.log(`✅ Pasaron: ${results.passed}`);
        console.log(`❌ Fallaron: ${results.failed}`);
        console.log(`⏭️ Omitidos: ${results.skipped}`);
        console.log(`📈 Tasa de éxito: ${((results.passed / results.total) * 100).toFixed(2)}%`);
        console.log(`⏱️ Duración: ${results.duration.toFixed(2)}ms`);
        
        // Mostrar errores si los hay
        if (results.errors.length > 0) {
            console.log('\n❌ ERRORES ENCONTRADOS:');
            results.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error.test}:`);
                console.log(`   ${error.error}`);
            });
        } else {
            console.log('\n🎉 ¡Todos los tests pasaron exitosamente!');
        }
        
        return results;
        
    } catch (error) {
        console.error('❌ Error ejecutando tests:', error);
        return null;
    }
}

// Función para verificar correcciones específicas
function verifyFixes() {
    console.log('🔧 Verificando correcciones específicas...');
    
    const results = {
        transactionStructure: false,
        aiClasses: false,
        currencyFormat: false
    };
    
    // Test 1: Estructura de transacciones
    try {
        const transactions = getTransactions();
        if (transactions.length > 0) {
            const transaction = transactions[0];
            results.transactionStructure = transaction.hasOwnProperty('date') &&
                                         transaction.hasOwnProperty('amount') &&
                                         transaction.hasOwnProperty('type') &&
                                         transaction.hasOwnProperty('description');
        } else {
            // Si no hay transacciones, crear una de prueba
            const testTransaction = {
                date: '2025-08-23',
                amount: 1000,
                type: 'expense',
                description: 'Test'
            };
            results.transactionStructure = testTransaction.hasOwnProperty('date');
        }
        console.log(`✅ Estructura de transacciones: ${results.transactionStructure ? 'CORRECTO' : 'INCORRECTO'}`);
    } catch (error) {
        console.log(`❌ Error verificando estructura de transacciones: ${error.message}`);
    }
    
    // Test 2: Clases de IA
    try {
        results.aiClasses = typeof AIMemorySystem === 'function' &&
                           typeof AILearningEngine === 'function' &&
                           typeof ProactiveInsightsEngine === 'function';
        console.log(`✅ Clases de IA disponibles: ${results.aiClasses ? 'CORRECTO' : 'INCORRECTO'}`);
        if (!results.aiClasses) {
            console.log(`   AIMemorySystem: ${typeof AIMemorySystem}`);
            console.log(`   AILearningEngine: ${typeof AILearningEngine}`);
            console.log(`   ProactiveInsightsEngine: ${typeof ProactiveInsightsEngine}`);
        }
    } catch (error) {
        console.log(`❌ Error verificando clases de IA: ${error.message}`);
    }
    
    // Test 3: Formato de moneda
    try {
        if (typeof formatCurrency === 'function') {
            const formatted = formatCurrency(1000);
            results.currencyFormat = formatted.includes('COP') &&
                                   !formatted.includes('EUR') &&
                                   !formatted.includes('MXN') &&
                                   !formatted.includes('USD');
            console.log(`✅ Formato de moneda: ${results.currencyFormat ? 'CORRECTO' : 'INCORRECTO'}`);
            console.log(`   Resultado: "${formatted}"`);
        } else {
            console.log(`❌ Función formatCurrency no disponible`);
        }
    } catch (error) {
        console.log(`❌ Error verificando formato de moneda: ${error.message}`);
    }
    
    // Resumen
    const totalCorrect = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;
    
    console.log('\n📊 RESUMEN DE CORRECCIONES:');
    console.log(`✅ Correcciones exitosas: ${totalCorrect}/${total}`);
    
    if (totalCorrect === total) {
        console.log('🎉 ¡Todas las correcciones funcionan correctamente!');
    } else {
        console.log('⚠️ Algunas correcciones necesitan revisión.');
    }
    
    return results;
}

// Función para ejecutar tests específicos
async function runSpecificTests(suiteNames = []) {
    console.log(`🎯 Ejecutando tests específicos: ${suiteNames.join(', ')}`);
    
    try {
        const testRunner = new TestRunner();
        testRunner.initialize(window.appTests);
        
        for (const suiteName of suiteNames) {
            console.log(`\n📋 Ejecutando suite: ${suiteName}`);
            await testRunner.runSuite(suiteName);
        }
        
    } catch (error) {
        console.error('❌ Error ejecutando tests específicos:', error);
    }
}

// Exportar funciones para uso en consola
window.runTestsInConsole = runTestsInConsole;
window.verifyFixes = verifyFixes;
window.runSpecificTests = runSpecificTests;

console.log('🧪 Script de tests cargado. Funciones disponibles:');
console.log('  - runTestsInConsole(): Ejecutar todos los tests');
console.log('  - verifyFixes(): Verificar correcciones específicas');
console.log('  - runSpecificTests([suiteNames]): Ejecutar tests específicos');
