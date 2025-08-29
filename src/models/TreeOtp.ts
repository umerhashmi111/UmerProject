import mongoose, { Schema, InferSchemaType, Model, Types } from "mongoose";

const TreeOtpSchema = new Schema(
  {
    treeId: { type: Schema.Types.ObjectId, ref: "Tree", required: true },
    codeHash: { type: String, required: true }, // sha256(code)
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export type TreeOtpDoc = InferSchemaType<typeof TreeOtpSchema> & { _id: Types.ObjectId };

export const TreeOtp: Model<TreeOtpDoc> =
  mongoose.models.TreeOtp || mongoose.model<TreeOtpDoc>("TreeOtp", TreeOtpSchema);
