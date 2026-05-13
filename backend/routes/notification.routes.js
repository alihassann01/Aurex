import express from "express";
import { authMiddleware as protect } from "../middleware/auth.middleware.js";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notification.controllers.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);

router.patch("/read-all", protect, markAllNotificationsAsRead);

router.patch("/:id/read", protect, markNotificationAsRead);

router.delete("/:id", protect, deleteNotification);

export default router;
