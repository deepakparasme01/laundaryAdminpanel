import { useNavigate } from "react-router-dom";
import { addcategory, categoryList, subcategoryList, updatecategory } from "../../../apis/SuperAdmin";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { IMG_BASE_URL } from "../../../config/Config";

export const SubcategoryModel = ({ isOpen, onClose, subcat_data, mode, onSubmit, isLoading }) => {
    const navigate = useNavigate();
    const [formdata, setFormdata] = useState({
        category: "",
        subcategory: "",
        image: null,
        // subcategoryname:""

    })
    const [catList, setCatList] = useState([]);
    const [subcatList, setSubcategoryListData] = useState([]);

    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    console.log("subcat_dataformdata", formdata);


    const fetchSubcategories = async (categoryId) => {
        // if (!categoryId) return;
        try {
            //   setIsLoading(true);
            const response = await subcategoryList();
            if (response?.status == 200) {
                const subcategoryData = response?.data?.sub_category_list || []
                console.log("subcategoryData", subcategoryData);

                const filteredSubcategory = subcategoryData?.find((subcat) => { return subcat?.id == categoryId })

                // setSubcategoryListData(filteredSubcategory || []);
                // setIsLoading(false);
            }
        } catch (error) {
            console.error("Error fetching admin list:", error);
        } finally {
            //   setIsLoading(false);
        }
    };

    useEffect(() => {
        if (formdata?.category) {
            fetchSubcategories(formdata?.category);
        }
    }, [formdata?.category]);

    useEffect(() => {
        if (mode === "edit" && subcat_data) {
            setFormdata({
                category: subcat_data?.root || "",
                subcategory: subcat_data?.name || "",
                image: subcat_data?.image || null
            });
            if (subcat_data?.image) {
                const imageUrl = `${IMG_BASE_URL}${subcat_data?.image}`;
                setPreviewImage(imageUrl);
            }
            if (subcat_data?.root) {
                fetchSubcategories(subcat_data?.root)
            }
        }
    }, [mode, subcat_data]);

    // console.log("cat_data", cat_data);



    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name == 'image') {
            const file = files[0];
            setFormdata(prev => ({
                ...prev,
                [name]: file
            }));
            const preview = URL.createObjectURL(file);
            setPreviewImage(preview)

        } else {
            setFormdata(prev => ({
                ...prev,
                [name]: value
            }));
        }
        setErrors({});
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // setIsLoading(true);
                const response = await categoryList();

                if (response?.status == 200) {
                    setCatList(response?.data?.category_list || []);
                    // setIsLoading(false);

                } else if (response?.response?.data?.status == 401) {
                    toast.error(response?.response?.data?.message);
                    localStorage.removeItem("user_role");
                    localStorage.removeItem("laundary-token");
                    navigate("/");
                }

            } catch (error) {
                console.error("Error fetching category list:", error);
            } finally {
                // setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        for (const [field, value] of Object.entries(formdata)) {
            // if (mode === "add" && !formdata[field]) {
            //     newErrors[field] = `${field} is required`;
            // }
            // if (mode === "edit" && field === "categoryname" && !formdata[field]) {
            //     newErrors[field] = `${field} is required`;
            // }
            if (!formdata[field]) {
                newErrors[field] = `${field} is required`;
            }
        }

        if (Object.keys(newErrors).length > 0) {
            console.log("newerrors", newErrors);
            
            const firstKey = Object.keys(newErrors)[0]
            const firstValue = Object.values(newErrors)[0]
            setErrors({ [firstKey]: firstValue }); // store in state for inline display
            return false;
        }
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        onSubmit(mode, formdata);
    };
    if (!isOpen) return null;
    const handleModelClose = () => {
        setErrors({});
        setFormdata({
            category: "",
            subcategory:"",
            image: null
        });
        setPreviewImage(null);
        onClose();
    }
    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/60 flex justify-center items-center z-[9999]">
            <div className="w-[90%] max-w-2xl bg-white rounded-lg p-6 relative">
                {/* <BreadcrumbsNav customTrail={[{ label: "Category List", path: "/category_list" }, { label: "Add Category", path: "/add_category" }]} />
            <PageTitle title={"Create Category"} /> */}
                {/* Top KPI Cards */}
                {/* <UserTable /> */}
                <div className="absolute top-2 right-2">
                    <button onClick={handleModelClose}>
                        <IoMdClose className="text-gray-600 text-xl hover:text-red-500" />
                    </button>
                </div>
                <div className="mt-4">
                    <h1 className="text-lg font-semibold mb-4">{mode === "add" ? "Add" : "Update"} Subcategory</h1>
                    <form onSubmit={(e) => handleSubmit(e)} method="POST">
                        <div className="p-4 border border-gray-100 rounded shadow-md">
                            <div className="grid grid-cols-2 gap-6">

                                <div className="flex flex-col gap-2">
                                    <label className="">Category</label>
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
                                {/* {mode == "edit" ? (
                                     <div className="flex flex-col gap-2">
                                    <label className="">Subcategory</label>
                                    <select name="subcategory" value={formdata?.subcategory} onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded">
                                        <option value="">Select Subcategory</option>
                                        {subcatList?.map((subcat) => (
                                            <option key={subcat?.id} value={subcat?.id}>{subcat?.name}</option>
                                        ))}
                                    </select>
                                    {errors?.subcategory && (
                                        <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>
                                    )} */}
                                {/* <input type="text" name="subcategoryname" value={formdata?.subcategoryname} placeholder="category name" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.subcategoryname && (
                                    <p className="text-red-500 text-sm mt-1">{errors.subcategoryname}</p>
                                )} */}
                                {/* </div>
                                )
                            :(
                                <div className="flex flex-col gap-2">
                                    <label className="">Subcategory</label>
                                    <input type="text" name="subcategoryname" value={formdata?.subcategoryname} placeholder="subcategory name" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                    {errors?.subcategoryname && (
                                        <p className="text-red-500 text-sm mt-1">{errors.subcategoryname}</p>
                                    )}
                                </div>
                            )} */}
                                <div className="flex flex-col gap-2">
                                    <label className="">Subcategory</label>
                                    <input type="text" name="subcategory" value={formdata?.subcategory} placeholder="subcategory name" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                    {errors?.subcategory && (
                                        <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="image" >Image</label>
                                    <input type="file" name="image" onChange={handleChange} className="border border-gray-200 p-3 text-sm rounded" />
                                    {errors?.image && (
                                        <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                    )}
                                    {previewImage && (
                                        <div style={{ marginTop: "0.1rem" }}>
                                            <img
                                                src={previewImage}
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
                                <button type="submit" className="bg-[#3d9bc7] hover:bg-[#02598e] text-white px-3 py-1 rounded " disabled={isLoading}>{mode === "add" ? "Save" : "Update"}</button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
};