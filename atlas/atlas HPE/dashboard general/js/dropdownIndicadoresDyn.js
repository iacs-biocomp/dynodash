//JavaScript perteneciente al widget de indicadores
function getDataIndicadores() {
    return $.ajax({
      dataType: "json",
      type: "GET",
      url: "{{{url}}}"
    })
  }
  
  function callbackDataIndicadores(data) {
    myViewModel.setDataIndicadores(data)
  }
  $(getDataIndicadores().done(callbackDataIndicadores))