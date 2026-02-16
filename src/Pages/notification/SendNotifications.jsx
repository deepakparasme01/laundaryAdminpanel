import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { toast } from "react-toastify";
import { getCustomerList, sendNotification } from "../../apis/SuperAdmin";

export const SendNotifications = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [deviceType, setDeviceType] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getCustomerList();
            if (response?.status === 200) {
                setUsers(response?.data?.user || []);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleSendNotification = async () => {
        if (!title.trim()) {
            toast.error("Please enter a title");
            return;
        }
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }
        if (selectedUsers.length === 0) {
            toast.error("Please select at least one user");
            return;
        }

        try {
            const payload = {
                title,
                message,
                user_ids: selectedUsers
            };
            const response = await sendNotification(payload);
            if (response?.status === 200) {
                toast.success(response?.message || "Notifications sent successfully");
                setTitle("");
                setMessage("");
                setSelectedUsers([]);
            } else {
                toast.error(response?.message || "Failed to send notifications");
            }
        } catch (error) {
            console.error("Error sending notification:", error);
            toast.error("An error occurred while sending notifications");
        }
    };

    const filteredUsers = users.filter(user => {
        // Filter by device type (currently disabled in UI but logic kept)
        if (deviceType !== "All" && user.device_type !== deviceType) return false;

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                user.name?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query) ||
                user.phone?.toLowerCase().includes(query)
            );
        }
        return true;
    });

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-6 main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[{ label: "Send Notifications", path: "/send_notifications" }]} />

            <div className="flex justify-between items-center mb-4">
                <PageTitle title={"Send Notifications"} />
                <Link
                    to="/notification_history"
                    className="px-4 py-2 bg-[#4680ff] text-white rounded-lg hover:bg-[#3267d6] transition-colors text-sm font-medium"
                >
                    Notification History
                </Link>
            </div>

            <div className="mt-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="bg-[#4680ff] p-4 -m-6 mb-6 rounded-t-2xl">
                    <h2 className="text-lg font-semibold text-white">Send Notifications</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title Notification..."
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4680ff]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Notification Message..."
                            rows="4"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4680ff]"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSendNotification}
                            className="px-6 py-2 bg-[#4680ff] text-white rounded-lg hover:bg-[#3267d6] transition-colors"
                        >
                            Send Message
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="selectAllMain"
                                    checked={filteredUsers.length > 0 && filteredUsers.every(user => selectedUsers.includes(user.id))}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            const newSelected = [...new Set([...selectedUsers, ...filteredUsers.map(u => u.id)])];
                                            setSelectedUsers(newSelected);
                                        } else {
                                            const currentIds = filteredUsers.map(u => u.id);
                                            setSelectedUsers(selectedUsers.filter(id => !currentIds.includes(id)));
                                        }
                                    }}
                                    className="w-4 h-4 rounded border-gray-300 text-[#4680ff] focus:ring-[#4680ff] cursor-pointer"
                                />
                                <label htmlFor="selectAllMain" className="text-sm font-medium text-gray-700 cursor-pointer select-none">Select All Users</label>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // Reset to first page on search
                                }}
                                placeholder="Search by name, email or phone..."
                                className="p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4680ff] w-64"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Device Type:</span>
                            <select
                                value={deviceType}
                                onChange={(e) => setDeviceType(e.target.value)}
                                disabled={true}
                                className="p-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-gray-100 cursor-not-allowed opacity-60"
                            >
                                <option value="All">All</option>
                                <option value="android">Android</option>
                                <option value="ios">iOS</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-left w-12">
                                        <input
                                            type="checkbox"
                                            checked={currentUsers.length > 0 && currentUsers.every(user => selectedUsers.includes(user.id))}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    const newSelected = [...new Set([...selectedUsers, ...currentUsers.map(u => u.id)])];
                                                    setSelectedUsers(newSelected);
                                                } else {
                                                    const currentIds = currentUsers.map(u => u.id);
                                                    setSelectedUsers(selectedUsers.filter(id => !currentIds.includes(id)));
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 text-[#4680ff] focus:ring-[#4680ff] cursor-pointer"
                                        />
                                    </th>
                                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</th>
                                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-[#4680ff] focus:ring-[#4680ff] cursor-pointer"
                                                />
                                            </td>
                                            <td className="p-4 text-sm text-gray-900">{user.name || "N/A"}</td>
                                            <td className="p-4 text-sm text-gray-500">{user.phone || "N/A"}</td>
                                            <td className="p-4 text-sm text-gray-500">{user.email || "N/A"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-4 text-center text-sm text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'}`}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded border cursor-pointer ${currentPage === page ? 'bg-[#4680ff] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'}`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
