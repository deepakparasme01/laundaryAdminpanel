import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdVisibility } from "react-icons/md";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { ProductTable } from "../../components/common/Table/ProductTable";
import { getOrderList, assignDriver, getDrivers, updateOrderStatus } from "../../apis/SuperAdmin";

export const OrderList = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [orderList, setOrderList] = useState([]);

    const [isAssignDriverModalOpen, setAssignDriverModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [driverId, setDriverId] = useState("");
    const [drivers, setDrivers] = useState([]);

    // Status Modal State
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [driverSearch, setDriverSearch] = useState("");
    const [statusOrder, setStatusOrder] = useState(null);

    const statusMapping = {
        1: { label: "New", color: "bg-blue-100 text-blue-600" },
        2: { label: "Pick up", color: "bg-yellow-100 text-yellow-600" },
        3: { label: "In Wash", color: "bg-purple-100 text-purple-600" },
        4: { label: "Drying/Folding", color: "bg-orange-100 text-orange-600" },
        5: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-600" },
        6: { label: "Delivered", color: "bg-green-100 text-green-600" },
        7: { label: "Cancelled", color: "bg-red-100 text-red-600" },
    };

    const getAvailableStatuses = (currentStatus) => {
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
            return [];
        }
    };

    const columns = useMemo(
        () => [
            {
                header: "S.N",
                cell: (info) => <span>{info.row.index + 1}</span>,
                size: 50,
            },
            { header: "Service Name", accessorKey: "service_name" },
            {
                header: "Timeline",
                cell: ({ row }) => {
                    const { pickup_date, pickup_time, delivery_date, delivery_time } = row.original;
                    // Format dates and times for better readability if needed, or display as is
                    return (
                        <div className="flex flex-col text-xs text-gray-600 gap-1">
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800 text-[10px] uppercase tracking-wider">Pickup</span>
                                <span>{pickup_date} <span className="text-gray-400">({pickup_time})</span></span>
                            </div>
                            <div className="flex flex-col border-t border-dashed border-gray-200 pt-1">
                                <span className="font-semibold text-gray-800 text-[10px] uppercase tracking-wider">Delivery</span>
                                <span>{delivery_date} <span className="text-gray-400">({delivery_time})</span></span>
                            </div>
                        </div>
                    );
                },
                size: 180,
            },
            {
                header: "Total Amount",
                accessorKey: "final_amount",
                cell: (info) => <span className="font-medium text-gray-900">₹{info.getValue()}</span>
            },
            {
                header: "Order Status",
                accessorKey: "order_status",
                size: 100,
                cell: (info) => {
                    const order_status = info.row.original.order_status;
                    const statusInfo = statusMapping[order_status] || { label: "Unknown", color: "bg-gray-100 text-gray-600" };
                    const available = getAvailableStatuses(order_status);
                    const isClickable = available.length > 0;

                    return (
                        <div
                            className={`flex justify-center items-center rounded-full px-2 py-1 font-semibold text-[12px] capitalize whitespace-nowrap ${statusInfo.color} ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}`}
                            onClick={() => {
                                if (isClickable) {
                                    setStatusOrder(info.row.original);
                                    setIsStatusModalOpen(true);
                                }
                            }}
                            title={isClickable ? "Click to change status" : ""}
                        >
                            {statusInfo.label}
                        </div>
                    );
                }
            },
            {
                header: "Driver",
                size: 160,
                cell: ({ row }) => {
                    const isDriverAssigned = row.original.driver_id !== null;
                    const isCancelled = row.original.order_status === 7;
                    const isActionDisabled = isDriverAssigned || isCancelled;

                    return (
                        <div className="flex justify-center">
                            <button
                                className={`flex items-center gap-1 justify-center px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shadow-sm
                                    ${isCancelled
                                        ? 'bg-red-50 text-red-500 ring-1 ring-red-200 cursor-not-allowed'
                                        : (isDriverAssigned
                                            ? 'bg-gray-100 text-gray-500 ring-1 ring-gray-200 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 text-white cursor-pointer hover:shadow-md')}`}
                                onClick={() => {
                                    if (!isActionDisabled) {
                                        setSelectedOrder(row.original);
                                        setAssignDriverModalOpen(true);
                                        fetchDrivers();
                                    }
                                }}
                                disabled={isActionDisabled}
                                title={
                                    isCancelled
                                        ? "Order Cancelled"
                                        : (isDriverAssigned
                                            ? `Assigned to: ${row.original.driver_name || 'Unknown Driver'}`
                                            : "Assign Driver")
                                }
                            >
                                {isCancelled ? "Cancelled" : (isDriverAssigned ? "Driver Assigned" : "Assign Driver")}
                            </button>
                        </div>
                    );
                }
            },
            {
                header: "Action",
                size: 80,
                cell: ({ row }) => {
                    return (
                        <div className="flex justify-center">
                            <button
                                className="text-gray-500 hover:text-blue-600 cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-colors"
                                onClick={() => navigate(`/order_detail/${row.original.id}`)}
                                title="View Details"
                            >
                                <MdVisibility size={20} />
                            </button>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await getOrderList();
            if (response?.status === 200) {
                setOrderList(response?.data?.orders || []);
            } else if (response?.response?.data?.status === 401) {
                toast.error(response?.response?.data?.message);
                localStorage.removeItem("user_role");
                localStorage.removeItem("laundary-token");
                navigate("/");
            }
        } catch (error) {
            console.error("Error fetching order list:", error);
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleAssignDriver = async () => {
        if (!driverId) {
            toast.error("Please select a Driver");
            return;
        }

        try {
            setIsLoading(true);
            const response = await assignDriver({
                order_id: selectedOrder.id,
                user_id: driverId
            });

            if (response?.status === 200) {
                toast.success(response.message || "Driver assigned successfully");
                setAssignDriverModalOpen(false);
                setDriverId("");
                fetchOrders(); // Refresh list to update button state
            } else {
                toast.error(response?.response?.data?.message || "Failed to assign driver");
            }
        } catch (error) {
            console.error("Assign driver error:", error);
            toast.error("An error occurred while assigning driver");
        } finally {
            setIsLoading(false);
        }
    }

    const handleStatusChange = async () => {
        if (!selectedStatus || !statusOrder) return;

        try {
            setIsLoading(true);
            const response = await updateOrderStatus({
                order_id: statusOrder.id,
                status: parseInt(selectedStatus)
            });
            if (response?.status === 200) {
                toast.success(response.message || "Order status updated successfully");
                setIsStatusModalOpen(false);
                setSelectedStatus("");
                setStatusOrder(null);
                fetchOrders();
            } else {
                toast.error(response?.response?.data?.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Update status error:", error);
            toast.error("An error occurred while updating status");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const availableStatuses = statusOrder ? getAvailableStatuses(statusOrder.order_status) : [];


    return (
        <>
            <div className="p-6 main main_page min-h-screen duration-800 ease-in-out">
                <BreadcrumbsNav customTrail={[{ label: "Order List", path: "/order_list" }]} />
                <div className="flex justify-between items-center">
                    <PageTitle title={"Order List"} />
                </div>
                <div className="mt-4">
                    <ProductTable columns={columns} productList={orderList} isLoading={isLoading} />
                </div>
            </div>

            {/* Assign Driver Modal */}
            {isAssignDriverModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all scale-100 border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Assign Driver</h2>
                            <button onClick={() => {
                                setAssignDriverModalOpen(false);
                                setDriverId("");
                                setDriverSearch("");
                            }} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1 rounded-full hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Select Driver</label>

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
                                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto custom-scrollbar bg-gray-50">
                                    {drivers.filter(d => d.name.toLowerCase().includes(driverSearch.toLowerCase())).length > 0 ? (
                                        drivers
                                            .filter(d => d.name.toLowerCase().includes(driverSearch.toLowerCase()))
                                            .map(driver => (
                                                <div
                                                    key={driver.id}
                                                    onClick={() => setDriverId(driver.id)}
                                                    className={`px-4 py-3 cursor-pointer flex justify-between items-center transition-colors border-b last:border-b-0 border-gray-100 ${driverId == driver.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-white text-gray-700'
                                                        }`}
                                                >
                                                    <div className="flex flex-col">
                                                        <span>{driver.name}</span>
                                                        <span className="text-xs text-gray-500 font-normal">{driver.email}</span>
                                                    </div>
                                                    {driverId == driver.id && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
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

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                            <button
                                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 cursor-pointer rounded-xl hover:bg-gray-100 transition-colors font-semibold shadow-sm text-sm"
                                onClick={() => {
                                    setAssignDriverModalOpen(false);
                                    setDriverId("");
                                    setDriverSearch("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-8 py-2.5 bg-blue-600 text-white cursor-pointer rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                                onClick={handleAssignDriver}
                                disabled={isLoading || !driverId}
                            >
                                {isLoading ? "Assigning..." : "Confirm Assignment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                        {statusMapping[statusOrder?.order_status]?.label}
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
                                                if (status.value === 2 && statusOrder?.order_status === 1) {
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
                            {selectedStatus == 2 && statusOrder?.order_status === 1 && (
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
                                    // If driver is selected in this modal, assign it too
                                    if (selectedStatus == 2 && statusOrder?.order_status === 1 && driverId) {
                                        // Reuse handleAssignDriver logic or call API directly
                                        // Since handleAssignDriver uses `selectedOrder` state which might not be set here (we use statusOrder), 
                                        // it's safer to reproduce the logic briefly or set selectedOrder = statusOrder before calling.
                                        // Better to just call the API here to be safe and explicit.
                                        try {
                                            const response = await assignDriver({
                                                order_id: statusOrder.id,
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
                                    fetchOrders(); // Ensure refresh happens effectively
                                }}
                                disabled={isLoading || !selectedStatus}
                            >
                                {isLoading ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
