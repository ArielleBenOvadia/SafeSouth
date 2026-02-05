import mongoose, { Schema } from "mongoose";
import { IPost } from "./user_post_model";

export type Gender = "male" | "female";

export interface IUser {
  email: string;
  password: string;
  imgUrl?: string;
  _id?: string;
  posts: (Schema.Types.ObjectId | IPost)[];
  refreshTokens?: string[];
  first_name: string;
  last_name: string;
  gender: Gender;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
  },

  // ✅ חדש
  gender: {
    type: String,
    enum: ["male", "female"],
    required: false,
  },

  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  refreshTokens: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<IUser>("User", userSchema);
