// Función para manejar el envío del formulario de contraseña
function handlePasswordSubmit(event) {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario

    const password = document.getElementById('password').value;
    const email = new URLSearchParams(window.location.search).get('email'); // Obtiene el email de la URL

    if (!password) {
        alert('Por favor, ingrese su contraseña.');
        return;
    }

    // Enviar la contraseña y el correo al servidor para validación
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email, contrasena: password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor.');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Redirigir al usuario a la página principal o dashboard
            window.location.href = '/home.html';
        } else {
            alert('Credenciales incorrectas.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al verificar las credenciales.');
    });
}

// Asociar la función de envío del formulario al evento de submit
document.getElementById('passwordForm')?.addEventListener('submit', handlePasswordSubmit);
