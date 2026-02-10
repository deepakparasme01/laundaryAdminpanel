import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { getDriverDetails } from "../../apis/SuperAdmin";
import { IMG_BASE_URL } from "../../config/Config";

export const DriverDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [driverDetails, setDriverDetails] = useState(null);

    useEffect(() => {
        const fetchDriverDetails = async () => {
            try {
                setIsLoading(true);
                const response = await getDriverDetails({ driver_id: id });
                if (response?.status === 200) {
                    setDriverDetails(response.data);
                } else {
                    toast.error(response?.message || "Failed to fetch driver details");
                }
            } catch (error) {
                console.error("Error fetching driver details:", error);
                toast.error("An error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchDriverDetails();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-10 h-10 border-4 border-[#3d9bc7] border-dashed rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!driverDetails) {
        return <div className="text-center py-10">Driver not found</div>;
    }

    return (
        <div className="p-6 main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[
                { label: "Driver List", path: "/driver_list" },
                { label: "Driver Details", path: "" }
            ]} />

            <div className="flex justify-between items-center mb-6">
                <PageTitle title={"Driver Details"} />
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Back
                </button>
            </div>

            <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start gap-8">
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md flex-shrink-0 mx-auto md:mx-0">
                        {driverDetails.driver.image ? (
                            <img src={`${IMG_BASE_URL}${driverDetails.driver.image}`} alt={driverDetails.driver.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-bold text-gray-400">{driverDetails.driver.name?.charAt(0)}</span>
                        )}
                    </div>

                    <div className="flex-1 w-full text-center md:text-left">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">{driverDetails.driver.name}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-sm text-gray-600">
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <span className="font-semibold text-gray-800 w-24">Email:</span>
                                <span>{driverDetails.driver.email}</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <span className="font-semibold text-gray-800 w-24">Phone:</span>
                                <span>{driverDetails.driver.phone || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <span className="font-semibold text-gray-800 w-24">DOB:</span>
                                <span>{driverDetails.driver.dob || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <span className="font-semibold text-gray-800 w-24">Status:</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${driverDetails.driver.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {driverDetails.driver.status === 1 ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <span className="font-semibold text-gray-800 w-24">Driver ID:</span>
                                <span>#{driverDetails.driver.id}</span>
                            </div>
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                <span className="font-semibold text-gray-800 w-24">Joined:</span>
                                <span>{driverDetails.driver.created_at ? new Date(driverDetails.driver.created_at).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Orders</h4>
                        <p className="text-2xl font-bold text-[#3d9bc7]">{driverDetails.total_order?.length || 0}</p>
                    </div>
                    {/* Placeholder for other stats, can be calculated from orders */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Delivered</h4>
                        <p className="text-2xl font-bold text-green-600">
                            {driverDetails.total_order?.filter(o => o.order_status === 6).length || 0}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Pending</h4>
                        <p className="text-2xl font-bold text-yellow-600">
                            {driverDetails.total_order?.filter(o => o.order_status !== 6 && o.order_status !== 7).length || 0}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Cancelled</h4>
                        <p className="text-2xl font-bold text-red-600">
                            {driverDetails.total_order?.filter(o => o.order_status === 7).length || 0}
                        </p>
                    </div>
                </div>

                {/* Assigned Orders Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h4 className="font-bold text-gray-800">Assigned Orders History</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Pickup Date</th>
                                    <th className="px-6 py-4">Delivery Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {driverDetails.total_order && driverDetails.total_order.length > 0 ? (
                                    driverDetails.total_order.map((order, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/order_detail/${order.id}`)}
                                            title="Click to view full order details"
                                        >
                                            <td className="px-6 py-4 font-medium text-blue-600">#{order.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-800">{order.service_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{order.pickup_date} <span className="text-xs text-gray-400">({order.pickup_time})</span></td>
                                            <td className="px-6 py-4 text-gray-600">{order.delivery_date} <span className="text-xs text-gray-400">({order.delivery_time})</span></td>
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
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500">No orders assigned to this driver yet.</td>
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
