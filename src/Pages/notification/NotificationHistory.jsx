import React, { useState, useEffect } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { toast } from "react-toastify";
import { getAllNotifications } from "../../apis/SuperAdmin";

export const NotificationHistory = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await getAllNotifications();
            if (response?.status === 200) {
                setNotifications(response?.data || []);
            } else {
                toast.error(response?.message || "Failed to load notification history");
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Error loading history");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[
                { label: "Send Notifications", path: "/send_notifications" },
                { label: "Notification History", path: "/notification_history" }
            ]} />
            <PageTitle title={"Notification History"} />

            <div className="mt-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="bg-[#4680ff] p-4 -m-6 mb-6 rounded-t-2xl">
                    <h2 className="text-lg font-semibold text-white">History</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipients</th>
                                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sent At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : notifications.length > 0 ? (
                                notifications.map((notification, index) => (
                                    <tr key={notification.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-sm text-gray-900">{index + 1}</td>
                                        <td className="p-4 text-sm font-medium text-gray-900">{notification.title}</td>
                                        <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={notification.message}>
                                            {notification.message}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {Array.isArray(notification.users) ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {notification.users.slice(0, 3).map((user, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs border border-blue-100">
                                                            {user}
                                                        </span>
                                                    ))}
                                                    {notification.users.length > 3 && (
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs border border-gray-200">
                                                            +{notification.users.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">No recipients</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No notification history found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
