auth.onAuthStateChanged(user => {
    console.log(user);
    if (user) {
        db.collection('platillos').onSnapshot(snapshot => {
            obtienePlatillos(snapshot.docs);
        });

        configurarMenu(user);

    } else {
        obtienePlatillos([]);
        configurarMenu();
    }
});

const formaingresar = document.getElementById("formaingresar");

formaingresar.addEventListener('submit', (e) => {
    e.preventDefault();
    let correo = formaingresar['correo'].value;
    let contrasena = formaingresar['contrasena'].value;

    auth.signInWithEmailAndPassword(correo, contrasena).then(cred => {
        console.log("Entro");
        $('#ingresarmodal').modal('hide');
        formaingresar.reset();
        formaingresar.querySelector('.error').innerHTML = '';
    }).catch(err => {
        console.log(err);
        formaingresar.querySelector('.error').innerHTML = messageError(err.code);
    });
});

function messageError(codigo) {
    let message = '';
    switch (codigo) {
        case 'auth/wrong-password':
            message = "Contraseña Incorrecta";
            break;
        case 'auth/user-not-found':
            message = "Usuario no encontrado";
            break;
        case 'auth/weak-password':
            message = "Contraeña débil";
            break;
        default:
            message = "Hubo un error";
    }
    return message;
}

const salir = document.getElementById("salir");
salir.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        alert('Se ha cerrado sesión');
    });
});

const formaregistrate = document.getElementById('formaregistrar');

formaregistrate.addEventListener('submit', (e) => {
    e.preventDefault();

    const correo = formaregistrate['rcorreo'].value;
    const contrasena = formaregistrate['rcontrasena'].value;

    auth.createUserWithEmailAndPassword(correo, contrasena).then(cred => {
        return db.collection('usuarios').doc(cred.user.uid).set({
            nombre: formaregistrate['rnombre'].value,
            telefono: formaregistrate['rtelefono'].value,
            direccion: formaregistrate['rdireccion'].value
        });
    }).then(() => {
        $('#registrarmodal').modal('hide');
        formaregistrate.reset();
        formaregistrate.querySelector('.error').innerHTML = '';
    }).catch(err => {
        formaregistrate.querySelector('.error').innerHTML = messageError(err.code);
    });
});

entrarGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
        var token = result.credential.accessToken;

        console.log(token);

        var user = result.user;

        let html = `
        
        <p style="color:black"> Nombre: ${user.displayName} </p>
        <p style="color:black"> Email: ${user.email} </p>
        <img src="${user.photoURL}">
        `;

        datosdelacuenta.innerHTML = html;

        $('#ingresarmodal').modal('hide');
        formaingresar.reset();
        formaingresar.querySelector('.error').innerHTML = '';

    }).catch(function (error) {
        console.log(error);
    })
}