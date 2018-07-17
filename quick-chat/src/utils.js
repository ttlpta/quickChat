import _ from "lodash";
import axios from "./axios";
import * as jquery from "./jquery";

export const checkIsLogging = () => {
  const quickChatData = JSON.parse(localStorage.getItem('quickchat'));
  if(_.isEmpty(quickChatData) || _.isNull(quickChatData))
    return false;

  const checkExpiredToken = async () => {
    const token = quickChatData.token;
    try {
      const response = await axios.get('/auth/user/checkExpiredToken', {
        headers :  {
          Authorization: token
        }
      });
  
      return ! response.data.isExpired;
    } catch ({ response }) {
      if(response.status == 403) {
        return false;
      } 
      jquery.alert(response.statusText, 'warn');
    }
  }

  return checkExpiredToken();
}