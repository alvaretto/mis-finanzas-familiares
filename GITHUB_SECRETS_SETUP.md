# 🔐 Configuración de GitHub Secrets

## ⚠️ ACCIÓN REQUERIDA: Configurar Secrets en GitHub

Para que la aplicación funcione correctamente en GitHub Pages, necesitas configurar los siguientes secrets en tu repositorio:

### 📍 Ubicación: 
https://github.com/alvaretto/mis-finanzas-familiares/settings/secrets/actions

### 🔑 Secrets a Configurar:

1. **GEMINI_API_KEY**
   ```
   AIzaSyDTwnuRm4vXeuU9wUF69ftxsX9yxXS-0Ho
   ```

2. **FIREBASE_API_KEY**
   ```
   AIzaSyDioqBsl1lNWF0DB96ryOEF3KUzQNGtVnQ
   ```

3. **FIREBASE_AUTH_DOMAIN**
   ```
   mis-finanzas-familiares-f7298.firebaseapp.com
   ```

4. **FIREBASE_PROJECT_ID**
   ```
   mis-finanzas-familiares-f7298
   ```

5. **FIREBASE_STORAGE_BUCKET**
   ```
   mis-finanzas-familiares-f7298.firebasestorage.app
   ```

6. **FIREBASE_MESSAGING_SENDER_ID**
   ```
   133085274608
   ```

7. **FIREBASE_APP_ID**
   ```
   1:133085274608:web:e6ac5cac8303f6dd0a7d35
   ```

8. **FIREBASE_MEASUREMENT_ID**
   ```
   G-ZNWVMVEY6W
   ```

## 🚀 Pasos para Configurar:

1. Ve a: https://github.com/alvaretto/mis-finanzas-familiares/settings/secrets/actions
2. Haz clic en "New repository secret"
3. Agrega cada secret con su nombre y valor correspondiente
4. Una vez configurados todos, el workflow de GitHub Actions reemplazará automáticamente los placeholders en config-demo.js

## ✅ Verificación:

Después de configurar los secrets, la aplicación funcionará:
- 🖥️ **Local**: Usando config-fresh.js (protegido, no se sube)
- 📱 **GitHub Pages**: Usando config-demo.js con secrets reemplazados automáticamente

## 🗑️ Eliminar este archivo:

Una vez configurados los secrets, puedes eliminar este archivo:
```bash
rm GITHUB_SECRETS_SETUP.md
```
