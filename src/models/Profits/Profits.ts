import mongoose, { Schema, Model } from "mongoose";
import joi, { ObjectSchema } from "joi";
import { IProfits } from "./dto";

// Profits Schema
const ProfitsSchema: Schema<IProfits> = new Schema(
  {
    profits: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Profits Model
const Profits: Model<IProfits> =
  mongoose.models.Profits || mongoose.model("Profits", ProfitsSchema);

// Validation Schemas
const validateCreateProfits = (obj: IProfits): joi.ValidationResult => {
  const schema: ObjectSchema = joi.object({
    profits: joi.number().required(),
  });

  return schema.validate(obj);
};

const validateUpdateProfits = (obj: IProfits): joi.ValidationResult => {
  const schema: ObjectSchema = joi.object({
    profits: joi.number(),
  });

  return schema.validate(obj);
};

export { Profits, validateCreateProfits, validateUpdateProfits };
