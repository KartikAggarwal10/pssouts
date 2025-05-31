import mongoose from "mongoose";
const achievementSchema = new mongoose.Schema({
    name:String,
    batch:String,
    email:String,
    amount:String,
    purpose:String,
    occupation:String,
    message:String
  
});
export const don = mongoose.model('donation', achievementSchema);