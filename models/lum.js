import mongoose from "mongoose";
const lsSchema = new mongoose.Schema({
    name: String,
    msg:String,
    date: String
});
export const ls = mongoose.model('best', lsSchema);