import express from "express";
import { authMiddleware as protect } from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import {
  createRequest,
  getMyRequests,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  assignRequest,
  addComment,
} from "../controllers/request.controllers.js";

const router = express.Router();

// Resident creates civic request
router.post("/", protect, authorizeRoles("resident"), createRequest);

// Resident views own requests
router.get("/my", protect, authorizeRoles("resident"), getMyRequests);

// Staff/Admin views requests
router.get(
  "/",
  protect,
  authorizeRoles("staff", "department_admin", "super_admin"),
  getAllRequests
);

// Any authorized related user can view request details
router.get("/:id", protect, getRequestById);

// Staff/Admin updates request status
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("staff", "department_admin", "super_admin"),
  updateRequestStatus
);

// Department Admin/Super Admin assigns request
router.patch(
  "/:id/assign",
  protect,
  authorizeRoles("department_admin", "super_admin"),
  assignRequest
);

// Resident/staff/admin can comment based on access
router.post("/:id/comments", protect, addComment);

export default router;
