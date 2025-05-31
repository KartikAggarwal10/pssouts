import mongoose from "mongoose";
const pplSchema = new mongoose.Schema({
    name: String,
     work:String,
      email: String,
      photo: String
});
export const ppl = mongoose.model('peoples', pplSchema);