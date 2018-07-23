export default class NotifyHolder {
  static notify;

  static setNotify(notify) {
      this.notify = notify;
  }

  static getNotify() {
      return this.notify;
  }
}