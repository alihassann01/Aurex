import CivicRequest from "../models/civicRequests.js";
import Department from "../models/department.model.js";
import User from "../models/user.model.js";
import calculateSlaDeadline from "../utils/calculateSlaDeadline.js";
import generateTicketId from "../utils/generateTicketId.js";

const allowedStatuses = new Set([
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "resolved",
  "closed",
]);

const getIdValue = (value) => value?._id || value;

const isSameId = (left, right) => getIdValue(left)?.toString() === getIdValue(right)?.toString();

const canAccessRequest = (user, request) => {
  if (user.role === "super_admin") return true;

  if (user.role === "resident" && isSameId(request.resident, user._id)) {
    return true;
  }

  if (
    (user.role === "staff" || user.role === "department_admin") &&
    isSameId(request.department, user.department)
  ) {
    return true;
  }

  return false;
};

const createRequest = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      department,
      location,
      priority,
      attachments,
    } = req.body;

    if (!title || !description || !category || !department) {
      return res.status(400).json({
        message: "Title, description, category, and department are required",
      });
    }

    const foundDepartment = await Department.findById(department);

    if (!foundDepartment) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    const requestPriority = priority || "low";
    const ticketId = generateTicketId(foundDepartment.code);
    const slaDeadline = calculateSlaDeadline(requestPriority, foundDepartment);

    const request = await CivicRequest.create({
      ticketId,
      title,
      description,
      category,
      department: foundDepartment._id,
      resident: req.user._id,
      location,
      priority: requestPriority,
      attachments: attachments || [],
      slaDeadline,
    });

    res.status(201).json({
      message: "Request created successfully",
      request,
    });
  } catch (error) {
    next(error);
  }
};

const getMyRequests = async (req, res, next) => {
  try {
    const requests = await CivicRequest.find({
      resident: req.user._id,
    })
      .populate("department", "name code")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

const getAllRequests = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === "staff" || req.user.role === "department_admin") {
      filter.department = req.user.department;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    if (req.query.department && req.user.role === "super_admin") {
      filter.department = req.query.department;
    }

    const requests = await CivicRequest.find(filter)
      .populate("resident", "name email")
      .populate("department", "name code")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

const getRequestById = async (req, res, next) => {
  try {
    const request = await CivicRequest.findById(req.params.id)
      .populate("resident", "name email")
      .populate("department", "name code")
      .populate("assignedTo", "name email role")
      .populate("comments.user", "name email role")
      .lean();

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (!canAccessRequest(req.user, request)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (req.user.role === "resident") {
      request.comments = request.comments.filter((comment) => !comment.isInternal);
    }

    res.status(200).json({
      request,
    });
  } catch (error) {
    next(error);
  }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!allowedStatuses.has(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const request = await CivicRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (!canAccessRequest(req.user, request)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    request.status = status;

    if (status === "resolved" || status === "closed") {
      request.resolvedAt = new Date();
    }

    await request.save();

    res.status(200).json({
      message: "Request status updated successfully",
      request,
    });
  } catch (error) {
    next(error);
  }
};

const assignRequest = async (req, res, next) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        message: "staffId is required",
      });
    }

    const request = await CivicRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (!canAccessRequest(req.user, request)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const staffUser = await User.findById(staffId).select("name email role department");

    if (!staffUser || staffUser.role !== "staff") {
      return res.status(400).json({
        message: "Assigned user must be a staff member",
      });
    }

    if (req.user.role !== "super_admin" && !isSameId(staffUser.department, request.department)) {
      return res.status(403).json({
        message: "Staff member must belong to same department",
      });
    }

    request.assignedTo = staffUser._id;
    request.status = "assigned";

    await request.save();

    res.status(200).json({
      message: "Request assigned successfully",
      request,
    });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { message, isInternal } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Comment message is required",
      });
    }

    const request = await CivicRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (!canAccessRequest(req.user, request)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const internalFlag = req.user.role === "resident" ? false : Boolean(isInternal);

    request.comments.push({
      user: req.user._id,
      message,
      isInternal: internalFlag,
    });

    await request.save();

    res.status(201).json({
      message: "Comment added successfully",
      comments: request.comments,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createRequest,
  getMyRequests,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  assignRequest,
  addComment,
};
