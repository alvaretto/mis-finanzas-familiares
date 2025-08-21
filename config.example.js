// 🔐 CONFIGURACIÓN DE API KEYS - EJEMPLO
// ⚠️  NUNCA subas este archivo con tus API keys reales a GitHub
// 📋 Instrucciones:
// 1. Copia este archivo como 'config.js'
// 2. Reemplaza los valores con tus API keys reales
// 3. El archivo config.js está en .gitignore y no se subirá al repositorio

// 🤖 API Key de Google Gemini
// Obtén tu API key en: https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = "TU_API_KEY_DE_GEMINI_AQUI";

// 🔥 Configuración de Firebase
// Obtén tu configuración en: https://console.firebase.google.com/
const firebaseConfig = {
    apiKey: "TU_FIREBASE_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
    measurementId: "G-ABCDEF1234"
};

// 🏷️ ID de la aplicación (debe coincidir con tu proyecto Firebase)
const appId = 'tu-proyecto-id';

// 🚀 Exportar configuración para uso en la aplicación
window.APP_CONFIG = {
    GEMINI_API_KEY,
    firebaseConfig,
    appId
};
