import { Document } from "mongoose";

// Bill InterFace
export interface IBill extends Document {
  category: string;
  userName?: string;
  phoneNumber?: string;
  price: number;
  available: boolean;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillFilter {
  category?: { $regex: RegExp };
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
}

export interface ProductsFilter {
  category: string;
  available: boolean;
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
}
