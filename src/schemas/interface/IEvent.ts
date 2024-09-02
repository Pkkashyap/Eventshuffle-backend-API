import { Types } from "mongoose";
export default interface IEvent {
  _id: Types.ObjectId;
  name: string;
  dates: string[];
}
