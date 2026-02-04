import apiClient from "./ApiClient";

export const apiRequest = async (endpoint, method = "GET", data = null, customHeaders = {}) => {
  try {
    const response = await apiClient({
      url: endpoint,
      method,
      data,
      headers: {
        ...customHeaders, // you can override or add headers here
      },
    });

    return response.data;
  } catch (error) {
    return error;
  }
};
