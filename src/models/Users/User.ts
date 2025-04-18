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
    weeksDate:{
      type: [String]

    },
    startDate: {
      type: Date, // تاريخ بداية الفترة
    },
  },
  {
    timestamps: true,
  }
);


// في ملف السكيما (مثل user.model.ts)
UserSchema.pre<IUser>("save", function (next) {
  // تحديث weeksDate إذا تم تغيير startDate أو إنشاء مستخدم جديد
  if (this.isModified("startDate") || this.isNew) {
    if (this.startDate) {
      const startDate = new Date(this.startDate);
      this.weeksDate = [];
      for (let i = 0; i < 4; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + 7 * i);
        this.weeksDate.push(date.toISOString().split("T")[0]);
      }
    }
  }
  next();
});

  UserSchema.post('findOneAndUpdate', async function(doc) {
    if (doc.startDate) {
      const startDate = new Date(doc.startDate);
      doc.weeksDate = Array.from({ length: 4 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + 7 * i);
        return date.toISOString().split('T')[0];
      });
      await doc.save();
    }
  });

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
