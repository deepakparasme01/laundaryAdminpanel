import { IoMdClose } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";

import profilePhoto from "../../../assets/images/guest.png";
import { useEffect, useState } from "react";
import { IMG_BASE_URL } from "../../../config/Config";
import { updateProfile } from "../../../apis/Auth";
import { toast } from "react-toastify";

export const PickupSchedule_Model = ({ model, onClose, schedule_data, onSubmit }) => {
    const [formdata, setFormData] = useState({
        start_time: "",
        end_time: "",
        per_hour: null,
    })

    function to24Hour(time) {
        const [t, modifier] = time.split(' ');
        let [hours, minutes] = t.split(':');
        hours = Number(hours);
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}`;
    }
    useEffect(() => {
        if (schedule_data) {
            setFormData({
                start_time: to24Hour(schedule_data?.start_time) || "",
                end_time: to24Hour(schedule_data?.end_time) || "",
                per_hour: schedule_data?.per_hour || null,
            })

        }
    }, [schedule_data])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevProfile => ({
            ...prevProfile,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        onSubmit(formdata)
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
                <div className="absolute top-4 right-4 p-2 bg-white hover:bg-gray-50 flex items-center rounded-full border border-gray-300 shadow-xs text-gray-600 text-xl hover:text-red-500" onClick={onClose}>
                    <button

                    >
                        <IoMdClose className=" " />
                    </button>
                </div>
                <div className="mt-4">
                    <h1 className="text-lg font-semibold mb-4">Update Shedule</h1>
                    <form onSubmit={(e) => handleSubmit(e)} method="POST">
                        <div className="p-4 border border-gray-100 rounded shadow-md">


                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="">Start Time</label>
                                    <input type="time" name="start_time" value={formdata?.start_time} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" onChange={handleChange} />
                                    {/* {errors?.categoryname && (
                                                <p className="text-red-500 text-sm mt-1">{errors.categoryname}</p>
                                            )} */}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="">End Time</label>
                                    <input type="time" name="end_time" value={formdata?.end_time} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" onChange={handleChange} />
                                    {/* {errors?.categoryname && (
                                                <p className="text-red-500 text-sm mt-1">{errors.categoryname}</p>
                                            )} */}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="">Hours</label>
                                    <input type="number" name="per_hour" value={formdata?.per_hour} className="border border-gray-200 p-3 text-sm focus:outline-none rounded" onChange={handleChange} />
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