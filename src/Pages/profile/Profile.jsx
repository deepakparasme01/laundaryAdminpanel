
import { useEffect, useState } from "react";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import PageTitle from "../../components/PageTitle/PageTitle";
import { fetchUserProfile } from "../../apis/Auth";
import profilePhoto from "../../assets/images/guest.png";
import { CiEdit } from "react-icons/ci";
import { IMG_BASE_URL } from "../../config/Config";
import { ProfileModel } from "../../components/common/profile-model/ProfileModel";

export const Profile = () => {
    const [profile, setProfile] = useState({});
    const [model, setModel] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getProfileData = async () => {
            setIsLoading(true);
            try {
                const response = await fetchUserProfile();
                if (response?.status === 200) {
                    setProfile(response.data);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Refresh data when modal closes to reflect changes
        if (!model) {
            getProfileData();
        }
    }, [model]);

    if (isLoading && !profile.name) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <>
            <div className="p-6 main main_page min-h-screen duration-800 ease-in-out bg-gray-50">
                <BreadcrumbsNav customTrail={[{ label: "Profile", path: "/profile" }]} />
                <div className="flex justify-between items-center mb-6">
                    <PageTitle title={"My Profile"} />
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-10" />

                        <div className="relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6 z-10">
                            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full p-1 bg-white shadow-lg">
                                        <img
                                            src={profile?.image ? `${IMG_BASE_URL}${profile.image}` : profilePhoto}
                                            alt={profile?.name}
                                            className="w-full h-full rounded-full object-cover"
                                            onError={(e) => { e.target.src = profilePhoto }}
                                        />
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="pb-2">
                                    <h2 className="text-3xl font-bold text-gray-800">{profile?.name}</h2>
                                    <p className="text-gray-500 font-medium">{profile?.role_id === 1 ? "Super Admin" : "Admin"}</p>
                                    <p className="text-gray-400 text-sm mt-1">Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setModel(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform active:scale-95"
                            >
                                <CiEdit className="text-xl" />
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Personal Information Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                            <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
                            <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Full Name</span>
                                <span className="text-lg font-medium text-gray-800">{profile?.name || "N/A"}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Email Address</span>
                                <span className="text-lg font-medium text-gray-800 break-all">{profile?.email || "N/A"}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Phone Number</span>
                                <span className="text-lg font-medium text-gray-800">
                                    {profile?.country_code} {profile?.phone || "N/A"}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Account Role</span>
                                <span className="text-lg font-medium text-gray-800">
                                    {profile?.role_id === 1 ? "Super Admin" : "Admin"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {model && <ProfileModel model={model} setModel={setModel} profiledata={profile} />}
        </>
    );
};