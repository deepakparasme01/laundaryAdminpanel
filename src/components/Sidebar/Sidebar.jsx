import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown, FaCog } from "react-icons/fa";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DesignServicesIcon from '@mui/icons-material/DesignServices';

import logo from "../../assets/images/laundry-logo.png"
/* 🔹 Recursive Sidebar Item */
const SidebarItem = ({
  item,
  openMain,
  setOpenMain,
  openNested,
  setOpenNested,
  activePath,
  handleSubClick,
  isMain = false,
}) => {
  const isOpen = isMain
    ? openMain === item.name
    : openNested[item.name] || false;

  const handleClick = () => {
    if (item.dropdown) {
      if (isMain) {
        // Accordion: only one main open
        setOpenMain(isOpen ? null : item.name);
      } else {
        // Inner dropdown: toggle only itself
        setOpenNested((prev) => ({
          ...prev,
          [item.name]: !isOpen,
        }));
      }
    } else {
      handleSubClick(item.link);
    }
  };

  return (
    <li className={`text-sm ${isMain ? 'mx-4' : ""} rounded-sm group relative`}>
      {item.dropdown ? (
        <div
          onClick={handleClick}
          className={`flex w-full justify-between mb-1 items-center pl-3 pr-3 py-2 cursor-pointer 
            rounded-lg 
            hover:bg-white hover:text-[#3d9bc7] 
            ${isOpen ? "bg-white text-[#3d9bc7]" : "text-white"}`}
        >
          <div className="flex items-center gap-3 text-[100%]">
            {item.icon}
            {item.name}
          </div>
          <FaChevronDown
            className={`w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </div>
      ) : (
        <Link
          to={item.link}
          onClick={handleClick}
          className={`
    flex w-full justify-between items-center pl-3 pr-3 py-2 mb-1 cursor-pointer
    rounded-lg
    ${item.indent ? "ml-6" : ""}
    hover:bg-white hover:text-[#3d9bc7]
    ${activePath === "/" + item.link ? "bg-white text-[#3d9bc7]" : "text-white"}
  `}
        >
          <div className="flex items-center gap-3 text-[100%]">
            {item.icon}
            {item.name}
          </div>
        </Link>
      )}

      {/* 🔹 Recursive Sub Items */}
      {item.dropdown && isOpen && item.subItems && (
        <ul className="ml-6 mt-2 flex flex-col gap-1 list-none pl-4 ">
          {item.subItems.map((subItem, idx) => (
            <SidebarItem
              key={idx}
              item={subItem}
              openMain={openMain}
              setOpenMain={setOpenMain}
              openNested={openNested}
              setOpenNested={setOpenNested}
              activePath={activePath}
              handleSubClick={handleSubClick}
              isMain={false}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

function Sidebar({ setIs_Toggle, isToggle }) {
  const [openMain, setOpenMain] = useState(null); // only for main dropdowns
  const [openNested, setOpenNested] = useState({}); // for inner dropdowns
  const [activeItem, setActiveItem] = useState("Dashboard");
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("user_role");
  const activePath = location.pathname;

  const filteredSidebarData = [
    {
      section: null,
      items: [
        ...(userRole === "admin"
          ? [
            {
              name: "Dashboard",
              icon: <DashboardIcon className="w-4 h-4" />,
              link: "dashboard",
              dropdown: false,
              // subItems: [{ name: "Dashboard", link: "/Dashboard" }],
            },
          ]
          : []),
        ...(userRole == 1
          ? [
            {
              name: "Dashboard",
              icon: <DashboardIcon className="w-4 h-4" />,
              link: "dashboard",
              dropdown: false,
              subItems: [{ name: "Dashboard", link: "/Dashboard" }],
            },
          ]
          : []),
      ],
    },
    {
      section: "",
      items: [
        {
          name: "Admin Management",
          icon: <AdminPanelSettingsIcon className="w-4 h-4" />,
          link: "#",
          dropdown: true,
          subItems: [
            { name: "Admins", link: "admin_list", dropdown: false },
            { name: "managers", link: "manager_list", dropdown: false },
            // { name: "Add Admin", link: "#", dropdown: false },

          ],
        },
      ],
      border: true,
    },
    {
      section: "",
      items: [
        {
          name: "Category Management",
          icon: <CategoryOutlinedIcon />,
          link: "#",
          dropdown: true,
          subItems: [
            { name: "Category List", link: "category_list", dropdown: false },
            { name: "Subcategory List", link: "subcategory_list", dropdown: false },
            // { name: "Add Category", link: "#", dropdown: false },
          ],
        },
      ],
      border: true,
    },
    {
      section: "",
      items: [
        {
          name: "Product Manage",
          icon: <SettingsOutlinedIcon />,
          link: "#",
          dropdown: true,
          subItems: [
            { name: "Products", link: "products", dropdown: false },
            // { name: "Subcategory List", link: "subcategory_list", dropdown: false },
            // { name: "Add Category", link: "#", dropdown: false },
          ],
        },
      ],
      border: true,
    },
    {
      section: null,
      items: [
        {
          name: "App Banners",
          icon: <DashboardIcon className="w-4 h-4" />,
          link: "banners",
          dropdown: false,
          // subItems: [{ name: "Dashboard", link: "/Dashboard" }],
        },
      ],
      border: true,
    },
    {
      section: "",
      items: [
        {
          name: "Services",
          icon: <DesignServicesIcon />,
          link: "#",
          dropdown: true,
          subItems: [
            { name: "Service List", link: "services", dropdown: false },
            // { name: "Add Service", link: "add_service", dropdown: false },
            // { name: "", link: "subcategory_list", dropdown: false },
          ],
        },
      ],
      border: true,
    },
    {
      section: "",
      items: [
        {
          name: "Coupons",
          icon: <DesignServicesIcon />,
          link: "#",
          dropdown: true,
          subItems: [
            { name: "Coupon List", link: "coupons", dropdown: false },
            // { name: "Add Coupon", link: "add_service", dropdown: false },
            // { name: "", link: "subcategory_list", dropdown: false },
          ],
        },
      ],
      border: true,
    },
    {
      section: "",
      items: [
        {
          name: "Settings",
          icon: <SettingsOutlinedIcon />,
          link: "#",
          dropdown: true,
          subItems: [
            { name: "App Setting", link: "app_setting", dropdown: false },
            { name: "Area", link: "area", dropdown: false },
            // { name: "Subcategory List", link: "subcategory_list", dropdown: false },
            // { name: "Add Category", link: "#", dropdown: false },
          ],
        },
      ],
      border: true,
    },
    {
      section: "",
      items: [
        {
          name: "Shedules",
          icon: <DesignServicesIcon />,
          link: "#",
          dropdown: true,
          subItems: [
            { name: "Pic-up Shedule", link: "pickup_schedule", dropdown: false },
            { name: "Delivery Shedule", link: "delivery_schedule", dropdown: false },
            // { name: "Terms & Conditions", link: "/terms_conditions", dropdown: false },
            // { name: "Add Service", link: "add_service", dropdown: false },
            // { name: "", link: "subcategory_list", dropdown: false },
          ],
        },
      ],
      border: true,
    },
    {
      section: "",
      items: [
        {
          name: "CMS",
          icon: <DesignServicesIcon />,
          link: "#",
          dropdown: true,
          subItems: [
            { name: "About Us", link: "/about_us", dropdown: false },
            { name: "Privacy & Policy", link: "/privacy_policy", dropdown: false },
            { name: "Terms & Conditions", link: "/terms_conditions", dropdown: false },
            // { name: "Add Service", link: "add_service", dropdown: false },
            // { name: "", link: "subcategory_list", dropdown: false },
          ],
        },
      ],
      border: true,
    },
    // {
    //   section: "",
    //   items: [
    //     {
    //       name: "Role Management",
    //       icon: <GroupWorkIcon />,
    //       link: "#",
    //       dropdown: true,
    //       subItems: [
    //         // { name: "Add Role", link: "RoleCreate", dropdown: false },
    //         { name: "Roles", link: "RoleList", dropdown: false },
    //       ],
    //     },
    //   ],
    //   border: true,
    // },
    // {
    //   section: "",
    //   items: [
    //     {
    //       name: "User Management",
    //       icon: <PeopleIcon />,
    //       link: "#",
    //       dropdown: true,
    //       subItems: [{ name: "Users", link: "UserList", dropdown: false }],
    //     },
    //   ],
    //   border: true,
    // },
    // {
    //   section: "",
    //   items: [
    //     {
    //       name: "Restaurant Management",
    //       icon: <FaCog />,
    //       link: "#",
    //       dropdown: true,
    //       subItems: [
    //         {
    //           name: "Restaurant Amenity",
    //           link: "RestroAmenityList",
    //           dropdown: false,
    //           indent: true,
    //         },
    //         {
    //           name: "Restaurant Type",
    //           link: "RestroTypeList",
    //           dropdown: false,
    //           indent: true,
    //         },
    //         {
    //           name: "Restaurant Good For",
    //           link: "RestroGoodForList",
    //           dropdown: false,
    //           indent: true,
    //         },
    //         {
    //           name: "Restaurant Cuisine",
    //           link: "RestroCuisineList",
    //           dropdown: false,
    //           indent: true,
    //         },
    //       ],
    //     },
    //   ],
    // },

    // ,
    // {
    //   section: "",
    //   items: [
    //     {
    //       name: "Dish Management",
    //       icon: <FaConciergeBell />,
    //       link: "#",
    //       dropdown: true,
    //       subItems: [
    //         {
    //           name: "Dish Type",
    //           link: "RestroDishTypeList",
    //           dropdown: false,
    //           indent: true,
    //         },
    //         {
    //           name: "Dish Category ",
    //           link: "RestroDishCategoryList",
    //           dropdown: false,
    //           indent: true,
    //         },
    //         {
    //           name: "Dish Sub Category ",
    //           link: "RestroDishSubCategoryList",
    //           dropdown: false,
    //           indent: true,
    //         },
    //       ],
    //     },
    //   ],
    //   border: true,
    // },
    // {
    //   section: "",
    //   items: [
    //     {
    //       name: "Restaurant",
    //       icon: <FaStore />,
    //       link: "#",
    //       dropdown: true,
    //       subItems: [
    //         // {
    //         //   name: "Add Restaurant",
    //         //   link: "RestroAdd",
    //         //   dropdown: false,
    //         // },
    //         {
    //           name: " Restaurant's",
    //           link: "RestroList",
    //           dropdown: false,
    //         },
    //       ],
    //     },
    //   ],
    //   border: true,
    // },

    // {
    //   section: "",
    //   items: [
    //     {
    //       name: "Dish",
    //       icon: <RestaurantIcon />,
    //       link: "#",
    //       dropdown: true,
    //       subItems: [
    //         // { name: "Add Dish", link: "AddDishes", dropdown: false },
    //         { name: "Dishes", link: "DishesList", dropdown: false },
    //       ],
    //     },
    //   ],
    //   border: true,
    // },

    // {
    //   section: "",
    //   items: [
    //     {
    //       name: "Feedback Management",
    //       icon: <FaCommentDots />,
    //       link: "#",
    //       dropdown: true,
    //       subItems: [
    //         {
    //           name: "Restaurants Review",
    //           link: "RestaurantReviewList",
    //           dropdown: false,
    //         },
    //         {
    //           name: "Dishes Review",
    //           link: "DishReviewList",
    //           dropdown: false,
    //         },
    //         {
    //           name: "Manage HashTag's",
    //           link: "HashtagList",
    //           dropdown: false,
    //         },
    //       ],
    //     },
    //   ],
    //   border: true,
    // },

  ];

  const handleSubClick = (link) => {
    setActiveItem(link);
    localStorage.setItem("sidebar_active_item", link);
    navigate(link);
  };

  useEffect(() => {
    const savedActiveItem = localStorage.getItem("sidebar_active_item");
    if (savedActiveItem) {
      setActiveItem(savedActiveItem);
    }
  }, []);

  return (
    <div className="flex">
      <div
        className={`sidebar fixed left-0 top-0 h-full transition-transform duration-900 z-20 bg-[#3d9bc7] 
          ${isToggle ? "translate-x-0" : "-translate-x-full"} shadow-lg`}
      >
        {/* Logo */}
        <div className=" flex items-center gap-2 text-white font-bold text-2xl px-4 py-5">
          <div
            className="bg-white"
            style={{
              boxShadow: `
      inset 6px 6px 12px rgba(249, 115, 22, 0.35),  /* orange shadow bottom-right */
      inset -6px -6px 12px rgba(255, 200, 150, 0.6) /* soft orange highlight top-left */
    `,
            }}
          >
            <img src={logo} alt="" className="w-8 h-8" />
          </div>
          <span className="whitespace-nowrap">Laundry</span>
        </div>
        <div className="bg-[#3d9bc7] h-[90vh] overflow-y-auto scrollbar-thin-line">
          {/* Navigation */}
          <nav>
            <ul className="flex flex-col mb-4">
              {filteredSidebarData.map((section, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                  {section.items.map((item, idx) => (
                    <SidebarItem
                      key={idx}
                      item={item}
                      openMain={openMain}
                      setOpenMain={setOpenMain}
                      openNested={openNested}
                      setOpenNested={setOpenNested}
                      activePath={activePath}
                      handleSubClick={handleSubClick}
                      isMain={true} // only top-level marked as main
                    />
                  ))}
                </React.Fragment>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
