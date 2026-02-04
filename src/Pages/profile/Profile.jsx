import { useEffect, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { fetchUserProfile } from "../../apis/Auth";
import profilePhoto from "../../assets/images/guest.png";
import { CiEdit } from "react-icons/ci";
import { IMG_BASE_URL } from "../../config/Config";
import { ProfileModel } from "../../components/common/profile-model/ProfileModel";
export const Profile = () => {
    const [profile, setProfile] = useState({})
    const [model, setModel] = useState(false)

    console.log("check_performance:");

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const response = await fetchUserProfile();
                if (response?.status == 200) {
                    // Handle the profile data
                    console.log("Profile Data:", response.data);
                    setProfile(response.data)
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
            // Fetch profile data logic here
        };
        getProfileData();
    }, [model]);
    return (
        <>
            <div className="p-6  main main_page min-h-screen duration-800 ease-in-out">
                <BreadcrumbsNav customTrail={[{ label: "Profile", path: "/profile" }]} />
                <PageTitle title={"Profile"} />
                {/* Top KPI Cards */}
                {/* <UserTable /> */}
                <div className="mt-4">
                    <div className="p-8 border border-gray-200 rounded-2xl bg-white">
                        <h3 className="text-[#202224] text-xl font-bold mb-3">Profile</h3>
                        <div className="p-6 border border-gray-200 rounded-2xl">
                            <div id="profile" className="flex justify-between items-center">
                                <div className="flex gap-6">
                                    <img src={profile?.image ? (`${IMG_BASE_URL}${profile?.image}`) : (`${profilePhoto}`)} alt="" className="w-30 h-30" />
                                    <div className="flex flex-col justify-center gap-4">
                                        <h2 className=" text-[#202224] text-lg font-bold">{profile?.name}</h2>
                                        <p className="text-gray-500 text-md">{profile?.role_id == 1 ? ("Super Admin") : "Admin"}</p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 text-[#202224] font-normal text-sm px-4 py-3 border border-gray-300 shadow-xs rounded-full hover:bg-gray-50 " onClick={() => setModel(true)}><CiEdit className="text-[#202224] text-lg" /> Edit</button>
                            </div>

                        </div>
                        <div id="information" className="p-6 border border-gray-200 rounded-2xl mt-6">
                            <div className="flex flex-row items-start justify-between gap-6">
                                <div>
                                    <h4 className="text-[#202224] text-xl font-bold mb-6">Personal Information</h4>
                                    <div className="grid grid-cols-2 gap-7">
                                        <div>
                                            <p className="mb-2 text-md leading-normal text-gray-500">Name</p>
                                            <p className="text-lg font-semibold text-[#202224]">{profile?.name}</p>
                                        </div>
                                        <div>
                                            <p className="mb-2 text-md leading-normal text-gray-500">Email Address</p>
                                            <p className="text-lg font-semibold text-[#202224]">{profile?.email}</p>
                                        </div>
                                        {profile?.phone && profile?.country_code && (
                                            <div>
                                                <p className="mb-2 text-md leading-normal text-gray-500">Phone</p>
                                                <p className="text-lg font-semibold text-[#202224]">{`${profile?.country_code}${profile?.phone}`}</p>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <ProfileModel model={model} setModel={setModel} profiledata={profile} />
        </>
    );
}