# 🔐 Guía de Configuración Segura

## ⚠️ IMPORTANTE - Configuración de API Keys

Este proyecto requiere configuración de API keys para funcionar. **NUNCA** subas tus API keys reales a GitHub.

## 🚀 Configuración Rápida

### 1. Configurar API Keys

```bash
# 1. Copia el archivo de ejemplo
cp config.example.js config.js

# 2. Edita config.js con tus API keys reales
# (El archivo config.js NO se subirá a GitHub)
```

### 2. Obtener API Key de Google Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crea una nueva API Key
3. Copia la API Key generada
4. Pégala en `config.js` reemplazando `TU_API_KEY_DE_GEMINI_AQUI`

### 3. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Ve a Configuración del proyecto > General
4. En "Tus apps" > "Configuración del SDK"
5. Copia toda la configuración
6. Pégala en `config.js` reemplazando los valores de ejemplo

### 4. Habilitar Servicios Firebase

#### Authentication:
1. Ve a Authentication > Sign-in method
2. Habilita "Email/password"

#### Firestore Database:
1. Ve a Firestore Database
2. Crea una base de datos
3. Configura las reglas de seguridad:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso solo a usuarios autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🛡️ Seguridad

### ✅ Lo que SÍ se sube a GitHub:
- `config.example.js` - Archivo de ejemplo sin API keys reales
- `index.html` - Código principal sin API keys hardcodeadas
- `README.md` - Documentación
- `.gitignore` - Configuración para excluir archivos sensibles

### ❌ Lo que NO se sube a GitHub:
- `config.js` - Contiene tus API keys reales
- Cualquier archivo con credenciales

## 🔧 Verificación

Después de configurar, abre la consola del navegador (F12) y verifica:

```javascript
// Debe mostrar tu configuración (sin mostrar las keys completas)
console.log('Configuración cargada:', !!window.APP_CONFIG);
console.log('Gemini API configurada:', !!window.APP_CONFIG?.GEMINI_API_KEY);
console.log('Firebase configurado:', !!window.APP_CONFIG?.firebaseConfig?.apiKey);
```

## 🚨 Solución de Problemas

### Error: "Configuración no encontrada"
- Asegúrate de haber creado `config.js` basado en `config.example.js`
- Verifica que el archivo esté en la raíz del proyecto

### Error: "API Key no configurada"
- Revisa que hayas reemplazado `TU_API_KEY_DE_GEMINI_AQUI` con tu API key real
- Verifica que la API key sea válida en Google AI Studio

### Error de Firebase
- Confirma que hayas copiado toda la configuración de Firebase
- Verifica que los servicios estén habilitados en Firebase Console

## 📞 Soporte

Si tienes problemas con la configuración:
1. Revisa la consola del navegador (F12) para errores específicos
2. Verifica que todos los servicios estén habilitados en Firebase
3. Confirma que las API keys sean válidas

---

**🔒 Recuerda: Nunca compartas tus API keys públicamente**
