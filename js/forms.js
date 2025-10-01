// Formulario de contacto
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.add('loading');
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // Validar teléfono
    if (!isValidPhone(phone)) {
        showNotification('Por favor, ingresa un número de teléfono válido.', 'error');
        submitBtn.classList.remove('loading');
        return;
    }
    
    // Enviar correo al cliente
    const customerPayload = {
        access_key: "5b4257f1-1e6b-4d3a-9031-95e1df5f7908",
        subject: "Confirmación de contacto - JovGT Soluciones",
        from_name: "JovGT Soluciones",
        email: email,
        text: `¡Gracias por contactarnos, ${name}!\n\nHemos recibido tu solicitud de información sobre ${service}.\n\nTu mensaje: "${message}"\n\nNos pondremos en contacto contigo pronto al teléfono ${phone} para brindarte más información.\n\nAtentamente,\nEl equipo de JovGT Soluciones`,
        botcheck: ""
    };

    // Enviar correo a JovGT Soluciones
    const businessPayload = {
        access_key: "5b4257f1-1e6b-4d3a-9031-95e1df5f7908",
        subject: "Nuevo contacto desde la web - JovGT Soluciones",
        from_name: "JovGT Soluciones - Web",
        email: "jovgtsoluciones@gmail.com",
        text: `Nuevo contacto recibido:\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nServicio de interés: ${service}\nMensaje: ${message}\n\nPor favor, contactar al cliente lo antes posible.`,
        botcheck: ""
    };

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
            showNotification('¡Solicitud enviada con éxito! Te hemos enviado un correo de confirmación.', 'success');
            this.reset();
        } else {
            throw new Error('Error al enviar correo a JovGT: ' + json.message);
        }
    })
    .catch(error => {
        console.error(error);
        showNotification('Error al enviar el formulario: ' + error.message, 'error');
    })
    .finally(() => {
        submitBtn.classList.remove('loading');
    });
});

// Validación de teléfono
function isValidPhone(phone) {
    const re = /^[+]?[\d\s\-()]{8,}$/;
    return re.test(phone);
}