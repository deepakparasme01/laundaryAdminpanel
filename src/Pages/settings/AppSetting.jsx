import { useEffect, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { toast } from "react-toastify";
import { getSettingData, updateSettings } from "../../apis/SuperAdmin";
import { fetchUserProfile, updateProfile } from "../../apis/Auth";
import { IMG_BASE_URL } from "../../config/Config";
import { Printer, Receipt } from "lucide-react";

export const AppSetting = () => {
    const [formData, setFormData] = useState({
        sitename: "",
        email: "",
        phone: "",
        header_logo: null,
        footer_logo: null,
        fav_icon: null,
        short_description: "",
        address: "",
    });
    const [errors, setErrors] = useState({});
    const [previewHeaderLogo, setPreviewHeaderLogo] = useState(null);
    const [previewFooterLogo, setPreviewFooterLogo] = useState(null);
    const [previewFavIcon, setPreviewFavIcon] = useState(null);
    const [printerType, setPrinterType] = useState('0');

    const fetchProfileData = async () => {
        try {
            const response = await fetchUserProfile();
            if (response?.status == 200) {
                const userData = response?.data;
                if (userData?.printer_type !== undefined && userData?.printer_type !== null) {
                    setPrinterType(String(userData.printer_type));
                }
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    const fetchSettingData = async () => {
        try {
            const response = await getSettingData();
            console.log("settings-data", response);

            if (response?.status == 200) {
                const data = response?.data?.settings;
                setFormData({
                    sitename: data?.sitename || "",
                    email: data?.email || "",
                    phone: data?.phone || "",
                    header_logo: data?.header_logo || null,
                    footer_logo: data?.footer_logo || null,
                    fav_icon: data?.fav_icon || null,
                    short_description: data?.short_description || "",
                    address: data?.address || "",
                });
                // setPreviewHeaderLogo(data?.header_logo || null);
                // setPreviewFooterLogo(data?.footer_logo || null);
                // setPreviewFavIcon(data?.fav_icon || null);
            }
            // const data = response?.data;

        } catch (error) {
            console.error("Error fetching setting data:", error);
        }
    };

    useEffect(() => {
        fetchSettingData();
        fetchProfileData();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setErrors({});
        if (files) {
            const preview = URL.createObjectURL(files[0]);
            if (name === "header_logo") {
                setPreviewHeaderLogo(preview);
            } else if (name === "footer_logo") {
                setPreviewFooterLogo(preview);
            } else if (name === "fav_icon") {
                setPreviewFavIcon(preview);
            }

            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    console.log("setting-form:", formData);
    let newErrors = {};



    const handlePrinterUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('printer_type', printerType);
            const response = await updateProfile(formData);
            if (response?.status == 200) {
                toast.success(response?.message || "Printer settings updated successfully");
            } else {
                toast.error(response?.message || "Failed to update printer settings");
            }
        } catch (error) {
            console.error("Error updating printer settings:", error);
            toast.error("An error occurred");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.sitename) {
            newErrors.sitename = "Site name is required";
        }
        if (!formData.email) {
            newErrors.email = "Email is required";
        }
        if (Object.keys(newErrors).length > 0) {
            const firstKey = Object.keys(newErrors)[0];
            const firstValue = Object.values(newErrors)[0];
            setErrors({ [firstKey]: firstValue });
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append("sitename", formData.sitename);
            submitData.append("email", formData.email);
            submitData.append("phone", formData.phone);
            if (formData.header_logo) {
                submitData.append("header_logo", formData.header_logo);
            }
            if (formData.footer_logo) {
                submitData.append("footer_logo", formData.footer_logo);
            }
            if (formData.fav_icon) {
                submitData.append("fav_icon", formData.fav_icon);
            }
            submitData.append("short_description", formData.short_description);
            submitData.append("address", formData.address);

            const response = await updateSettings(submitData);
            console.log("setting-response", response);
            if (response?.status == 200) {
                toast.success(response?.message);
                fetchSettingData()
            }
            else if (response?.response?.data?.status == 401) {
                toast.error(response?.response?.data?.message);
            }

        } catch (error) {
            console.error("Error updating settings:", error);
        }


        // Handle form submission logic here
    };


    return (
        <div className="p-6  main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav
                customTrail={[{ label: "App Settings", path: "/app_setting" }]} />
            <PageTitle title={"App Settings"} />
            {/* Top KPI Cards */}
            {/* <UserTable /> */}
            <div className="mt-4">
                <form onSubmit={handleSubmit} method="POST">
                    <div className="p-8 border border-gray-200 rounded-2xl bg-white">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="">Site Name <span className="text-red-500">*</span></label>
                                <input type="text" name="sitename" value={formData?.sitename} placeholder="enter sitename" className="border border-gray-200 focus:outline-none p-3 text-sm  rounded" onChange={handleChange} />
                                {errors?.sitename && (
                                    <p className="text-red-500 text-sm mt-1">{errors.sitename}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="">Email  <span className="text-red-500">*</span></label>
                                <input type="email" name="email" value={formData?.email} placeholder="enter email" className="border border-gray-200 p-3 text-sm focus:outline-none rounded" onChange={handleChange} />
                                {errors?.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="">Mobile Number</label>
                                <input type="number" name="phone" value={formData?.phone} placeholder="Mobile Number" className="border border-gray-200 p-3 text-sm focus:outline-none rounded" onChange={handleChange} />
                                {/* {errors?.categoryname && (
                                    <p className="text-red-500 text-sm mt-1">{errors.categoryname}</p>
                                )} */}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label >Favicon</label>
                                <input type="file" name="fav_icon" className="border border-gray-200 p-3 text-sm rounded" onChange={handleChange} />
                                {/* {errors?.image && (
                                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                )} */}
                                {previewFavIcon ? (
                                    <div style={{ marginTop: "0.1rem" }}>
                                        <img
                                            src={previewFavIcon}
                                            alt="Preview favicon"
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                objectFit: "cover",
                                                border: "1px solid #ccc",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                ) : formData?.fav_icon ? (
                                    <div style={{ marginTop: "0.1rem" }}>
                                        <img
                                            src={`${IMG_BASE_URL}${formData?.fav_icon}`}
                                            alt="View favicon"
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                objectFit: "cover",
                                                border: "1px solid #ccc",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                ) : null}


                            </div>
                            <div className="flex flex-col gap-2">
                                <label >Header Logo</label>
                                <input type="file" name="header_logo" className="border border-gray-200 p-3 text-sm rounded" onChange={handleChange} />
                                {/* {errors?.image && (
                                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                )} */}
                                {previewHeaderLogo ? (
                                    <div style={{ marginTop: "0.1rem" }}>
                                        <img
                                            src={previewHeaderLogo}
                                            alt="Preview header logo"
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                                border: "1px solid #ccc",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                ) : formData?.header_logo ? (
                                    <div style={{ marginTop: "0.1rem" }}>
                                        <img
                                            src={`${IMG_BASE_URL}${formData?.header_logo}`}
                                            alt="View header logo"
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                                border: "1px solid #ccc",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                ) : null}

                            </div>
                            <div className="flex flex-col gap-2">
                                <label >Footer Logo</label>
                                <input type="file" name="footer_logo" className="border border-gray-200 p-3 text-sm rounded" onChange={handleChange} />
                                {/* {errors?.image && (
                                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                )} */}
                                {previewFooterLogo ? (
                                    <div style={{ marginTop: "0.1rem" }}>
                                        <img
                                            src={previewFooterLogo}
                                            alt="Preview footer logo"
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                                border: "1px solid #ccc",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                ) : formData?.footer_logo ? (
                                    <div style={{ marginTop: "0.1rem" }}>
                                        <img
                                            src={`${IMG_BASE_URL}${formData?.footer_logo}`}
                                            alt="View footer logo"
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                                border: "1px solid #ccc",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                ) : null}

                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="">Short Description</label>
                                <input type="text" name="short_description" value={formData?.short_description} placeholder="Mobile Number" className="border border-gray-200 p-3 text-sm focus:outline-none rounded" onChange={handleChange} />
                                {/* {errors?.categoryname && (
                                    <p className="text-red-500 text-sm mt-1">{errors.categoryname}</p>
                                )} */}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="">Address</label>
                                <textarea name="address" placeholder="Address" value={formData?.address} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" onChange={handleChange} />
                                {/* {errors?.categoryname && (
                                    <p className="text-red-500 text-sm mt-1">{errors.categoryname}</p>
                                )} */}
                            </div>
                        </div>
                        <div className="mt-3">
                            <button type="submit" className="bg-[#3d9bc7] hover:bg-[#02598e] text-white px-3 py-1 rounded ">Submit</button>
                        </div>
                    </div>
                </form>

            </div>

            {/* Printer Selection Section */}
            <div className="mt-6 p-6 border border-gray-200 rounded-2xl bg-white">
                <div className="bg-[#3d9bc7] p-3 rounded-t-lg mb-6">
                    <h2 className="text-lg font-semibold text-white">Select Printer Type</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 p-4">
                    {/* Regular Printer Option */}
                    <div
                        onClick={() => setPrinterType('0')}
                        className={`cursor-pointer relative p-8 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-4 group ${printerType === '0'
                            ? 'border-[#3d9bc7] bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                        style={{ minHeight: "200px" }}
                    >
                        {/* Radial Selection Indicator */}
                        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${printerType === '0' ? 'border-[#3d9bc7]' : 'border-gray-300'
                            }`}>
                            {printerType === '0' && (
                                <div className="w-3 h-3 rounded-full bg-[#3d9bc7]" />
                            )}
                        </div>

                        <Printer className={`w-16 h-16 ${printerType === '0' ? 'text-[#3d9bc7]' : 'text-gray-400 group-hover:text-[#3d9bc7]'}`} />
                        <span className={`text-lg font-semibold ${printerType === '0' ? 'text-[#3d9bc7]' : 'text-gray-600'}`}>
                            Regular Printer
                        </span>
                    </div>

                    {/* POS Printer Option */}
                    <div
                        onClick={() => setPrinterType('1')}
                        className={`cursor-pointer relative p-8 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-4 group ${printerType === '1'
                            ? 'border-[#3d9bc7] bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                        style={{ minHeight: "200px" }}
                    >
                        {/* Radial Selection Indicator */}
                        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${printerType === '1' ? 'border-[#3d9bc7]' : 'border-gray-300'
                            }`}>
                            {printerType === '1' && (
                                <div className="w-3 h-3 rounded-full bg-[#3d9bc7]" />
                            )}
                        </div>

                        <Receipt className={`w-16 h-16 ${printerType === '1' ? 'text-[#3d9bc7]' : 'text-gray-400 group-hover:text-[#3d9bc7]'}`} />
                        <span className={`text-lg font-semibold ${printerType === '1' ? 'text-[#3d9bc7]' : 'text-gray-600'}`}>
                            Pos Printer
                        </span>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handlePrinterUpdate}
                        className="bg-[#3d9bc7] hover:bg-[#02598e] text-white px-6 py-2 rounded font-medium transition-colors shadow-sm"
                    >
                        Save And Update
                    </button>
                </div>
            </div>

        </div>
    );
}