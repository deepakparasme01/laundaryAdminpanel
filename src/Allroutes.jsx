import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ContextApi from "./ContextApi";
import Login from "./Pages/Login/Login";
import Layout from "./Layout/Layout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import { AdminList } from "./Pages/Admin/AdminList";
import { ManagerList } from "./Pages/Admin/ManagerList";
import { CategoryList } from "./Pages/category/CategoryList";
import { SubcategoryList } from "./Pages/category/SubcategoryList";
import { CreateCategory } from "./Pages/category/CreateCategory";
import { CreateSubcategory } from "./Pages/category/CreateSubcategory";
import { CreateAdmin } from "./Pages/Admin/AddAdmin";
import { CreateManager } from "./Pages/Admin/AddManager";
import { AppSetting } from "./Pages/settings/AppSetting";
import { Products } from "./Pages/products/Products";
import { AppBanners } from "./Pages/app-banner/AppBanners";
import { Profile } from "./Pages/profile/Profile";
import { Services } from "./Pages/services/Services";
import { AddService } from "./Pages/services/AddService";
import { AddBanner } from "./Pages/app-banner/AddBanner";
import { About_Us } from "./Pages/cms-pages/About_Us";
import { Terms_Conditions } from "./Pages/cms-pages/Terms_Conditions";
import { Privacy_Policy } from "./Pages/cms-pages/Privacy_Policy";
import { Coupons } from "./Pages/coupons/Coupons";
import { AddCoupon } from "./Pages/coupons/AddCoupon";
import PublicRoute from "./PublicRoutes";
import { PicUp_Shedules } from "./Pages/shedule/picup-shedule/PicUp_Shedules";
import { Delivery_Shedules } from "./Pages/shedule/delivery-shedule/Delivery_Shedules";

const Allroutes = () => {
  const [authData, setAuthData] = useState(() =>
    (localStorage.getItem("laundary-token"))
  );
  return (
    <ContextApi.Provider value={{ authData, setAuthData }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PublicRoute />}>
            <Route path="/Login" element={<Login />} />
          </Route>
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin_list" element={<AdminList />} />
              <Route path="/manager_list" element={<ManagerList />} />
              <Route path="/category_list" element={<CategoryList />} />
              <Route path="/subcategory_list" element={<SubcategoryList />} />
              <Route path="/add_category" element={<CreateCategory />} />
              <Route path="/add_subcategory" element={<CreateSubcategory />} />
              <Route path="/add_admin" element={<CreateAdmin />} />
              <Route path="/add_manager" element={<CreateManager />} />

              <Route path="/products" element={<Products />} />
              <Route path="/banners" element={<AppBanners />} />
              <Route path="/add_banner" element={<AddBanner />} />
              <Route path="/update_banner/:id" element={<AddBanner />} />

              <Route path="/services" element={<Services />} />
              <Route path="/add_service" element={<AddService />} />
              <Route path="/update_service/:srId" element={<AddService />} />

              <Route path="/app_setting" element={<AppSetting />} />

              {/* cms routes */}
              <Route path="/about_us" element={<About_Us />} />
              <Route path="/terms_conditions" element={<Terms_Conditions />} />
              <Route path="/privacy_policy" element={<Privacy_Policy />} />

              {/* coupo routes */}
              <Route path="/coupons" element={<Coupons />} />
              <Route path="/update_coupon/:srId" element={<AddCoupon />} />
              <Route path="/add_coupon" element={<AddCoupon />} />

              <Route path="/pickup_schedule" element={<PicUp_Shedules />} />
              <Route path="/delivery_schedule" element={<Delivery_Shedules />} />




            </Route>
          </Route>
        </Routes>
      </Router>
    </ContextApi.Provider>
  );
};

export default Allroutes;
