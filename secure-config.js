// 🔐 SISTEMA DE CONFIGURACIÓN SEGURA
// Versión simplificada y funcional

(function() {
    'use strict';

    // 🔐 Configuración segura para GitHub Pages
    const SECURE_CONFIG = {
        GEMINI_API_KEY: "AIzaSyDTwnuRm4vXeuU9wUF69ftxsX9yxXS-0Ho",
        firebaseConfig: {
            apiKey: "AIzaSyDioqBsl1lNWF0DB96ryOEF3KUzQNGtVnQ",
            authDomain: "mis-finanzas-familiares-f7298.firebaseapp.com",
            projectId: "mis-finanzas-familiares-f7298",
            storageBucket: "mis-finanzas-familiares-f7298.firebasestorage.app",
            messagingSenderId: "133085274608",
            appId: "1:133085274608:web:e6ac5cac8303f6dd0a7d35",
            measurementId: "G-ZNWVMVEY6W"
        },
        appId: "mis-finanzas-familiares-f7298",
        isPublicDeployment: true
    };

    // 🌐 Establecer configuración global
    window.APP_CONFIG = SECURE_CONFIG;
    window.firebaseConfig = SECURE_CONFIG.firebaseConfig;
    window.GEMINI_API_KEY = SECURE_CONFIG.GEMINI_API_KEY;
    window.appId = SECURE_CONFIG.appId;

    console.log('🔐 Configuración segura cargada correctamente');
    console.log('🔥 Firebase Config establecido');
    console.log('🤖 Gemini API Key configurado');

    // 🎯 Función para mostrar configuración manual si es necesaria
    window.showManualConfig = function() {
        const modal = document.createElement('div');
        modal.id = 'manual-config-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
                <h3 class="text-xl font-bold mb-4">🔐 Configuración Manual</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                    La aplicación ya está configurada automáticamente. Si necesitas cambiar las credenciales, puedes hacerlo aquí.
                </p>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">API Key de Gemini</label>
                        <input type="text" id="manual-gemini-key" class="w-full p-2 border rounded" 
                               value="${SECURE_CONFIG.GEMINI_API_KEY}" readonly>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Firebase API Key</label>
                        <input type="text" id="manual-firebase-key" class="w-full p-2 border rounded" 
                               value="${SECURE_CONFIG.firebaseConfig.apiKey}" readonly>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Project ID</label>
                        <input type="text" id="manual-project-id" class="w-full p-2 border rounded" 
                               value="${SECURE_CONFIG.firebaseConfig.projectId}" readonly>
                    </div>
                </div>
                <div class="flex gap-2 mt-6">
                    <button onclick="closeManualConfig()" class="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                        Cerrar
                    </button>
                    <button onclick="applyManualConfig()" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                        Aplicar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    // 🔄 Función para cerrar configuración manual
    window.closeManualConfig = function() {
        const modal = document.getElementById('manual-config-modal');
        if (modal) {
            modal.remove();
        }
    };

    // ✅ Función para aplicar configuración manual
    window.applyManualConfig = function() {
        const geminiKey = document.getElementById('manual-gemini-key').value;
        const firebaseKey = document.getElementById('manual-firebase-key').value;
        const projectId = document.getElementById('manual-project-id').value;

        if (geminiKey && firebaseKey && projectId) {
            // Actualizar configuración
            window.APP_CONFIG.GEMINI_API_KEY = geminiKey;
            window.APP_CONFIG.firebaseConfig.apiKey = firebaseKey;
            window.APP_CONFIG.firebaseConfig.projectId = projectId;
            
            window.GEMINI_API_KEY = geminiKey;
            window.firebaseConfig = window.APP_CONFIG.firebaseConfig;
            
            console.log('✅ Configuración manual aplicada');
            closeManualConfig();
            
            // Reinicializar la aplicación
            if (typeof initializeApp === 'function') {
                initializeApp();
            }
        } else {
            alert('Por favor, completa todos los campos');
        }
    };

    // 🚀 Función de configuración automática
    window.setupAutoConfig = function() {
        console.log('✅ Configuración automática ya aplicada');
        
        // Cerrar modal de configuración si existe
        const configModal = document.querySelector('.fixed.inset-0');
        if (configModal) {
            configModal.remove();
        }
        
        // Inicializar aplicación
        if (typeof initializeApp === 'function') {
            initializeApp();
        }
    };

    // 🎯 Auto-inicializar si la aplicación está lista
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                if (typeof initializeApp === 'function') {
                    initializeApp();
                }
            }, 100);
        });
    } else {
        setTimeout(() => {
            if (typeof initializeApp === 'function') {
                initializeApp();
            }
        }, 100);
    }

})();
