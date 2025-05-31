import mongoose from "mongoose";
const achievementSchema = new mongoose.Schema({
    name:String,
    batch:String,
    branch:String,
    dob:String,
    address:String,
    email:String,
    contact:String,

    photo:String,
});
export const vntmem = mongoose.model('event-member', achievementSchema);