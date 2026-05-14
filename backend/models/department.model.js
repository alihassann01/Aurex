import mongoose from "mongoose";
import { Schema } from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
    },

    slaHours: {                  // service level agreement hours for different priority levels
       low: { type: Number, default: 72 },
      medium: { type: Number, default: 48 },
      high: { type: Number, default: 24 },
      emergency: { type: Number, default: 4 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);