
import React, { useEffect, useState, useMemo } from 'react';
import { getNotificationList } from '../../apis/SuperAdmin';
import { toast } from 'react-toastify';
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { ProductTable } from "../../components/common/Table/ProductTable";

export const NotificationList = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await getNotificationList();
            if (response?.status === 200) {
                setNotifications(response?.data?.notification || []);
            } else {
                toast.error(response?.message || "Failed to fetch notifications");
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const columns = useMemo(() => [
        {
            header: "No.",
            accessorKey: "id",
            cell: (info) => <span>{info.row.index + 1}</span>,
            size: 50,
        },
        {
            header: "Title",
            accessorKey: "title",
            cell: ({ row }) => <span className="font-semibold text-gray-800">{row.original.title}</span>
        },
        {
            header: "Message",
            accessorKey: "message",
            cell: ({ row }) => <span className="text-gray-600 line-clamp-2" title={row.original.message}>{row.original.message}</span>
        },
        {
            header: "Date",
            accessorKey: "created_at",
            cell: ({ row }) => {
                const date = new Date(row.original.created_at);
                return (
                    <div className="flex flex-col text-xs text-gray-500">
                        <span>{date.toLocaleDateString()}</span>
                        <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                );
            }
        },
        {
            header: "Type",
            accessorKey: "type",
            cell: ({ row }) => (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {row.original.type?.replace('_', ' ')}
                </span>
            )
        }
    ], []);

    return (
        <div className="p-6 main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[{ label: "Notifications", path: "/notifications" }]} />
            <div className="flex justify-between items-center mb-4">
                <PageTitle title={"Notifications"} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ProductTable
                    columns={columns}
                    productList={notifications}
                    isLoading={isLoading}
                    emptyMessage="No notifications found."
                />
            </div>
        </div>
    );
};
