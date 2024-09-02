import { Schema } from "mongoose";
import IEvent from "./interface/IEvent";

const eventSchema: Schema<IEvent> = new Schema({
  name: { type: String, required: true, unique: true },
  dates: [{ type: String, required: true }],
});

export default eventSchema;
