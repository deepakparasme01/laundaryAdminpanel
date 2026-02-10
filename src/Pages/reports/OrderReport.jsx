import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { getOrderReport } from "../../apis/SuperAdmin";

export const OrderReport = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState([]);

    // Default dates can be empty or set to current month/week
    const [filterDates, setFilterDates] = useState({
        pickup_date: "",
        delivery_date: ""
    });

    const fetchReport = async () => {
        // Validation: Ensure at least one date is selected
        if (!filterDates.pickup_date || !filterDates.delivery_date) {
            toast.info("Please select both Pickup and Delivery dates.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await getOrderReport(filterDates);

            if (response?.status === 200) {
                setReportData(response.data?.orders || []);
                if ((response.data?.orders || []).length === 0) {
                    toast.info("No orders found for the selected date range.");
                }
            } else {
                toast.error(response?.message || "Failed to fetch report");
            }
        } catch (error) {
            console.error("Error fetching order report:", error);
            toast.error("An error occurred while fetching the report");
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchReport();
    // }, []);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFilterDates(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleApplyFilter = () => {
        fetchReport();
    };

    const handleResetFilter = () => {
        setFilterDates({
            pickup_date: "",
            delivery_date: ""
        });
        setReportData([]);
    };

    return (
        <div className="p-6 main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[{ label: "Reports", path: "#" }, { label: "Order Report", path: "/order_report" }]} />

            <PageTitle title={"Order Report"} />

            <div className="mt-6">
                {/* Filters Section */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-1/3">
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Pickup Date</label>
                            <input
                                type="date"
                                name="pickup_date"
                                value={filterDates.pickup_date}
                                onChange={handleDateChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Delivery Date</label>
                            <input
                                type="date"
                                name="delivery_date"
                                value={filterDates.delivery_date}
                                onChange={handleDateChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                            />
                        </div>
                        <div className="w-full md:w-1/3 flex gap-2">
                            <button
                                onClick={handleApplyFilter}
                                className="flex-1 bg-[#3d9bc7] hover:bg-[#02598e] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                            >
                                Apply Filter
                            </button>
                            <button
                                onClick={handleResetFilter}
                                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Report Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h4 className="font-bold text-gray-800">Order List</h4>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                            Total: {reportData.length}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Pickup Date</th>
                                    <th className="px-6 py-4">Delivery Date</th>
                                    <th className="px-6 py-4">Driver</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-10 text-center">
                                            <div className="flex justify-center items-center">
                                                <div className="w-6 h-6 border-2 border-[#3d9bc7] border-dashed rounded-full animate-spin"></div>
                                                <span className="ml-2 text-gray-500">Loading report...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : reportData.length > 0 ? (
                                    reportData.map((order, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-blue-600">#{order.id}</td>
                                            <td className="px-6 py-4">User #{order.user_id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-800">{order.service_name}</span>
                                                    <span className="text-xs text-gray-500">Qty: {order.quantity}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {order.pickup_date} <br />
                                                <span className="text-xs text-gray-400">{order.pickup_time}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {order.delivery_date} <br />
                                                <span className="text-xs text-gray-400">{order.delivery_time}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.driver_name ? (
                                                    <span className="text-gray-800">{order.driver_name}</span>
                                                ) : (
                                                    <span className="text-gray-400 italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block
                                                    ${order.order_status === 6 ? 'bg-green-100 text-green-700' :
                                                        order.order_status === 7 ? 'bg-red-100 text-red-700' :
                                                            order.order_status === 1 ? 'bg-blue-100 text-blue-700' :
                                                                'bg-yellow-100 text-yellow-700'}`}>
                                                    {order.order_status === 1 ? "New" :
                                                        order.order_status === 2 ? "Pick up" :
                                                            order.order_status === 3 ? "In Wash" :
                                                                order.order_status === 4 ? "Drying" :
                                                                    order.order_status === 5 ? "Out for Delivery" :
                                                                        order.order_status === 6 ? "Delivered" :
                                                                            order.order_status === 7 ? "Cancelled" : "Unknown"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-800">₹{order.final_amount}</td>
                                        </tr>
                                    ))
                                ) : (!filterDates.pickup_date && !filterDates.delivery_date) ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-10 text-center text-gray-500">Please choose a date range to view the report.</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-10 text-center text-gray-500">No orders found for the selected criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
