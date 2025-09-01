#!/bin/bash

# 🚀 Script de Instalación Automática de Claude Dev
# Versión: 1.0
# Autor: Asistente IA
# Fecha: $(date)

set -e  # Salir si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================${NC}\n"
}

# Variables
CLAUDE_REPO="https://github.com/anthropics/claude-code.git"
TEMP_DIR="/tmp/claude-dev-install"
EXTENSION_NAME="claude-dev"

print_header "🚀 INSTALACIÓN AUTOMÁTICA DE CLAUDE DEV"

# Paso 1: Verificar prerrequisitos
print_header "📋 PASO 1: VERIFICAR PRERREQUISITOS"

print_status "Verificando VS Code..."
if command -v code &> /dev/null; then
    VS_CODE_VERSION=$(code --version | head -n 1)
    print_success "VS Code encontrado: $VS_CODE_VERSION"
else
    print_error "VS Code no encontrado. Por favor instala VS Code primero."
    exit 1
fi

print_status "Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js encontrado: $NODE_VERSION"
else
    print_error "Node.js no encontrado. Por favor instala Node.js primero."
    exit 1
fi

print_status "Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm encontrado: $NPM_VERSION"
else
    print_error "npm no encontrado. Por favor instala npm primero."
    exit 1
fi

print_status "Verificando Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    print_success "Git encontrado: $GIT_VERSION"
else
    print_error "Git no encontrado. Por favor instala Git primero."
    exit 1
fi

# Paso 2: Verificar extensión existente
print_header "📋 PASO 2: VERIFICAR EXTENSIÓN EXISTENTE"

print_status "Buscando extensiones Claude existentes..."
EXISTING_CLAUDE=$(code --list-extensions | grep -i claude || true)

if [ ! -z "$EXISTING_CLAUDE" ]; then
    print_warning "Extensiones Claude encontradas:"
    echo "$EXISTING_CLAUDE"
    
    read -p "¿Deseas desinstalar las extensiones existentes? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Desinstalando extensiones Claude existentes..."
        echo "$EXISTING_CLAUDE" | while read extension; do
            if [ ! -z "$extension" ]; then
                print_status "Desinstalando: $extension"
                code --uninstall-extension "$extension"
                print_success "Desinstalado: $extension"
            fi
        done
    fi
else
    print_success "No se encontraron extensiones Claude existentes"
fi

# Paso 3: Limpiar directorio temporal
print_header "📋 PASO 3: PREPARAR ENTORNO"

print_status "Limpiando directorio temporal..."
if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi
mkdir -p "$TEMP_DIR"
print_success "Directorio temporal preparado: $TEMP_DIR"

# Paso 4: Clonar repositorio
print_header "📋 PASO 4: DESCARGAR CÓDIGO FUENTE"

print_status "Clonando repositorio oficial de Claude Dev..."
cd "$TEMP_DIR"
git clone "$CLAUDE_REPO" claude-dev
cd claude-dev

print_success "Repositorio clonado exitosamente"

# Verificar contenido del repositorio
print_status "Verificando estructura del repositorio..."
if [ -f "package.json" ]; then
    print_success "package.json encontrado"
else
    print_error "package.json no encontrado. El repositorio podría estar incompleto."
    exit 1
fi

# Paso 5: Instalar dependencias
print_header "📋 PASO 5: INSTALAR DEPENDENCIAS"

print_status "Instalando dependencias de Node.js..."
npm install
print_success "Dependencias instaladas"

# Paso 6: Compilar extensión
print_header "📋 PASO 6: COMPILAR EXTENSIÓN"

print_status "Compilando extensión..."
if npm run compile; then
    print_success "Compilación exitosa"
else
    print_warning "Comando compile no disponible, intentando build..."
    if npm run build; then
        print_success "Build exitoso"
    else
        print_warning "Comando build no disponible, continuando..."
    fi
fi

# Paso 7: Empaquetar extensión
print_header "📋 PASO 7: EMPAQUETAR EXTENSIÓN"

print_status "Verificando si vsce está disponible..."
if command -v vsce &> /dev/null; then
    print_success "vsce encontrado"
else
    print_status "Instalando vsce globalmente..."
    npm install -g vsce
fi

print_status "Empaquetando extensión..."
vsce package
print_success "Extensión empaquetada"

# Encontrar el archivo .vsix generado
VSIX_FILE=$(find . -name "*.vsix" | head -n 1)
if [ -z "$VSIX_FILE" ]; then
    print_error "No se encontró archivo .vsix generado"
    exit 1
fi

print_success "Archivo .vsix encontrado: $VSIX_FILE"

# Paso 8: Instalar extensión
print_header "📋 PASO 8: INSTALAR EXTENSIÓN"

print_status "Instalando extensión en VS Code..."
code --install-extension "$VSIX_FILE"
print_success "Extensión instalada exitosamente"

# Paso 9: Verificar instalación
print_header "📋 PASO 9: VERIFICAR INSTALACIÓN"

print_status "Verificando instalación..."
sleep 2  # Esperar a que VS Code registre la extensión

INSTALLED_EXTENSIONS=$(code --list-extensions | grep -i claude || true)
if [ ! -z "$INSTALLED_EXTENSIONS" ]; then
    print_success "Extensión Claude Dev instalada correctamente:"
    echo "$INSTALLED_EXTENSIONS"
else
    print_warning "La extensión podría no haberse registrado aún. Reinicia VS Code."
fi

# Paso 10: Limpiar archivos temporales
print_header "📋 PASO 10: LIMPIEZA"

print_status "Limpiando archivos temporales..."
cd /
rm -rf "$TEMP_DIR"
print_success "Archivos temporales eliminados"

# Paso 11: Instrucciones finales
print_header "🎉 INSTALACIÓN COMPLETADA"

print_success "Claude Dev ha sido instalado exitosamente!"
echo
print_status "PRÓXIMOS PASOS:"
echo "1. Reinicia VS Code"
echo "2. Ve a https://console.anthropic.com para obtener tu API Key"
echo "3. En VS Code, ve a Configuración (Ctrl+,) y busca 'Claude'"
echo "4. Ingresa tu API Key en la configuración"
echo "5. Usa Ctrl+Shift+P y busca comandos 'Claude' para empezar"
echo
print_warning "IMPORTANTE: Necesitarás una API Key válida de Anthropic para usar la extensión."
echo
print_success "¡Disfruta usando Claude Dev!"
