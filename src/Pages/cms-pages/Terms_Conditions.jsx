import { useEffect, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { toast } from "react-toastify";
import { getAboutData, getTermsConditionsData, updateAboutData, updateTermsConditionsData } from "../../apis/SuperAdmin";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

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
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Title <span className="text-red-500">*</span></label>
                                <input type="text" name="title" value={formData?.title} placeholder="Enter title" className="border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all" onChange={handleChange} />
                                {errors?.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Content</label>
                                <SunEditor
                                    setContents={formData?.content}
                                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                                    setOptions={{
                                        height: 300,
                                        buttonList: [
                                            ['undo', 'redo'],
                                            ['font', 'fontSize', 'formatBlock'],
                                            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                                            ['fontColor', 'hiliteColor', 'textStyle'],
                                            ['removeFormat'],
                                            ['outdent', 'indent'],
                                            ['align', 'horizontalRule', 'list', 'lineHeight'],
                                            ['table', 'link', 'image', 'video'],
                                            ['fullScreen', 'showBlocks', 'codeView']
                                        ]
                                    }}
                                />
                                {errors?.content && (
                                    <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button type="submit" className="bg-[#3d9bc7] hover:bg-[#02598e] text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">Submit</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
}