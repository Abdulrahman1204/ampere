import { Document } from "mongoose";

// Settings InterFace
export interface ISetting extends Document {
    _id: string;
    priceOfAmpere: number
}