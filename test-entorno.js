#!/usr/bin/env node

// 🧪 Script para verificar el entorno de desarrollo
// Ejecuta verificaciones básicas sin necesidad del navegador

const fs = require('fs');
const path = require('path');

console.log('🧪 VERIFICACIÓN DEL ENTORNO DE DESARROLLO');
console.log('=' .repeat(50));

// 1. Verificar archivos esenciales
function verificarArchivos() {
    console.log('\n📁 1. Verificando archivos esenciales...');
    
    const archivosEsenciales = [
        'index.html',
        'secure-config.js',
        'ai-memory-system.js',
        'ai-learning-engine.js',
        'proactive-insights-engine.js',
        'predictive-analytics-engine.js',
        'predictive-dashboard.js',
        'automatic-backup-system.js',
        'multi-export-system.js',
        'backup-management-ui.js',
        'performance-optimizer.js',
        'firebase-query-optimizer.js',
        'mobile-optimizations.js',
        'testing-framework.js',
        'assertions.js',
        'test-runner.js',
        'test-ui.js',
        'app-tests.js',
        'run-tests.js'
    ];
    
    let archivosEncontrados = 0;
    
    archivosEsenciales.forEach(archivo => {
        const existe = fs.existsSync(path.join(__dirname, archivo));
        console.log(`${existe ? '✅' : '❌'} ${archivo}`);
        if (existe) archivosEncontrados++;
    });
    
    const porcentaje = Math.round((archivosEncontrados / archivosEsenciales.length) * 100);
    console.log(`\n📊 Archivos encontrados: ${archivosEncontrados}/${archivosEsenciales.length} (${porcentaje}%)`);
    
    return porcentaje >= 95;
}

// 2. Verificar configuración
function verificarConfiguracion() {
    console.log('\n🔧 2. Verificando configuración...');
    
    try {
        const configContent = fs.readFileSync(path.join(__dirname, 'secure-config.js'), 'utf8');
        
        const checks = {
            'GEMINI_API_KEY': configContent.includes('GEMINI_API_KEY:'),
            'firebaseConfig': configContent.includes('firebaseConfig:'),
            'apiKey': configContent.includes('apiKey:'),
            'projectId': configContent.includes('projectId:'),
            'authDomain': configContent.includes('authDomain:')
        };
        
        Object.entries(checks).forEach(([key, found]) => {
            console.log(`${found ? '✅' : '❌'} ${key}: ${found ? 'Configurado' : 'Falta'}`);
        });
        
        const configurados = Object.values(checks).filter(Boolean).length;
        const total = Object.keys(checks).length;
        console.log(`\n📊 Configuración: ${configurados}/${total} elementos`);
        
        return configurados === total;
        
    } catch (error) {
        console.log('❌ Error leyendo configuración:', error.message);
        return false;
    }
}

// 3. Verificar estructura HTML
function verificarHTML() {
    console.log('\n🌐 3. Verificando estructura HTML...');
    
    try {
        const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
        
        const checks = {
            'Firebase SDK': htmlContent.includes('firebase-app-compat.js'),
            'Firebase Auth': htmlContent.includes('firebase-auth-compat.js'),
            'Firebase Firestore': htmlContent.includes('firebase-firestore-compat.js'),
            'Chart.js': htmlContent.includes('chart.js'),
            'Tailwind CSS': htmlContent.includes('tailwindcss.com'),
            'Lucide Icons': htmlContent.includes('lucide'),
            'Secure Config': htmlContent.includes('secure-config.js'),
            'App Element': htmlContent.includes('id="app"'),
            'Auth Screen': htmlContent.includes('id="auth-screen"')
        };
        
        Object.entries(checks).forEach(([key, found]) => {
            console.log(`${found ? '✅' : '❌'} ${key}: ${found ? 'Incluido' : 'Falta'}`);
        });
        
        const incluidos = Object.values(checks).filter(Boolean).length;
        const total = Object.keys(checks).length;
        console.log(`\n📊 Estructura HTML: ${incluidos}/${total} elementos`);
        
        return incluidos >= total * 0.9; // 90% o más
        
    } catch (error) {
        console.log('❌ Error leyendo HTML:', error.message);
        return false;
    }
}

// 4. Verificar tamaños de archivos
function verificarTamanos() {
    console.log('\n📏 4. Verificando tamaños de archivos...');
    
    const archivosImportantes = [
        'index.html',
        'secure-config.js',
        'ai-learning-engine.js',
        'predictive-analytics-engine.js',
        'automatic-backup-system.js'
    ];
    
    let archivosValidos = 0;
    
    archivosImportantes.forEach(archivo => {
        try {
            const stats = fs.statSync(path.join(__dirname, archivo));
            const tamanoKB = Math.round(stats.size / 1024);
            const esValido = stats.size > 1000; // Al menos 1KB
            
            console.log(`${esValido ? '✅' : '❌'} ${archivo}: ${tamanoKB}KB`);
            if (esValido) archivosValidos++;
            
        } catch (error) {
            console.log(`❌ ${archivo}: No encontrado`);
        }
    });
    
    console.log(`\n📊 Archivos válidos: ${archivosValidos}/${archivosImportantes.length}`);
    return archivosValidos === archivosImportantes.length;
}

// 5. Función principal
async function verificarEntorno() {
    const resultados = {
        archivos: verificarArchivos(),
        configuracion: verificarConfiguracion(),
        html: verificarHTML(),
        tamanos: verificarTamanos()
    };
    
    console.log('\n📊 RESUMEN FINAL:');
    console.log('=' .repeat(30));
    
    const categorias = Object.keys(resultados);
    const exitosos = Object.values(resultados).filter(Boolean).length;
    const porcentaje = Math.round((exitosos / categorias.length) * 100);
    
    Object.entries(resultados).forEach(([categoria, status]) => {
        const nombre = categoria.charAt(0).toUpperCase() + categoria.slice(1);
        console.log(`${status ? '✅' : '❌'} ${nombre}: ${status ? 'OK' : 'FALLA'}`);
    });
    
    console.log('\n' + '=' .repeat(30));
    console.log(`🎯 RESULTADO: ${exitosos}/${categorias.length} (${porcentaje}%)`);
    
    if (porcentaje === 100) {
        console.log('\n🎉 ¡ENTORNO PERFECTO!');
        console.log('✨ Todos los componentes están listos');
        console.log('🚀 La aplicación está lista para desarrollo');
    } else if (porcentaje >= 75) {
        console.log('\n✅ ENTORNO FUNCIONAL');
        console.log('⚠️ Algunos elementos menores necesitan atención');
        console.log('🔧 La aplicación debería funcionar correctamente');
    } else {
        console.log('\n❌ ENTORNO CON PROBLEMAS');
        console.log('🚨 Se requiere configuración adicional');
        console.log('🔧 Revisa los elementos marcados como falla');
    }
    
    console.log('\n💡 PRÓXIMOS PASOS:');
    console.log('1. Abrir http://localhost:8000 en el navegador');
    console.log('2. Verificar que la aplicación carga sin errores');
    console.log('3. Probar el registro/login de usuarios');
    console.log('4. Ejecutar tests en la consola del navegador');
    
    return resultados;
}

// Ejecutar verificación
if (require.main === module) {
    verificarEntorno().catch(console.error);
}

module.exports = { verificarEntorno };
