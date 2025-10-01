// Variables globales
let currentSlide = 0;
let currentCategory = 'all';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    // Loader de página
    window.addEventListener('load', () => {
        const pageLoader = document.querySelector('.page-loader');
        setTimeout(() => {
            pageLoader.classList.add('hidden');
        }, 1000);
    });

    // Inicializar la hora del primer mensaje del chat
    document.getElementById('initialMessageTime').textContent = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // Configurar event listeners
    initializeEventListeners();
    
    // Cargar carrito desde localStorage
    loadCartFromStorage();
    
    // Iniciar slider automático
    startSlider();
}

function initializeEventListeners() {
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Botón volver arriba
    document.getElementById('backToTop').addEventListener('click', scrollToTop);
    
    // Menú móvil
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Close modals when clicking outside
    window.onclick = function(event) {
        const cartModal = document.getElementById('cartModal');
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
        
        const chatWidget = document.getElementById('chatWidget');
        if (event.target === chatWidget) {
            toggleChat();
        }
        
        const checkoutModal = document.getElementById('checkoutModal');
        if (event.target === checkoutModal) {
            closeCheckoutModal();
        }
    };

    // Animación de elementos al cargar la página
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

function handleScroll() {
    updateProgressBar();
    toggleHeaderScrolled();
    toggleBackToTop();
    animateOnScroll();
}

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
}

function toggleHeaderScrolled() {
    const header = document.getElementById('mainHeader');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function toggleBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

function animateOnScroll() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Slider functionality
function moveSlide(direction) {
    const slider = document.getElementById('repairSlider');
    const slides = slider.children.length;
    
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = slides - 1;
    if (currentSlide >= slides) currentSlide = 0;
    
    updateSlider();
}

function updateSlider() {
    const slider = document.getElementById('repairSlider');
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function startSlider() {
    setInterval(() => {
        moveSlide(1);
    }, 8000);
}

// Filtrado de productos
function filterCategory(category) {
    currentCategory = category;
    
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(category) || (category === 'all' && btn.textContent.toLowerCase() === 'todos')) {
            btn.classList.add('active');
        }
    });
    
    filterProducts();
}

function filterProducts() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        const searchKeywords = product.getAttribute('data-search');
        const matchesCategory = currentCategory === 'all' || productCategory === currentCategory;
        const matchesSearch = searchKeywords.includes(searchText);
        
        if (matchesCategory && matchesSearch) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Notificaciones
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}