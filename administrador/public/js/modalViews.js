
$(function () {

  let contenedorTarget;
  let imagesContenido = [];

  const url = 'http://localhost:3000';

  /**
 * Evento para obtener el contedor en el que se a clicado el icono de insertar
 */
  $(this).on('click', '#insertarTemplate, #eliminarTemplate', function (event) {
    let elemento = event.target;
    contenedorTarget = $(elemento).closest(".nav").parent()
  })

  /**
* Llamada ajax de las imagenes contenidas en la base de datos.
*/
  $.ajax(url + '/images', {
    type: 'get',
    dataType: 'json',
    success: function (data) {
      console.log("se ha hecho la llamada")
      imagesContenido = data
    },
    error: function (jqhxr, textStatus, error) {
      alert('Error: ' + textStatus + ' ' + error);
    },
  });

  $('#modalWindowCrearDash .modal-body #error').hide();


  /**
  * Acciones en la ventana modal de insertar contenido
  */
  const fullscreenModal = document.getElementById('fullscreenModal');

  // Bind a function to the "shown.bs.modal" event of the modal
  fullscreenModal.addEventListener('shown.bs.modal', function (event) {

    /*
      Funcion que inserta las imagenes con un elemento checkbox debajo en las columnas del grid de la página.
    */
    function formatearImagenes(data) {

      let indexMapa = 1;
      let indexGraph = 1;
      let indexLegend = 1;

      data.forEach((element, index) => {
        const { name, content, format, type } = element;
        let pestanna;

        if (type === 'map') {
          pestanna = '#mapas'
          index = indexMapa
          indexMapa++
        }

        if (type === 'graph') {
          pestanna = '#graficos'
          index = indexGraph
          indexGraph++
        }

        if (type === 'legend') {
          pestanna = '#leyendas'
          index = indexLegend
          indexLegend++
        }

        let label = `<div class="item${name}">
      <label class="form-check-label" for="img${name}">
        ${name}
      </label>
    </div>`;
        if (index > 3) {
          index -= 3;
        }
        $(`${pestanna} .row:first() > :nth-child(${index})`).append(
          `<div class="img"><img src='data:${format};base64,${content}' class="img-fluid" alt="${name}"/>
          ${label}
        </div><br>`,
        );
      });
    }

    formatearImagenes(imagesContenido)

    /**
     * Evento que elimina 
     */
    $(this).on('click', '.btn-close', function () {
      $('#mapas .row:first()').children().empty()
      $('#graficos .row:first()').children().empty()
      $('#leyendas .row:first()').children().empty()
    })

    $(this).on('click', '.img', function () {
      let imagen = $(this).find('img')
      let children = contenedorTarget.children('img')
      let icons = contenedorTarget.children('.nav')
      contenedorTarget.empty()
      contenedorTarget.append(children).append(imagen).append(icons)
      $('#mapas .row:first()').children().empty()
      $('#graficos .row:first()').children().empty()
      $('#leyendas .row:first()').children().empty()
      $('#fullscreenModal').modal('hide');
    })

  });

  /**
   * Acciones en la ventana modal de eliminar contenido
   */

  $('button#aceptarEliminarContenido').on('click', function () {
    let icons = contenedorTarget.children('.nav')
    contenedorTarget.empty()
    contenedorTarget.text('Contenedor')
    contenedorTarget.append(icons)
  })


  /**
  * Acciones en la ventana modal de crear contenido
  */
  let frame = 1;
  let arrayWidgets = []


  //funcion para loopear los elementos en busca de filas
  //si tiene filas entonces extraemos las columnas y se comprueba si tienen filas
  function buscarRows(elemento) {
    elemento.each(function () {
      if (tieneRows($(this))) {
        let rows = $(this).children('.row')
        let children = rows.children()
        buscarRows(children)

      } else {
        if ($(this).attr('class').includes('col')) {
          let columna = $(this)
          //console.log('Es columna sin fila', $(this))
          extraerContenido(columna)
        }
      }
    })
  }

  //Funcion que indica si el elemnto tiene hijos .row directos
  function tieneRows(elemento) {
    const rows = $(elemento).children('.row')
    if (rows.length !== 0) {
      return true
    } else {
      return false
    }
  }

  //Funcion para extraer el contenido dentro de las columnas que no es fila
  function extraerContenido(columna) {
    let order = 1;
    let imagenes = columna.children('img')
    columna.empty()
    imagenes.each(function () {

      let type = $(this).attr('alt');

      const widget = {
        "frame": frame,
        "order": order,
        "type": type,
        "url": "",
        "doc": null,
        "grant": "PUBLIC",
        "title": "name",
        "info": "",
        "js": ""
      }
      //console.log(widget)
      order++
      arrayWidgets.push(widget)
    })
    columna.text(`{{{frame_${frame}}}}`)
    frame++
  }

  //cuando se clica aceptar se envia la peticion POST al servidor y se mantiene a la espera de la respuesta de exito o fracaso al guardar en base de datos
  $('button#aceptarGuardarDash',).on('click', function (event) {

    //duplicar el html
    let htmlClonado = $('#content').clone()

    buscarRows(htmlClonado)
    frame = 1;
    const idDash = $('input#inputID').val()
    const nameDash = $('#inputNombre').val()
    const content = htmlClonado.html().replace(/"/g, "'")
    const template = {
      "code": nameDash,
      "content": content
    }

    const dashboard = {
      "code": "nombre atlas",
      "template": nameDash,
      "grant": "PUBLIC",
      "widgets": arrayWidgets
    }
    $.ajax({
      type: "post",
      url: url + '/dashboard/template',
      data: template,
      dataType: "json",
      success: function (response) {
        $('#content').empty()
        $('input#inputID').val('')
        $('#inputNombre').val('')
        $('#modalWindowCrearDash').modal('hide')
        $('#content').append(`<div class="alert alert-success" id="alertExito" role="alert">
        Dashboard guardado con éxito
      </div>`);
        $('#alertExito').fadeOut(4000, function () {
          $(this).remove()
        })
      },
      error: function (errorobj, textstatus, error) {
        const { message } = JSON.parse(errorobj.responseText)
        $('#modalWindowCrearDash .modal-body #error').contents().filter(function () {
          return this.nodeType === 3;
        }).remove();
        $('#modalWindowCrearDash .modal-body #error').show();
        $('#modalWindowCrearDash .modal-body #error').append(`${message}`)
      }
    })

  })

  $('#modalWindowCrearDash .btn-close, button#cancelarGuardarDash').on('click', function () {
    $('#modalWindowCrearDash').modal('hide')
    $('input#inputID').val('')
    $('#inputNombre').val('')
    $('#modalWindowCrearDash .modal-body #error').hide();
  })

  /**
* Acciones en la ventana modal de actualizar y eliminar contenido
*/
  let nameDashboard;
  $('button#buscar').on('click', function (event) {
    nameDashboard = $('input:text').val();
    console.log(nameDashboard)
  })

  $('button#aceptarActualizarDash').on('click', function (event) {

    //duplicar el html
    let htmlClonado = $('#content').clone()

    buscarRows(htmlClonado)
    frame = 1;

    const content = htmlClonado.html().replace(/"/g, "'")
    const template = {
      "code": nameDashboard,
      "content": content
    }
    console.log(template)
    $.ajax({
      url: url + `/dashboard/${nameDashboard}`,
      type: 'PUT',
      dataType: 'text',
      data: template,
      success: function (response) {
        $('#content').empty()
        console.log("todo bien")

        console.log(response)
        $('#content').append(`<div class="alert alert-success" id="alertExito" role="alert">
        ${response}
      </div>`);
        $('#alertExito').fadeOut(4000, function () {
          $(this).remove()
        })
      },
      error: function (errorobj, textstatus, error) {
        console.log("Algo mal")
        console.log(errorobj)
        console.log(textstatus)

        console.log(error)

      }

    });
  })

  $('button#aceptarEliminarDash').on('click', function (event) {
    console.log(nameDashboard)
    $.ajax({
      url: url + `/dashboard/${nameDashboard}`,
      type: 'DELETE',
      success: function (response) {
        $('#content').empty()
        $('#content').append(`<div class="alert alert-success" id="alertExito" role="alert">
        ${response}
      </div>`);
        $('#alertExito').fadeOut(4000, function () {
          $(this).remove()
        })
      },
      error: function (errorobj, textstatus, error) {

      }
    });
  })


});
