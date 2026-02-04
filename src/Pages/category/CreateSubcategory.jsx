import { useEffect, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { addSubcategory, categoryList } from "../../apis/SuperAdmin";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const CreateSubcategory = () => {
    const navigate = useNavigate();
    const [formdata, setFormdata] = useState({
        category: "",
        subcategoryname: "",
        image: null
    })
    const [isLoading, setIsLoading] = useState(false);
    const [catList, setCatList] = useState([]);
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
        } else if (name == 'category') {
            setFormdata(prev => ({
                ...prev,
                [name]: Number(value)
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
            submitData.append("cat_id", formdata?.category);
            submitData.append("name", formdata?.subcategoryname);
            submitData.append("image", formdata?.image);
            const response = await addSubcategory(submitData);
            if (response?.status == 200) {
                toast.success(response?.message);
                setFormdata({
                    category: "",
                    subcategoryname: "",
                    image: null
                });
                navigate("/subcategory_list");
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const response = await categoryList();

                if (response?.status == 200) {
                    setCatList(response?.data?.category_list || []);
                    setIsLoading(false);

                } else if (response?.response?.data?.status == 401) {
                    toast.error(response?.response?.data?.message);
                    localStorage.removeItem("user_role");
                    localStorage.removeItem("laundary-token");
                    navigate("/");
                }

            } catch (error) {
                console.error("Error fetching admin list:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="p-6  main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[{ label: "Subcategory List", path: "/subcategory_list" }, { label: "Add Subcategory", path: "/add_subcategory" }]} />
            <PageTitle title={"Create Subcategory"} />
            {/* Top KPI Cards */}
            {/* <UserTable /> */}
            <div className="mt-4">
                <form onSubmit={(e) => handleSubmit(e)} method="POST">
                    <div className="p-8 border border-gray-200 rounded-2xl bg-white">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="category" className="">Category</label>
                                <select name="category" value={formdata?.category} onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded">
                                    <option value="">Select Category</option>
                                    {catList?.map((cat) => (
                                        <option key={cat?.id} value={cat?.id}>{cat?.name}</option>
                                    ))}
                                </select>
                                {errors?.category && (
                                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                                )}
                                {/* <input type="text" name="subcategoryname" value={formdata?.subcategoryname} placeholder="category name" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.subcategoryname && (
                                    <p className="text-red-500 text-sm mt-1">{errors.subcategoryname}</p>
                                )} */}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="subcategoryname" className="">Subcategory Name</label>
                                <input type="text" name="subcategoryname" value={formdata?.subcategoryname} placeholder="category name" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.subcategoryname && (
                                    <p className="text-red-500 text-sm mt-1">{errors.subcategoryname}</p>
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