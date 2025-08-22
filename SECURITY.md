# 🔒 GUÍA DE SEGURIDAD - MIS FINANZAS FAMILIARES

## ⚠️ INFORMACIÓN IMPORTANTE DE SEGURIDAD

### 🚨 ANTES DE USAR ESTA APLICACIÓN:

#### 1. 🔑 CONFIGURA TUS PROPIAS API KEYS

**❌ NO USES las keys del repositorio público**
- Las keys en `config-demo.js` son EJEMPLOS
- Debes reemplazarlas con tus propias keys

#### 2. 🔥 CONFIGURA TU PROPIO PROYECTO FIREBASE

1. Ve a: https://console.firebase.google.com/
2. Crea un nuevo proyecto
3. Configura Authentication → Google
4. Configura Firestore Database
5. Copia tu configuración a `config.js` (local)

#### 3. 🤖 CONFIGURA TU API DE GEMINI

1. Ve a: https://aistudio.google.com/app/apikey
2. Crea una nueva API key
3. Configura restricciones de dominio
4. Agrega tu key a `config.js` (local)

### 📁 ESTRUCTURA DE ARCHIVOS SEGURA:

```
├── config.js          ← TU ARCHIVO PRIVADO (no se sube a GitHub)
├── config-demo.js      ← ARCHIVO PÚBLICO (solo plantilla)
├── .gitignore          ← Protege config.js
└── index.html          ← Aplicación principal
```

### 🛡️ REGLAS DE SEGURIDAD:

#### ✅ HACER:
- Usar tu propio proyecto Firebase
- Configurar reglas de seguridad en Firestore
- Restringir API keys por dominio
- Mantener `config.js` en .gitignore

#### ❌ NO HACER:
- Subir API keys reales a GitHub
- Usar las keys del ejemplo público
- Compartir credenciales en repositorios públicos
- Ignorar las reglas de seguridad de Firebase

### 🔧 CONFIGURACIÓN RECOMENDADA:

#### Firebase Security Rules (Firestore):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden acceder a sus datos
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### Gemini API Restrictions:
- Restringir por dominio (tu-dominio.com)
- Configurar límites de uso
- Monitorear uso regularmente

### 📞 SOPORTE:

Si tienes dudas sobre seguridad:
1. Revisa la documentación de Firebase
2. Consulta las mejores prácticas de Google Cloud
3. Nunca compartas credenciales reales

---
**🔐 Recuerda: La seguridad es responsabilidad del usuario final**
