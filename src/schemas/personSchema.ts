import { Schema } from "mongoose";

const personSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default personSchema;
