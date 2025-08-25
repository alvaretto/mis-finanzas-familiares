# 🏠 Guía Súper Fácil para Configurar tu App de Finanzas Familiares

¡Hola! 👋 Esta guía te ayudará a configurar tu aplicación de finanzas familiares paso a paso, sin necesidad de conocimientos técnicos.

## 🎯 ¿Qué vamos a hacer?

Vamos a configurar tu aplicación para que puedas:
- 💰 Gestionar tus finanzas familiares
- 🤖 Recibir consejos de inteligencia artificial
- 📱 Usar la app desde cualquier dispositivo
- 🔒 Mantener tus datos seguros

## ⏰ Tiempo estimado: 15-20 minutos

---

## 📋 **PASO 1: Preparar los Archivos** (2 minutos)

### 1.1 Descargar el proyecto
1. Ve a: https://github.com/alvaretto/mis-finanzas-familiares
2. Haz clic en el botón verde **"Code"**
3. Selecciona **"Download ZIP"**
4. Descomprime el archivo en tu computadora

### 1.2 Crear tu archivo de configuración
1. Busca el archivo `config.example.js` en la carpeta del proyecto
2. **Cópialo** y **pégalo** en la misma carpeta
3. **Renombra** la copia a `config.js`

✅ **¡Listo!** Ahora tienes tu archivo de configuración personal.

---

## 🤖 **PASO 2: Configurar la Inteligencia Artificial** (5 minutos)

### 2.1 Obtener tu API Key de Google Gemini
1. Ve a: https://aistudio.google.com/app/apikey
2. **Inicia sesión** con tu cuenta de Google
3. Haz clic en **"Create API Key"** (Crear API Key)
4. Selecciona **"Create API key in new project"**
5. **Copia** la API Key que aparece (algo como: `AIzaSyC...`)

### 2.2 Configurar la API Key
1. Abre el archivo `config.js` con cualquier editor de texto (Bloc de notas, etc.)
2. Busca esta línea:
   ```
   const GEMINI_API_KEY = "TU_API_KEY_DE_GEMINI_AQUI";
   ```
3. **Reemplaza** `TU_API_KEY_DE_GEMINI_AQUI` con tu API Key real
4. Debe quedar así:
   ```
   const GEMINI_API_KEY = "AIzaSyC...tu-api-key-real";
   ```
5. **Guarda** el archivo

✅ **¡Perfecto!** Ya tienes la IA configurada.

---

## 🔥 **PASO 3: Configurar Firebase (Base de Datos)** (8 minutos)

### 3.1 Crear tu proyecto Firebase
1. Ve a: https://console.firebase.google.com/
2. **Inicia sesión** con tu cuenta de Google
3. Haz clic en **"Crear un proyecto"**
4. Ponle un nombre (ejemplo: "mis-finanzas-familiares")
5. **Desactiva** Google Analytics (no lo necesitamos)
6. Haz clic en **"Crear proyecto"**
7. Espera a que se cree y haz clic en **"Continuar"**

### 3.2 Configurar Authentication (Autenticación)
1. En el menú izquierdo, haz clic en **"Authentication"**
2. Haz clic en **"Comenzar"**
3. Ve a la pestaña **"Sign-in method"**
4. Haz clic en **"Correo electrónico/contraseña"**
5. **Activa** la primera opción (Correo electrónico/contraseña)
6. Haz clic en **"Guardar"**

### 3.3 Configurar Firestore Database
1. En el menú izquierdo, haz clic en **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"**
4. Elige una ubicación cercana a ti (ejemplo: "southamerica-east1")
5. Haz clic en **"Listo"**

### 3.4 Obtener la configuración
1. Haz clic en el ⚙️ (engranaje) junto a "Descripción general del proyecto"
2. Selecciona **"Configuración del proyecto"**
3. Baja hasta **"Tus apps"**
4. Haz clic en **"</>"** (icono web)
5. Ponle un nombre a tu app (ejemplo: "finanzas-web")
6. **NO** marques "También configura Firebase Hosting"
7. Haz clic en **"Registrar app"**
8. **Copia** todo el código que aparece en `firebaseConfig = { ... }`

### 3.5 Configurar en tu archivo
1. Abre tu archivo `config.js`
2. Busca la sección de Firebase:
   ```javascript
   const firebaseConfig = {
       apiKey: "TU_FIREBASE_API_KEY_AQUI",
       authDomain: "tu-proyecto.firebaseapp.com",
       // ... más líneas
   };
   ```
3. **Reemplaza** todos los valores con los que copiaste de Firebase
4. También cambia esta línea:
   ```javascript
   const appId = 'tu-proyecto-id';
   ```
   Por tu ID real (es el `projectId` de tu configuración)
5. **Guarda** el archivo

✅ **¡Excelente!** Firebase está configurado.

---

## 🚀 **PASO 4: Probar tu Configuración** (3 minutos)

### 4.1 Abrir la aplicación
1. Busca el archivo `index.html` en tu carpeta del proyecto
2. **Haz doble clic** para abrirlo en tu navegador
3. Deberías ver la pantalla de inicio de sesión

### 4.2 Crear tu primera cuenta
1. Haz clic en **"Regístrate"**
2. Ingresa tu correo electrónico y una contraseña segura
3. Haz clic en **"Crear Cuenta"**
4. Si todo está bien, deberías entrar a la aplicación

### 4.3 Probar la IA
1. Una vez dentro, haz clic en **"Tips IA"**
2. Deberías recibir un consejo financiero personalizado
3. Si funciona, ¡todo está perfecto!

---

## 🎉 **¡FELICITACIONES!**

Tu aplicación de finanzas familiares está lista para usar. Ahora puedes:

- 💰 Agregar tus ingresos y gastos
- 📊 Ver gráficos de tus finanzas
- 🤖 Recibir consejos de IA
- 👨‍👩‍👧‍👦 Compartir con tu familia
- 📱 Usar desde cualquier dispositivo

---

## 🆘 **¿Necesitas Ayuda?**

### Problemas Comunes:

**❌ "Error de API Key"**
- Verifica que copiaste correctamente la API Key de Gemini
- Asegúrate de que no hay espacios extra

**❌ "Error de Firebase"**
- Verifica que copiaste toda la configuración de Firebase
- Asegúrate de que habilitaste Authentication y Firestore

**❌ "No puedo registrarme"**
- Verifica que habilitaste "Correo electrónico/contraseña" en Firebase Authentication

### 📞 Contacto
Si tienes problemas, puedes:
1. Revisar esta guía paso a paso
2. Verificar que seguiste todos los pasos
3. Contactar al desarrollador con detalles específicos del error

---

## 🔒 **Importante sobre Seguridad**

- ✅ Tu archivo `config.js` es personal y no se comparte
- ✅ Tus datos están seguros en Firebase
- ✅ Solo tú y tu familia pueden acceder a tus finanzas
- ❌ NUNCA compartas tu API Key con nadie
- ❌ NUNCA subas tu `config.js` a internet

---

**¡Disfruta gestionando tus finanzas familiares! 🏠💰**
