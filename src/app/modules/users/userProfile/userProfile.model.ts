import { Schema, model } from "mongoose";
import { IUserProfile } from "./userProfile.interface";

const userProfileSchema = new Schema<IUserProfile>(
  {
    fullName: { type: String },
    nickname: { type: String },
    dateOfBirth: { type: Date },
    phone: { type: String },
    address: { type: String },
    image: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", unique: true },
  },
  {
    timestamps: true,
  }
);

export const UserProfile = model<IUserProfile>(
  "UserProfile",
  userProfileSchema
);
