$(function () {

    const url = 'http://localhost:3000';

    const inputElement = $("input[name='dashboard']")

    let templateNames = [];

    inputElement.on('input', function (e) {
        onInputChange()
    });

    getCountryData();

    async function getCountryData() {
        const data = await $.ajax({
            type: "get",
            url: url + "/dashboard",
        })

        templateNames = data.map((template) => {
            return template.code;
        })

    }

    function onInputChange() {
        removeOldDropdown();

        const value = inputElement.val().toLowerCase();

        if(value.length === 0) return;

        const filteredNames = [];

        templateNames.forEach((templateName) => {
            if(templateName.substr(0, value.length).toLowerCase() === value) {
                filteredNames.push(templateName)
            }
        })

        createDropdown(filteredNames)
    }

    function createDropdown(list) {
        const lista = $('<ul></ul>');
        lista.addClass("options-dash-list")
        lista.attr('id', 'options-dash-list');

        list.forEach((template) => {

            const listItem = $('<li></li>')
            const button = $('<button></button>')

            button.text(template)
            listItem.append(button)

            lista.append(listItem)
        })

        $('#options-dash-wrapper').append(lista)
    }

    function removeOldDropdown() {
        const lista = $('#options-dash-list');
        if(lista) {
            lista.remove()
        }
    }

    $('#options-dash-wrapper').on('click', '#options-dash-list button', function(event) {
        event.preventDefault();
        inputElement.val($(event.target).text())
        removeOldDropdown();
    })

})