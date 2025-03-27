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
    updates: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
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
    profits: joi.number().required(),
    updates: joi
      .array()
      .items(
        joi.object({
          amount: joi.number().required(),
          date: joi.date().default(Date.now),
        })
      )
      .optional(),
  });

  return schema.validate(obj, { abortEarly: false });
};
export { Profits, validateCreateProfits, validateUpdateProfits };
