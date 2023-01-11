
const buscador = document.querySelector('input');
const boton = document.querySelector('button');

boton.addEventListener('click', () => {

    const valor = buscador.value
    console.log(valor)
    
    const url = 'http://localhost:8080/templates/'

    fetch(url + valor, {
        method: 'GET',
    });

});
