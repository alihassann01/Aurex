import express from "express";
import { authMiddleware as protect } from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  markAnnouncementAsRead,
  deleteAnnouncement,
} from "../controllers/announcement.controllers.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("department_admin", "super_admin"),
  createAnnouncement
);

router.get("/", protect, getAnnouncements);

router.get("/:id", protect, getAnnouncementById);

router.patch("/:id/read", protect, authorizeRoles("resident"), markAnnouncementAsRead);

router.delete(
  "/:id",
  protect,
  authorizeRoles("department_admin", "super_admin"),
  deleteAnnouncement
);

export default router;
