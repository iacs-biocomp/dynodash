
const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:3000/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

let usuario = null;
let socket  = null;

const botonCarga = document.getElementById('botonCarga');
const botonAcceso = document.getElementById('botonAcceso');
const lista = document.getElementById('mensajes');

// Validar el token del localstorage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';
    console.log(token)

    /*if ( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }*/

    const resp = await fetch( url + 'profile', {
        headers: {
            'Authorization' : 'bearer' + ' ' + token
            }
    });

    const { userId, username } = await resp.json();
    localStorage.setItem('token', token );
    usuario = userId;
    console.log(usuario);
    document.title = username;

    
}



botonCarga.addEventListener('click',async ev => {
    ev.preventDefault();

    const token = localStorage.getItem('token');

    //fetch a method get that return a html piece
    const listaPieza = await fetch(url + 'html', {
        method: 'GET',
        headers: {
            'Authorization': 'bearer' + ' ' + token
        }
    })

    lista.innerHTML = listaPieza;

});

botonAcceso.addEventListener('click', ev => {
    ev.preventDefault();

    const token = localStorage.getItem('token');

    fetch
});

const main = async() => {
    // Validar JWT
    await validarJWT();
}

main();

/*(()=>{
    gapi.load('auth2', () => {
        gapi.auth2.init();
        main();
    });
})();*/