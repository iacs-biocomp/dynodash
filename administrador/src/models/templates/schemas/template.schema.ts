import { Schema } from "mongoose";

export const templateSchema = new Schema({
    _name : String,
    _html: String,
})