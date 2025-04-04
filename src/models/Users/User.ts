import mongoose, { Schema, Model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { IUser } from "./dto";

// User Schema
const UserSchema: Schema<IUser> = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    phoneNumber: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
    },
    numberOfAmpere: {
      type: Number,
      required: true,
    },
    numberOfPlate: {
      type: Number,
      required: true,
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
    totalPrice: {
      type: Number,
    },
    note: {
      type: String,
    },
    weeks: {
      type: [Boolean], 
      default: [false, false, false, false], 
    },
    startDate: {
      type: Date, // تاريخ بداية الفترة
    },
  },
  {
    timestamps: true,
  }
);

// User Model
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// Validation Schemas
const validateCreateUser = (obj: IUser): joi.ValidationResult => {
  const schema: ObjectSchema = joi.object({
    userName: joi.string().trim().min(2).max(100).required(),
    phoneNumber: joi
      .string()
      .trim()
      .length(10)
      .required(),
    numberOfAmpere: joi.number().required(),
    numberOfPlate: joi.number().required(),
    totalPrice: joi.number(),
    note: joi.string(),
    startDate: joi.date(), // إضافة التحقق من التاريخ
  });

  return schema.validate(obj);
};

const validateUpdateUser = (obj: IUser): joi.ValidationResult => {
  const schema: ObjectSchema = joi.object({
    userName: joi.string().trim().min(2).max(100),
    phoneNumber: joi
      .string()
      .trim()
      .length(10),
    numberOfAmpere: joi.number(),
    numberOfPlate: joi.number(),
    available: joi.boolean(),
    totalPrice: joi.number(),
    note: joi.string(),
    startDate: joi.date(), // إضافة التحقق من التاريخ
  });

  return schema.validate(obj);
};

export { User, validateCreateUser, validateUpdateUser };