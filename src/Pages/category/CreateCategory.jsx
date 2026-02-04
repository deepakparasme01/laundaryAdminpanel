import { useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { addcategory } from "../../apis/SuperAdmin";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const CreateCategory = () => {
    const navigate = useNavigate();
    const [formdata, setFormdata] = useState({
        categoryname: "",
        image: null
    })
    const [errors, setErrors] = useState(null);

    const resetErrors = () => {
        setErrors(null);
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        resetErrors();
        if (name == 'image') {
            setFormdata(prev => ({
                ...prev,
                [name]: files[0]
            }));
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
            submitData.append("name", formdata?.categoryname);
            submitData.append("image", formdata?.image);
            const response = await addcategory(submitData);
            if (response?.status == 200) {
                toast.success(response?.message);
                setFormdata({
                    categoryname: "",
                    image: null
                });
                navigate("/category_list");
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
            <BreadcrumbsNav customTrail={[{ label: "Category List", path: "/category_list" }, { label: "Add Category", path: "/add_category" }]} />
            <PageTitle title={"Create Category"} />
            {/* Top KPI Cards */}
            {/* <UserTable /> */}
            <div className="mt-4">
                <form onSubmit={(e) => handleSubmit(e)} method="POST">
                    <div className="p-8 border border-gray-200 rounded-2xl bg-white">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="categoryname" className="">Category Name</label>
                                <input type="text" name="categoryname" value={formdata?.categoryname} placeholder="category name" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.categoryname && (
                                    <p className="text-red-500 text-sm mt-1">{errors.categoryname}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="image" >Image</label>
                                <input type="file" name="image" onChange={handleChange} className="border border-gray-200 p-3 text-sm rounded" />
                                {errors?.image && (
                                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
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