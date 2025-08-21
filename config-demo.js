// 🌐 CONFIGURACIÓN PARA GITHUB PAGES - PRODUCCIÓN PÚBLICA
// Este archivo permite que la aplicación funcione completamente en GitHub Pages
// Usa un proyecto Firebase público específico para despliegue

// ⚠️ IMPORTANTE: Esta configuración es pública y segura
// - Firebase está configurado con reglas de seguridad apropiadas
// - Los datos están separados del proyecto personal
// - Ideal para uso familiar desde múltiples dispositivos

// 🔐 API Key de Gemini (REEMPLAZAR CON TU KEY)
// ⚠️ IMPORTANTE: Reemplaza con tu propia API key restringida
const GEMINI_API_KEY = "TU_GEMINI_API_KEY_AQUI";

// 🔥 Configuración de Firebase (REEMPLAZAR CON TU PROYECTO)
// ⚠️ IMPORTANTE: Reemplaza con tu propia configuración de Firebase
const firebaseConfig = {
    apiKey: "TU_FIREBASE_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.firebasestorage.app",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID",
    measurementId: "TU_MEASUREMENT_ID"
};

// 🏷️ ID de la aplicación (REEMPLAZAR CON TU ID)
const appId = 'tu-proyecto-id';

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
