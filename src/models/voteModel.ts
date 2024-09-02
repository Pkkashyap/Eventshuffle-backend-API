import mongoose from "mongoose";
import voteSchema from "../schemas/voteSchema";
import IVote from "../schemas/interface/IVote";

export const Vote = mongoose.model<IVote>("Vote", voteSchema);
