// 🌐 CONFIGURACIÓN PARA GITHUB PAGES - PRODUCCIÓN PÚBLICA
// Este archivo permite que la aplicación funcione completamente en GitHub Pages
// Usa el proyecto Firebase con reglas de seguridad estrictas

// ⚠️ IMPORTANTE: Esta configuración es pública pero segura
// - Firebase está configurado con reglas de seguridad apropiadas
// - API Key de Gemini restringida solo para alvaretto.github.io
// - Los datos están protegidos por autenticación Firebase
// - Ideal para acceso móvil y uso familiar desde múltiples dispositivos

// 🔒 CONFIGURACIÓN DUAL:
// - GitHub Pages: Usa este archivo (config-demo.js) para acceso público
// - Local: Usa config.js para desarrollo con tus credenciales privadas

// 🔐 API Key de Gemini (restringida para alvaretto.github.io)
const GEMINI_API_KEY = "AIzaSyDTwnuRm4vXeuU9wUF69ftxsX9yxXS-0Ho";

// 🔥 Configuración de Firebase (con reglas de seguridad estrictas)
const firebaseConfig = {
    apiKey: "AIzaSyDioqBsl1lNWF0DB96ryOEF3KUzQNGtVnQ",
    authDomain: "mis-finanzas-familiares-f7298.firebaseapp.com",
    projectId: "mis-finanzas-familiares-f7298",
    storageBucket: "mis-finanzas-familiares-f7298.firebasestorage.app",
    messagingSenderId: "133085274608",
    appId: "1:133085274608:web:e6ac5cac8303f6dd0a7d35",
    measurementId: "G-ZNWVMVEY6W"
};

// 🏷️ ID de la aplicación
const appId = 'mis-finanzas-familiares-f7298';

// 🚀 Exportar configuración para uso en GitHub Pages
window.APP_CONFIG = {
    GEMINI_API_KEY,
    firebaseConfig,
    appId,
    isPublicDeployment: true  // Indica que es despliegue público
};

// 📢 Mensaje informativo
console.log('🌐 Aplicación ejecutándose en GitHub Pages');
console.log('🔥 Firebase configurado para uso familiar');
console.log('📱 Listo para acceso desde móviles');
console.log('📂 Repositorio: https://github.com/alvaretto/mis-finanzas-familiares');
