// Función para verificar el correo y redirigir al formulario de contraseña
function verifyAndRedirect() {
    const email = document.getElementById('email').value;

    // Validar si el correo no está vacío
    if (!email) {
        alert('Por favor, ingrese su correo electrónico.');
        return;
    }

    // Enviar el correo al servidor para verificar si existe
    fetch('/verify-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email }),
    })
    .then(response => {
        // Verificar si la respuesta fue exitosa (status 2xx)
        if (!response.ok) {
            // Si no es exitosa, lanzar un error con el código de estado
            throw new Error('Error en el servidor: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        // Si el correo existe, redirigir al formulario de contraseña
        if (data.exists) {
            window.location.href = '/password?email=' + encodeURIComponent(email);
        } else {
            alert('Este correo no está registrado.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Mostrar un mensaje de error al usuario
        alert('Ocurrió un error al verificar el correo: ' + error.message);
    });
}

// Solo se ejecuta el código del formulario de login si el formulario está presente
document.addEventListener('DOMContentLoaded', function() {
    // Manejo del formulario de inicio de sesión
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            verifyAndRedirect();
        });
    } else {
        console.error("El formulario 'loginForm' no se encuentra en el DOM.");
    }

    // Manejo del formulario de registro solo si está presente en el DOM
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

            // Obtener los valores de los campos del formulario
            const correo = document.getElementById('correo').value;
            const contrasena = document.getElementById('contrasena').value;

            // Validar que ambos campos estén llenos
            if (!correo || !contrasena) {
                alert('Por favor, ingrese correo y contraseña.');
                return;
            }

            // Crear un objeto con los datos del formulario
            const data = {
                correo: correo,
                contrasena: contrasena
            };

            // Enviar los datos al servidor como JSON
            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);  // Mostrar mensaje de éxito
                    window.location.href = '/';  // Redirigir a la página de inicio o login
                } else {
                    alert('Error al registrar el usuario.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al registrar el usuario.');
            });
        });
    } else {
        
    }
});
