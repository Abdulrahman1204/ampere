import mongoose, { Schema, Model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import bcrypt from "bcryptjs";
import { CreateAdminInput, IAdmin, LoginAdminInput } from "./dto";

// Admin Schema
const AdminSchema: Schema<IAdmin> = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    password: { type: String, required: true, trim: true, minLength: 8 },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 10,
    },
    role: {
        type: String,
        enum: ["admin", "superAdmin"],
        default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    next(error as Error);
  }
});

// Admin Model
const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

// Validation Schemas
const validateCreateAdmin = (obj: CreateAdminInput): joi.ValidationResult => {
    const schema: ObjectSchema = joi.object({
      userName: joi.string().trim().min(2).max(100).required(),
      phoneNumber: joi.string().trim().length(10).required(),
      password: joi.string().trim().min(8).required(),
      role: joi
        .string()
        .valid("admin", "superAdmin")
        .required(),
    });
  
    return schema.validate(obj);
};

const validateUpdateAdmin = (obj: CreateAdminInput): joi.ValidationResult => {
  const schema: ObjectSchema = joi.object({
    userName: joi.string().trim().min(2).max(100),
    phoneNumber: joi.string().trim().length(10),
  });

  return schema.validate(obj);
};


const validateLoginAdmin = (obj: LoginAdminInput): joi.ValidationResult => {
    const schema: ObjectSchema = joi.object({
      phoneNumber: joi.string().trim().length(10).required(),
      password: joi.string().trim().min(8).required(),
    });
  
    return schema.validate(obj);
};

export { Admin, validateCreateAdmin, validateUpdateAdmin, validateLoginAdmin };  