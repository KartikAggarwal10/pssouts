import mongoose from "mongoose";
const regSchema = new mongoose.Schema({
    name: String,
     phone:Number,
      email: String,
      college: String,
      batch:Number,
      event:String,
      message:String
});
export const reg = mongoose.model('registered', regSchema);