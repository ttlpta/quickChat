import axios from "axios";

import { BASE_URL } from "./contanst";
import { checkIsLogging } from "./utils";

let instance = {
  baseURL: BASE_URL,
  timeout: 5000,
};

if(checkIsLogging()) {
  const quickchat = JSON.parse(localStorage.getItem('quickchat'));
  instance = { ...instance, headers : { Authorization: quickchat.token } };
} 

const axiosInstance = axios.create(instance);

export default axiosInstance;