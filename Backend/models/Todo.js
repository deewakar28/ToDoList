import { Schema, model } from "mongoose";

const todoSchema = new Schema({
    name:{
        type: String,
        required: true
    }
})

export const Todo = model("Todo", todoSchema);