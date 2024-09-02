import mongoose from "mongoose";
import personSchema from "../schemas/personSchema";
import IPerson from "../schemas/interface/IPerson";

export const Person = mongoose.model<IPerson>("Person", personSchema);
