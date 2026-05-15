"use client";

import { useNotificationStore } from "@/lib/zustandStore/notification";

export default function NotificationPanel() {
  const { notifications, markAllRead } = useNotificationStore();

  // ✅ always sorted (latest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="p-10 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>

        {notifications.length > 0 && (
          <button
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={markAllRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="border rounded-lg overflow-hidden">
        {sortedNotifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            🔕 No notifications yet
          </div>
        ) : (
          sortedNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 border-b text-sm ${
                !n.read ? "bg-gray-100 font-medium" : ""
              }`}
            >
              <div>{n.message}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
