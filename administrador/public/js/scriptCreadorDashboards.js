$(function () {
  let botonColumna = false; //saber si el boton de columna se ha pulsado o no
  let botonFila = false; //saber si el boton de columna se ha pulsado o no
  let esColumna = false; //saber si el elemento seleccionado en el dashboard es una columna
  let esFila = false; //saber si el elemento seleccionado en el dashboard es una fila
  let contenedorInicial = false;
  let fasesHTML = []; //Guarda el contenido HTML en cada cambio que se hace en la vista
  let editorWindow;

  const icons = `<ul class='nav justify-content-end'>
  <li class='nav-item'>
      <i title='Insertar contenido' class='fa-solid fa-arrow-up-from-bracket' id='insertarTemplate' style='color: #e9cb0c; margin-right: 5px;'></i>
  </li>
  <li class='nav-item'>
      <i title='Borrar contenido' class='fa fa-trash' id='eliminarTemplate' style='color: #e9cb0c;'></i>
  </li>
</ul>`

  let elemento_seleccionado = null;

  let keysPressed = {};

  annadirEstadoHTML()

  //Desabilitar el boton back en el browser
  /*window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };*/


  //Evento para leer los mensajes/eventos recibidos de otras ventanas secundarias
  $(window).on('message', function (event) {
    const { data } = event.originalEvent;
    let accion = data.accion; //Variable que guarda el evento seleccionado en el menú selector
    switch (accion) {
      case 'columna':
        selectColumna();
        break;

      case 'fila':
        selectFila();
        break;

      case 'reset':
        reset();
        break;

      case 'back':
        back();
        break;

      case 'aceptar':
        aplicarFilasColumnas(data);
        break;

      case 'aceptarMedidas':
        aplicarMedidas(data);
        break;

      case 'openSidebar':
        openSidebar();
        break;
    }
  });

  $('#alert-danger').hide()


  //Evento que abre el selector en una nueva ventana cuando se presiona CTRL + m y elimina la columna o fila seleccionada cuando se presiona CTRL + supr
  $(window).on('keydown', (event) => {
    keysPressed[event.key] = true;

    if (keysPressed['Control'] && event.key == 'm') {
      editorWindow = window.open(
        '../public/editor.html',
        'Selector',
        'width=500,height=500',
      );
    }
    if (keysPressed['Control'] && event.key == 'Delete') {
      if (elemento_seleccionado.id !== 'content') {
        annadirEstadoHTML();
        elemento_seleccionado.remove();
      }
    }
  });

  /**
   * Evento que se ejecuta al presionar el boton Crear
   * Abre la ventana secundaria Editor y resetea la pantalla principal
   */
  $(this).on('click', 'button#abrirEditor', function () {
    editorWindow = window.open(
      '../public/editor.html',
      'Selector',
      'width=500,height=500',
    );
    //reset()
  })

  /**
   * Evento que se ejecuta cuando se clica el boton de guardar
   * Se abre una ventana modal especifica para las opciones de crear, actualizar y eliminar dashboard
   * Se ejecuta la funcion de separacion de elementos
   */

  $(this).on('click', 'button#guardar', function (event) {
    if ($('#newDash').is(':checked')) {
      $('#modalWindowCrearDash').modal('show');
    }
    if ($('#updateDash').is(':checked')) {
      $('#modalWindowActualizarDash').modal('show');
    }
    if ($('#deleteDash').is(':checked')) {
      $('#modalWindowEliminarDash').modal('show');
    }
  })

  /**
   * Evento que despliega la ventana modal de insertar contenido al clicar en el icono de insertar
   */
  $(this).on('click', '#insertarTemplate', function () {
    annadirEstadoHTML();
    $('#fullscreenModal').modal('show');
  })

  /**
   * Evento que despliega la ventana modal de eliminar contenido al clicar en el icono de eliminar
   */
  $(this).on('click', '#eliminarTemplate', function () {
    annadirEstadoHTML();
    $('#modalWindowEliminarContenido').modal('show');
  })


  //Evento que hace los elementos del menu draggable
  $('.draggable').draggable({
    helper: 'clone',
  });

  //Evento que evita que el boton se quede presionado
  $('button').mouseup(function () {
    $(this).blur();
  });

  /**
   * Evento que cierra las ventanas secundarias abiertas cuando el usuario hace un log out
   */

  $('button#logout').on('click', function (event) {
    editorWindow.close();
  });



  //Modificar

  /*
   * Evento que carga el dashboard que se quiere editar desde la base de datos
   */
  $('button#buscar').on('click', function (event) {

    if ($('#updateDash').is(':checked') || $('#deleteDash').is(':checked')) {
      let id = $('input:text').val();
      //$('input:text').val('')
      const url = 'http://localhost:3000';

      $.ajax({
        type: 'get',
        url: url + `/dashboard/${id}`,
        dataType: 'html',
        error: function (jqhxr, textStatus, error) {
          //solo elimina el mensaje de error previo
          $('#modalWindowError .alert').contents().filter(function () {
            return this.nodeType === 3;
          }).remove();
          //se annade el nuevo mensaje de error
          $('#modalWindowError .alert').prepend(`${jqhxr.responseText}`)
          $('#modalWindowError').modal('show');
        },
      }).done(function (response) {
        //console.log(response)
        $('#content').html(response);
        let droppables = $('.ui-droppable');
        annadirDroppable(droppables);
        annadirHighlight(droppables);
        droppables.text('Contenedor');
        droppables.append(icons)
        $('input:text').val('')
      });
    }

  });

  //Evento que hace droppable al container con id=content
  //annadirDroppable($('.droppable'));


  //Modificar 
  //Evento para eliminar con doble click los elementos arrastrados al dashboard
  $(this).on('dblclick', '#content img, #content .button', function () {
    annadirEstadoHTML();
    let parent = $(this).parent();
    $(this).remove();
    parent.removeClass('d-flex justify-content-center align-items-center');
    parent.text('Contenedor');
    annadirDroppable(parent);
    annadirHighlight(parent);
    parent.append(icons)
  });

  /*
      Funcion que se activa cada vez que se hace una modificacion en el dashboard.
      Guarda el estado actual del HTML si todavía no ha sido guardado con anterioridad
  */
  function annadirEstadoHTML() {
    //console.log(fasesHTML.length)
    if (fasesHTML.length == 0 || !fasesHTML.includes($('#content').html())) {
      fasesHTML.push($('#content').html());
    }
  }


  /*
        Funcion que añade eventos droppable a los nodos hijos del elemento que se le pasa como parametro
        Cada vez que se ejecute un drop en un elemento con ese evento se ejecutara la funcion annadirEstadoHTML
    */


  function annadirDroppable(elemento) {
    //console.log('inicio', elemento)

    $(elemento).each(function (indexInArray, valueOfElement) {
      let droppable = $(this);
      if (!$(this).attr('class').includes('col')) {
        droppable = $(this).children();
      }
      //console.log(droppable)
      droppable.each(function (indexInArray, valueOfElement) {
        $(this).droppable({
          tolerance: "pointer",
          drop: function (event, ui) {
            annadirEstadoHTML();
            $(this).empty();
            $(this).addClass(
              'd-flex justify-content-center align-items-center',
            );
            $(this).append(ui.draggable.clone());
          },
        })
      })
    })
  }

  /*
      Funcion que añade eventos mousenter y mouseleave a los hijos del elemento que se le pasa como parametro.
      Estos eventos se usarán para resaltar el elemento sobre el que está el cursor del ratón.
  */
  function annadirHighlight(elemento) {

    $(elemento).each(function (indexInArray, valueOfElement) {
      let highlight = $(this);
      if (!$(this).attr('class').includes('col')) {
        highlight = $(this).children();
      }

      highlight.each(function (indexInArray, valueOfElement) {
        $(this).on('mouseenter', function () {
          $(this).addClass('bg-primary text-white');
        });
        $(this).on('mouseleave', function () {
          $(this).removeClass('bg-primary text-white');
        });
      })
    })


  }

  /*
       Evento que selecciona el elemento (columna/fila) sobre el que se clica con el cursor del ratón
   */
  $(this).on('click', '#content', function (event) {
    //console.log("Elemento capturado en el click")
    let elementoEntrada = event.target;
    let element;
    //console.log(elementoEntrada)

    let dentroContenedor = false;

    if ($(elementoEntrada).attr('class').includes('col')) {
      dentroContenedor = true;
      element = elementoEntrada
    }
    if ($(elementoEntrada).hasClass('nav')) {
      dentroContenedor = true;
      element = elementoEntrada.parentNode
    }

    //Seleccion de columna
    if (botonColumna && dentroContenedor) {
      //console.log("El elemento es una columna")
      let columna = element;
      //console.log(columna)
      elemento_seleccionado = columna;
      esColumna = true;
      esFila = false;
    }

    //Seleccion de fila
    if (botonFila && dentroContenedor) {
      //console.log("El elemento es una fila")
      let fila = element.parentNode;
      //console.log(fila)
      elemento_seleccionado = fila;
      esColumna = false;
      esFila = true;
    }

    //Seleccion del contenedor principal
    if (elementoEntrada.childElementCount === 0 && elementoEntrada.id === 'content') {
      elemento_seleccionado = elementoEntrada;
      contenedorInicial = true;
    }
  });


  /**
   *   Funcion que se activa cuando se clica el boton columna
   */
  function selectColumna() {
    //console.log("columna")

    botonColumna = true;
    botonFila = false;
  }

  /**
   *   Funcion que se activa cuando se clica el boton fila
   */
  function selectFila() {
    //console.log("fila")

    botonFila = true;
    botonColumna = false;
  }

  /*
    Funcion que se activa cuando se clica el boton reset.
    Se borran todos los cambios y la página vuelve a su estado inicial
    */
  function reset() {
    //console.log("reset")

    if (fasesHTML.length > 0) {
      console.log(fasesHTML)
      $('#content').html(fasesHTML[0]);
      botonColumna = false;
      botonFila = false;
      esColumna = false;
      esFila = false;
      contenedorInicial = false;
      fasesHTML = [];
      elemento_seleccionado = null;
    }
  }

  /*
     * Funcion que se activa cuando se clica el boton back.
        La pagina vuelve a su estado anterior más reciente.
    */
  function back() {
    //console.log("back")

    if (fasesHTML.length > 0) {

      let html = fasesHTML.pop();
      $('#content').html(html);
      let droppables = $('.ui-droppable');
      annadirDroppable(droppables);
      annadirHighlight(droppables);
    }
  }

  /*
        Función que añade columnas y filas a los elementos del dashboard.
        Esta función se ejecuta cuando se clica sobre el primer botón aceptar.
        Cada vez que se ejecuta también lo hace la función annadirEstadoHTML.
    */
  function aplicarFilasColumnas(data) {
    annadirEstadoHTML();

    //Numero de filas annadidas y parseo a numero entero
    let numFilas = data.filas;
    let numFilasInt = parseInt(numFilas);

    //Numero de columnas annadidas y parseo a numero entero
    let numColumnas = data.columnas;
    let numColumnasInt = parseInt(numColumnas);

    let element = $(elemento_seleccionado);

    //console.log(element)
    //console.log("------------------------------------")

    //Se realiza esta eliminación del droppable para que solo los últimos elementos hijos sean droppeables.
    if (element.hasClass('ui-droppable')) {
      element.droppable('destroy');
      //console.log(element)
    }

    if (
      (esColumna &&
        Number.isInteger(numFilasInt) &&
        Number.isInteger(numColumnasInt)) ||
      contenedorInicial
    ) {
      //console.log("esColumna")
      let annadirFila = true;

      //Si la columna está vacía entonces se elimina el texto y se añaden nuevas filas y columnas.
      //Si no se añadiran nuevas filas alas ya existentes dentro de la columna
      if (element.children('.nav').length !== 0) {
        annadirFila = false;
        element.empty(); //Se elimina el contenido de la columna
      }
      //console.log(element.children().length)

      element.off('mouseenter'); //Se elimina para que solo los elemetos hijos tengan el evento de mouseenter

      //introducir las filas
      for (let i = 0; i < numFilasInt; i++) {
        element.append("<div class='row'></div>");
        let fila;
        if (annadirFila) {
          fila = element.children(`:last-child()`);
        } else {
          fila = element.children(`:nth-child(${i + 1})`);
        }

        //Introducir las columnas
        for (let i = 0; i < numColumnasInt; i++) {
          fila.append(
            "<div class='col border border-primary'>Contenedor</div>",
          );
          let columna = fila.children(`:nth-child(${i + 1})`);
          columna.append(icons)
        }

        //console.log('en columna', fila)


        annadirDroppable(fila);
        annadirHighlight(fila);
      }
      contenedorInicial = false;
    }

    //Añadir nuevas columnas a las ya existentes dentro de una fila
    if (esFila && Number.isInteger(numColumnasInt)) {
      console.log("esFila")
      //Introducir las columnas
      for (let i = 0; i < numColumnasInt; i++) {
        //append te sustituye las columnas
        element.append(
          "<div class='col border border-primary'>Contenedor</div>",
        )
        let columna = element.children(`:last-child()`);
        columna.append(icons)
      }
      //console.log('en fila', element)
      let children = element.children()
      buscarLastColumn(children)

    }
  }

  //funcion para loopear los elementos en busca de filas
  //si tiene filas entonces extraemos las columnas y se comprueba si tienen filas
  function buscarLastColumn(elemento) {
    elemento.each(function () {
      if (tieneRows($(this))) {
        let rows = $(this).children('.row')
        let children = rows.children()
        buscarLastColumn(children)

      } else {
        if ($(this).attr('class').includes('col')) {
          let columna = $(this)
          //console.log('Es columna sin fila', $(this))
          annadirDroppable(columna);
          annadirHighlight(columna);
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


  /*  
        Función que cambia la altura de la fila o la anchura de la columna seleccionada.
        Esta función se ejecuta cuando se clica el segundo botón aceptar.
        Cada vez que se ejecuta también lo hace la función annadirEstadoHTML.
    */
  function aplicarMedidas(data) {
    annadirEstadoHTML();

    let anchuraSM = data.anchuraSM;
    let anchuraSMInt = parseInt(anchuraSM);

    let anchuraMD = data.anchuraMD;
    let anchuraMDInt = parseInt(anchuraMD);

    let anchuraLG = data.anchuraLG;
    let anchuraLGInt = parseInt(anchuraLG);

    let element = $(elemento_seleccionado);

    //La anchura de las columnas se modifica en nº de columnas
    //La anchura de la fila se ajusta a toda la pantalla

    //Anchura en el breakpoint SM
    if (
      Number.isInteger(anchuraSMInt) &&
      anchuraSMInt <= 12 &&
      anchuraSMInt >= 0
    ) {
      const regColSM = /col[-]sm[-][0-9]*/;
      //const reg = /col[-]?[0-9]*/;
      if (!element.hasClass('col')) {
        if (!element.attr('class').includes('col-sm')) {
          element.addClass('col-sm-' + anchuraSMInt)
        } else {
          let clase = element.attr('class').replace(regColSM, 'col-sm-' + anchuraSMInt)
          element.removeClass().addClass(clase)
        }
      } else {
        let clase = element.attr('class').replace('col', 'col-sm-' + anchuraSMInt)
        element.removeClass().addClass(clase)
      }

    }

    //Anchura en el breakpoint MD
    if (
      Number.isInteger(anchuraMDInt) &&
      anchuraMDInt <= 12 &&
      anchuraMDInt >= 0
    ) {
      //console.log('anchura md', anchuraMDInt)

      const regColMD = /col[-]md[-][0-9]*/;
      //const reg = /col[-]?[0-9]*/;

      if (!element.hasClass('col')) {
        if (!element.attr('class').includes('col-md')) {
          element.addClass('col-md-' + anchuraMDInt)
        } else {
          let clase = element.attr('class').replace(regColMD, 'col-md-' + anchuraMDInt)
          element.removeClass().addClass(clase)
        }
      } else {
        let clase = element.attr('class').replace('col', 'col-md-' + anchuraMDInt)
        element.removeClass().addClass(clase)
      }
    }

    //Anchura en el breakpoint MD
    if (
      Number.isInteger(anchuraLGInt) &&
      anchuraLGInt <= 12 &&
      anchuraLGInt >= 0
    ) {
      //console.log('anchura lg', anchuraLGInt)

      const regColLG = /col[-]lg[-][0-9]*/;
      //const reg = /col[-]?[0-9]*/;

      if (!element.hasClass('col')) {
        if (!element.attr('class').includes('col-lg')) {
          element.addClass('col-lg-' + anchuraLGInt)
        } else {
          let clase = element.attr('class').replace(regColLG, 'col-lg-' + anchuraLGInt)
          element.removeClass().addClass(clase)
        }
      } else {
        let clase = element.attr('class').replace('col', 'col-lg-' + anchuraLGInt)
        element.removeClass().addClass(clase)
      }
    }

    //console.log(anchura, "...", altura)
    //console.log(element)
  }

  /*
        Función despliega el menu lateral.
        Se ejecuta cuando se clica sobre el boton sidebar
    */
  function openSidebar() {
    $('#sidebar').toggleClass('active');
  }


});
