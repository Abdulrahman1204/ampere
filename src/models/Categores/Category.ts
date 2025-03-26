import mongoose, { Schema, Model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { ICategory } from "./dto";

// Category Schema
const CategorySchema: Schema<ICategory> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Category Model
const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

// Validation Schema
const validateCreateCategory = (obj: ICategory): joi.ValidationResult => {
  const schema: ObjectSchema = joi.object({
    title: joi.string().required().trim(),
  });

  return schema.validate(obj);
};

const validateUpdateCategory = (obj: ICategory): joi.ValidationResult => {
  const schema: ObjectSchema = joi.object({
    title: joi.string().required().trim(),
  });

  return schema.validate(obj);
};

export { Category, validateCreateCategory, validateUpdateCategory }