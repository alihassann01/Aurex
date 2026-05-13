import Announcement from "../models/announcement.model.js";
import User from "../models/user.model.js";
import createNotification from "../utils/createNotification.js";

const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, category, priority, expiresAt } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const announcement = await Announcement.create({
      title,
      message,
      category: category || "general",
      priority: priority || "normal",
      expiresAt: expiresAt || null,
      createdBy: req.user._id,
    });

    const residents = await User.find({ role: "resident" }).select("_id");

    await Promise.all(
      residents.map((resident) =>
        createNotification({
          user: resident._id,
          title: "New City Announcement",
          message: announcement.title,
          type: "announcement",
          relatedId: announcement._id,
        })
      )
    );

    res.status(201).json({
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

const getAnnouncements = async (req, res, next) => {
  try {
    const filter = { isActive: true };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.priority) filter.priority = req.query.priority;

    filter.$or = [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }];

    const announcements = await Announcement.find(filter)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    const data = announcements.map((item) => {
      const obj = item.toObject();
      obj.isRead = item.readBy.some((id) => id.toString() === req.user._id.toString());
      return obj;
    });

    res.status(200).json({
      count: data.length,
      announcements: data,
    });
  } catch (error) {
    next(error);
  }
};

const getAnnouncementById = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!announcement || !announcement.isActive) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    const obj = announcement.toObject();
    obj.isRead = announcement.readBy.some((id) => id.toString() === req.user._id.toString());

    res.status(200).json({ announcement: obj });
  } catch (error) {
    next(error);
  }
};

const markAnnouncementAsRead = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement || !announcement.isActive) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    const alreadyRead = announcement.readBy.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      announcement.readBy.push(req.user._id);
      await announcement.save();
    }

    res.status(200).json({
      message: "Announcement marked as read",
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    announcement.isActive = false;
    await announcement.save();

    res.status(200).json({
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  markAnnouncementAsRead,
  deleteAnnouncement,
};
