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
        phone: "",
        country_code: "",
        image: null
    })
    const [preview, setPreview] = useState("")
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (profiledata) {
            setFormData({
                name: profiledata.name || "",
                email: profiledata.email || "",
                phone: profiledata.phone || "",
                country_code: profiledata.country_code || "+91",
                image: profiledata.image || null
            })
            if (profiledata.image) {
                setPreview(`${IMG_BASE_URL}${profiledata.image}`)
            } else {
                setPreview("")
            }
        }
    }, [profiledata, model])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);
            setPreview(previewUrl);
            setFormData((prev) => ({
                ...prev,
                image: selectedFile,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        data.append("name", formdata.name);
        data.append("email", formdata.email);
        data.append("country_code", formdata.country_code);
        data.append("phone", formdata.phone);

        // Only append image if it's a new file (not the existing string URL)
        if (formdata.image instanceof File) {
            data.append("image", formdata.image);
        }

        try {
            const response = await updateProfile(data);
            if (response?.status === 200) {
                toast.success(response.message || "Profile updated successfully");
                setModel(false);
                // Ideally trigger a refresh of the parent profile data here
                // For now, we rely on the parent likely refetching or the user reloading
                if (window.location.pathname === '/profile') {
                    window.location.reload();
                }
            } else {
                toast.error(response?.response?.data?.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred while updating profile");
        } finally {
            setIsLoading(false);
        }
    }

    if (!model) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[9999] backdrop-blur-sm transition-opacity duration-300">
            <div className="w-[90%] max-w-2xl bg-white rounded-2xl shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={() => setModel(false)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                >
                    <IoMdClose size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Image Section */}
                    <div className="flex justify-center mb-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                                <img
                                    src={preview || profilePhoto}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = profilePhoto }}
                                />
                            </div>
                            <label className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-md transition-all hover:scale-105">
                                <IoCameraOutline size={20} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-600">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formdata.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-600">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formdata.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Enter email address"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-600">Country Code</label>
                            <input
                                type="text"
                                name="country_code"
                                value={formdata.country_code}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="+91"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formdata.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Enter phone number"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-3">
                        <button
                            type="button"
                            onClick={() => setModel(false)}
                            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}