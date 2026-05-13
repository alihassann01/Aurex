import express from "express";
import { authMiddleware as protect } from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import {
  createEvent,
  getEvents,
  getEventById,
  registerForEvent,
  cancelEventRegistration,
  deleteEvent,
} from "../controllers/event.controllers.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("department_admin", "super_admin"),
  createEvent
);

router.get("/", protect, getEvents);

router.get("/:id", protect, getEventById);

router.post("/:id/register", protect, authorizeRoles("resident"), registerForEvent);

router.delete("/:id/register", protect, authorizeRoles("resident"), cancelEventRegistration);

router.delete(
  "/:id",
  protect,
  authorizeRoles("department_admin", "super_admin"),
  deleteEvent
);

export default router;
