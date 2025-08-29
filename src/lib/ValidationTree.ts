import { z } from "zod";

export const cnicSchema = z
  .string()
  .regex(/^\d{5}-\d{7}-\d$|^\d{13}$/, "Invalid CNIC (#####-#######-# or 13 digits)");

const genderEnum = z.enum(["male", "female", "other"]);
const relEnum = z.enum(["FATHER","MOTHER","SON","DAUGHTER","SIBLING","SPOUSE","OTHER"]);

export const ownerSchema = z.object({
  fullName: z.string().min(2),
  gender:   genderEnum,
  cnic:     cnicSchema,
  address:  z.string().min(3),
});

export const personSchema = z.object({
  fullName:        z.string().min(2),
  gender:          genderEnum,
  cnic:            cnicSchema,
  relationToOwner: relEnum,
  address:         z.string().min(3),
});

export const treeCreateSchema = z.object({
  title:   z.string().min(2),
  owner:   ownerSchema,
  persons: z.array(personSchema).min(1),
});

export const treeUpdateSchema = z.object({
  title:   z.string().min(2).optional(),
  owner:   ownerSchema.optional(),
  persons: z.array(personSchema).min(1).optional(),
});

export const otpVerifySchema = z.object({
  treeId: z.string().min(1),
  code:   z.string().length(6).regex(/^\d+$/),
});
