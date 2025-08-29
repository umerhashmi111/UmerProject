import mongoose, { Schema, InferSchemaType, Model, Types } from "mongoose";

const OwnerSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    cnic:   { type: String, required: true, trim: true },
    address:{ type: String, required: true, trim: true },
  },
  { _id: false }
);

const PersonSchema = new Schema(
  {
    fullName:        { type: String, required: true, trim: true },
    gender:          { type: String, enum: ["male", "female", "other"], required: true },
    cnic:            { type: String, required: true, trim: true },
    relationToOwner: { type: String, enum: ["FATHER","MOTHER","SON","DAUGHTER","SIBLING","SPOUSE","OTHER"], required: true },
    address:         { type: String, required: true, trim: true },
  },
  { _id: true }
);

const TreeSchema = new Schema(
  {
    ownerId:    { type: String, required: true },   // String(user._id)
    ownerEmail: { type: String, required: true },
    title:      { type: String, required: true },

    // ✅ NEW fields
    owner:      { type: OwnerSchema, required: true },
    persons:    { type: [PersonSchema], required: true },

    // ❌ REMOVE the old relations array entirely if you no longer use it:
    // relations: { type: [RelationSchema], default: [] },
  },
  { timestamps: true, strict: true }
);

// helpful indexes
TreeSchema.index({ ownerId: 1 });
TreeSchema.index({ "owner.cnic": 1 });
TreeSchema.index({ "persons.cnic": 1 });

export type TreeDoc = InferSchemaType<typeof TreeSchema> & { _id: Types.ObjectId };
export const Tree: Model<TreeDoc> =
  mongoose.models.Tree || mongoose.model<TreeDoc>("Tree", TreeSchema);
