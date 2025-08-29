import mongoose, { Schema, InferSchemaType, Model, Types } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true }, // no `unique` here
    passwordHash: { type: String, required: true },
    emailVerifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true }); // single source of truth

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: Types.ObjectId };

export const User: Model<UserDoc> =
  mongoose.models.User || mongoose.model<UserDoc>("User", UserSchema);
