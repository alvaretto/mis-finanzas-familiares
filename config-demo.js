// 🌐 CONFIGURACIÓN PARA GITHUB PAGES - MODO DEMOSTRACIÓN
// Este archivo permite que la aplicación funcione en GitHub Pages sin exponer API keys reales

// ⚠️ IMPORTANTE: Esta es una configuración de demostración
// Las funciones de IA no funcionarán sin API keys reales

// 🔐 Configuración de demostración (sin funcionalidad real)
const GEMINI_API_KEY = null; // No funcional en modo demo

// 🔥 Configuración de Firebase para demo
const firebaseConfig = {
    apiKey: "demo-mode-no-real-functionality",
    authDomain: "demo.firebaseapp.com",
    projectId: "demo-project",
    storageBucket: "demo.appspot.com",
    messagingSenderId: "000000000",
    appId: "demo:app:id",
    measurementId: "G-DEMO"
};

// 🏷️ ID de la aplicación para demo
const appId = 'demo-project';

// 🚀 Exportar configuración para uso en GitHub Pages
window.APP_CONFIG = {
    GEMINI_API_KEY,
    firebaseConfig,
    appId,
    isDemoMode: true
};

// 📢 Mensaje informativo
console.log('🌐 Aplicación ejecutándose en modo demostración');
console.log('📋 Para funcionalidad completa, clona el repositorio y configura tus API keys');
console.log('📂 Repositorio: https://github.com/alvaretto/mis-finanzas-familiares');
