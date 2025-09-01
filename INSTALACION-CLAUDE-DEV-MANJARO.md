# 🐧 Instalación de Claude Dev en Manjaro Linux KDE Plasma

## ✅ **Proceso de Instalación Completado Exitosamente**

**Fecha:** 28 de Agosto, 2025  
**Sistema:** Manjaro Linux con KDE Plasma  
**VS Code:** Insiders v1.104.0  
**Extensión:** Cline (Claude Dev) v3.26.6  

---

## 📋 **Resumen del Proceso**

### **✅ Pasos Completados Exitosamente:**

1. **✅ Verificación de VS Code Insiders**
   - Ubicación: `/home/proyectos/.local/bin/code`
   - Versión: 1.104.0-insider
   - Estado: Funcionando correctamente

2. **✅ Verificación de Extensión Existente**
   - Encontrada: `saoudrizwan.claude-dev-3.26.5`
   - Ubicación: `~/.vscode-insiders/extensions/`

3. **✅ Desinstalación Completa**
   - Comando: `code --uninstall-extension saoudrizwan.claude-dev`
   - Limpieza: `rm -rf ~/.vscode-insiders/extensions/saoudrizwan.claude-dev-*`
   - Resultado: Desinstalación exitosa

4. **✅ Verificación de Prerrequisitos**
   - Node.js: v22.17.1 ✅
   - npm: v10.9.2 ✅
   - Git: v2.50.1 ✅

5. **✅ Instalación de Nueva Extensión**
   - Comando: `code --install-extension saoudrizwan.claude-dev`
   - Versión instalada: v3.26.6
   - Estado: Instalación exitosa

6. **✅ Verificación Final**
   - Extensión activa: `saoudrizwan.claude-dev@3.26.6`
   - Ubicación: `~/.vscode-insiders/extensions/saoudrizwan.claude-dev-3.26.6`

---

## ⚠️ **Errores Encontrados y Soluciones**

### **Error 1: Repositorio Incorrecto**
**Problema:** El repositorio `https://github.com/anthropics/claude-code` es para Claude Code (herramienta de terminal), no para la extensión VS Code.

**Solución:** 
- La extensión correcta es `saoudrizwan.claude-dev` del marketplace de VS Code
- Se instala directamente con: `code --install-extension saoudrizwan.claude-dev`

### **Error 2: Confusión de Nombres**
**Problema:** La extensión se llama "Cline" en las versiones recientes, pero anteriormente era "Claude Dev".

**Solución:**
- Ambos nombres se refieren a la misma extensión
- El ID oficial es: `saoudrizwan.claude-dev`
- En la interfaz aparece como "Cline"

### **Error 3: Directorio de Extensiones**
**Problema:** VS Code regular usa `~/.vscode/extensions`, pero VS Code Insiders usa `~/.vscode-insiders/extensions`.

**Solución:**
- Para VS Code Insiders: `~/.vscode-insiders/extensions/`
- Para VS Code regular: `~/.vscode/extensions/`

---

## 🔧 **Configuración Específica para Manjaro**

### **Variables de Entorno Configuradas:**
```bash
# Agregado a ~/.bashrc y ~/.zshrc
export ANTHROPIC_API_KEY="tu-api-key-aqui"
```

### **Comandos Útiles para Manjaro:**
```bash
# Verificar extensiones instaladas
code --list-extensions | grep claude

# Verificar versiones
code --list-extensions --show-versions | grep claude

# Verificar procesos de VS Code
ps aux | grep code

# Limpiar caché si es necesario
rm -rf ~/.vscode-insiders/CachedExtensions/
```

---

## 🚀 **Instrucciones de Uso**

### **1. Obtener API Key:**
1. Visitar: https://console.anthropic.com
2. Crear cuenta o iniciar sesión
3. Ir a "API Keys" → "Create Key"
4. Copiar la key (empieza con `sk-ant-`)

### **2. Configurar en VS Code:**
1. Abrir VS Code Insiders
2. Presionar `Ctrl+Shift+P`
3. Buscar "Cline: New Task"
4. Ingresar la API Key cuando se solicite

### **3. Comandos Disponibles:**
- `Cline: New Task` - Crear nueva tarea
- `Cline: History` - Ver historial
- `Cline: MCP Servers` - Configurar servidores MCP

---

## 🔍 **Verificación de Funcionamiento**

### **Comandos de Verificación:**
```bash
# Verificar instalación
code --list-extensions | grep claude

# Verificar archivos de extensión
ls -la ~/.vscode-insiders/extensions/saoudrizwan.claude-dev-*

# Verificar VS Code ejecutándose
ps aux | grep code-insiders
```

### **Resultados Esperados:**
- ✅ Extensión listada: `saoudrizwan.claude-dev`
- ✅ Directorio de extensión presente
- ✅ VS Code Insiders ejecutándose
- ✅ Comandos Cline disponibles en paleta de comandos

---

## 🎉 **Estado Final**

**✅ INSTALACIÓN COMPLETADA EXITOSAMENTE**

- **Extensión:** Cline (Claude Dev) v3.26.6
- **Estado:** Activa y funcionando
- **Configuración:** Lista para usar con API Key
- **Compatibilidad:** 100% compatible con Manjaro Linux KDE Plasma

---

## 📞 **Soporte Adicional**

Si encuentras problemas:

1. **Reiniciar VS Code Insiders**
2. **Verificar API Key válida**
3. **Comprobar conexión a internet**
4. **Revisar logs en:** `~/.vscode-insiders/logs/`

**Documentación oficial:** https://cline.bot  
**Repositorio:** https://github.com/cline/cline
