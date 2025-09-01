// 🔍 SCRIPT DE VERIFICACIÓN DEL ENTORNO DE DESARROLLO
// Ejecutar en la consola del navegador para verificar que todo funciona

console.log('🚀 Iniciando verificación del entorno de desarrollo...');

// 1. Verificar configuración básica
function verificarConfiguracion() {
    console.log('\n📋 1. Verificando configuración básica...');
    
    const checks = {
        'Firebase Config': !!window.firebaseConfig,
        'APP Config': !!window.APP_CONFIG,
        'Gemini API Key': !!window.GEMINI_API_KEY,
        'Firebase SDK': typeof firebase !== 'undefined',
        'Chart.js': typeof Chart !== 'undefined'
    };
    
    Object.entries(checks).forEach(([name, status]) => {
        console.log(`${status ? '✅' : '❌'} ${name}: ${status ? 'OK' : 'FALTA'}`);
    });
    
    return Object.values(checks).every(Boolean);
}

// 2. Verificar sistemas de IA
function verificarSistemasIA() {
    console.log('\n🤖 2. Verificando sistemas de IA...');
    
    const aiSystems = {
        'AI Memory System': typeof AIMemorySystem !== 'undefined',
        'AI Learning Engine': typeof AILearningEngine !== 'undefined',
        'Proactive Insights Engine': typeof ProactiveInsightsEngine !== 'undefined',
        'Predictive Analytics Engine': typeof PredictiveAnalyticsEngine !== 'undefined'
    };
    
    Object.entries(aiSystems).forEach(([name, status]) => {
        console.log(`${status ? '✅' : '❌'} ${name}: ${status ? 'Disponible' : 'No disponible'}`);
    });
    
    return Object.values(aiSystems).every(Boolean);
}

// 3. Verificar sistemas de backup
function verificarSistemasBackup() {
    console.log('\n💾 3. Verificando sistemas de backup...');
    
    const backupSystems = {
        'Automatic Backup System': typeof AutomaticBackupSystem !== 'undefined',
        'Multi Export System': typeof MultiExportSystem !== 'undefined',
        'Backup Management UI': typeof BackupManagementUI !== 'undefined'
    };
    
    Object.entries(backupSystems).forEach(([name, status]) => {
        console.log(`${status ? '✅' : '❌'} ${name}: ${status ? 'Disponible' : 'No disponible'}`);
    });
    
    return Object.values(backupSystems).every(Boolean);
}

// 4. Verificar optimizadores
function verificarOptimizadores() {
    console.log('\n🚀 4. Verificando optimizadores...');
    
    const optimizers = {
        'Performance Optimizer': typeof PerformanceOptimizer !== 'undefined',
        'Firebase Query Optimizer': typeof FirebaseQueryOptimizer !== 'undefined',
        'Mobile Optimizations': typeof MobileOptimizations !== 'undefined'
    };
    
    Object.entries(optimizers).forEach(([name, status]) => {
        console.log(`${status ? '✅' : '❌'} ${name}: ${status ? 'Disponible' : 'No disponible'}`);
    });
    
    return Object.values(optimizers).every(Boolean);
}

// 5. Verificar sistema de testing
function verificarSistemaTesting() {
    console.log('\n🧪 5. Verificando sistema de testing...');
    
    const testingSystems = {
        'Testing Framework': typeof TestingFramework !== 'undefined',
        'Assertions': typeof expect !== 'undefined',
        'Test Runner': typeof TestRunner !== 'undefined',
        'Test UI': typeof TestingUI !== 'undefined',
        'App Tests': !!window.appTests
    };
    
    Object.entries(testingSystems).forEach(([name, status]) => {
        console.log(`${status ? '✅' : '❌'} ${name}: ${status ? 'Disponible' : 'No disponible'}`);
    });
    
    return Object.values(testingSystems).every(Boolean);
}

// 6. Verificar conectividad Firebase
async function verificarFirebase() {
    console.log('\n🔥 6. Verificando conectividad Firebase...');
    
    try {
        if (typeof firebase === 'undefined') {
            console.log('❌ Firebase SDK no está cargado');
            return false;
        }
        
        // Verificar que Firebase esté inicializado
        const app = firebase.apps.length > 0 ? firebase.apps[0] : null;
        if (!app) {
            console.log('❌ Firebase no está inicializado');
            return false;
        }
        
        console.log('✅ Firebase SDK cargado e inicializado');
        console.log('✅ Proyecto:', app.options.projectId);
        console.log('✅ Auth Domain:', app.options.authDomain);
        
        return true;
    } catch (error) {
        console.log('❌ Error verificando Firebase:', error.message);
        return false;
    }
}

// 7. Función principal de verificación
async function verificarEntornoCompleto() {
    console.log('🔍 VERIFICACIÓN COMPLETA DEL ENTORNO DE DESARROLLO');
    console.log('='.repeat(60));
    
    const resultados = {
        configuracion: verificarConfiguracion(),
        sistemasIA: verificarSistemasIA(),
        sistemasBackup: verificarSistemasBackup(),
        optimizadores: verificarOptimizadores(),
        sistemaTesting: verificarSistemaTesting(),
        firebase: await verificarFirebase()
    };
    
    console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
    console.log('='.repeat(30));
    
    const total = Object.keys(resultados).length;
    const exitosos = Object.values(resultados).filter(Boolean).length;
    const porcentaje = Math.round((exitosos / total) * 100);
    
    Object.entries(resultados).forEach(([categoria, status]) => {
        const nombre = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        console.log(`${status ? '✅' : '❌'} ${nombre}: ${status ? 'OK' : 'FALLA'}`);
    });
    
    console.log('\n' + '='.repeat(30));
    console.log(`📈 RESULTADO FINAL: ${exitosos}/${total} (${porcentaje}%)`);
    
    if (porcentaje >= 90) {
        console.log('🎉 ¡ENTORNO DE DESARROLLO LISTO!');
        console.log('✨ Todos los sistemas están funcionando correctamente');
    } else if (porcentaje >= 70) {
        console.log('⚠️ Entorno parcialmente funcional');
        console.log('🔧 Algunos componentes necesitan atención');
    } else {
        console.log('❌ Entorno con problemas significativos');
        console.log('🚨 Se requiere configuración adicional');
    }
    
    return resultados;
}

// Exportar funciones para uso manual
window.verificarEntorno = {
    completo: verificarEntornoCompleto,
    configuracion: verificarConfiguracion,
    sistemasIA: verificarSistemasIA,
    sistemasBackup: verificarSistemasBackup,
    optimizadores: verificarOptimizadores,
    sistemaTesting: verificarSistemaTesting,
    firebase: verificarFirebase
};

console.log('✅ Script de verificación cargado');
console.log('💡 Ejecuta: verificarEntorno.completo() para verificar todo');
