import Notification from "../models/Notification.js";

export const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
      read: false
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch unread notifications" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this notification" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};
