import mongoose from "mongoose";
const stdsSchema = new mongoose.Schema({
    name:String,
    batch:String,
    location:String,
    branch:String,
    comp:String,
    position:String,
    email:String,
    photo:String,
    summary:String,
    
    id:String

});
export const stds = mongoose.model('students', stdsSchema);