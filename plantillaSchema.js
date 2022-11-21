const mongoose = require("mongoose")

const plantillaSchema = new mongoose.Schema({
    _name : String,
    _html: String,
})

module.exports = mongoose.model("Template", plantillaSchema)