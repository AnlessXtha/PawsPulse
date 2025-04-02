import axios from "axios";

export const createApiClient = (baseURL) => {
  const apiClient = axios.create({ baseURL });

  return apiClient;
};
