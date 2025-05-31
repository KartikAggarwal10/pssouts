import mongoose from "mongoose";
const achievementSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    education:String,
    achievementTitle:String,
    achievement:String,
    currentRole:String,
    projects:String,
    story:String,
    photo:String,
    date:String
});
export const chv = mongoose.model('achievement', achievementSchema);