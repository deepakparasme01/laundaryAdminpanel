import React, { useEffect, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { toast } from "react-toastify";
import { getDeliveryCost, updateDeliveryCost } from "../../apis/SuperAdmin";
import { useNavigate } from "react-router-dom";

const DeliveryCharge = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        delivery_charge: "",
        minimum_amount: ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchDeliveryCost();
    }, []);

    const fetchDeliveryCost = async () => {
        try {
            setIsLoading(true);
            const response = await getDeliveryCost();
            if (response?.status === 200) {
                const data = response?.data?.delivery_cost_list;
                if (data) {
                    setFormData({
                        delivery_charge: data.delivery_charge || "",
                        minimum_amount: data.minimum_amount || ""
                    });
                }
            } else if (response?.response?.data?.status === 401) {
                toast.error(response?.response?.data?.message);
                localStorage.removeItem("user_role");
                localStorage.removeItem("laundary-token");
                navigate("/");
            }
        } catch (error) {
            console.error("Error fetching delivery cost:", error);
            toast.error("Failed to load delivery cost details");
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.delivery_charge) {
            newErrors.delivery_charge = "Delivery charge is required";
        } else if (isNaN(formData.delivery_charge) || Number(formData.delivery_charge) < 0) {
            newErrors.delivery_charge = "Please enter a valid amount";
        }

        if (!formData.minimum_amount) {
            newErrors.minimum_amount = "Minimum amount is required";
        } else if (isNaN(formData.minimum_amount) || Number(formData.minimum_amount) < 0) {
            newErrors.minimum_amount = "Please enter a valid amount";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setIsSaving(true);
            const response = await updateDeliveryCost({
                delivery_charge: parseFloat(formData.delivery_charge),
                minimum_amount: parseFloat(formData.minimum_amount)
            });

            if (response?.status === 200) {
                toast.success(response.message || "Delivery cost updated successfully");
                fetchDeliveryCost(); // Refresh data
            } else {
                toast.error(response?.message || "Failed to update delivery cost");
            }
        } catch (error) {
            console.error("Error updating delivery cost:", error);
            toast.error("An error occurred while updating");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Allow only numbers and decimal
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setFormData(prev => ({ ...prev, [name]: value }));
            // Clear error for this field
            if (errors[name]) {
                setErrors(prev => ({ ...prev, [name]: "" }));
            }
        }
    };

    return (
        <div className="p-6 main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[{ label: "Settings", path: "#" }, { label: "Delivery Charge", path: "/delivery_charge" }]} />

            <div className="flex justify-between items-center mb-6">
                <PageTitle title={"Delivery Charge Settings"} />
            </div>

            <div className="max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Delivery Charge Input */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="delivery_charge" className="text-sm font-semibold text-gray-700">
                                    Delivery Charge (₹)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                    </div>
                                    <input
                                        type="text"
                                        id="delivery_charge"
                                        name="delivery_charge"
                                        value={formData.delivery_charge}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className={`pl-8 block w-full rounded-lg border ${errors.delivery_charge ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} p-2.5 text-sm transition-colors`}
                                    />
                                </div>
                                {errors.delivery_charge && (
                                    <p className="text-red-500 text-xs mt-1">{errors.delivery_charge}</p>
                                )}
                                <p className="text-xs text-gray-500">Standard delivery fee applied to orders.</p>
                            </div>

                            {/* Minimum Amount Input */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="minimum_amount" className="text-sm font-semibold text-gray-700">
                                    Minimum Order Amount (₹)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                    </div>
                                    <input
                                        type="text"
                                        id="minimum_amount"
                                        name="minimum_amount"
                                        value={formData.minimum_amount}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className={`pl-8 block w-full rounded-lg border ${errors.minimum_amount ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} p-2.5 text-sm transition-colors`}
                                    />
                                </div>
                                {errors.minimum_amount && (
                                    <p className="text-red-500 text-xs mt-1">{errors.minimum_amount}</p>
                                )}
                                <p className="text-xs text-gray-500">Minimum cart subtotal required for free delivery (if applicable) or order placement.</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`px-6 py-2.5 bg-[#3d9bc7] hover:bg-[#02598e] text-white font-medium rounded-lg text-sm shadow-sm transition-all focus:ring-4 focus:ring-blue-300 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSaving ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : "Update Changes"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DeliveryCharge;
