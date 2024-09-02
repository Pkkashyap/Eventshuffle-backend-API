import mongoose, { Document } from "mongoose";

export default interface IVote extends Document {
  eventId: mongoose.Types.ObjectId;
  date: string;
  personId: mongoose.Types.ObjectId;
}
