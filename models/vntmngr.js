import mongoose from "mongoose";
const vntSchema = new mongoose.Schema({
    name: String,
    msg:String,
    date: String
});
export const vnte = mongoose.model('evnts', vntSchema);