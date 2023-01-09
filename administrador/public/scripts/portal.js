
const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:3000/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

let usuario = null;
let socket  = null;

const miContenido = document.querySelector('form');
const boton = document.querySelector('button')


// Validar el token del localstorage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';
    console.log(token)

    const resp = await fetch( url + 'profile', {
        headers: {
            'Authorization' : 'bearer' + ' ' + token
            }
    });

    const { userId, username } = await resp.json();
    //localStorage.setItem('token', token );
    usuario = userId;
    console.log(usuario);
    document.title = username;
    
}

boton.addEventListener('click',async ev => {
    //ev.defaultPrevented();

    const token = localStorage.getItem('token') || '';

    const formData = {};

    for( let el of miContenido.elements ) {
        if ( el.name.length > 0 ) 
            formData[el.name] = el.value
    }

    fetch('http://localhost:3000/templates', {
    method: "POST",
    body: JSON.stringify({
        token: token,
        data : formData
    }),
    headers: {
        "Content-type": "application/json",
        }
    })

});



const main = async() => {
    // Validar JWT
    //await validarJWT();

}

main();