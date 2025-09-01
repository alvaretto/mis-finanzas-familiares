# 🚀 **Claude Code - Guía Completa de Uso en Manjaro Linux**

## ✅ **Instalación Completada**

**Fecha:** 28 de Agosto, 2025  
**Sistema:** Manjaro Linux KDE Plasma  
**Claude Code:** v1.0.81  
**Estado:** ✅ Instalado y configurado correctamente  

---

## 📋 **Información de la Instalación**

### **Ubicación:**
- **Ejecutable:** `/home/proyectos/.npm-global/bin/claude`
- **Paquete:** `@anthropic-ai/claude-code`
- **Versión:** 1.0.81

### **Variables de Entorno Configuradas:**
```bash
# En ~/.bashrc y ~/.zshrc
export ANTHROPIC_API_KEY="sk-ant-api03-REEMPLAZA-CON-TU-API-KEY"

# En /etc/environment.d/anthropic.conf (sistema completo)
ANTHROPIC_API_KEY="sk-ant-api03-REEMPLAZA-CON-TU-API-KEY"
```

---

## 🔑 **Configuración de API Key**

### **1. Obtener API Key:**
```bash
# Abrir consola de Anthropic
xdg-open https://console.anthropic.com
```

### **2. Configurar API Key:**
```bash
# Opción 1: Variable de entorno temporal
export ANTHROPIC_API_KEY="tu-api-key-real"

# Opción 2: Configurar permanentemente
echo 'export ANTHROPIC_API_KEY="tu-api-key-real"' >> ~/.bashrc
source ~/.bashrc

# Opción 3: Usar comando de configuración de Claude
claude config set apiKey "tu-api-key-real"
```

---

## 📖 **Comandos Básicos**

### **Comandos Principales:**
```bash
# Iniciar sesión interactiva
claude

# Ejecutar comando directo con salida
claude -p "Explica qué hace este código: console.log('Hello World')"

# Continuar conversación anterior
claude -c

# Reanudar sesión específica
claude -r

# Ver ayuda completa
claude --help

# Ver versión
claude --version
```

### **Comandos de Configuración:**
```bash
# Ver configuración actual
claude config list

# Configurar API key
claude config set apiKey "tu-api-key"

# Configurar tema
claude config set theme dark

# Configurar modelo por defecto
claude config set model sonnet
```

### **Comandos de Gestión:**
```bash
# Verificar salud del sistema
claude doctor

# Actualizar Claude Code
claude update

# Configurar servidores MCP
claude mcp

# Migrar instalación
claude migrate-installer
```

---

## 💡 **5 Ejemplos Prácticos de Uso**

### **Ejemplo 1: Explicar Código JavaScript**
```bash
# Comando
claude -p "Explica línea por línea este código JavaScript:
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}"

# Resultado esperado:
# Claude explicará cada parte del código, incluyendo:
# - Qué hace la función
# - Cómo funciona reduce()
# - El propósito del callback
# - El valor inicial (0)
```

### **Ejemplo 2: Generar Documentación**
```bash
# Comando
claude -p "Genera documentación JSDoc para esta función:
function processTransaction(amount, type, category) {
    // Lógica de procesamiento
    return { id: Date.now(), amount, type, category };
}"

# Resultado esperado:
# /**
#  * Procesa una transacción financiera
#  * @param {number} amount - Monto de la transacción
#  * @param {string} type - Tipo de transacción (ingreso/gasto)
#  * @param {string} category - Categoría de la transacción
#  * @returns {Object} Objeto con los datos de la transacción procesada
#  */
```

### **Ejemplo 3: Revisar y Optimizar Código Python**
```bash
# Comando
claude -p "Revisa y optimiza este código Python:
def calculate_budget(transactions):
    total = 0
    for transaction in transactions:
        if transaction['type'] == 'income':
            total = total + transaction['amount']
        else:
            total = total - transaction['amount']
    return total"

# Resultado esperado:
# Claude sugerirá optimizaciones como:
# - Usar comprensión de listas
# - Simplificar la lógica condicional
# - Mejorar la legibilidad
```

