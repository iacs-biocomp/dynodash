import { Injectable } from "@nestjs/common";
import { AppService } from "src/app.service";

@Injectable()
export class Funciones {

    constructor(private appService: AppService) {}

    buscadorEtiquetas(plantilla : string) : string[] {
        const re = /\{([^{}][^{}]*)\}/g;

        //regex to find #each
        //const reEach = /\{#each([^{}][^{}]*)\}/g;
    
        //obtiene la etiqueta entre llaves y se devuelve un array con las etiquetas
        const matches = [...plantilla.matchAll(re)].flat();
        
        const etiquetas = matches.filter(item => matches.indexOf(item)%2 != 0);
    
        return etiquetas;
    }

    crearJSON(etiquetas : string[]) {
        //Se usan las etiquetas para buscar las plantillas en la base de datos, se crea un JSON con ellas y se devuelve el JSON
    let data = "";
    for(let i = 0 ; i < etiquetas.length; i++) {

      const datos = this.appService.getData(etiquetas[i]);

      console.log("Datos en crearJSON")
      console.log(datos)

      if(i==etiquetas.length-1) {
        data += datos
      }else{
        data += datos + ",";
      }

    }
    console.log("{"+data+"}")

    const json = JSON.parse("{"+data+"}");

    return json;
    }


}
        


