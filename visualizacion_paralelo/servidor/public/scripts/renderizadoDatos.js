

/*Realizar una funcion que recorra todo el string HTML buscando los caracteres {{{ }}} o {{ }}

La funcion se ejecutara cuando se cargue la pagina inicial.

Si localiza un elemento { } enviará el string HTML y la etiqueta contenida entre braquets al servidor a través de una peticion POST.

En el servidor se realizara el renderizado y se volvera a enviar la respuesta al cliente donde se volvera a ejecutar la funcion hasta que ya no queden braquets.

*/


/*const url = 'http://localhost:8080'

$(function() {

    const listaPerros = $('#Perros')
    const listaGatos = $('#Gatos')

    const mascota = $('.pet')

    console.log(mascota);

    function getPets() {
    	return $.ajax({
	    	dataType:'json',
	    	type: 'GET',
	    	url: url +'/templates'
    	});
    }

    var getData = function(response) {

        const petData = response.find(animal => animal.name==="Purrsloud");

        const htmlMascota = mostrarMascota(petData)
        
        final = mascota.replaceWith(htmlMascota)

        console.log('Final')
        console.log(final)

        const listaPieza = $('#Barksalot').children().attr("href")

        console.log(listaPieza)

    }

    const algo = $('#Perros a[href^="/templates"]');
    console.log('dasds')
    console.log(algo)
    
    


    $(getPets().done(getData))
});*/

/*$('#Barksalot').click(e => {

    const hrefURL = $('#Barksalot').children().attr("href")
    console.log(url + hrefURL)
    return $.ajax({
            dataType:'json',
            type: 'GET',
            url: url + hrefURL
        });

    var getData2 = function(response) {
        console.log(response)
    }




},  $(getPet().done(getData2)));*/

