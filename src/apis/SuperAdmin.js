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
export const getProducts = (params) => {
  const queryString = params
    ? Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&")
    : "";
  const url = queryString ? `superadmin/product-list?${queryString}` : "superadmin/product-list";
  return apiRequest(url, "GET", null, {
    Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
  });
};
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

// Area Apis
export const getAreaList = () => apiRequest("superadmin/area-list", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const addArea = (body) => apiRequest("superadmin/area-add", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const editArea = (body, id) => apiRequest(`superadmin/area-edit/${id}`, "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const areaStatusUpdate = (body, id) => apiRequest(`superadmin/area-status/${id}`, "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const deleteArea = (deleteId) => apiRequest(`superadmin/area-delete/${deleteId}`, "DELETE", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

const formatDateFilter = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

// Order Apis
export const getOrderList = (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.order_status) queryParams.append("order_status", filters.order_status);
  if (filters.pickup_date) queryParams.append("pickup_date", formatDateFilter(filters.pickup_date));
  if (filters.delivery_date) queryParams.append("delivery_date", formatDateFilter(filters.delivery_date));

  const queryString = queryParams.toString();
  const url = queryString ? `superadmin/order-list?${queryString}` : "superadmin/order-list";

  return apiRequest(url, "GET", null, {
    Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
  });
};

export const getOrderDetail = (body) => apiRequest("superadmin/order-detail", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const updateOrderStatus = (body) => apiRequest("superadmin/order-status", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const assignDriver = (body) => apiRequest("superadmin/order-driver", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const getDrivers = (status) => {
  const url = status ? `superadmin/driver-list?status=${status}` : "superadmin/driver-list";
  return apiRequest(url, "GET", null, {
    Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
  });
};

export const addDriver = (formData) => apiRequest("superadmin/driver-add", "POST", formData, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
  "Content-Type": "multipart/form-data",
});

export const updateUserStatus = (body) => apiRequest("superadmin/user-status", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const getCustomerList = () => apiRequest("superadmin/user-list", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

// Delivery Cost APIs
export const getDeliveryCost = () => apiRequest("superadmin/delivery-cost", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const updateDeliveryCost = (body) => apiRequest("superadmin/delivery-cost-update", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const getDriverDetails = (body) => apiRequest("superadmin/driver-detail", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const updateDriver = (formData) => apiRequest("superadmin/driver-update", "POST", formData, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
  "Content-Type": "multipart/form-data",
});

export const deleteDriver = (deleteId) => apiRequest("superadmin/driver-delete", "DELETE", { driver_id: deleteId }, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

// Report Apis
export const getOrderReport = ({ pickup_date, delivery_date }) => {
  const queryParams = new URLSearchParams();
  if (pickup_date) queryParams.append("pickup_date", formatDateFilter(pickup_date));
  if (delivery_date) queryParams.append("delivery_date", formatDateFilter(delivery_date));

  const queryString = queryParams.toString();
  const url = queryString ? `superadmin/order-report?${queryString}` : "superadmin/order-report";

  return apiRequest(url, "GET", null, {
    Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
  });
};
