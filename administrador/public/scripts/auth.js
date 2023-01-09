
const miFormulario = document.querySelector('form');


const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:3000/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';



miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for( let el of miFormulario.elements ) {
        if ( el.name.length > 0 ) 
            formData[el.name] = el.value
    }
    console.log(formData);

    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() ) //this is the readable stream
    .then(({access_token}) => {

        console.log(access_token)
        //only save the token in the local storage when the server returns a validated token
        if(access_token!==undefined){
            localStorage.setItem('token', access_token);
            window.location = 'portal.html'
        }
        //window.location = 'chat.html';
    })
    .catch( err => {
        console.log(err)
    })
    
});

