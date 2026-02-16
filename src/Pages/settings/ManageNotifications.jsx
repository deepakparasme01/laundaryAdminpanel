import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { getManageNotifications, updateManageNotification } from "../../apis/SuperAdmin";

const ManageNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingIds, setUpdatingIds] = useState([]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await getManageNotifications();
            if (response?.status === 200) {
                setNotifications(response.data || []);
            } else {
                toast.error(response?.message || "Failed to fetch notifications");
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Error loading notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleChange = (id, field, value) => {
        setNotifications(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleUpdate = async (notification) => {
        setUpdatingIds(prev => [...prev, notification.id]);
        try {
            const payload = {
                message: notification.message,
                status: notification.status
            };
            const response = await updateManageNotification(payload, notification.id);
            if (response?.status === 200) {
                toast.success(response.message || "Notification updated successfully");
            } else {
                toast.error(response?.message || "Failed to update notification");
            }
        } catch (error) {
            console.error("Error updating notification:", error);
            toast.error("Error updating notification");
        } finally {
            setUpdatingIds(prev => prev.filter(id => id !== notification.id));
        }
    };

    return (
        <div className="p-6 main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[{ label: "Settings", path: "#" }, { label: "Manage Notifications", path: "/manage_notifications" }]} />
            <PageTitle title={"Notification Management"} />

            <div className="mt-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notifications.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition-all">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={item.status === 1}
                                                onChange={(e) => handleChange(item.id, 'status', e.target.checked ? 1 : 0)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Message</label>
                                        <textarea
                                            value={item.message}
                                            onChange={(e) => handleChange(item.id, 'message', e.target.value)}
                                            rows="3"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white resize-none"
                                            placeholder="Enter notification message"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-3 border-t border-gray-100 mt-2">
                                    <button
                                        onClick={() => handleUpdate(item)}
                                        disabled={updatingIds.includes(item.id)}
                                        className="bg-[#3d9bc7] hover:bg-[#02598e] text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {updatingIds.includes(item.id) && (
                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        )}
                                        {updatingIds.includes(item.id) ? "Updating..." : "Update"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageNotifications;
