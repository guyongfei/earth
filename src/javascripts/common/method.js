export default {
  isEmpty (value) {
    return (value === '' || value === null) ? true : false;
  },
  emailFormat (value) {
    return /(^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$)/.test(value);
  },
  checkEquals (value, confirmValue) {
    return value === confirmValue ? true : false;
  },
  checkNoEquals (value, confirmVal) {
    return value === confirmVal ? false : true;
  },
  passwordFormat (value) {
    return /^[0-9a-zA-Z]{6, 20}/.test(value);
  }
}