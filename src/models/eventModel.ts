import mongoose, { Schema, Types } from "mongoose";

export interface IEvent {
  _id: Types.ObjectId;
  name: string;
  dates: string[];
}

const eventSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  dates: [{ type: String, required: true }],
});

export const Event = mongoose.model<IEvent>("Event", eventSchema);
