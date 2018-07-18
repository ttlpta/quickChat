import axios from "axios";

import { BASE_URL } from "./contanst";

let instance = {
  baseURL: BASE_URL,
  timeout: 5000,
};

const axiosInstance = axios.create(instance);
export default axiosInstance;

export const authAxios = () => {
  const quickchat = JSON.parse(localStorage.getItem('quickchat'));
  instance = { ...instance, headers : { Authorization: quickchat.token } };

  return axios.create(instance);
}


