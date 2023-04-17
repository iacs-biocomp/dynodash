$(function () {
  /*
        Evento que envia la accion = columna a la ventana principal cuando se clica el boton columna
    */
  $(this).on('click', 'button#columna', function (event) {
    window.opener.postMessage(
      {
        accion: 'columna',
      },
      '*',
    );
  });

  /*
        Evento que envia la accion = fila a la ventana principal cuando se clica el boton fila
    */
  $(this).on('click', 'button#fila', function (event) {
    window.opener.postMessage(
      {
        accion: 'fila',
      },
      '*',
    );
  });

  /*
        Evento que envia la accion = aceptarMedidas junto con los breakpoints y las medidas.
    */
  $(this).on('click', 'button#aceptarMedidas', function (event) {
    let anchuraSM = $('input#anchuraSM').val();
    let anchuraMD = $('input#anchuraMD').val();
    let anchuraLG = $('input#anchuraLG').val();

    window.opener.postMessage(
      {
        accion: 'aceptarMedidas',
        anchuraSM,
        anchuraMD,
        anchuraLG,
      },
      '*',
    );

    $('input#anchuraSM').val('');
    $('input#anchuraMD').val('');
    $('input#anchuraLG').val('');
  });

  /*
        Evento que envia la accion = aceptar junto con el nº de columnas y filas a añadir a la ventana principal cuando se clica el primer boton aceptar.
    */
  $(this).on('click', 'button#aceptar', function (event) {
    let filas = $('input#numFilas').val();
    let columnas = $('input#numColumnas').val();

    window.opener.postMessage(
      {
        accion: 'aceptar',
        filas,
        columnas,
      },
      '*',
    );

    $('input#numFilas').val('');
    $('input#numColumnas').val('');
  });

  /*
        Evento que envia la accion = reset a la ventana principal cuando se clica el boton reset
    */
  $(this).on('click', 'button#reset', function (event) {
    window.opener.postMessage({ accion: 'reset' }, '*');
  });

  /*
        Evento que envia la accion = back a la ventana principal cuando se clica el boton back
    */
  $(this).on('click', 'button#back', function (event) {
    window.opener.postMessage({ accion: 'back' }, '*');
  });

  /*
        Evento que envia la accion = openSidebar a la ventana principal cuando se clica el boton sidebar
    */
  $(this).on('click', 'button#sidebarCollapse', function (event) {
    window.opener.postMessage({ accion: 'openSidebar' }, '*');
  });

   /*
        Evento que cierra la ventana secundaria
    */
        $(this).on('click', 'button#end', function (event) {
          window.close()
        });
});
