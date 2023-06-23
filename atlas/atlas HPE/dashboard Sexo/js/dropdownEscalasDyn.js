//JavaScript perteneciente al widget de niveles de agregación
function getDataAggLevels() {
    return $.ajax({
      dataType: "json",
      type: "GET",
      url: "{{{url}}}"
    })
  }
  function callbackDataAggLevels(data) {
    myViewModel.setDataAggLevels(data)
  }
  $(getDataAggLevels().done(callbackDataAggLevels))