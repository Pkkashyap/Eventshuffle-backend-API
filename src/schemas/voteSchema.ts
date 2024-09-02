import mongoose, { Schema } from "mongoose";

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

export default voteSchema;
