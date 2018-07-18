import _ from "lodash";

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
