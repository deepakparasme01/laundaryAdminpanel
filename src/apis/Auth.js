
import { apiRequest } from "./ApiService";
export const login = (credentials) => apiRequest("admin/login", "POST", credentials);
export const fetchUserProfile = () => apiRequest("superadmin/get-profile", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});
export const logout = () => apiRequest("superadmin/logout", "GET", null, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});

export const updateProfile = (body) => apiRequest("superadmin/update-profile", "POST", body, {
  Authorization: `Bearer ${localStorage.getItem("laundary-token")}`,
});