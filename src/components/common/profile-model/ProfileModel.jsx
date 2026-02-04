import { IoMdClose } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";

import profilePhoto from "../../../assets/images/guest.png";
import { useEffect, useState } from "react";
import { IMG_BASE_URL } from "../../../config/Config";
import { updateProfile } from "../../../apis/Auth";
import { toast } from "react-toastify";

export const ProfileModel = ({ model, setModel, profiledata }) => {
    const [formdata, setFormData] = useState({
        name: "",
        email: "",
        phone: null,
        country_code: null,
        image: null
    })
    const [preview, setPreview] = useState("")

    useEffect(() => {
        if (profiledata) {
            setFormData({
                name: profiledata?.name || "",
                email: profiledata?.email || "",
                phone: profiledata?.phone || null,
                country_code: profiledata?.country_code || null,
                image: profiledata?.image || null
            })
            if (profiledata?.image) {
                const ImageUrl = `${IMG_BASE_URL}${profiledata?.image}`;
                setPreview(ImageUrl)
            }
        }
    }, [profiledata, model])
    const handleChange = (e) =>{
        const {name, value} = e.target
        setFormData(prevProfile=>({
            ...prevProfile,
            [name]:value
        }))
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);
            setPreview(previewUrl);
            setFormData((prevProfile) => ({
                ...prevProfile,
                image: selectedFile,

            }));
        }
    };




    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = new FormData();
        data.append("name", formdata?.name)
        data.append("email", formdata?.email)
        data.append("country_code", formdata?.country_code)
        data.append("phone", formdata?.phone)
        data.append("image", formdata?.image)
        try {
            const response = await updateProfile(data)
            console.log("update profile:", response);
            if (response?.status == 200) {
                toast.success(response?.message)
                setModel(false)
               
            }

        } catch (error) {
            console.error("Error update profile:", error)

        }
    }

    if (!model) {
        return;
    }
    return (

        <div className="fixed top-0 left-0 w-screen h-screen bg-black/60 flex justify-center items-center z-[9999]">
            <div className="w-[90%] max-w-2xl bg-white rounded-lg p-6 relative">
                {/* <BreadcrumbsNav customTrail={[{ label: "Category List", path: "/category_list" }, { label: "Add Category", path: "/add_category" }]} />
                    <PageTitle title={"Create Category"} /> */}
                {/* Top KPI Cards */}
                {/* <UserTable /> */}
                <div className="absolute top-4 right-4 p-2 bg-white hover:bg-gray-50 flex items-center rounded-full border border-gray-300 shadow-xs text-gray-600 text-xl hover:text-red-500">
                    <button
                    // onClick={handleModelClose}
                    >
                        <IoMdClose className=" " onClick={() => setModel(false)} />
                    </button>
                </div>
                <div className="mt-4">
                    <h1 className="text-lg font-semibold mb-4">Update Profile</h1>
                    <form onSubmit={(e) => handleSubmit(e)} method="POST">
                        <div className="p-4 border border-gray-100 rounded shadow-md">
                            <div className="flex items-center justify-center mb-5 relative">
                                {preview ? (
                                    <div style={{ marginTop: "0.1rem" }}>
                                        <img
                                            src={preview}
                                            alt="preview"
                                            style={{
                                                width: "140px",
                                                height: "140px",
                                                objectFit: "cover",
                                                // border: "1px solid #ccc",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                ) : formdata?.image ? (
                                    <div style={{ marginTop: "0.1rem" }}>
                                        <img
                                            src={`${IMG_BASE_URL}${formdata?.image}`}
                                            alt="Profile"
                                            style={{
                                                width: "140px",
                                                height: "140px",
                                                objectFit: "cover",
                                                // border: "1px solid #ccc",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ marginTop: "0.1rem" }}>
                                        <img
                                            src={profilePhoto}
                                            alt="default"
                                            style={{
                                                width: "140px",
                                                height: "140px",
                                                objectFit: "cover",
                                                // border: "1px solid #ccc",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                )}
                                <div
                                    className="absolute bottom-[10px] flex justify-center w-full">
                                    <div className="p-image rounded-full relative flex flex-col items-center">
                                        {/* <i
                                        className="fi-rr-camera text-[#fff] text-[18px] leading-[17px]"></i> */}
                                        <IoCameraOutline className="text-white" />
                                        <input className="file-upload" type="file" name='profileImg'
                                            onChange={handleFileChange}
                                            accept="image/*" />
                                    </div>
                                </div>

                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="">Name</label>
                                    <input type="text" name="name" placeholder="enter name" value={formdata?.name} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" onChange={handleChange} />
                                    {/* {errors?.categoryname && (
                                                <p className="text-red-500 text-sm mt-1">{errors.categoryname}</p>
                                            )} */}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="">Email Address</label>
                                    <input type="email" name="email" placeholder="enter email address" value={formdata?.email} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" onChange={handleChange} />
                                    {/* {errors?.categoryname && (
                                                <p className="text-red-500 text-sm mt-1">{errors.categoryname}</p>
                                            )} */}
                                </div>

                            </div>
                            <div className="mt-3">
                                <button type="submit" className="bg-[#3d9bc7] hover:bg-[#02598e] text-white px-3 py-1 rounded " >Save</button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}