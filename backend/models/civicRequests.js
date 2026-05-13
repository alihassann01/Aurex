import mongoose from "mongoose";
import { Schema } from "mongoose";

const civicRequestSchema = new Schema({
     ticketId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    location: {
      address: String,
      lat: Number,
      lng: Number,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "emergency"],
      default: "low",
    },

    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "assigned",
        "in_progress",
        "resolved",
        "closed",
      ],
      default: "submitted",
    },

    attachments: [
      {
        url: String,
        fileName: String,
        fileType: String,
      },
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: String,
        isInternal: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    slaDeadline: {
      type: Date,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

civicRequestSchema.index({ resident: 1 });
civicRequestSchema.index({ department: 1 });
civicRequestSchema.index({ status: 1 });
civicRequestSchema.index({ createdAt: -1 });

export default mongoose.model("CivicRequest", civicRequestSchema);