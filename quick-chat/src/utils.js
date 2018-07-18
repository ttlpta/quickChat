import _ from "lodash";

import axios from "./axios";
import { SERVER_IMAGE_URL } from "./contanst";

export const checkIsLogging = () => {
  const quickChatData = JSON.parse(localStorage.getItem('quickchat'));
  if(_.isEmpty(quickChatData) || _.isNull(quickChatData))
    return false;

  const token = quickChatData.token;
  if(!token)
    return false;

  const expiredTime = quickChatData.expiredTime;
  const timestamp = Date.now();

  return timestamp < expiredTime - 60 * 60;
}

export const getQuickchatLocalData = () => {
  return JSON.parse(localStorage.getItem('quickchat'));
}

export const uploadImage = async dataImage => {
  const { token } = getQuickchatLocalData();
  try {
    const response = await axios.post('auth/files', dataImage, {
      headers: {
        Authorization: token
      }
    });

    return response.data.success ? SERVER_IMAGE_URL + response.data.data.imageUrl : false;
  } catch(e) {
    console.log('=======>', e);
  };
}
