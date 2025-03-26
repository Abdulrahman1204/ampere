import { Document } from "mongoose";

// Category InterFace
export interface ICategory extends Document {
    title: string,
}