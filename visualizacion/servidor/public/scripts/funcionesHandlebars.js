

function hacerLista(array) {

    Handlebars.registerHelper('lista', function(items, options) {
        
            
        //Comprobar que se reciben datos para generar el HTML
            
        if(Object.keys(items).length !== 0){
            //const h2 = "<h2>Selecciona una opción</h2>\n"
            const itemsAsHtml = items.map(pet => '<li><a class="btn btn-primary btn-lg" role="button" href="/templates/'+ options.fn(pet.name) +'" '+ 'role="button">' + options.fn(pet.name) + "</a>" +"</li>");
            return itemsAsHtml.join("\n"); 
        }
        return "<p>No hay opciones disponibles.</p>"
    });


    //Recibo la plantilla de la DB Plantillas
    const template = `{{#if pets}}{{#lista pets}}{{this}}{{/lista}}{{/if}}`;

    const compiledTemplate = Handlebars.compile(template, {knownHelpers: {'lista':true}, knownHelpersOnly:true});
    //console.log(compiledTemplate)

    //Recibo los datos de la DB Datos
    console.log("Datos recuperados")
    const pets = array;
    console.log(pets);

    //Creacion del HTML
    const html = compiledTemplate({pets});
    return html;
}

