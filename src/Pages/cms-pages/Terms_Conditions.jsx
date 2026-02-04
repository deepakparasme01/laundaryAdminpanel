import { useEffect, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { toast } from "react-toastify";
import { getAboutData, getTermsConditionsData, updateAboutData, updateTermsConditionsData } from "../../apis/SuperAdmin";

export const Terms_Conditions = () => {
    const [formData, setFormData] = useState({
        title: "",
        content: ""
    });
    const [errors, setErrors] = useState({});


    const fetchTermsCondition = async () => {
        try {
            const response = await getTermsConditionsData();
            console.log("settings-data", response);

            if (response?.status == 200) {
                const data = response?.data;
                setFormData({
                    title: data?.title || "",
                    content: data?.content || "",

                });

            }
        } catch (error) {
            console.error("Error fetching about_us data:", error);
        }
    };

    useEffect(() => {
        fetchTermsCondition();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors({});

        setFormData({ ...formData, [name]: value });
    };

    console.log("setting-form:", formData);
    let newErrors = {};

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const [field, value] of Object.entries(formData)) {
            if (!formData[field]) {
                newErrors[field] = `${field} is required`;
            }
        }
        if (Object.keys(newErrors).length > 0) {
            const firstKey = Object.keys(newErrors)[0];
            const firstValue = Object.values(newErrors)[0];
            setErrors({ [firstKey]: firstValue });
            return;
        }

        try {
           
            const response = await updateTermsConditionsData(formData);
            if (response?.status == 200) {
                toast.success(response?.message);
                fetchTermsCondition()
            }
            else if (response?.response?.data?.status == 401) {
                toast.error(response?.response?.data?.message);
            }

        } catch (error) {
            console.error("Error updating terms conditions:", error);
        }


        // Handle form submission logic here
    };


    return (
        <div className="p-6  main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav
                customTrail={[{ label: "Terms Conditions", path: "/terms_conditions" }]} />
            <PageTitle title={"Terms & Conditions"} />
            {/* Top KPI Cards */}
            {/* <UserTable /> */}
            <div className="mt-4">
                <form onSubmit={handleSubmit} method="POST">
                    <div className="p-8 border border-gray-200 rounded-2xl bg-white">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="">Title <span className="text-red-500">*</span></label>
                                <input type="text" name="title" value={formData?.title} placeholder="enter title" className="border border-gray-200 p-3 text-sm focus:outline-none rounded" onChange={handleChange} />
                                {errors?.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="">Content</label>
                                <input type="text" name="content" value={formData?.content} placeholder="content" className="border border-gray-200 p-3 text-sm focus:outline-none rounded" onChange={handleChange} />
                                {errors?.content && (
                                    <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                                )}
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