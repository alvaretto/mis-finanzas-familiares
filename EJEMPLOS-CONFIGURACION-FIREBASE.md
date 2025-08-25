# 🔥 Ejemplos Prácticos de Configuración Firebase

Esta guía contiene ejemplos reales y casos prácticos para configurar Firebase correctamente.

## 📋 **Ejemplo 1: Configuración Básica Completa**

### Archivo `config.js` Ejemplo:
```javascript
// 🔐 CONFIGURACIÓN DE API KEYS - EJEMPLO REAL
// ⚠️  NUNCA subas este archivo con tus API keys reales a GitHub

// 🤖 API Key de Google Gemini
const GEMINI_API_KEY = "AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz";

// 🔥 Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB9876543210zyxwvutsrqponmlkjihgfedcba",
    authDomain: "mis-finanzas-familiares-2024.firebaseapp.com",
    projectId: "mis-finanzas-familiares-2024",
    storageBucket: "mis-finanzas-familiares-2024.firebasestorage.app",
    messagingSenderId: "987654321098",
    appId: "1:987654321098:web:1a2b3c4d5e6f7g8h9i0j",
    measurementId: "G-ABCD123456"
};

// 🏷️ ID de la aplicación
const appId = 'mis-finanzas-familiares-2024';

// 🚀 Exportar configuración
window.APP_CONFIG = {
    GEMINI_API_KEY,
    firebaseConfig,
    appId
};
```

---

## 🔐 **Ejemplo 2: Reglas de Seguridad Firestore**

### Reglas Básicas (Recomendadas):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 👤 Datos de usuario - Solo el propietario
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 💰 Transacciones - Usuarios autenticados
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null;
    }
    
    // 💾 Backups - Usuarios autenticados
    match /backups/{backupId} {
      allow read, write: if request.auth != null;
    }
    
    // 🤖 Datos de IA - Solo el propietario
    match /ai_memory_data/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // ❌ Denegar todo lo demás
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Reglas para Desarrollo (Temporal):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ⚠️ SOLO PARA DESARROLLO - CAMBIAR EN PRODUCCIÓN
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 🌐 **Ejemplo 3: Configuración de Dominios**

### Dominios Autorizados en Firebase:
```
localhost                                    # Para desarrollo local
127.0.0.1                                   # Para desarrollo local alternativo
tu-usuario.github.io                        # Para GitHub Pages
mis-finanzas-familiares.web.app            # Para Firebase Hosting
tu-dominio-personalizado.com               # Si tienes dominio propio
```

### Cómo Agregar Dominios:
1. Firebase Console → Authentication → Settings
2. Scroll hasta "Authorized domains"
3. Click "Add domain"
4. Ingresa el dominio exacto
5. Click "Add"

---

## 🔧 **Ejemplo 4: Configuración de Authentication**

### Métodos de Autenticación Recomendados:
```
✅ Email/Password          - Habilitado (Principal)
❌ Email link              - Deshabilitado (Opcional)
❌ Phone                   - Deshabilitado (No necesario)
❌ Google                  - Deshabilitado (Opcional)
❌ Facebook                - Deshabilitado (Opcional)
❌ Twitter                 - Deshabilitado (Opcional)
❌ GitHub                  - Deshabilitado (Opcional)
❌ Anonymous               - Deshabilitado (No recomendado)
```

### Configuración de Contraseñas:
```
Longitud mínima: 6 caracteres (por defecto)
Complejidad: No requerida (Firebase maneja esto)
Recuperación: Habilitada automáticamente
```

---

## 📊 **Ejemplo 5: Estructura de Datos Recomendada**

### Colecciones Principales:
```
/users/{userId}                             # Datos del usuario
  ├── profile/                              # Perfil personal
  ├── settings/                             # Configuraciones
  └── preferences/                          # Preferencias

/transactions/{transactionId}               # Transacciones familiares
  ├── amount: number                        # Monto
  ├── category: string                      # Categoría
  ├── date: timestamp                       # Fecha
  ├── description: string                   # Descripción
  ├── type: string                          # "income" | "expense"
  └── userId: string                        # ID del usuario

/backups/{backupId}                         # Backups automáticos
  ├── timestamp: timestamp                  # Fecha del backup
  ├── userId: string                        # Usuario que creó
  ├── data: object                          # Datos respaldados
  └── version: string                       # Versión del backup

/ai_memory_data/{userId}/{sessionId}        # Memoria de IA
  ├── conversations: array                  # Conversaciones
  ├── insights: array                       # Insights generados
  └── preferences: object                   # Preferencias de IA
```

