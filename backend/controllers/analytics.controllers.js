import Announcement from "../models/announcement.model.js";
import CivicRequest from "../models/civicRequests.js";
import Event from "../models/event.model.js";
import PermitApplication from "../models/permitApplication.model.js";

const getOverviewAnalytics = async (req, res, next) => {
  try {
    const [
      totalRequests,
      resolvedRequests,
      totalPermits,
      approvedPermits,
      totalEvents,
      activeAnnouncements,
    ] = await Promise.all([
      CivicRequest.countDocuments(),
      CivicRequest.countDocuments({
        status: { $in: ["resolved", "closed"] },
      }),
      PermitApplication.countDocuments(),
      PermitApplication.countDocuments({
        status: "approved",
      }),
      Event.countDocuments({
        isActive: true,
      }),
      Announcement.countDocuments({
        isActive: true,
      }),
    ]);

    const pendingRequests = totalRequests - resolvedRequests;

    res.status(200).json({
      totalRequests,
      resolvedRequests,
      pendingRequests,
      totalPermits,
      approvedPermits,
      totalEvents,
      activeAnnouncements,
    });
  } catch (error) {
    next(error);
  }
};

const getRequestStatusAnalytics = async (req, res, next) => {
  try {
    const analytics = await CivicRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      analytics,
    });
  } catch (error) {
    next(error);
  }
};

const getRequestPriorityAnalytics = async (req, res, next) => {
  try {
    const analytics = await CivicRequest.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      analytics,
    });
  } catch (error) {
    next(error);
  }
};

const getPermitStatusAnalytics = async (req, res, next) => {
  try {
    const analytics = await PermitApplication.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      analytics,
    });
  } catch (error) {
    next(error);
  }
};

const getEventAnalytics = async (req, res, next) => {
  try {
    const events = await Event.find({
      isActive: true,
    });

    const analytics = events.map((event) => ({
      id: event._id,
      title: event.title,
      category: event.category,
      capacity: event.capacity,
      registeredUsers: event.registeredUsers.length,
      remainingCapacity: event.capacity - event.registeredUsers.length,
      eventDate: event.eventDate,
    }));

    res.status(200).json({
      count: analytics.length,
      analytics,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getOverviewAnalytics,
  getRequestStatusAnalytics,
  getRequestPriorityAnalytics,
  getPermitStatusAnalytics,
  getEventAnalytics,
};
