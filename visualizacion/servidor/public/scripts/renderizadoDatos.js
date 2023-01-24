

/*Realizar una funcion que recorra todo el string HTML buscando los caracteres {{{ }}} o {{ }}

La funcion se ejecutara cuando se cargue la pagina inicial.

Si localiza un elemento { } enviará el string HTML y la etiqueta contenida entre braquets al servidor a través de una peticion POST.

En el servidor se realizara el renderizado y se volvera a enviar la respuesta al cliente donde se volvera a ejecutar la funcion hasta que ya no queden braquets.

*/



$(function() {


    const url = 'http://localhost:8080/'

    const listaPerros = $('#Perros')
    const listaGatos = $('#Gatos')

    console.log(listaPerros);

    function getPets() {
    	return $.ajax({
	    	dataType:'json',
	    	type: 'GET',
	    	url: url +'templates'
    	});
    }

    var getData = function(response) {
        //console.log(response[0]);

        //Creaar lista perros

        const perros = response.filter(animal => animal.species==="Dog")
        console.log(perros)
        
        const htmlPerros = hacerLista(perros)
        


        let final = listaPerros.append(htmlPerros)

        const gatos = response.filter(animal => animal.species==="Cat")
        console.log(perros)
        
        const htmlGatos = hacerLista(gatos)
        


        final = listaGatos.append(htmlGatos)

        console.log('Final')
        console.log(final)

    }

    $(getPets().done(getData))
});




/*window.onload = renderizaoConDatos();

function renderizaoConDatos() {
    console.log(listaPerros)
}*/

