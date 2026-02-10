import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { ProductTable } from "../../components/common/Table/ProductTable";
import { getCustomerList, updateUserStatus } from "../../apis/SuperAdmin";
import { IMG_BASE_URL } from "../../config/Config";

export const CustomerList = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [customerList, setCustomerList] = useState([]);

    const columns = useMemo(
        () => [
            {
                header: "S.N",
                cell: (info) => <span>{info.row.index + 1}</span>,
                size: 50,
            },
            {
                header: "Customer Info",
                accessorKey: "name",
                cell: ({ row }) => {
                    const user = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            {user.image ? (
                                <img src={`${IMG_BASE_URL}${user.image}`} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800">{user.name || "N/A"}</span>
                                <span className="text-xs text-gray-500">ID: #{user.id}</span>
                            </div>
                        </div>
                    );
                }
            },
            { header: "Email", accessorKey: "email" },
            {
                header: "Phone",
                accessorKey: "phone",
                cell: ({ row }) => <span>{row.original.phone || 'N/A'}</span>
            },
            {
                header: "Status",
                accessorKey: "status",
                size: 100,
                cell: ({ row }) => {
                    const isActive = row.original.status === 1;
                    return (
                        <div className="flex justify-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isActive}
                                    onChange={() => handleStatusToggle(row.original.id, isActive ? 0 : 1)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                            </label>
                        </div>
                    );
                },
            },
            {
                header: "Created At",
                accessorKey: "created_at",
                cell: ({ row }) => <span>{new Date(row.original.created_at).toLocaleDateString()}</span>
            },
            {
                header: "Action",
                accessorKey: "action",
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate(`/customer_detail/${row.original.id}`)}
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded text-sm transition-colors duration-200"
                        >
                            View
                        </button>
                    </div>
                )
            }
        ],
        [navigate]
    );

    const fetchCustomers = async () => {
        try {
            setIsLoading(true);
            const response = await getCustomerList();
            if (response?.status === 200) {
                setCustomerList(response?.data?.user || []);
            } else if (response?.response?.data?.status === 401) {
                toast.error(response?.response?.data?.message);
                localStorage.removeItem("user_role");
                localStorage.removeItem("laundary-token");
                navigate("/");
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusToggle = async (userId, newStatus) => {
        try {
            const response = await updateUserStatus({
                user_id: userId,
                status: newStatus
            });
            if (response?.status === 200) {
                toast.success(response.message || "Status updated successfully");
                // Optimistic update
                setCustomerList(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
            } else {
                toast.error(response?.response?.data?.message || "Failed to update status");
                fetchCustomers(); // Revert
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error("An error occurred");
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <div className="p-6 main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[{ label: "Customer List", path: "/customer_list" }]} />
            <div className="flex justify-between items-center">
                <PageTitle title={"Customer List"} />
            </div>
            <div className="mt-4">
                <ProductTable columns={columns} productList={customerList} isLoading={isLoading} />
            </div>
        </div>
    );
};
