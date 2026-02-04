import { useEffect, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { toast } from "react-toastify";
import { getSettingData, updateSettings } from "../../apis/SuperAdmin";
import { IMG_BASE_URL } from "../../config/Config";

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

    const handleSubmit = async(e) => {
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
        </div>
    );
}