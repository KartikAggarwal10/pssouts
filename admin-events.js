import mongoose from "mongoose";
const achievementSchema = new mongoose.Schema({
    eventTopic:String,
    eventDate:String,
    eventDescription:String
});
export const dmevt = mongoose.model('event-admin', achievementSchema);