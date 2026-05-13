import PermitApplication from "../models/permitApplication.model.js";
import calculatePermitFee from "../utils/calculatePermitFee.js";
import generateApplicationNumber from "../utils/generateApplicationNumber.js";
import generateCertificateNumber from "../utils/generateCertificateNumber.js";
import createNotification from "../utils/createNotification.js";
import generateReceiptNumber from "../utils/generateReceiptNumber.js";

const getIdValue = (value) => value?._id || value;

const isSameId = (left, right) => getIdValue(left)?.toString() === getIdValue(right)?.toString();

const canAccessPermit = (user, permit) => {
  if (user.role === "super_admin") return true;

  if (user.role === "resident" && isSameId(permit.applicant, user._id)) {
    return true;
  }

  if (user.role === "staff" || user.role === "department_admin") {
    return true;
  }

  return false;
};

const createPermit = async (req, res, next) => {
  try {
    const { permitType, formData, documents } = req.body;

    const allowedTypes = ["construction", "event", "business_license"];

    if (!permitType) {
      return res.status(400).json({ message: "permitType is required" });
    }

    if (!allowedTypes.includes(permitType)) {
      return res.status(400).json({ message: "Invalid permit type" });
    }

    const permit = await PermitApplication.create({
      applicationNumber: generateApplicationNumber(permitType),
      applicant: req.user._id,
      permitType,
      formData: formData || {},
      documents: documents || [],
      feeAmount: calculatePermitFee(permitType),
      receiptNumber: generateReceiptNumber(),
      status: "draft",
    });

    res.status(201).json({
      message: "Permit draft created successfully",
      permit,
    });
  } catch (error) {
    next(error);
  }
};

const getMyPermits = async (req, res, next) => {
  try {
    const permits = await PermitApplication.find({
      applicant: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: permits.length,
      permits,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPermits = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.permitType) {
      filter.permitType = req.query.permitType;
    }

    const permits = await PermitApplication.find(filter)
      .populate("applicant", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: permits.length,
      permits,
    });
  } catch (error) {
    next(error);
  }
};

const getPermitById = async (req, res, next) => {
  try {
    const permit = await PermitApplication.findById(req.params.id).populate(
      "applicant",
      "name email role"
    );

    if (!permit) {
      return res.status(404).json({ message: "Permit not found" });
    }

    if (!canAccessPermit(req.user, permit)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ permit });
  } catch (error) {
    next(error);
  }
};

const updatePermit = async (req, res, next) => {
  try {
    const { formData, documents } = req.body;

    const permit = await PermitApplication.findById(req.params.id);

    if (!permit) {
      return res.status(404).json({ message: "Permit not found" });
    }

    if (!isSameId(permit.applicant, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (permit.status !== "draft" && permit.status !== "rejected") {
      return res.status(400).json({
        message: "Only draft or rejected permits can be edited",
      });
    }

    if (formData !== undefined) permit.formData = formData;
    if (documents !== undefined) permit.documents = documents;

    await permit.save();

    res.status(200).json({
      message: "Permit updated successfully",
      permit,
    });
  } catch (error) {
    next(error);
  }
};

const submitPermit = async (req, res, next) => {
  try {
    const permit = await PermitApplication.findById(req.params.id);

    if (!permit) {
      return res.status(404).json({ message: "Permit not found" });
    }

    if (!isSameId(permit.applicant, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (permit.status !== "draft" && permit.status !== "rejected") {
      return res.status(400).json({
        message: "Only draft or rejected permits can be submitted",
      });
    }

    permit.status = "submitted";
    permit.rejectionReason = null;

    await permit.save();

    res.status(200).json({
      message: "Permit submitted successfully",
      permit,
    });
  } catch (error) {
    next(error);
  }
};

const updatePermitStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    const allowedStatuses = [
      "document_verification",
      "inspection_scheduled",
      "approved",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    const permit = await PermitApplication.findById(req.params.id);

    if (!permit) {
      return res.status(404).json({ message: "Permit not found" });
    }

    permit.status = status;

    if (status === "rejected") {
      permit.rejectionReason = rejectionReason;
      permit.certificateNumber = null;
      permit.certificateUrl = null;
      permit.expiryDate = null;
    }

    if (status === "approved") {
      permit.rejectionReason = null;
      permit.certificateNumber = generateCertificateNumber();

      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      permit.expiryDate = expiryDate;
      permit.certificateUrl = `/certificates/${permit.certificateNumber}.pdf`;
    }

    await permit.save();

    await createNotification({
      user: permit.applicant,
      title: "Permit Status Updated",
      message: `Your permit ${permit.applicationNumber} is now ${permit.status}.`,
      type: "permit",
      relatedId: permit._id,
    });

    res.status(200).json({
      message: "Permit status updated successfully",
      permit,
    });
  } catch (error) {
    next(error);
  }
};

const resubmitPermit = async (req, res, next) => {
  try {
    const { formData, documents } = req.body;

    const permit = await PermitApplication.findById(req.params.id);

    if (!permit) {
      return res.status(404).json({ message: "Permit not found" });
    }

    if (!isSameId(permit.applicant, req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (permit.status !== "rejected") {
      return res.status(400).json({
        message: "Only rejected permits can be resubmitted",
      });
    }

    if (formData !== undefined) permit.formData = formData;
    if (documents !== undefined) permit.documents = documents;

    permit.status = "submitted";
    permit.rejectionReason = null;

    await permit.save();

    res.status(200).json({
      message: "Permit resubmitted successfully",
      permit,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createPermit,
  getMyPermits,
  getAllPermits,
  getPermitById,
  updatePermit,
  submitPermit,
  updatePermitStatus,
  resubmitPermit,
};