### **Ejemplo 4: Automatizar Tareas Git**
```bash
# Comando
claude -p "Crea un script bash que automatice:
1. git add .
2. git commit con mensaje descriptivo
3. git push origin main
4. Mostrar estado final"

# Resultado esperado:
# Script bash completo con:
# - Verificaciones de seguridad
# - Manejo de errores
# - Mensajes informativos
# - Validaciones de estado
```

### **Ejemplo 5: Análisis de Código de Finanzas**
```bash
# Comando (desde el directorio del proyecto)
claude -p "Analiza este archivo de finanzas y sugiere mejoras:
$(cat index.html | head -50)"

# Resultado esperado:
# Claude analizará el código y sugerirá:
# - Mejoras en la estructura
# - Optimizaciones de rendimiento
# - Mejores prácticas
# - Correcciones de seguridad
```

---

## 🔧 **Casos de Uso Avanzados**

### **Trabajo con Archivos:**
```bash
# Analizar archivo específico
claude -p "Revisa este archivo: $(cat mi-archivo.js)"

# Generar tests para un módulo
claude -p "Genera tests unitarios para: $(cat utils.js)"

# Refactorizar código
claude -p "Refactoriza este código para mejor legibilidad: $(cat legacy-code.js)"
```

### **Integración con Git:**
```bash
# Generar mensaje de commit
claude -p "Genera un mensaje de commit para estos cambios: $(git diff --cached)"

# Revisar cambios antes de commit
claude -p "Revisa estos cambios y sugiere mejoras: $(git diff)"

# Generar changelog
claude -p "Genera changelog basado en: $(git log --oneline -10)"
```

### **Desarrollo de Funcionalidades:**
```bash
# Generar función específica
claude -p "Crea una función JavaScript que calcule el patrimonio neto basado en activos y pasivos"

# Crear componente React
claude -p "Crea un componente React para mostrar gráficos de gastos mensuales"

# Generar SQL queries
claude -p "Crea queries SQL para un sistema de finanzas personales"
```

---

## ⚙️ **Configuración Avanzada**

### **Modelos Disponibles:**
```bash
# Usar modelo específico
claude --model sonnet "Tu pregunta aquí"
claude --model opus "Tu pregunta aquí"
claude --model haiku "Tu pregunta aquí"

# Configurar modelo por defecto
claude config set model sonnet
```

### **Herramientas Permitidas:**
```bash
# Permitir herramientas específicas
claude --allowedTools "Bash,Edit,Create" "Tu tarea aquí"

# Denegar herramientas específicas
claude --disallowedTools "Bash" "Tu tarea aquí"
```

### **Modos de Permisos:**
```bash
# Modo de aceptar ediciones automáticamente
claude --permission-mode acceptEdits "Refactoriza este código"

# Modo de bypass de permisos (solo para sandboxes)
claude --dangerously-skip-permissions "Tu tarea aquí"
```

---

## 🐛 **Solución de Problemas**

### **Problemas Comunes:**

1. **Error de API Key:**
```bash
# Verificar API key
echo $ANTHROPIC_API_KEY

# Reconfigurar
claude config set apiKey "tu-nueva-api-key"
```

2. **Problemas de Permisos:**
```bash
# Verificar permisos
claude doctor

# Reinstalar si es necesario
npm uninstall -g @anthropic-ai/claude-code
npm install -g @anthropic-ai/claude-code
```

3. **Problemas de Conexión:**
```bash
# Verificar conectividad
curl -I https://api.anthropic.com

# Verificar configuración de proxy si es necesario
```

---

## 📊 **Comandos de Monitoreo**

```bash
# Ver estado del sistema
claude doctor

# Ver configuración completa
claude config list

# Ver historial de conversaciones
claude -r

# Verificar actualizaciones
claude update
```

---

## 🎯 **Mejores Prácticas**

1. **Usa prompts específicos y claros**
2. **Aprovecha el modo -p para scripts**
3. **Configura herramientas permitidas según necesidad**
4. **Mantén actualizada la API key**
5. **Usa el modo interactivo para tareas complejas**

---

## 📞 **Recursos Adicionales**

- **Documentación oficial:** https://docs.anthropic.com/en/docs/claude-code/overview
- **Repositorio:** https://github.com/anthropics/claude-code
- **Discord:** https://anthropic.com/discord
- **Soporte:** Usar comando `/bug` dentro de Claude Code
