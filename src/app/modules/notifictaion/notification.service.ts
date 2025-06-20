import Notification from "./notification.model";
import { TUserRole, userRoles } from "../../interface/auth.interface";
import AppError from "../../errors/AppError";
import status from "http-status";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const getFromUser = async (page: number, limit: number) => {
  // Filter condition for unread notifications
  const filter = { isRead: false, sender: userRoles.USER };

  // Total unread notifications count
  const totalItem = await Notification.countDocuments(filter);

  // Calculate total pages for unread notifications
  const totalPage = Math.ceil(totalItem / limit);

  // Fetch paginated unread notifications
  const getNotification = await Notification.find(filter)
    .sort({ createdAt: -1 }) // newest first
    .skip((page - 1) * limit)
    .limit(limit);

  const meta = {
    totalItem,
    totalPage,
    limit: limit,
    page: page,
  };

  return { getNotification, meta };
};

const getFromAdmin = async (userId: string) => {
  const getNotification = await Notification.find({
    user: userId,
    sender: userRoles.ADMIN,
    isRead: false,
  });

  return getNotification;
};

const markAsRead = async (nId: string, userRole: TUserRole) => {
  const query: Record<string, unknown> = { _id: nId };

  if (userRole === userRoles.ADMIN) {
    query.sender = userRoles.USER;
  }

  if (userRole === userRoles.USER) {
    query.sender = userRoles.ADMIN;
  }

  const update = await Notification.findOneAndUpdate(
    query,
    { isRead: true },
    { new: true }
  );

  if (!update) {
    throw new AppError(status.BAD_REQUEST, "Failed to mark as read.");
  }

  return update;
};

export const NotificationService = { getFromUser, getFromAdmin, markAsRead };
