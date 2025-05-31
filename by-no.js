import mongoose from "mongoose";
const numSchema = new mongoose.Schema({
    member:Number,
    comp:Number,
    ach:Number,
    countries:Number
}, { timestamps: true });
export const num = mongoose.model('homestts', numSchema);