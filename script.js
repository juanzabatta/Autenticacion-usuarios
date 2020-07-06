//Al presionar el botón de entrar
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [Cierra sesión]
        firebase.auth().signOut();

    } else {
        //Obtiene los datos de los inputs
        var $signInEmail = document.getElementById('signInEmail').value;
        var $signInPassword = document.getElementById('signInPassword').value;

        //Verificación rápida de los campos
        if ($signInEmail.length < 4) {
            alert('Por favor agrega un correo válido.');
            return;
        }
        if ($signInPassword.length < 6) {
            alert('La contraseña debe ser superior a 6 caracteres.');
            return;
        }
        // Inicia sesión con correo y contraseña.
        // [Comienza authwithemail]
        firebase.auth().signInWithEmailAndPassword($signInEmail, $signInPassword)
            .then(function () {
                //Colocar lo que va a hacer luego de iniciar sesión
                // alert("Inicio correcto");

            })
            .catch(function (error) {
                // Manejo de errores.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [conversión y muestreo de errores de código]
                if (errorCode === 'auth/wrong-password') {
                    alert('Contraseña incorrecta.');
                } else if (errorCode === 'auth/user-not-found') {
                    alert('El correo electrónico no está registrado.');
                } else {
                    alert(errorMessage);
                }
                console.log(errorCode);
                console.log(errorMessage);
                //si hay error se deshabilita el botón de entrar
                document.getElementById('signIn').disabled = false;
            });
    }
    document.getElementById('signIn').disabled = true;
}




//Al presionar el botón de registro.
function handleSignUp() {
    //Obtiene los datos de los inputs
    var $registerEmail = document.getElementById('registerEmail').value;
    var $registerPassword = document.getElementById('registerPassword').value;

    //Verificación rápida de los campos
    if ($registerEmail.length < 4) {
        alert('Por favor agrega un correo válido.');
        return;
    }
    if ($registerPassword.length < 6) {
        alert('La contraseña debe ser superior a 6 caracteres.');
        return;
    }
    // Crea el usuario con correo y contraseña.
    // [Comienza createwithemail]
    firebase.auth().createUserWithEmailAndPassword($registerEmail, $registerPassword)
        .then(function () {
            //Colocar lo que va a hacer luego de registrarse
            sendEmailVerification();
            alert("Registro satisfactorio, por favor verifica tu correo electrónico");

        })
        .catch(function (error) {
            // Manejo de errores.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [conversión y muestreo de errores de código]
            if (errorCode == 'auth/weak-password') {
                alert('La contraseña es demasiado corta.');
            } else if (errorCode === 'auth/user-not-found') {
                alert('El correo electrónico no está registrado.');
            } else if (errorCode === 'auth/email-already-in-use') {
                alert('La dirección de correo electrónico ya está siendo utilizada por otra cuenta..');
            } else {
                alert(errorMessage);
            }
            console.log(errorCode);
            console.log(errorMessage);

        });
}




//Está disponible solo si el usuario entra a su cuenta
//Enviar el correo de verificación
function sendEmailVerification() {
    // [Comienza sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        // Correo enviado
        // alert('¡Correo de verificación enviado satisfactoriamente!');
    });
}




//Enviar el correo de restablecer contraseña
function sendPasswordReset() {
    //Obtiene los datos de los inputs
    var $signInEmail = document.getElementById('signInEmail').value;

    // [Comienza sendpasswordemail]
    firebase.auth().sendPasswordResetEmail($signInEmail).then(function () {
        // Correo enviado
        alert('Correo de reestablecimiento de contraseña enviado!');
    }).catch(function (error) {
        // Manejo de errores.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [conversión y muestreo de errores de código]
        if (errorCode == 'auth/invalid-email') {
            alert('La dirección de correo electrónico ingresado parece ser invalida');
        } else if (errorCode == 'auth/user-not-found') {
            alert('El correo ingresado no está registrado');
        }
        console.log(errorCode);
        console.log(errorMessage);
    });
}






/*
  initApp se encarga de configurar los eventos de escucha de la interfaz de usuario y de registrar los oyentes de Firebase:
  - firebase.auth().onAuthStateChanged:  Este oyente se llama cuando el usuario se conecta o se desconecta y es ahí donde actualizamos la UI.
 */
function initApp() {
    // Escuchar los cambios de estado de auth.
    // [Comienza authstatelistener]
    firebase.auth().onAuthStateChanged(function (user) {
        document.getElementById('signInContentAlert').hidden = true;

        if (user) {
            // Sesión iniciada.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;

            console.log('***************');
            console.log(emailVerified);
            console.log('***************');

            document.getElementById('signInStatus').textContent = 'Sesión iniciada';
            document.getElementById('signIn').textContent = 'Salir';




            if (emailVerified) {
                document.getElementById('verifyEmail').hidden = true;
                showContent(user)
            } else {
                document.getElementById('verifyEmail').hidden = false;
            }
        } else {
            // Sesión cerrada.
            document.getElementById('signInStatus').textContent = 'Sesion cerrada';
            document.getElementById('signIn').textContent = 'Acceder';
            document.getElementById('signInContent').hidden = true;
            document.getElementById('signInContentAlert').hidden = true;
        }

        document.getElementById('signIn').disabled = false;
    });

    //Eventos de click
    document.getElementById('signIn').addEventListener('click', toggleSignIn, false);
    document.getElementById('signUp').addEventListener('click', handleSignUp, false);
    document.getElementById('verifyEmail').addEventListener('click', sendEmailVerification, false);
    document.getElementById('passwordReset').addEventListener('click', sendPasswordReset, false);
}




function showContent(user) {
    document.getElementById('userWelcome').textContent = user.email;
    document.getElementById('signInContentAlert').hidden = false;
    document.getElementById('signInContent').hidden = false;

}




window.onload = function () {
    initApp();
};