---

## 🚨 **Ejemplo 6: Solución de Problemas Comunes**

### Error: "Missing or insufficient permissions"
```javascript
// ❌ Problema: Reglas muy restrictivas
match /transactions/{transactionId} {
  allow read, write: if request.auth.uid == resource.data.userId;
}

// ✅ Solución: Permitir a usuarios autenticados
match /transactions/{transactionId} {
  allow read, write: if request.auth != null;
}
```

### Error: "Firebase configuration not found"
```javascript
// ❌ Problema: Configuración no exportada
const firebaseConfig = { ... };

// ✅ Solución: Exportar correctamente
window.APP_CONFIG = {
    firebaseConfig,
    // ... otros campos
};
```

### Error: "Auth domain not authorized"
```
❌ Problema: Dominio no autorizado
✅ Solución: Agregar dominio en Firebase Console
   Authentication → Settings → Authorized domains
```

---

## 🔍 **Ejemplo 7: Verificación de Configuración**

### Script de Verificación:
```javascript
// 🔍 Verificar configuración Firebase
function verificarFirebase() {
    console.log('🔍 Verificando configuración Firebase...');
    
    // Verificar configuración
    if (!window.APP_CONFIG?.firebaseConfig) {
        console.error('❌ Configuración Firebase no encontrada');
        return false;
    }
    
    // Verificar campos requeridos
    const config = window.APP_CONFIG.firebaseConfig;
    const camposRequeridos = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    
    for (const campo of camposRequeridos) {
        if (!config[campo]) {
            console.error(`❌ Campo faltante: ${campo}`);
            return false;
        }
    }
    
    // Verificar Firebase SDK
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase SDK no cargado');
        return false;
    }
    
    console.log('✅ Configuración Firebase correcta');
    return true;
}

// Ejecutar verificación
verificarFirebase();
```

---

## 📱 **Ejemplo 8: Configuración para Móviles**

### Configuración Adicional para PWA:
```javascript
// En tu config.js, agregar:
const firebaseConfig = {
    // ... configuración normal
    
    // 📱 Configuración adicional para móviles
    vapidKey: "TU_VAPID_KEY_AQUI", // Para notificaciones push
    measurementId: "G-ABCD123456"   // Para Analytics (opcional)
};
```

### Dominios para Aplicaciones Móviles:
```
# Para aplicaciones híbridas (Cordova/PhoneGap)
file://
capacitor://localhost
ionic://localhost

# Para aplicaciones React Native
localhost:8081
localhost:19006
```

---

## 🎯 **Ejemplo 9: Configuración de Producción vs Desarrollo**

### Desarrollo (config-dev.js):
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDEV...",
    authDomain: "mi-app-dev.firebaseapp.com",
    projectId: "mi-app-dev",
    // ... resto de configuración de desarrollo
};
```

### Producción (config-prod.js):
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyPROD...",
    authDomain: "mi-app-prod.firebaseapp.com",
    projectId: "mi-app-prod",
    // ... resto de configuración de producción
};
```

### Script de Selección Automática:
```javascript
// Detectar entorno automáticamente
const isProduction = window.location.hostname !== 'localhost';
const configFile = isProduction ? 'config-prod.js' : 'config-dev.js';

// Cargar configuración apropiada
const script = document.createElement('script');
script.src = configFile;
document.head.appendChild(script);
```

---

## 📚 **Recursos Adicionales**

- **Firebase Console**: https://console.firebase.google.com/
- **Documentación Oficial**: https://firebase.google.com/docs/web/setup
- **Reglas de Seguridad**: https://firebase.google.com/docs/firestore/security/get-started
- **Verificador de Configuración**: `verificar-configuracion.html`

---

**¡Con estos ejemplos tendrás Firebase configurado perfectamente! 🔥**
