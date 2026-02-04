import { useNavigate } from "react-router-dom";
import { addcategory, categoryList, subcategoryList, updatecategory } from "../../../apis/SuperAdmin";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { IMG_BASE_URL } from "../../../config/Config";

export const ProductModel = ({ isOpen, onClose, product_data, mode, onSubmit, isLoading }) => {
    const navigate = useNavigate();
    console.log("product_data", product_data);

    const [formdata, setFormdata] = useState({
        name: "",
        image: null,
        category: "",
        subcategory: "",
        type: "",
        price: "",
        description: ""
    })
    const [catList, setCatList] = useState([]);
    const [subcatList, setSubcategoryListData] = useState([]);

    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});

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
                console.error("Error fetching admin list:", error);
            } finally {
                // setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const fetchSubcategories = async (categoryId) => {
        if (!categoryId) return;
        try {
            //   setIsLoading(true);
            const response = await subcategoryList();
            if (response?.status == 200) {
                const subcategoryData = response?.data?.sub_category_list || []
                console.log("subcategoryData", subcategoryData);

                const filteredSubcategory = subcategoryData?.filter((subcat) => { return subcat?.root == categoryId })

                setSubcategoryListData(filteredSubcategory || []);
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
        if (mode === "edit" && product_data) {
            setFormdata({
                name: product_data?.name || "",
                image: product_data?.image || null,
                category: product_data?.cat_id || "",
                subcategory: product_data?.subcat_id || "",
                type: product_data?.type || "",
                price: product_data?.price || "",
                description: product_data?.description || "",
            });
            if (product_data?.image) {
                const imageUrl = `${IMG_BASE_URL}${product_data?.image}`;
                setPreviewImage(imageUrl);
            }
            if (product_data?.cat_id) {
                fetchSubcategories(product_data?.cat_id)
            }
        }

    }, [mode, product_data]);


    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name == 'image') {
            const file = files[0];
            if (file) {
                const preview = URL.createObjectURL(file);
                setPreviewImage(preview)

                setFormdata({ ...formdata, [name]: file });
            }


        }
        else if (name == 'category') {
            setFormdata(prev => ({
                ...prev,
                category: value,
                subcategory:""
            }));
        } else {
            setFormdata(prev => ({
                ...prev,
                [name]: value
            }));
        }
        setErrors({});
    }

    const validateForm = () => {
        const newErrors = {};
        for (const [field, value] of Object.entries(formdata)) {
            if (mode === "add" && !formdata[field]) {
                newErrors[field] = `${field} is required`;
            }
            if (mode === "edit" && field === "category" && !formdata[field]) {
                newErrors[field] = `${field} is required`;
            }
            if (mode === "edit" && field === "name" && !formdata[field]) {
                newErrors[field] = `${field} is required`;
            }
        }

        if (Object.keys(newErrors).length > 0) {
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
    const handleModelClose = () => {
        setErrors({});
        setFormdata({
        name: "",
        image: null,
        category: "",
        subcategory: "",
        type: "",
        price: "",
        description: ""
    });
        setPreviewImage(null);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/60 flex justify-center items-center z-[9999]">
            <div className="w-[90%] max-w-2xl  bg-white rounded-lg p-6 relative">
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
                    <h1 className="text-lg font-semibold mb-4">{mode === "add" ? "Add" : "Update"} Product</h1>
                    <form onSubmit={(e) => handleSubmit(e)} method="POST">
                        <div className="p-4 border border-gray-100 rounded shadow-md max-h-[80vh]  overflow-y-scroll">
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
                                    )}
                                    {/* <input type="text" name="subcategoryname" value={formdata?.subcategoryname} placeholder="category name" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.subcategoryname && (
                                    <p className="text-red-500 text-sm mt-1">{errors.subcategoryname}</p>
                                )} */}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="">Product Name</label>
                                    <input type="text" name="name" value={formdata?.name} placeholder="product name" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                    {errors?.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="">Type</label>
                                    <input type="text" name="type" value={formdata?.type} placeholder="type" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                    {errors?.type && (
                                        <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="">Price</label>
                                    <input type="number" name="price" value={formdata?.price} placeholder="product price" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                    {errors?.price && (
                                        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="">Description</label>
                                    <input type="text" name="description" value={formdata?.description} placeholder="description" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                    {errors?.description && (
                                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label >Image</label>
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