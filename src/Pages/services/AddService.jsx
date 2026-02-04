import { useEffect, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { addcategory, addservice, getServices, updateService } from "../../apis/SuperAdmin";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export const AddService = () => {
    const navigate = useNavigate();
    const { srId } = useParams()
    const [isLoading, setIsLoading] = useState(false);

    const [formdata, setFormdata] = useState({
        servicename: "",
        extracharge: "",
        description: "",
        // image: null
    })
    const [errors, setErrors] = useState(null);

    const resetErrors = () => {
        setErrors(null);
    }


    useEffect(() => {
        if (srId) {
            const fetchService = async () => {
                try {
                    setIsLoading(true);
                    const response = await getServices();
                    if (response?.status == 200) {
                        const seviceList = response?.data?.service || []
                        const matchedService = seviceList?.find((serv) => serv?.id == srId)
                        setFormdata({
                            servicename: matchedService?.name,
                            extracharge: matchedService?.extra_charge,
                            description: matchedService?.description,
                        });
                        console.log("matchedService", matchedService);

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
                    console.error("Error fetching service list:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchService();
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        resetErrors();

        setFormdata(prev => ({
            ...prev,
            [name]: value
        }));

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
            submitData.append("name", formdata?.servicename);
            submitData.append("extra_charge", formdata?.extracharge);
            submitData.append("description", formdata?.description);
            let response;
            if(srId){
            response = await updateService(submitData, srId);

            }else{
            response = await addservice(submitData);

            }
            console.log("service Api Response:", response);
            
            if (response?.status == 200) {
                toast.success(response?.message);
                // setFormdata({
                //     servicename: "",
                //     extracharge: "",
                //     description: "",
                // });
                // navigate("/services");
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
            <BreadcrumbsNav customTrail={[{ label: "Services", path: "/services" }, { label: srId ? "Update Service" : "Add New Service", path: srId ? `/update_service/${srId}` : "/add_service" }]} />
            <PageTitle title={srId ? "Update Service" : "Add New Service"} />
            {/* Top KPI Cards */}
            {/* <UserTable /> */}
            <div className="mt-4">
                <form onSubmit={(e) => handleSubmit(e)} method="POST">
                    <div className="p-8 border border-gray-200 rounded-2xl bg-white">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="">Service Name</label>
                                <input type="text" name="servicename" value={formdata?.servicename} placeholder="service name" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.servicename && (
                                    <p className="text-red-500 text-sm mt-1">{errors.servicename}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="">Extra Charge</label>
                                <input type="number" name="extracharge" value={formdata?.extracharge} placeholder="extra charge" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.extracharge && (
                                    <p className="text-red-500 text-sm mt-1">{errors.extracharge}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="">Description</label>
                                <input type="text" name="description" value={formdata?.description} placeholder="description" onChange={handleChange} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" />
                                {errors?.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>
                            {/* <div className="flex flex-col gap-2">
                                <label htmlFor="image" >Image</label>
                                <input type="file" name="image" onChange={handleChange} className="border border-gray-200 p-3 text-sm rounded" />
                                {errors?.image && (
                                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                )}

                            </div> */}
                        </div>
                        <div className="mt-3">
                            <button type="submit" className="bg-[#3d9bc7] hover:bg-[#02598e] text-white px-3 py-1 rounded ">{srId ? "Update" : "Submit"}</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
}