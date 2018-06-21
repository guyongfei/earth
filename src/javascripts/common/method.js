export default {
  isEmpty (value) {
    return (value === '' || value === null) ? true : false;
  },
  emailFormat (value) {
    return !/(^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$)/.test(value) ? false : true;
  },
  checkEquals (value, confirmValue) {
    return value === confirmValue ? true : false;
  },
  checkNoEquals (value, confirmVal) {
    return value === confirmVal ? false : true;
  }
}