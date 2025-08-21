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

// 🔐 API Key de Gemini - GENERADA DINÁMICAMENTE POR GITHUB ACTIONS
// Las credenciales reales se almacenan de forma segura en GitHub Secrets
const GEMINI_API_KEY = "{{GEMINI_API_KEY}}";

// 🔥 Configuración de Firebase - GENERADA DINÁMICAMENTE POR GITHUB ACTIONS
// Las credenciales reales se almacenan de forma segura en GitHub Secrets
const firebaseConfig = {
    apiKey: "{{FIREBASE_API_KEY}}",
    authDomain: "{{FIREBASE_AUTH_DOMAIN}}",
    projectId: "{{FIREBASE_PROJECT_ID}}",
    storageBucket: "{{FIREBASE_STORAGE_BUCKET}}",
    messagingSenderId: "{{FIREBASE_MESSAGING_SENDER_ID}}",
    appId: "{{FIREBASE_APP_ID}}",
    measurementId: "{{FIREBASE_MEASUREMENT_ID}}"
};

// 🏷️ ID de la aplicación - GENERADO DINÁMICAMENTE POR GITHUB ACTIONS
const appId = '{{FIREBASE_PROJECT_ID}}';

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
