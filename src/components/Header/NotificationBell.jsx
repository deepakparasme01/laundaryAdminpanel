
import React, { useState, useEffect, useRef } from "react";
import { GoBellFill } from "react-icons/go";
import { IoNotificationsOutline } from "react-icons/io5";
import { getNotificationList } from "../../apis/SuperAdmin";
import { useNavigate } from "react-router-dom";

function NotificationBell() {
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await getNotificationList();
      if (response?.status === 200) {
        const allNotifications = response?.data?.notification || [];
        setNotifications(allNotifications);
        // Count unread notifications (is_read === 0)
        const unreadCount = allNotifications.filter(n => n.is_read === 0).length;
        setCount(unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optional: Poll for notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const clearNotifications = () => {
    // In a real app, this might call an API to mark all as read
    setCount(0);
    // Optimistically update local state if needed, or just clear the badge
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShowAll = () => {
    setIsOpen(false);
    navigate("/notifications");
  };

  // Show only top 4 notifications in dropdown
  const displayedNotifications = notifications.slice(0, 4);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell with badge */}
      <div onClick={toggleDropdown} className="cursor-pointer relative">
        {count > 0 && (
          <div
            className="flex justify-center items-center px-1.5 h-[16px] min-w-[16px]
              bg-red-500 absolute -top-1 -right-1 rounded-full 
              text-white text-[10px] font-bold z-10 border border-white"
          >
            {count > 99 ? '99+' : count}
          </div>
        )}

        <IoNotificationsOutline
          className="w-7 h-7 text-[#3d9bc7]
            transition-transform duration-200 
            hover:scale-110 hover:rotate-6 hover:drop-shadow-lg"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl z-20 
             border border-gray-100 flex flex-col animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="border-b border-gray-100 px-4 py-3 flex justify-between items-center bg-gray-50 rounded-t-xl">
            <h3 className="font-semibold text-gray-700 text-sm">Notifications</h3>
            {count > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications list */}
          <ul className="max-h-[350px] overflow-y-auto flex-1 py-1">
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((note, index) => (
                <li
                  key={note.id || index}
                  className="px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-none cursor-pointer group"
                  onClick={() => {/* Handle click on individual notification if needed */ }}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{note.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{note.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1.5">{new Date(note.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className="px-4 py-8 flex flex-col items-center justify-center text-gray-400">
                <GoBellFill className="w-8 h-8 mb-2 opacity-20" />
                <span className="text-sm">No notifications</span>
              </div>
            )}
          </ul>

          {/* Footer with Show All */}
          <div className="border-t border-gray-100 rounded-b-xl p-2 bg-gray-50">
            <button
              onClick={handleShowAll}
              className="w-full flex justify-center items-center py-2 text-sm text-[#3d9bc7] hover:bg-blue-50 rounded-lg font-medium transition-colors"
            >
              See all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
