// 📱 OPTIMIZACIONES ESPECÍFICAS PARA MÓVILES ANDROID
// Sistema de mejoras para la experiencia móvil

class MobileOptimizations {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isAndroid = this.detectAndroid();
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        console.log('📱 Inicializando optimizaciones móviles...');
        console.log(`📱 Dispositivo móvil: ${this.isMobile}`);
        console.log(`🤖 Android: ${this.isAndroid}`);
        
        this.init();
    }
    
    // 🔍 Detectar si es dispositivo móvil
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }
    
    // 🤖 Detectar si es Android
    detectAndroid() {
        return /Android/i.test(navigator.userAgent);
    }
    
    // 🚀 Inicializar optimizaciones
    init() {
        if (this.isMobile) {
            this.setupTouchOptimizations();
            this.setupViewportOptimizations();
            this.setupScrollOptimizations();
            this.setupKeyboardOptimizations();
            this.setupGestureOptimizations();
            
            if (this.isAndroid) {
                this.setupAndroidSpecificOptimizations();
            }
        }
    }
    
    // 👆 Optimizaciones táctiles
    setupTouchOptimizations() {
        // Mejorar el feedback táctil
        document.addEventListener('touchstart', (e) => {
            const target = e.target.closest('button, [role="button"], .btn');
            if (target) {
                target.style.transform = 'scale(0.95)';
                target.style.transition = 'transform 0.1s ease';
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const target = e.target.closest('button, [role="button"], .btn');
            if (target) {
                setTimeout(() => {
                    target.style.transform = '';
                }, 100);
            }
        }, { passive: true });
        
        // Prevenir zoom accidental en inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.style.fontSize === '' || parseFloat(input.style.fontSize) < 16) {
                input.style.fontSize = '16px';
            }
        });
    }
    
    // 📱 Optimizaciones de viewport
    setupViewportOptimizations() {
        // Ajustar viewport dinámicamente
        const updateViewport = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        updateViewport();
        window.addEventListener('resize', updateViewport);
        window.addEventListener('orientationchange', () => {
            setTimeout(updateViewport, 100);
        });
    }
    
    // 📜 Optimizaciones de scroll
    setupScrollOptimizations() {
        // Scroll suave para navegación
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Prevenir scroll horizontal accidental
        document.body.style.overflowX = 'hidden';
        
        // Mejorar rendimiento de scroll en listas largas
        const transactionList = document.getElementById('transaction-list');
        if (transactionList) {
            transactionList.style.willChange = 'scroll-position';
        }
    }
    
    // ⌨️ Optimizaciones de teclado
    setupKeyboardOptimizations() {
        // Manejar aparición/desaparición del teclado virtual
        let initialViewportHeight = window.innerHeight;
        
        const handleKeyboard = () => {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            
            if (heightDifference > 150) {
                // Teclado visible
                document.body.classList.add('keyboard-visible');
                
                // Ajustar botón flotante
                const addBtn = document.getElementById('add-transaction-btn');
                if (addBtn) {
                    addBtn.style.bottom = '10px';
                }
            } else {
                // Teclado oculto
                document.body.classList.remove('keyboard-visible');
                
                // Restaurar botón flotante
                const addBtn = document.getElementById('add-transaction-btn');
                if (addBtn) {
                    addBtn.style.bottom = '1.5rem';
                }
            }
        };
        
        window.addEventListener('resize', handleKeyboard);
        
        // Scroll automático a campos de entrada activos
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('input, textarea, select')) {
                setTimeout(() => {
                    e.target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 300);
            }
        });
    }
    
    // 👋 Optimizaciones de gestos
    setupGestureOptimizations() {
        // Swipe para cerrar modales
        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe(e);
        }, { passive: true });
    }
    
    // 👋 Manejar gestos de swipe
    handleSwipe(e) {
        const swipeDistance = this.touchStartY - this.touchEndY;
        const minSwipeDistance = 100;
        
        // Swipe hacia abajo para cerrar modales
        if (swipeDistance < -minSwipeDistance) {
            const modal = e.target.closest('.modal-backdrop');
            if (modal && modal.classList.contains('modal-backdrop')) {
                const closeBtn = modal.querySelector('.js-close-modal, [data-close-modal]');
                if (closeBtn) {
                    closeBtn.click();
                }
            }
        }
    }
    
    // 🤖 Optimizaciones específicas para Android
    setupAndroidSpecificOptimizations() {
        // Mejorar rendimiento en Android Chrome
        document.body.style.webkitTransform = 'translateZ(0)';
        document.body.style.transform = 'translateZ(0)';
        
        // Optimizar animaciones para Android
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 640px) {
                * {
                    -webkit-tap-highlight-color: transparent;
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    user-select: none;
                }
                
                input, textarea, select {
                    -webkit-user-select: text;
                    user-select: text;
                }
                
                .transition-transform {
                    will-change: transform;
                }
                
                .transition-colors {
                    will-change: background-color, color;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Mejorar scroll en Android
        if (CSS.supports('scroll-behavior', 'smooth')) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }
    
    // 🔧 Utilidades adicionales
    static addTouchClass() {
        document.body.classList.add('touch-device');
    }
    
    static optimizeImages() {
        // Lazy loading para imágenes (si las hay)
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }
    
    static preventZoom() {
        // Prevenir zoom en inputs específicos
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    }
}

// 🚀 Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.mobileOptimizations = new MobileOptimizations();
    
    // Aplicar utilidades adicionales
    MobileOptimizations.addTouchClass();
    MobileOptimizations.optimizeImages();
    
    // Solo prevenir zoom si es necesario (comentado por defecto)
    // MobileOptimizations.preventZoom();
});

// 📱 Exportar para uso global
window.MobileOptimizations = MobileOptimizations;
