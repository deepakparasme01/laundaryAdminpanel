import { useEffect, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { addCoupon, getCoupons, updateCoupon, } from "../../apis/SuperAdmin";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export const AddCoupon = () => {
    const navigate = useNavigate();
    const { srId } = useParams()
    const [isLoading, setIsLoading] = useState(false);

    const currentDate = new Date()
    const formatted = currentDate.toISOString().split('T')[0];

    const [formdata, setFormdata] = useState({
        couponCode: "",
        discountType: "",
        discount: "",
        started_date: formatted,
        expiry_date: ""
        // image: null
    })
    const [errors, setErrors] = useState(null);

    const resetErrors = () => {
        setErrors(null);
    }


    useEffect(() => {
        if (srId) {
            const fetchCoupons = async () => {
                try {
                    setIsLoading(true);
                    const response = await getCoupons();
                    if (response?.status == 200) {
                        const couponList = response?.data?.coupons || []
                        const matchedCoupon = couponList?.find((serv) => serv?.id == srId)
                        setFormdata({
                            couponCode: matchedCoupon?.code,
                            discountType: matchedCoupon?.discount_type,
                            discount: matchedCoupon?.discount_value,
                            started_date: matchedCoupon?.started_at || new Date(),
                            expiry_date: matchedCoupon?.expired_at,
                        });

                        setIsLoading(false);
                    }
                    else if (response?.response?.data?.status == 401) {
                        toast.error(response?.response?.data?.message);
                        localStorage.removeItem("user_role");
                        localStorage.removeItem("laundary-token");
                        navigate("/");
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.error("Error fetching coupon list:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchCoupons();
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        resetErrors();

        setFormdata(prev => ({
            ...prev,
            [name]: value
        }));

    }

    const newErrors = {};

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetErrors();
        for (const [field, value] of Object.entries(formdata)) {
            if (!formdata[field] && field !== "started_date") {
                newErrors[field] = `${field} is required`;
            }
        }

        if (Object.keys(newErrors).length > 0) {
            const firstKey = Object.keys(newErrors)[0]
            const firstValue = Object.values(newErrors)[0]

            setErrors({ [firstKey]: firstValue }); // store in state for inline display
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append("code", formdata?.couponCode);
            submitData.append("discount_type", formdata?.discountType);
            submitData.append("discount_value", formdata?.discount);
            submitData.append("started_at", formdata?.started_date);
            submitData.append("expired_at", formdata?.expiry_date);
            let response;
            if (srId) {
                response = await updateCoupon(submitData, srId);

            } else {
                response = await addCoupon(submitData);

            }
            console.log("service Api Response:", response);

            if (response?.status == 200) {
                toast.success(response?.message);
                // setFormdata({
                //     servicename: "",
                //     extracharge: "",
                //     description: "",
                // });
                // navigate("/services");
            }
            else if (response?.response?.data?.status == 401) {
                toast.error(response?.response?.data?.message);
                localStorage.removeItem("user_role");
                localStorage.removeItem("laundary-token");
                navigate("/");
            }

        } catch (error) {

        }
    }
    return (
        <div className="p-6  main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[{ label: "Coupons", path: "/coupons" }, { label: srId ? "Update Coupon" : "Add New Coupon", path: srId ? `/update_coupon/${srId}` : "/add_coupon" }]} />
            <PageTitle title={srId ? "Update Coupon" : "Add New Coupon"} />
            {/* Top KPI Cards */}
            {/* <UserTable /> */}
            <div className="mt-4">
                <form onSubmit={(e) => handleSubmit(e)} method="POST">
                    <div className="p-8 border border-gray-200 rounded-2xl bg-white">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="">Coupon Code</label>
                                <input type="text" name="couponCode" value={formdata?.couponCode} placeholder="enter code" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.couponCode && (
                                    <p className="text-red-500 text-sm mt-1">{errors.couponCode}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="">Discount Type</label>
                                <select name="discountType" value={formdata?.discountType} onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded">
                                    <option value="">Select Type</option>
                                    <option value="rs">Rs</option>
                                    <option value="%">%</option>
                                </select>
                                {errors?.discountType && (
                                    <p className="text-red-500 text-sm mt-1">{errors.discountType}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="">Discount</label>
                                <input type="number" name="discount" value={formdata?.discount} placeholder="discount" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.discount && (
                                    <p className="text-red-500 text-sm mt-1">{errors.discount}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="">Expiry Date</label>
                                <input type="date" name="expiry_date" value={formdata?.expiry_date} onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.expiry_date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.expiry_date}</p>
                                )}
                            </div>
                            {/* <div className="flex flex-col gap-2">
                                <label htmlFor="image" >Image</label>
                                <input type="file" name="image" onChange={handleChange} className="border border-gray-200 p-3 text-sm rounded" />
                                {errors?.image && (
                                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                )}

                            </div> */}
                        </div>
                        <div className="mt-3">
                            <button type="submit" className="bg-[#3d9bc7] hover:bg-[#02598e] text-white px-3 py-1 rounded ">{srId ? "Update" : "Submit"}</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
}