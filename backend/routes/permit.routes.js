import express from "express";
import { authMiddleware as protect } from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import {
  createPermit,
  getMyPermits,
  getAllPermits,
  getPermitById,
  updatePermit,
  submitPermit,
  updatePermitStatus,
  resubmitPermit,
} from "../controllers/permit.controllers.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("resident"), createPermit);

router.get("/my", protect, authorizeRoles("resident"), getMyPermits);

router.get(
  "/",
  protect,
  authorizeRoles("staff", "department_admin", "super_admin"),
  getAllPermits
);

router.get("/:id", protect, getPermitById);

router.patch("/:id", protect, authorizeRoles("resident"), updatePermit);

router.patch("/:id/submit", protect, authorizeRoles("resident"), submitPermit);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("staff", "department_admin", "super_admin"),
  updatePermitStatus
);

router.patch("/:id/resubmit", protect, authorizeRoles("resident"), resubmitPermit);

export default router;
