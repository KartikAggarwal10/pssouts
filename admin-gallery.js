import mongoose from "mongoose";
const achievementSchema = new mongoose.Schema({
    imageUrl:String,
    caption:String,
    category:String
});
export const dmgly = mongoose.model('gllery-admin', achievementSchema);