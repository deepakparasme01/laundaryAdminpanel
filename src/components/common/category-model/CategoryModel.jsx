import { useNavigate } from "react-router-dom";
import { addcategory, updatecategory } from "../../../apis/SuperAdmin";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { IMG_BASE_URL } from "../../../config/Config";

export const CategoryModel = ({ isOpen, onClose, cat_data, mode, onSubmit, isLoading }) => {
    const navigate = useNavigate();
    const [formdata, setFormdata] = useState({
        categoryname: "",
        image: null
    })
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mode === "edit" && cat_data) {
            setFormdata({
                categoryname: cat_data?.name || "",
                image: cat_data?.image || null
            });
            if (cat_data?.image) {
                const imageUrl = `${IMG_BASE_URL}${cat_data?.image}`;
                setPreviewImage(imageUrl);
            }
        }
    }, [mode, cat_data]);

    console.log("cat_data", cat_data);



    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name == 'image') {
            const file = files[0];
            setFormdata(prev => ({
                ...prev,
                [name]: file
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
            if (mode === "edit" && field === "categoryname" && !formdata[field]) {
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
    if (!isOpen) return null;
    const handleModelClose = () => {
        setErrors({});
        setFormdata({
            categoryname: "",
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
                    <h1 className="text-lg font-semibold mb-4">{mode === "add" ? "Add" : "Update"} Category</h1>
                    <form onSubmit={(e) => handleSubmit(e)} method="POST">
                        <div className="p-4 border border-gray-100 rounded shadow-md">
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