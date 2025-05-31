import mongoose from "mongoose";
const vntSchema = new mongoose.Schema({
    eventTopic: String,
    eventDate:String,
    eventDescription:String
});
export const vnt = mongoose.model('events', vntSchema);