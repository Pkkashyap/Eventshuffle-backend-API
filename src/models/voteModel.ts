import mongoose, { Schema, Document } from "mongoose";

export interface IVote extends Document {
  eventId: mongoose.Types.ObjectId;
  date: string;
  personId: mongoose.Types.ObjectId;
}

const voteSchema: Schema = new Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  date: { type: String, required: true },
  personId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    required: true,
  },
});

export const Vote = mongoose.model<IVote>("Vote", voteSchema);
