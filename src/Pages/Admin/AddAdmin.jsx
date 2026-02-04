import { useEffect, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { addAdmin } from "../../apis/SuperAdmin";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const CreateAdmin = () => {

    const navigate = useNavigate();
    const [formdata, setFormdata] = useState({
        name: "",
        email: "",
        password: "",
        role_id: 2
    })
    const [isLoading, setIsLoading] = useState(false);
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
            setIsLoading(true);
            const submitData = new FormData();
            submitData.append("name", formdata?.name);
            submitData.append("email", formdata?.email);
            submitData.append("password", formdata?.password);
            submitData.append("role_id", formdata?.role_id);
            const response = await addAdmin(submitData);
            if (response?.status == 200) {
                toast.success(response?.message);
                setFormdata({
                    name: "",
                    email: "",
                    password: "",
                });
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

        } finally {
            setIsLoading(false);
        }
    }



    return (
        <div className="p-6  main main_page min-h-screen duration-800 ease-in-out">
            <BreadcrumbsNav customTrail={[{ label: "Admin List", path: "/admin_list" }, { label: "Add Admin", path: "/add_admin" }]} />
            <PageTitle title={"Create Admin"} />
            {/* Top KPI Cards */}
            {/* <UserTable /> */}
            <div className="mt-4">
                <form onSubmit={(e) => handleSubmit(e)} method="POST">
                    <div className="p-8 border border-gray-200 rounded-2xl bg-white">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="">Name</label>

                                <input type="text" name="name" value={formdata?.name} placeholder="name" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="">Email</label>
                                <input type="email" name="email" value={formdata?.email} placeholder="email" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="password" >Password</label>
                                <input type="password" name="password" value={formdata?.password} placeholder="enter password" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}

                            </div>
                            {/* <div className="flex flex-col gap-2">
                                <label htmlFor="role_id" >Role</label>
                                <input type="radio" name="role_id" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                <input type="radio" name="role_id" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" /> Manager
                                {errors?.role_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>
                                )}

                            </div> */}
                        </div>
                        <div className="mt-3">
                            <button type="submit" className="bg-[#3d9bc7] hover:bg-[#02598e] text-white px-3 py-1 rounded " disabled={isLoading}>{isLoading ? "Submitting" : "Submit"}</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
}