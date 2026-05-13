import express from "express";
import { authMiddleware as protect } from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import {
  getOverviewAnalytics,
  getRequestStatusAnalytics,
  getRequestPriorityAnalytics,
  getPermitStatusAnalytics,
  getEventAnalytics,
} from "../controllers/analytics.controllers.js";

const router = express.Router();

router.get(
  "/overview",
  protect,
  authorizeRoles("staff", "department_admin", "super_admin"),
  getOverviewAnalytics
);

router.get(
  "/request-status",
  protect,
  authorizeRoles("staff", "department_admin", "super_admin"),
  getRequestStatusAnalytics
);

router.get(
  "/request-priority",
  protect,
  authorizeRoles("staff", "department_admin", "super_admin"),
  getRequestPriorityAnalytics
);

router.get(
  "/permit-status",
  protect,
  authorizeRoles("staff", "department_admin", "super_admin"),
  getPermitStatusAnalytics
);

router.get(
  "/events",
  protect,
  authorizeRoles("staff", "department_admin", "super_admin"),
  getEventAnalytics
);

export default router;
