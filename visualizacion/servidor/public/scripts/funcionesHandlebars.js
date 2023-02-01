

function hacerLista(array) {

    console.log(array)

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
    //console.log(pets);

    //Creacion del HTML
    const html = compiledTemplate({pets});
    return html;
}

function mostrarMascota(pet) {
    const template = `{{#with pet}}
    <div class="{{name}}">
        <div class="photo-column">
          <img src="{{photo}}">
        </div>
    
        <div class="info-column">
          <h2>{{name}} <span class="species">({{species}})</span></h2>
    
          {{#if favFoods}}
          <h4 class="headline-bar">Favorite Foods</h4>
          <ul class="favorite-foods">
            {{#each favFoods}}
              <li>{{{this}}}</li>
            {{/each}}
          </ul>
          {{/if}}
    
        </div>
      </div>
    {{/with}}`

    const compileTemplate = Handlebars.compile(template);

    const html = compileTemplate({pet})

    return html;

}

