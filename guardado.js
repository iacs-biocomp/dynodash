const mongoose = require("mongoose");

const Template = require("./plantillaSchema");

mongoose.connect("mongodb://127.0.0.1:27017/test");

//insertar();
//eliminarTodos();
async function insertar() {
    try {
        await Template.insertMany(
                {
                    _name: "cuerpoPrueba",
                    _html: "PGgyPlNlbGVjY2lvbmEgZWwgcG9zdHJlPC9oMj4NCjxsYWJlbD4NCiAgICA8aW5wdXQgdHlwZT0iY2hlY2tib3giIGlkPSJjaGVjazEiIHZhbHVlPSJwcmltZXJfY2hlY2siPk5hdGlsbGFzDQo8L2xhYmVsPjxicj4NCjxsYWJlbD4NCiAgICA8aW5wdXQgdHlwZT0iY2hlY2tib3giIGlkPSJjaGVjazIiIHZhbHVlPSJzZWd1bmRvX2NoZWNrIj5GbGFuDQo8L2xhYmVsPjxicj4NCjxsYWJlbD4NCiAgICA8aW5wdXQgdHlwZT0iY2hlY2tib3giIGlkPSJjaGVjazMiIHZhbHVlPSJ0ZXJjZXJfY2hlY2siPllvZ3VydA0KPC9sYWJlbD48YnI+"
                }
        )

    } catch (e) {
        console.log(e.menssage)
    }

}

async function eliminarTodos() {
    await Template.deleteMany({"_name": "cuerpoPrueba"});
}