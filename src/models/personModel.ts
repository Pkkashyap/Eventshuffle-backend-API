import mongoose, { Schema, Types } from "mongoose";

export interface IPerson {
  _id: Types.ObjectId;
  name: string;
}

const personSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export const Person = mongoose.model<IPerson>("Person", personSchema);
