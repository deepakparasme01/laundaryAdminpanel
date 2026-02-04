import { apiRequest } from "./ApiService";

export const adminList = () => apiRequest("superadmin/admin-list", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const managerList = () => apiRequest("superadmin/manager-list", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const categoryList = () => apiRequest("superadmin/category-list", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const subcategoryList = () => apiRequest("superadmin/sub-category-list", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const addcategory = (body) => apiRequest("superadmin/category-add", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const deletecategory = (deleteId) => apiRequest(`superadmin/category-delete/${deleteId}`, "DELETE", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const addSubcategory = (body) => apiRequest("superadmin/sub-category-add", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const deletesubcategory = (deleteId) => apiRequest(`superadmin/sub-category-delete/${deleteId}`, "DELETE", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const addAdmin = (body) => apiRequest("superadmin/admin-register", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const categoryStatusUpdate = (body, id) => apiRequest(`superadmin/category-status/${id}`, "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const subcategoryStatusUpdate = (body, id) => apiRequest(`superadmin/sub-category-status/${id}`, "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const updatecategory = (body, id) => apiRequest(`superadmin/category-edit/${id}`, "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const updateSubcategory = (body, id) => apiRequest(`superadmin/sub-category-edit/${id}`, "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});


// products
export const getProducts = () => apiRequest("superadmin/product-list", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const productStatusUpdate = (body, id) => apiRequest(`superadmin/product-status/${id}`, "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const deleteProduct = (deleteId) => apiRequest(`superadmin/product-delete/${deleteId}`, "DELETE", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const addproduct = (body) => apiRequest("superadmin/product-add", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const editproduct = (body, id) => apiRequest(`superadmin/product-edit/${id}`, "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

// setting apis
export const getSettingData = () => apiRequest('superadmin/settings', "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const updateSettings = (body) => apiRequest('superadmin/settings/update', "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});


// banners apis
export const getBanners = () => apiRequest("superadmin/slider-list", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const addbanner = (body) => apiRequest("superadmin/slider-add", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const updateBanner = (body, id) => apiRequest(`superadmin/slider-edit/${id}`, "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const deletebanner = (deleteId) => apiRequest(`superadmin/slider-delete/${deleteId}`, "DELETE", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const bannerStatusUpdate = (body, id) => apiRequest(`superadmin/slider-status/${id}`, "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});


// Service Apis
export const getServices = () => apiRequest("superadmin/service-list", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const serviceStatusUpdate = (body, id) => apiRequest(`superadmin/service-status/${id}`, "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const deleteService = (deleteId) => apiRequest(`superadmin/service-delete/${deleteId}`, "DELETE", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const addservice = (body) => apiRequest("superadmin/service-add", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const updateService = (body, id) => apiRequest(`superadmin/service-edit/${id}`, "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

// about us Apis
export const getAboutData = () => apiRequest('superadmin/about-us', "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const updateAboutData = (body) => apiRequest('superadmin/about-us-update', "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
// terms-conditions Apis
export const getTermsConditionsData = () => apiRequest('superadmin/terms-service', "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const updateTermsConditionsData = (body) => apiRequest('superadmin/terms-service-update', "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
// privacy policy Apis
export const getPrivacyPolicyData = () => apiRequest('superadmin/privacy-policy', "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const updatePrivacyPolicyData = (body) => apiRequest('superadmin/privacy-policy-update', "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

// Cpopon Apis
export const getCoupons = () => apiRequest("superadmin/coupon-list", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const deleteCoupon = (deleteId) => apiRequest(`superadmin/coupon-delete/${deleteId}`, "DELETE", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const addCoupon = (body) => apiRequest("superadmin/coupon-add", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const updateCoupon = (body, id) => apiRequest(`superadmin/coupon-edit/${id}`, "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});


// pick-up shedules Apis
export const getPicup_Shedules = () => apiRequest("superadmin/pickup-schedule-list", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const editPickup_Shedules = (id, data) => apiRequest(`superadmin/pickup-schedule-edit/${id}`, "POST", data, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const changeStatus_Pickup_Shedule = (data, id) => apiRequest(`superadmin/pickup-schedule-status/${id}`, "POST", data, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});


// delivery shedules Apis
export const getDelivery_Shedules = () => apiRequest("superadmin/delivery-schedule-list", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const editDelivery_Shedules = (id, data) => apiRequest(`superadmin/delivery-schedule-edit/${id}`, "POST", data, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const changeStatus_Delivery_Shedule = (data, id) => apiRequest(`superadmin/delivery-schedule-status/${id}`, "POST", data, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
