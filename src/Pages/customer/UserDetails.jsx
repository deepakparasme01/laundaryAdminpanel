import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../../apis/SuperAdmin';
import { toast } from 'react-toastify';
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { ProductTable } from "../../components/common/Table/ProductTable";
import { IMG_BASE_URL } from "../../config/Config";

export const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const response = await getUserDetails({ user_id: id });
            if (response?.status === 200) {
                setUser(response?.data?.user);
                setOrders(response?.data?.total_order || []);
            } else {
                toast.error(response?.message || "Failed to fetch details");
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            // toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDetails();
    }, [id]);

    const columns = useMemo(() => [
        {
            header: "Order ID",
            accessorKey: "id",
            cell: ({ row }) => <span className="font-semibold">#{row.original.id}</span>
        },
        {
            header: "Service",
            accessorKey: "service_name",
        },
        {
            header: "Date",
            accessorKey: "date",
            cell: ({ row }) => (
                <div className="flex flex-col text-sm">
                    <span className='whitespace-nowrap'>Pickup: {row.original.pickup_date}</span>
                    <span className='whitespace-nowrap'>Delivery: {row.original.delivery_date}</span>
                </div>
            )
        },
        {
            header: "Amount",
            accessorKey: "final_amount",
            cell: ({ row }) => (
                <span className="font-bold text-green-600">₹{row.original.final_amount}</span>
            )
        },
        {
            header: "Status",
            accessorKey: "order_status",
            cell: ({ row }) => {
                const statusMap = {
                    1: "Pending",
                    2: "Processing",
                    3: "Completed",
                    4: "Cancelled"
                };
                const statusColors = {
                    1: "bg-yellow-100 text-yellow-800",
                    2: "bg-blue-100 text-blue-800",
                    3: "bg-green-100 text-green-800",
                    4: "bg-red-100 text-red-800"
                };

                return (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[row.original.order_status] || "bg-gray-100 text-gray-800"}`}>
                        {statusMap[row.original.order_status] || "Unknown"}
                    </span>
                );
            }
        },
        {
            header: "Action",
            accessorKey: "action",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <button
                        onClick={() => navigate(`/order_detail/${row.original.id}`)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        title="View Order"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </div>
            )
        }
    ], [navigate]);

    if (isLoading && !user) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[
                { label: "Customer List", path: "/customer_list" },
                { label: "Customer Details", path: "#" }
            ]} />
            <div className="flex justify-between items-center mb-4">
                <PageTitle title={"Customer Details"} />
            </div>

            {/* User Profile Section */}
            {user && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div className="w-32 h-32 flex-shrink-0 relative">
                            {user.image ? (
                                <img
                                    src={`${IMG_BASE_URL}${user.image}`}
                                    alt={user.name}
                                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold border-4 border-white shadow-md">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                            <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white ${user.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Full Name</span>
                                    <span className="font-semibold text-gray-800 text-lg">{user.name || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Email Data</span>
                                    <span className="font-medium text-gray-700">{user.email || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Phone Number</span>
                                    <span className="font-medium text-gray-700">{user.phone || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Device Type</span>
                                    <span className="font-medium text-gray-700">{user.device_type || "Unknown"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Joined Date</span>
                                    <span className="font-medium text-gray-700">{new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Total Orders</span>
                                    <span className="font-medium text-gray-700">{orders.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Orders Section */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 px-1 border-l-4 border-blue-500 pl-2">Ordering History</h3>
                <ProductTable columns={columns} productList={orders} isLoading={isLoading} emptyMessage="No orders found for this user." />
            </div>
        </div>
    );
};
