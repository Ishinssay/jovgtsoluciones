// Chat functionality
function toggleChat() {
    const widget = document.getElementById('chatWidget');
    const toggle = document.getElementById('chatToggle');
    
    if (widget.classList.contains('open')) {
        widget.classList.remove('open');
        toggle.classList.remove('hidden');
    } else {
        widget.classList.add('open');
        toggle.classList.add('hidden');
    }
}

function quickReply(message) {
    document.getElementById('chatInput').value = message;
    sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (message === '') return;
    const currentTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    addMessageToChat(message, 'user', currentTime);
    input.value = '';
    showTypingIndicator();
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        const responseTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        addMessageToChat(response, 'bot', responseTime);
    }, 1500 + Math.random() * 1000);
}

function addMessageToChat(message, sender, time) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    const avatar = sender === 'user' ? '👤' : '🤖';
    const avatarClass = sender === 'user' ? 'user-avatar' : 'bot-avatar';
    messageDiv.innerHTML = `
        <div class="message-avatar ${avatarClass}">${avatar}</div>
        <div class="message-content">
            <div class="message-bubble">${message}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'block';
    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'none';
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const intents = {
        greeting: {
            keywords: ['hola', 'buen', 'hey', 'saludo', 'tarde', 'día', 'noche'],
            responses: ["¡Hola! 👋 Bienvenido a JovGT Soluciones. Soy tu asistente virtual experto en soporte técnico. ¿En qué puedo asistirte hoy?"]
        },
        prices: {
            keywords: ['precio', 'costo', 'cuanto', 'valor', 'formateo','formatear'],
            responses: ["Te comparto nuestros precios actualizados 💰:\n• Formateo de PC: $25.000\n• Instalación de Sistema: $20.000\n• Backup y Recuperación: $35.000\n• Eliminación de Virus: $30.000\n• Cotizaciones y cambios de Hardware: $35.000\n• Mantenimiento Preventivo: $30.000\n• Cambio de Pantalla Móvil: $45.000\n• Cambio de Batería Móvil: $35.000\n• Actualización de Software Móvil: $25.000\n• Diagnóstico Completo Móvil: $15.000"]
        },
        virus: {
            keywords: ['virus', 'malware', 'antivirus', 'lento', 'formateo', 'formatear'],
            responses: ["🔒 ¡No te preocupes! Somos expertos en eliminación de virus y malware. Por $30.000 hacemos una limpieza completa de tu sistema, instalamos antivirus y te damos recomendaciones para prevenir futuras infecciones."]
        },
        moviles: {
            keywords: ['móvil', 'celular', 'pantalla', 'batería', 'smartphone', 'android', 'iphone'],
            responses: ["📱 ¡Somos especialistas en reparación de móviles! Ofrecemos:\n• Cambio de pantalla: $45.000\n• Cambio de batería: $35.000\n• Actualización de software: $25.000\n• Diagnóstico completo: $15.000\nTrabajamos con todas las marcas y modelos. ¿Qué problema tiene tu dispositivo?"]
        },
        agenda: {
            keywords: ['agendar', 'cita', 'horario', 'disponibilidad', 'tiempo'],
            responses: ["📅 Puedes agendar un servicio contactándonos directamente por correo (jovgtsoluciones@gmail.com) o completando el formulario de contacto en nuestra página. Normalmente tenemos disponibilidad dentro de las 24-48 horas."]
        },
        urgencia: {
            keywords: ['urgente', 'rápido', 'prioridad', 'inmediato', 'ahora'],
            responses: ["⚡ Para servicios urgentes, contamos con atención prioritaria. Te recomiendo llamarnos directamente o enviar un correo marcando ASUNTO URGENTE para una respuesta más rápida."]
        }
    };
    
    for (const [intent, data] of Object.entries(intents)) {
        for (const keyword of data.keywords) {
            if (message.includes(keyword)) {
                return data.responses[0];
            }
        }
    }
    
    return "Gracias por tu consulta. Como experto en soporte técnico, te puedo orientar sobre el mejor servicio para tu caso. ¿Puedes describirme un poco más la situación?";
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}