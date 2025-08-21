// 🌐 CONFIGURACIÓN PARA GITHUB PAGES - PRODUCCIÓN PÚBLICA
// Este archivo permite que la aplicación funcione completamente en GitHub Pages
// Usa un proyecto Firebase público específico para despliegue

// ⚠️ IMPORTANTE: Esta configuración es pública y segura
// - Firebase está configurado con reglas de seguridad apropiadas
// - Los datos están separados del proyecto personal
// - Ideal para uso familiar desde múltiples dispositivos

// 🔐 API Key de Gemini (pública para GitHub Pages)
// Esta key está restringida solo para el dominio de GitHub Pages
const GEMINI_API_KEY = "AIzaSyD29AwETHKyHWZlyh563HtDuSD8MBN6_sY";

// 🔥 Configuración de Firebase para GitHub Pages (proyecto público)
const firebaseConfig = {
    apiKey: "AIzaSyAv-gCdNgsC4lJbEQ6OP9zbZm1ljj_HQ88",
    authDomain: "mis-finanzas-familiares-f7298.firebaseapp.com",
    projectId: "mis-finanzas-familiares-f7298",
    storageBucket: "mis-finanzas-familiares-f7298.firebasestorage.app",
    messagingSenderId: "133085274608",
    appId: "1:133085274608:web:1884eb9af14b6190a7d35",
    measurementId: "G-5SH2P1YRDW"
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
