import { Document } from "mongoose";

// Profits InterFace
export interface IProfits extends Document {
  _id: string;
  profits: number;
  updates: {
    amount: number;
    date: Date;
  }[];
}
