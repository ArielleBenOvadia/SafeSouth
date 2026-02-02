import mongoose, { Schema } from "mongoose";
import { IPost } from "./user_post_model";
import { IUser } from "./user_model";

export interface IComment {
  _id?: string;
  message: string;
  comment_owner: (Schema.Types.ObjectId | IUser)
  post: (Schema.Types.ObjectId | IPost)
}

const commentScheme = new mongoose.Schema<IComment>({
  message: {
    type: String,
    required: true,
  },
  comment_owner:{
    type:Schema.Types.ObjectId,
    ref: "User"
  },
  post: {
    type:Schema.Types.ObjectId,
    ref:"Post"
  },
});

export default mongoose.model<IComment>("Comment",commentScheme);