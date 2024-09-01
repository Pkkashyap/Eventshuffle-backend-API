import { Schema } from "mongoose";

export const voteSchema = new Schema({
  date: { type: String, required: true },
  people: [{ type: String }],
});

export const eventSchema = new Schema({
  name: { type: String, required: true },
  dates: [{ type: String, required: true }],
  votes: [voteSchema],
});
