function parseador(escala, datos) {
    //console.log('datos inicio',datos)
    //console.log(escala)
    const arrayDatos = []
    if(escala == 'as') {
      datos.forEach(element => {
        arrayDatos.push({codigo: element.code_as, nombre: element.snombre, value: element.value})
      });
      return arrayDatos
    }
    
    if(escala == 'zbs') {
      datos.forEach(element => {
        arrayDatos.push({codigo: element.code_zbs, nombre: element.znombre, value: element.value})
      });
      return arrayDatos
    }
    return arrayDatos
  }