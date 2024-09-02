import { Schema, Document } from "mongoose";
import IUser from "./interface/IUser";

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default userSchema;
