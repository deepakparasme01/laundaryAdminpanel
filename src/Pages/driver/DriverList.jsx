
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { ProductTable } from "../../components/common/Table/ProductTable";
import { getDrivers, addDriver, updateUserStatus } from "../../apis/SuperAdmin";
import { IMG_BASE_URL } from "../../config/Config";

export const DriverList = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [driverList, setDriverList] = useState([]);

    // Add Driver Modal State
    const [isAddDriverModalOpen, setAddDriverModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        country_code: "91",
        phone: "",
        dob: "",
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    const columns = useMemo(
        () => [
            {
                header: "S.N",
                cell: (info) => <span>{info.row.index + 1}</span>,
                size: 50,
            },
            {
                header: "Driver Info",
                accessorKey: "name",
                cell: ({ row }) => {
                    const driver = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            {driver.image ? (
                                <img src={`${IMG_BASE_URL}${driver.image}`} alt={driver.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                                    {driver.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800">{driver.name}</span>
                                <span className="text-xs text-gray-500">ID: #{driver.id}</span>
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
            }
        ],
        []
    );

    const fetchDrivers = async () => {
        try {
            setIsLoading(true);
            const response = await getDrivers();
            if (response?.status === 200) {
                setDriverList(response?.data?.driver || []);
            } else if (response?.response?.data?.status === 401) {
                toast.error(response?.response?.data?.message);
                localStorage.removeItem("user_role");
                localStorage.removeItem("laundary-token");
                navigate("/");
            }
        } catch (error) {
            console.error("Error fetching drivers:", error);
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
                // Optimistic update or refresh
                setDriverList(prev => prev.map(d => d.id === userId ? { ...d, status: newStatus } : d));
            } else {
                toast.error(response?.response?.data?.message || "Failed to update status");
                fetchDrivers(); // Revert on failure
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error("An error occurred");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmitDriver = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            setIsLoading(true);
            const response = await addDriver(data);
            if (response?.status === 200) {
                toast.success(response.message || "Driver added successfully");
                setAddDriverModalOpen(false);
                resetForm();
                fetchDrivers();
            } else {
                toast.error(response?.response?.data?.message || "Failed to add driver");
            }
        } catch (error) {
            console.error("Add driver error:", error);
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            country_code: "91",
            phone: "",
            dob: "",
            image: null
        });
        setImagePreview(null);
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    return (
        <>
            <div className="p-6 main main_page min-h-screen duration-800 ease-in-out">
                <BreadcrumbsNav customTrail={[{ label: "Driver List", path: "/driver_list" }]} />
                <div className="flex justify-between items-center">
                    <PageTitle title={"Driver List"} />
                    <button
                        className="bg-[#3d9bc7] text-white px-4 py-2 rounded-lg hover:bg-[#02598e] transition-colors shadow-md flex items-center gap-2"
                        onClick={() => setAddDriverModalOpen(true)}
                    >
                        <span>+ Add Driver</span>
                    </button>
                </div>
                <div className="mt-4">
                    <ProductTable columns={columns} productList={driverList} isLoading={isLoading} />
                </div>
            </div>

            {/* Add Driver Modal */}
            {isAddDriverModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity overflow-y-auto">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-[500px] transform transition-all scale-100 border border-gray-100 relative max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <button
                            onClick={() => {
                                setAddDriverModalOpen(false);
                                resetForm();
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Driver</h2>

                        <form onSubmit={handleSubmitDriver} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required minLength={6}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                                    <input
                                        type="text"
                                        name="country_code"
                                        value={formData.country_code}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:outline-none"
                                        readOnly
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover rounded-lg" alt="Preview" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                    <span className="text-xs text-gray-500">Click to upload image</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                    onClick={() => {
                                        setAddDriverModalOpen(false);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-[#3d9bc7] text-white rounded-lg hover:bg-[#02598e] transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Adding Driver..." : "Add Driver"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
