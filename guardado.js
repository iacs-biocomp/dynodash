const mongoose = require("mongoose");

const Template = require("./plantillaSchema");

mongoose.connect("mongodb://127.0.0.1:27017/test");

//insertar();
//eliminarTodos();
async function insertar() {
    try {
        await Template.insertMany(
            [
                {
                    _name: "plantilla1",
                    _html: "PCFET0NUWVBFIGh0bWw+CjxoZWFkPgogICAgPHRpdGxlPlBsYW50aWxsYSAxPC90aXRsZT4KPC9oZWFkPgo8Ym9keT4KICAgIDxoMj5TZWxlY2Npb25hIGVsIHBvc3RyZTwvaDI+CiAgICA8bGFiZWw+CiAgICAgICAgPGlucHV0IHR5cGU9ImNoZWNrYm94IiBpZCA9ICJjaGVjazEiIHZhbHVlID0gInByaW1lcl9jaGVjayI+TmF0aWxsYXMKICAgIDwvbGFiZWw+PGJyPgogICAgPGxhYmVsPgogICAgICAgIDxpbnB1dCB0eXBlPSJjaGVja2JveCIgaWQ9ImNoZWNrMiIgdmFsdWU9InNlZ3VuZG9fY2hlY2siPkZsYW4KICAgIDwvbGFiZWw+PGJyPgogICAgPGxhYmVsPgogICAgICAgIDxpbnB1dCB0eXBlPSJjaGVja2JveCIgaWQ9ImNoZWNrMyIgdmFsdWU9InRlcmNlcl9jaGVjayI+WW9ndXJ0CiAgICA8L2xhYmVsPjxicj4KPC9ib2R5Pgo8L2h0bWw+Cg=="
                },
                {
                    _name: "plantilla2",
                    _html: "PCFET0NUWVBFIGh0bWw+CjxoZWFkPgogICAgPHRpdGxlPlBsYW50aWxsYSAyPC90aXRsZT4KPC9oZWFkPgo8Ym9keT4KICAgIDxoMj5SZWxsZW5lIGNvbiBzdXMgZGF0b3M8L2gyPgogICAgPHA+Tm9tYnJlOiA8bGFiZWw+PGlucHV0IHR5cGU9InRleHQiIGlkPSJub21icmUiIHZhbHVlPSIiPjwvbGFiZWw+PC9wPgogICAgPHA+QXBlbGxpZG86IDxsYWJlbD48aW5wdXQgdHlwZT0idGV4dCIgaWQ9ImFwZWxsaWRvIiB2YWx1ZSA9IiI+PC9sYWJlbD48L3A+CiAgICA8cD5TZXhvPC9wPgogICAgPGlucHV0IHR5cGU9InJhZGlvIiBpZD0iaG9tYnJlIiBuYW1lPSJzZXhvIiB2YWx1ZT0iSG9tYnJlIj4KICAgIDxsYWJlbCBmb3I9ImhvbWJyZSI+SG9tYnJlPC9sYWJlbD48YnI+CiAgICA8aW5wdXQgdHlwZT0icmFkaW8iIGlkPSJtdWplciIgbmFtZT0ic2V4byIgdmFsdWU9Ik11amVyIj4KICAgIDxsYWJlbCBmb3I9Im11amVyIj5NdWplcjwvbGFiZWw+PGJyPgogICAgPGlucHV0IHR5cGU9InJhZGlvIiBpZD0ib3RybyIgbmFtZT0ic2V4byIgdmFsdWU9Ik90cm8iPgogICAgPGxhYmVsIGZvcj0ib3RybyI+T3RybzwvbGFiZWw+PGJyPgo8L2JvZHk+CjwvaHRtbD4="
                },
                {
                    _name: "plantilla3",
                    _html: "PCFET0NUWVBFIGh0bWw+CjxoZWFkPgogICAgPHRpdGxlPlBsYW50aWxsYSAzPC90aXRsZT4KPC9oZWFkPgo8Ym9keT4KICAgIDxoMj5TZWxlY2Npb25hIHVuYSBvcGNpw7NuPC9oMj4KICAgIDxzZWxlY3QgbmFtZT0ic2VsZWN0Ij4KICAgICAgICA8b3B0aW9uIHZhbHVlPSJyZXBhcmFjaW9uIj5SZXBhcmFjacOzbjwvb3B0aW9uPgogICAgICAgIDxvcHRpb24gdmFsdWU9InJldmlzaW9uIj5SZXZpc2nDs248L29wdGlvbj4KICAgICAgICA8b3B0aW9uIHZhbHVlPSJkZXNndWFjZSI+RGVzZ3VhY2U8L29wdGlvbj4KICAgIDwvc2VsZWN0Pjxicj48YnI+CiAgICA8aW5wdXQgdHlwZT0ic3VibWl0IiB2YWx1ZT0iRW52aWFyIi8+CjwvYm9keT4KPC9odG1sPg=="
                }
            ]
        )

    } catch (e) {
        console.log(e.menssage)
    }

}

async function eliminarTodos() {
    await Template.deleteMany({});
}