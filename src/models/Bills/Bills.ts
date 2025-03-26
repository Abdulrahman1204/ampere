import mongoose, { Schema, Model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { IBill } from "./dto";

// Bill Schema
const BillSchema: Schema<IBill> = new Schema(
  {
    category: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    userName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    note: {
      type: String,
      minlength: 0,
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id;
        return ret;
      },
    },
  }
);

// Bill Model
const Bill: Model<IBill> =
  mongoose.models.Bill || mongoose.model<IBill>("Bill", BillSchema);

// Validation Schemas
const validateCreateBill = (obj: IBill): joi.ValidationResult => {
  const schema: ObjectSchema = joi.object({
    category: joi.string().trim().required(),
    userName: joi.string().trim().min(0),
    phoneNumber: joi.string().trim().min(0),
    price: joi.number().required(),
    note: joi.string().min(0),
  });

  return schema.validate(obj);
};

const validateUpdateBill = (obj: IBill): joi.ValidationResult => {
  const schema: ObjectSchema = joi.object({
    category: joi.string().trim().min(2).max(100),
    userName: joi.string().trim().min(2).max(100),
    phoneNumber: joi.string().trim().length(10),
    price: joi.number(),
    note: joi.string().min(0),
  });

  return schema.validate(obj);
};

export { Bill, validateCreateBill, validateUpdateBill };
