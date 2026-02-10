import React, { useState, useEffect, use } from "react";
import { HiMenu } from "react-icons/hi";
import profilePhoto from "../../assets/images/guest.png";
import headerlogo from "../../assets/images/laundry-logo.png";
import NotificationBell from "./NotificationBell";
import UserDropdown from "../common/UserDropdown/UserDropdown";
import { FaArrowRight } from "react-icons/fa";
import { fetchUserProfile } from "../../apis/Auth";
import { IMG_BASE_URL } from "../../config/Config";

function Header({ setIs_Toggle, isToggle }) {
  const [userDropdown, setUserDropdown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [user, setUser] = useState(null); // <- will hold token, name, email
  const [profile, setProfile] = useState(null);
  // ✅ Fetch user info once when component mounts
  useEffect(() => {
    const stored =
      localStorage.getItem("trofi_user") ||
      sessionStorage.getItem("trofi_user");

    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Invalid user data", e);
      }
    }
  }, []);

  useEffect(() => {
    const fechProfile = async () => {
      try {
        const profileData = await fetchUserProfile();
        console.log("profiledata", profileData);
        if (profileData?.status == 200) {
          setProfile(profileData?.data);
        }

      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fechProfile();
  }, []);

  const handleUserDropdown = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setUserDropdown((prev) => !prev);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const onCloseDropdown = () => setUserDropdown(false);

  const handleToggle = () => setIs_Toggle(!isToggle);

  return (
    <>
      <div className="header header_top_menu fixed top-0 left-0 z-10 flex w-full py-2 items-center justify-between bg-white p-4 shadow-sm">
        <span
          className={`${isToggle ? "translate-x-[295px] duration-900" : "duration-900"
            } flex gap-5 items-center`}
        >
          <button
            onClick={handleToggle}
            className="relative w-8 h-14 flex flex-col justify-center items-center group"
          >
            {/* Burger icon */}
            <span
              className={`block h-0.5 bg-[#3d9bc7] transition-all duration-300 ${isToggle
                ? "w-6.5"
                : "rotate-30 translate-y-1 translate-x-2 w-3"
                } group-hover:rotate-40 group-hover:translate-y-1 group-hover:translate-x-2 group-hover:w-3 rounded-full`}
            ></span>
            <span className="block h-0.5 w-6.5 bg-[#3d9bc7] my-1.5 transition-all duration-300 rounded-full"></span>
            <span
              className={`block h-0.5 bg-[#3d9bc7] transition-all duration-300 ${isToggle
                ? "w-6.5"
                : "-rotate-40 -translate-y-1 translate-x-2 w-3"
                } group-hover:-rotate-40 group-hover:-translate-y-1 group-hover:translate-x-2 group-hover:w-3 rounded-full`}
            ></span>
          </button>

          {/* <div>
            <img
              src={headerlogo}
              className="w-10 h-10 translate-y-[-10%]"
              alt="logo"
            />
          </div> */}
        </span>

        <div
          className={`flex justify-end ${isToggle ? "hidden lg:flex" : "flex"}`}
        >
          <div className="flex items-center space-x-3 px-3 py-1 rounded-[8px] cursor-pointer">
            <NotificationBell />
            <div>
              {/* 👇 dynamic name / email fallback */}
              <p className="text-[14px] font-Montserrat font-[500]">
                {profile?.name || "Guest"}
              </p>
              <p className="text-[12px] font-Montserrat font-[400] text-[#9C9C9C]">
                {profile?.email || "login user"}
              </p>
            </div>
            <div className="rounded-full bg-[#D8D8D8] overflow-hidden w-11 h-11 border-2 border-white shadow-sm cursor-pointer">
              <img
                src={profile?.image ? `${IMG_BASE_URL}${profile.image}` : profilePhoto}
                className="w-full h-full object-cover"
                onClick={handleUserDropdown}
                onError={(e) => { e.target.onerror = null; e.target.src = profilePhoto; }}
                alt="profile_pic"
              />
            </div>
          </div>
        </div>
      </div>

      <UserDropdown
        userDropdown={userDropdown}
        handleuserDropdown={handleUserDropdown}
        onClosedropdown={onCloseDropdown}
        user={user}
      />

      <div className="mt-12"></div>
    </>
  );
}

export default Header;
