import IEvent from "../schemas/interface/IEvent";
import mongoose from "mongoose";
import eventSchema from "../schemas/eventSchema";

export const Event = mongoose.model<IEvent>("Event", eventSchema);
