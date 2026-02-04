import { useEffect, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { addbanner, addcategory, addservice, getBanners, getServices, updateBanner, updateService } from "../../apis/SuperAdmin";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { IMG_BASE_URL } from "../../config/Config";

export const AddBanner = () => {
    const navigate = useNavigate();
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(false);

    const [formdata, setFormdata] = useState({
        title: "",
        image: null
    })
    const [preview, setPreview] = useState(null)
    const [errors, setErrors] = useState(null);

    const resetErrors = () => {
        setErrors(null);
    }

    console.log("add banner:", formdata);

    useEffect(() => {
        if (id) {
            const fetchBanners = async () => {
                try {
                    setIsLoading(true);
                    const response = await getBanners();
                    if (response?.status == 200) {
                        const bannerList = response?.data?.slider_list || []
                        const matchedBanner = bannerList?.find((serv) => serv?.id == id)
                        setFormdata({
                            title: matchedBanner?.title,
                            image: matchedBanner?.image,
                            // description: matchedService?.description,
                        });
                        if (matchedBanner?.image) {
                            const ImageUrl = `${IMG_BASE_URL}${matchedBanner?.image}`;
                            setPreview(ImageUrl)
                        }
                        console.log("matchedService", matchedService);

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
                    console.error("Error fetching banner list:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchBanners();
        }
    }, [])

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        resetErrors();
        if (name == 'image') {
            const file = files[0];
            if (file) {
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl)

                setFormdata({ ...formdata, [name]: file });
            }

        } else {
            setFormdata(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }

    const newErrors = {};

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetErrors();
        for (const [field, value] of Object.entries(formdata)) {
            if (!formdata[field]) {
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
            submitData.append("title", formdata?.title);
            // submitData.append("extra_charge", formdata?.extracharge);
            // submitData.append("description", formdata?.description);
            if (formdata?.image) {
                submitData.append("image", formdata?.image);

            }
            let response;
            if (id) {
                response = await updateBanner(submitData, id);

            } else {
                response = await addbanner(submitData);
            }
            console.log("service Api Response:", response);

            if (response?.status == 200) {
                toast.success(response?.message);
                // setFormdata({
                //     servicename: "",
                //     extracharge: "",
                //     description: "",
                // });
                navigate("/banners");
            }
            else if (response?.response?.data?.status == 401) {
                toast.error(response?.response?.data?.message);
                localStorage.removeItem("user_role");
                localStorage.removeItem("laundary-token");
                navigate("/");
            }

        } catch (error) {
            console.error("Error submit form:", error)
        }
    }
    return (
        <div className="p-6  main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[{ label: "Banners", path: "/banners" }, { label: id ? "Update Banner" : "Add New Banner", path: id ? `/update_service/${id}` : "/add_service" }]} />
            <PageTitle title={id ? "Update Banner" : "Add New Banner"} />
            {/* Top KPI Cards */}
            {/* <UserTable /> */}
            <div className="mt-4">
                <form onSubmit={(e) => handleSubmit(e)} method="POST">
                    <div className="p-8 border border-gray-200 rounded-2xl bg-white">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="">Title</label>
                                <input type="text" name="title" value={formdata?.title} placeholder="enter title" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                )}
                            </div>
                            {/* <div className="flex flex-col gap-2">
                                <label className="">Extra Charge</label>
                                <input type="number" name="extracharge" value={formdata?.extracharge} placeholder="extra charge" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.extracharge && (
                                    <p className="text-red-500 text-sm mt-1">{errors.extracharge}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="">Description</label>
                                <input type="text" name="description" value={formdata?.description} placeholder="description" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                )}
                            </div> */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="image" >Image</label>
                                <input type="file" name="image" onChange={handleChange} className="border border-gray-200 p-3 text-sm rounded" />
                                {errors?.image && (
                                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                )}

                                {preview && (
                                    <div style={{ marginTop: "0.1rem" }}>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                                border: "1px solid #ccc",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-3">
                            <button type="submit" className="bg-[#020202] hover:bg-[#02598e] text-white px-3 py-1 rounded ">{id ? "Update" : "Submit"}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}