import Notification from "../models/notification.model.js";

const createNotification = async ({
  user,
  title,
  message,
  type = "system",
  relatedId = null,
}) => {
  if (!user || !title || !message) return null;

  return Notification.create({
    user,
    title,
    message,
    type,
    relatedId,
  });
};

export default createNotification;
