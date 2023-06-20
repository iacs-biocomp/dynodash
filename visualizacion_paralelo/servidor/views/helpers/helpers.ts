import * as Handlebars from "handlebars";

import {  } from "../../src/app.service";

/*module.exports = {
    makeupper: function(msg) {
        return msg.toUpperCase();
    },
    makebold: function(msg) {
        return new Handlebars.SafeString("<strong>"+msg+"</strong>");
    },
    bold: function(options) {
        return new Handlebars.SafeString('<div class="font-italic">' + options.fn(this) + "</div>").toString();
    },
    lista: function(items, options) {
        
        
        //Comprobar que se reciben datos para generar el HTML
         
        if(Object.keys(items).length !== 0){
            const h2 = "<h2>Selecciona una opción</h2>\n"
            const itemsAsHtml = items.map(pet => '<a class="btn btn-primary btn-lg" role="button" href="/templates/'+ options.fn(pet.name) +'" '+ 'role="button">' + options.fn(pet.name) + "</a>" +"<br>");
            return h2 + itemsAsHtml.join("\n"); 
        }
        return "<p>No hay opciones disponibles.</p>"
    }
    
}*/

export function makeupper(msg) {
    return msg.toUpperCase();
}

export function makebold(msg) {
    return new Handlebars.SafeString("<strong>"+msg+"</strong>");
}

export function bold(options) {
    return new Handlebars.SafeString('<div class="font-italic">' + options.fn(this) + "</div>").toString();
}

export function lista(items, options) {
        
    /**
     * Comprobar que se reciben datos para generar el HTML
     */
    if(Object.keys(items).length !== 0){
        const h2 = "<h2>Selecciona una opción</h2>\n"
        const itemsAsHtml = items.map(pet => '<a class="btn btn-primary btn-lg" role="button" href="/templates/'+ options.fn(pet.name) +'" '+ 'role="button">' + options.fn(pet.name) + "</a>" +"<br>");
        return h2 + itemsAsHtml.join("\n"); 
    }
    return "<p>No hay opciones disponibles.</p>"
}

