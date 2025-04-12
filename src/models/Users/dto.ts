import { Document } from "mongoose";

// User InterFace
export interface IUser extends Document {
  _id: string;
  userName: string;
  phoneNumber: string;
  numberOfAmpere: number;
  numberOfPlate: number;
  available: boolean;
  totalPrice: number;
  note: string;
  weeks: boolean[];
  startDate: Date;
  createdAt: Date;
  updatedAt: Date; 
}

export interface INewCustomer {
  userName: string;
  phoneNumber: string;
  numberOfAmpere: number;
  numberOfPlate: number;
  paid: boolean;
  note: string;
}

export interface UserFilter {
  userName?: { $regex: RegExp };
  phoneNumber?: string;
  role?: string;
  numberOfPlate?: number;
}

export interface IAdmin extends Document {
  _id: string;
  userName: string;
  phoneNumber: string;
  password: string;
  role: "admin" | "superAdmin";
}

export interface CreateAdminInput {
  userName: string;
  phoneNumber: string;
  password: string;
  role: "admin" | "superAdmin";
}

export interface LoginAdminInput {
  phoneNumber: string;
  password: string;
}

