"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: string;
  read: boolean;
  createdAt: string;
  postId?: string;
  actor: {
    id: string;
    username: string;
    image?: string;
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        // Mark as read
        fetch("/api/notifications", { method: "PATCH" });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart size={16} className="text-red-500 fill-red-500" />;
      case "comment":
        return <MessageCircle size={16} className="text-blue-500" />;
      case "follow":
        return <UserPlus size={16} className="text-green-500" />;
      default:
        return <Heart size={16} />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case "like":
        return "liked your post.";
      case "comment":
        return "commented on your post.";
      case "follow":
        return "started following you.";
      default:
        return "interacted with you.";
    }
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Notifications</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-11 h-11 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-48 h-4 bg-gray-200 rounded"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-1">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href={
                  notification.type === "follow"
                    ? `/profile/${notification.actor.username}`
                    : notification.postId
                    ? `/post/${notification.postId}`
                    : "#"
                }
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative">
                  {notification.actor.image ? (
                    <img
                      src={notification.actor.image}
                      alt={notification.actor.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-500">
                      {notification.actor.username[0].toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{notification.actor.username}</span>{" "}
                    {getNotificationText(notification)}{" "}
                    <span className="text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: false })}
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 border-2 border-black rounded-full flex items-center justify-center">
              <Heart size={40} />
            </div>
            <h3 className="text-xl font-light mb-2">Activity On Your Posts</h3>
            <p className="text-gray-500">
              When someone likes or comments on one of your posts, you'll see it here.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
