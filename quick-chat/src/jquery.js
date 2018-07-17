const $ = window.$;

export const alert = (msg, type = 'success') => {
  $.notify(msg, type);
};