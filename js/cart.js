// Cart functionality
let cart = [];
let cartCount = 0;

// Cargar carrito desde localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('jovgtCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Guardar carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('jovgtCart', JSON.stringify(cart));
}

function addToCart(productName, price, button) {
    let existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    updateCartCount();
    updateCartDisplay();
    saveCartToStorage();
    
    // Efecto visual en el botón
    button.classList.add('loading');
    setTimeout(() => {
        button.classList.remove('loading');
        showNotification(`${productName} agregado al carrito`, 'success');
    }, 600);
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartCount();
    updateCartDisplay();
    saveCartToStorage();
    showNotification('Producto eliminado del carrito', 'error');
}

function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
    document.getElementById('floatingCartCount').textContent = cartCount;
    
    // Actualizar total flotante
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('floatingCartTotal').textContent = total;
}

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalDiv = document.getElementById('cartTotal');
    const totalAmountSpan = document.getElementById('totalAmount');
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-cart"><p>Tu carrito está vacío</p></div>';
        cartTotalDiv.style.display = 'none';
    } else {
        let html = '';
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Cantidad: ${item.quantity}</p>
                    </div>
                    <div class="cart-item-price">$${itemTotal}</div>
                    <button class="remove-item" onclick="removeFromCart('${item.name}')">Eliminar</button>
                </div>
            `;
        });
        cartItemsDiv.innerHTML = html;
        totalAmountSpan.textContent = total;
        cartTotalDiv.style.display = 'block';
    }
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    updateCartDisplay();
}

// Cerrar modal de checkout
function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Iniciar proceso de checkout
function initiateCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.style.display = 'flex';
}

// Procesar checkout
function processCheckout(userEmail) {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }

    let total = 0;
    let resumen = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        resumen += `• ${item.name} x${item.quantity} = $${itemTotal}\n`;
    });

    // Enviar correo al cliente
    const customerPayload = {
        access_key: "5b4257f1-1e6b-4d3a-9031-95e1df5f7908",
        subject: "Confirmación de pedido - JovGT Soluciones",
        from_name: "JovGT Soluciones",
        email: userEmail,
        text: `¡Gracias por tu pedido! Aquí está el resumen:\n\n${resumen}\nTotal: $${total}\n\nNos pondremos en contacto contigo pronto para confirmar el servicio.\n\nSi tienes alguna pregunta, no dudes en contactarnos.\n\nAtentamente,\nEl equipo de JovGT Soluciones`,
        botcheck: ""
    };

    // Enviar correo a JovGT Soluciones
    const businessPayload = {
        access_key: "5b4257f1-1e6b-4d3a-9031-95e1df5f7908",
        subject: "Nuevo pedido - JovGT Soluciones",
        from_name: "JovGT Soluciones - Web",
        email: "jovgtsoluciones@gmail.com",
        text: `Nuevo pedido recibido:\n\nCliente: ${userEmail}\n\nResumen del pedido:\n${resumen}\nTotal: $${total}\n\nPor favor, contactar al cliente para confirmar el servicio.`,
        botcheck: ""
    };

    // Mostrar indicador de carga
    const checkoutBtn = document.getElementById('checkoutAccept');
    checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    checkoutBtn.disabled = true;

    // Enviar correo al cliente
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(customerPayload)
    })
    .then(async (response) => {
        const json = await response.json();
        if (response.status == 200) {
            // Enviar correo a JovGT Soluciones
            return fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(businessPayload)
            });
        } else {
            throw new Error('Error al enviar correo al cliente: ' + json.message);
        }
    })
    .then(async (response) => {
        const json = await response.json();
        if (response.status == 200) {
            showNotification('¡PEDIDO CONFIRMADO! Se ha enviado un correo con los detalles de tu pedido.', 'success');
            cart = [];
            updateCartCount();
            updateCartDisplay();
            saveCartToStorage();
            closeCheckoutModal();
            document.getElementById('cartModal').style.display = 'none';
        } else {
            throw new Error('Error al enviar correo a JovGT: ' + json.message);
        }
    })
    .catch(error => {
        console.error(error);
        showNotification('Error al procesar el pedido: ' + error.message, 'error');
    })
    .finally(() => {
        checkoutBtn.innerHTML = '<i class="fas fa-check"></i> Aceptar';
        checkoutBtn.disabled = false;
    });
}

// Event listeners para el modal de checkout
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('checkoutAccept').addEventListener('click', function() {
        const emailInput = document.getElementById('checkout-email');
        const email = emailInput.value.trim();
        
        if (email && isValidEmail(email)) {
            processCheckout(email);
        } else {
            emailInput.focus();
            emailInput.style.borderColor = 'var(--secondary)';
            showNotification('Por favor, ingresa un correo electrónico válido.', 'error');
        }
    });

    document.getElementById('checkoutCancel').addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas cancelar? Tu cotización no será procesada.')) {
            closeCheckoutModal();
            showNotification('Operación cancelada. Esperamos verte pronto.', 'error');
        }
    });

    document.getElementById('checkout-email').addEventListener('input', function() {
        this.style.borderColor = '#e9ecef';
    });
});

// Validación de email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}