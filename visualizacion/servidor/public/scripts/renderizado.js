

/*Realizar una funcion que recorra todo el string HTML buscando los caracteres {{{ }}} o {{ }}

La funcion se ejecutara cuando se cargue la pagina inicial.

Si localiza un elemento { } enviará el string HTML y la etiqueta contenida entre braquets al servidor a través de una peticion POST.

En el servidor se realizara el renderizado y se volvera a enviar la respuesta al cliente donde se volvera a ejecutar la funcion hasta que ya no queden braquets.

*/


// Seleccion del contenido del body. Return String
const cuerpo = document.querySelector('body').innerHTML;

const url = 'http://localhost:8080/'


window.onload = renderizado(cuerpo);

function renderizado(cuerpo) {



    const elementos = cuerpo.split('}}}');
    console.log("Longitud ", elementos.length)

    //Si no se ha detectado ningun elemento }} entonces se inserta el html final completamente renderizado.
    if(elementos.length<=1) {
        document.body.innerHTML = cuerpo;
        return;
    }

    const elementoCompilar = []

    elementoCompilar.push(elementos[0]+'}}}')
    elementoCompilar.push(elementos.slice(1).join('}}}'))

    const re = /\{{{(.*?)\}}}/;

    //obtiene la etiqueta entre llaves
    const etiqueta = elementoCompilar[0].match(re)[1];

    
    fetch(url+'renderizar', {
        method: 'POST',
        body: JSON.stringify({
            'etiqueta': etiqueta,
            'html' : elementoCompilar[0]
        }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() ) // resp.text()
    .then( ({ html }) => { // html en texto
        if( html ){
            console.log("Respuesta")
            console.log(html);
        }
        //htmlFinal += html + elementoCompilar[1]
        //console.log("HTML final",htmlFinal)
        renderizado(html + elementoCompilar[1]);
    })
    .catch( err => {
        console.log(err)
    });
    
}
