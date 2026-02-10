import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { getOrderDetail, updateOrderStatus, getDrivers, assignDriver } from "../../apis/SuperAdmin";
import { IMG_BASE_URL } from "../../config/Config";

export const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [drivers, setDrivers] = useState([]);
    const [driverId, setDriverId] = useState("");
    const [driverSearch, setDriverSearch] = useState("");

    const fetchDrivers = async () => {
        try {
            const response = await getDrivers(1); // Fetch only active drivers
            if (response?.status === 200) {
                setDrivers(response?.data?.driver || []);
            }
        } catch (error) {
            console.error("Error fetching drivers:", error);
            toast.error("Failed to load drivers");
        }
    };

    const statusOptions = [
        { value: 1, label: "New" },
        { value: 2, label: "Pick up" },
        { value: 3, label: "In Wash" },
        { value: 4, label: "Drying/Folding" },
        { value: 5, label: "Out for Delivery" },
        { value: 6, label: "Delivered" },
        { value: 7, label: "Cancelled" },
    ];

    const fetchOrderDetails = async () => {
        try {
            setIsLoading(true);
            const response = await getOrderDetail({ order_id: id });
            if (response?.status === 200) {
                setOrderData(response?.data);
            } else if (response?.response?.data?.status === 401) {
                toast.error(response?.response?.data?.message);
                localStorage.removeItem("user_role");
                localStorage.removeItem("laundary-token");
                navigate("/");
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async () => {
        if (!selectedStatus) return;

        try {
            const response = await updateOrderStatus({
                order_id: orderData.id,
                status: parseInt(selectedStatus)
            });
            if (response?.status === 200) {
                toast.success(response.message || "Order status updated successfully");
                setIsStatusModalOpen(false);
                fetchOrderDetails(); // Refresh data
            } else {
                toast.error(response?.response?.data?.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Update status error:", error);
            toast.error("An error occurred while updating status");
        }
    };

    const getAvailableStatuses = (currentStatus) => {
        // Validation Logic
        if (currentStatus === 1) { // New
            return [
                { value: 2, label: "Pick up" },
                { value: 7, label: "Cancelled" }
            ];
        } else if (currentStatus === 2) { // Pick up
            return [{ value: 3, label: "In Wash" }];
        } else if (currentStatus === 3) { // In Wash
            return [{ value: 4, label: "Drying/Folding" }];
        } else if (currentStatus === 4) { // Drying
            return [{ value: 5, label: "Out for Delivery" }];
        } else if (currentStatus === 5) { // Out for Delivery
            return [{ value: 6, label: "Delivered" }];
        } else {
            return []; // Delivered or Cancelled - No actions
        }
    };

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }
    }, [id]);

    if (isLoading && !orderData) {
        return <div className="p-6 text-center text-gray-500">Loading Order Details...</div>;
    }

    if (!orderData) {
        return <div className="p-6 text-center text-gray-500">Order not found.</div>;
    }

    // Determine current status label for the badge
    const currentStatusOption = statusOptions.find(opt => opt.value === orderData.order_status);
    const statusLabel = currentStatusOption ? currentStatusOption.label : "Unknown";

    // Determine badge color
    let badgeColor = "bg-gray-100 text-gray-600";
    if (orderData.order_status === 1) badgeColor = "bg-blue-100 text-blue-600";
    else if (orderData.order_status === 2) badgeColor = "bg-yellow-100 text-yellow-600";
    else if (orderData.order_status === 3) badgeColor = "bg-purple-100 text-purple-600";
    else if (orderData.order_status === 4) badgeColor = "bg-orange-100 text-orange-600";
    else if (orderData.order_status === 5) badgeColor = "bg-indigo-100 text-indigo-600";
    else if (orderData.order_status === 6) badgeColor = "bg-green-100 text-green-600";
    else if (orderData.order_status === 7) badgeColor = "bg-red-100 text-red-600";

    const availableStatuses = getAvailableStatuses(orderData.order_status);

    return (
        <div className="p-6 main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[
                { label: "Order List", path: "/order_list" },
                { label: `Order #${id}`, path: "#" }
            ]} />

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <PageTitle title={`Order Details #${orderData.id}`} />
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${badgeColor}`}>
                        {statusLabel}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {availableStatuses.length > 0 && (
                        <button
                            className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            onClick={() => setIsStatusModalOpen(true)}
                        >
                            Order Actions
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

                {/* 1. Customer & Address */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Customer & Address</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Customer info</p>
                            <p className="text-gray-900 font-semibold">{orderData.user_name || "N/A"}</p>
                            <p className="text-sm text-gray-500">{orderData.user_email}</p>
                            <p className="text-sm text-gray-500">{orderData.user_phone}</p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Pickup Address</p>
                            <div className="flex gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-sm text-gray-700 leading-relaxed">{orderData.pickup_address}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Delivery Address</p>
                            <div className="flex gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-sm text-gray-700 leading-relaxed">{orderData.delivery_address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Schedule & Driver */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Schedule & Driver</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Pickup Date</p>
                                <p className="font-semibold text-gray-800">{orderData.pickup_date}</p>
                                <p className="text-xs text-blue-600 font-medium mt-1">{orderData.pickup_time}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Delivery Date</p>
                                <p className="font-semibold text-gray-800">{orderData.delivery_date}</p>
                                <p className="text-xs text-green-600 font-medium mt-1">{orderData.delivery_time}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Assigned Driver</p>
                            {orderData.driver_id ? (
                                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500 font-bold">
                                        {orderData.driver_name ? orderData.driver_name.charAt(0).toUpperCase() : 'D'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{orderData.driver_name || "Unknown Driver"}</p>
                                        <p className="text-xs text-gray-500">ID: #{orderData.driver_id}</p>
                                    </div>
                                    <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Assigned</span>
                                </div>
                            ) : (
                                <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.56-4m4.123 11.328l-4.123-2.924" />
                                    </svg>
                                    <span className="text-sm">No Driver Assigned</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Payment & Summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Payment Summary</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="text-sm text-gray-600">Payment Status</span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${orderData.payment_status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {orderData.payment_status || "Pending"}
                            </span>
                        </div>

                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{orderData.base_amount || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax</span>
                                <span>₹{orderData.tax_amount || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm text-red-500">
                                <span>Discount</span>
                                <span>- ₹{orderData.discount_amount || 0}</span>
                            </div>
                            <div className="h-px bg-dashed bg-gray-300 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800 text-lg">Total Amount</span>
                                <span className="font-bold text-blue-600 text-xl">₹{orderData.final_amount}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Order Items Section - Full Width */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Order Items</h3>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        Toal Items: {orderData.order_details ? orderData.order_details.length : 0}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wide">Product</th>
                                <th className="px-6 py-4 font-semibold tracking-wide">Details</th>
                                <th className="px-6 py-4 font-semibold tracking-wide">Type</th>
                                <th className="px-6 py-4 font-semibold tracking-wide text-center">Qty</th>
                                <th className="px-6 py-4 font-semibold tracking-wide text-right">Price</th>
                                <th className="px-6 py-4 font-semibold tracking-wide text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orderData.order_details && orderData.order_details.length > 0 ? (
                                orderData.order_details.map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-800 text-base">{item.product_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-500 flex flex-col">
                                                <span className="text-xs font-medium bg-gray-100 w-fit px-2 py-0.5 rounded text-gray-600 mb-1">{item.category_name}</span>
                                                <span className="text-xs text-gray-400">{item.subcategory_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded border border-gray-200 text-xs text-gray-600 bg-white">
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-gray-700">{item.quantity}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">₹{item.price}</td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">₹{item.price * item.quantity}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No items available in this order.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Status Change Modal */}
            {/* Status Change Modal */}
            {isStatusModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all scale-100 border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Change Order Status</h2>
                            <button onClick={() => {
                                setIsStatusModalOpen(false);
                                setSelectedStatus("");
                                setDriverId("");
                                setDriverSearch("");
                            }} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1 rounded-full hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <p className="text-sm text-blue-800 flex items-center gap-2">
                                    <span className="font-semibold">Current Status:</span>
                                    <span className="px-3 py-1 bg-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm text-blue-600">
                                        {statusLabel}
                                    </span>
                                </p>
                            </div>

                            <p className="text-sm font-semibold text-gray-700 mb-3">Select New Status</p>
                            <div className="space-y-2.5">
                                {availableStatuses.map(status => {
                                    const isPickup = status.value === 2;
                                    const isCancel = status.value === 7;
                                    const isSelected = selectedStatus == status.value;

                                    let activeClass = "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                                    if (isSelected) {
                                        if (isPickup) activeClass = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
                                        else if (isCancel) activeClass = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
                                        else activeClass = "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500";
                                    }

                                    return (
                                        <button
                                            key={status.value}
                                            className={`w-full py-3 px-4 rounded-xl border text-left cursor-pointer flex justify-between items-center transition-all shadow-sm ${activeClass}`}
                                            onClick={() => {
                                                setSelectedStatus(status.value);
                                                if (status.value === 2 && orderData?.order_status === 1) {
                                                    fetchDrivers();
                                                }
                                            }}
                                        >
                                            <span className="font-semibold">{status.label}</span>
                                            {isSelected && (
                                                <div className={`w-3 h-3 rounded-full ${isPickup ? 'bg-green-500' : isCancel ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Driver Selection Logic */}
                            {selectedStatus == 2 && orderData?.order_status === 1 && (
                                <div className="mt-6 pt-6 border-t border-gray-100 animate-fadeIn">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Assign Driver <span className="text-xs font-normal text-gray-500">(Optional)</span></label>

                                    <div className="relative">
                                        {/* Search Input */}
                                        <div className="relative mb-2">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                                placeholder="Search driver by name..."
                                                value={driverSearch}
                                                onChange={(e) => setDriverSearch(e.target.value)}
                                            />
                                        </div>

                                        {/* Driver List */}
                                        <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto custom-scrollbar bg-gray-50">
                                            {drivers.filter(d => d.name.toLowerCase().includes(driverSearch.toLowerCase())).length > 0 ? (
                                                drivers
                                                    .filter(d => d.name.toLowerCase().includes(driverSearch.toLowerCase()))
                                                    .map(driver => (
                                                        <div
                                                            key={driver.id}
                                                            onClick={() => setDriverId(driver.id)}
                                                            className={`px-4 py-3 cursor-pointer flex justify-between items-center transition-colors border-b last:border-b-0 border-gray-100 ${driverId == driver.id ? 'bg-green-50 text-green-700 font-semibold' : 'hover:bg-white text-gray-700'
                                                                }`}
                                                        >
                                                            <div className="flex flex-col">
                                                                <span>{driver.name}</span>
                                                                <span className="text-xs text-gray-500 font-normal">{driver.email}</span>
                                                            </div>
                                                            {driverId == driver.id && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="p-4 text-center text-sm text-gray-500">No drivers found matching "{driverSearch}"</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                            <button
                                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 cursor-pointer rounded-xl hover:bg-gray-100 transition-colors font-semibold shadow-sm text-sm"
                                onClick={() => {
                                    setIsStatusModalOpen(false);
                                    setSelectedStatus("");
                                    setDriverId("");
                                    setDriverSearch("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-8 py-2.5 text-white cursor-pointer rounded-xl transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm
                                    ${selectedStatus == 2 ? 'bg-green-600 hover:bg-green-700 ring-2 ring-green-600 ring-offset-2' :
                                        selectedStatus == 7 ? 'bg-red-600 hover:bg-red-700 ring-2 ring-red-600 ring-offset-2' :
                                            'bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-600 ring-offset-2'}`}
                                onClick={async () => {
                                    await handleStatusChange();
                                    if (selectedStatus == 2 && orderData?.order_status === 1 && driverId) {
                                        try {
                                            const response = await assignDriver({
                                                order_id: orderData.id,
                                                user_id: driverId
                                            });
                                            if (response?.status === 200) {
                                                toast.success("Driver assigned successfully");
                                                setDriverId("");
                                            } else {
                                                toast.error("Failed to assign driver");
                                            }
                                        } catch (error) {
                                            console.error("Assign driver error in status modal:", error);
                                        }
                                    }
                                    fetchOrderDetails();
                                }}
                                disabled={isLoading || !selectedStatus}
                            >
                                {isLoading ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
