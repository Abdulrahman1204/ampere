import mongoose, { Schema, Model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { ISetting } from "./dto";

// Settings Schema
const SettingsSchema: Schema<ISetting> = new Schema(
  {
    priceOfAmpere: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Settings Model
const Settings: Model<ISetting> =
  mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

// Validation Schemas
const validateCreateSettings = (obj: ISetting): joi.ValidationResult => {
  const schema: ObjectSchema = joi.object({
    priceOfAmpere: joi.number().required().default(10),
  });

  return schema.validate(obj);
};

const validateUpdateSettings = (obj: ISetting): joi.ValidationResult => {
  const schema: ObjectSchema = joi.object({
    priceOfAmpere: joi.number(),
  });

  return schema.validate(obj);
};

export { Settings, validateCreateSettings, validateUpdateSettings };
