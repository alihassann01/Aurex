import mongoose from "mongoose";

const permitApplicationSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    permitType: {
      type: String,
      enum: ["construction", "event", "business_license"],
      required: true,
    },

    formData: {
      type: Object,
      default: {},
    },

    documents: [
      {
        url: String,
        fileName: String,
        fileType: String,
        size: Number,
      },
    ],

    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "document_verification",
        "inspection_scheduled",
        "approved",
        "rejected",
      ],
      default: "draft",
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    feeAmount: {
      type: Number,
      default: 0,
    },

    receiptNumber: {
      type: String,
      default: null,
    },

    certificateNumber: {
      type: String,
      default: null,
    },

    certificateUrl: {
      type: String,
      default: null,
    },

    expiryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

permitApplicationSchema.index({ applicant: 1 });
permitApplicationSchema.index({ status: 1 });
permitApplicationSchema.index({ permitType: 1 });
permitApplicationSchema.index({ createdAt: -1 });

export default mongoose.model("PermitApplication", permitApplicationSchema);
