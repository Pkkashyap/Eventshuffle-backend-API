import { Types } from "mongoose";

export default interface IPerson {
  _id: Types.ObjectId;
  name: string;
}
