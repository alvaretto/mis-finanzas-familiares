// 🔐 CONFIGURACIÓN FRESCA - SIN CACHÉ
// ⚠️  Este archivo NO se sube a GitHub (está en .gitignore)

// 🤖 API Key de Google Gemini (NUEVA - SEGURA)
const GEMINI_API_KEY = "AIzaSyDTwnuRm4vXeuU9wUF69ftxsX9yxXS-0Ho";

// 🔥 Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDioqBsl1lNWF0DB96ryOEF3KUzQNGtVnQ",
    authDomain: "mis-finanzas-familiares-f7298.firebaseapp.com",
    projectId: "mis-finanzas-familiares-f7298",
    storageBucket: "mis-finanzas-familiares-f7298.firebasestorage.app",
    messagingSenderId: "133085274608",
    appId: "1:133085274608:web:e6ac5cac8303f6dd0a7d35",
    measurementId: "G-ZNWVMVEY6W"
};

// 🏷 ID de la aplicación
const appId = 'mis-finanzas-familiares-f7298';

// 🚀 Exportar configuración para uso en la aplicación
window.APP_CONFIG = {
    GEMINI_API_KEY,
    firebaseConfig,
    appId
};

console.log("🔥 CONFIG-FRESH.JS CARGADO - API Key:", firebaseConfig.apiKey.substring(0, 20) + "...");
