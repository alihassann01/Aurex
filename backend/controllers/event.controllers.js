import Event from "../models/event.model.js";

const formatEvent = (event, userId) => {
  const obj = event.toObject();

  obj.registrationCount = event.registeredUsers.length;
  obj.remainingCapacity = Math.max(0, event.capacity - event.registeredUsers.length);

  obj.isRegistered = event.registeredUsers.some((user) => {
    const id = user._id ? user._id : user;
    return id.toString() === userId.toString();
  });

  return obj;
};

const createEvent = async (req, res, next) => {
  try {
    const { title, description, category, eventDate, location, capacity } = req.body;

    if (!title || !description || !category || !eventDate || !location || !capacity) {
      return res.status(400).json({ message: "All event fields are required" });
    }

    const event = await Event.create({
      title,
      description,
      category,
      eventDate,
      location,
      capacity,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const filter = { isActive: true };

    if (req.query.category) filter.category = req.query.category;

    const events = await Event.find(filter)
      .populate("createdBy", "name email role")
      .sort({ eventDate: 1 });

    const data = events.map((event) => formatEvent(event, req.user._id));

    res.status(200).json({
      count: data.length,
      events: data,
    });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("registeredUsers", "name email role");

    if (!event || !event.isActive) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      event: formatEvent(event, req.user._id),
    });
  } catch (error) {
    next(error);
  }
};

const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({ message: "Event not found" });
    }

    const alreadyRegistered = event.registeredUsers.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    if (event.registeredUsers.length >= event.capacity) {
      return res.status(400).json({ message: "Event capacity is full" });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();

    res.status(200).json({
      message: "Registered for event successfully",
      event: formatEvent(event, req.user._id),
    });
  } catch (error) {
    next(error);
  }
};

const cancelEventRegistration = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.registeredUsers = event.registeredUsers.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await event.save();

    res.status(200).json({
      message: "Event registration cancelled",
      event: formatEvent(event, req.user._id),
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.isActive = false;
    await event.save();

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createEvent,
  getEvents,
  getEventById,
  registerForEvent,
  cancelEventRegistration,
  deleteEvent,
};
