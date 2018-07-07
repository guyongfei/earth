import './global';
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
  },
  setCookie (name, value, days) {
    let expires = '';
    if (days != null) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires += date.toGMTString();
    } else {
      expires = '';
    }
    document.cookie = `${name}=${value};expires=${expires}; path=/`;
  },
  getCookie (name) {
    const nameEq = `${name}=`,
      ckArr = document.cookie.split(';');
    for (let i = 0; i < ckArr.length; i++) {
      let c = ckArr[i];
      if (c.charAt(0) == ' ') {
        c = c.substring(1, c.length); 
      }
      if (c.indexOf(nameEq) == 0) {
        return c.substring(nameEq.length, c.length);
      }
    }
    return null;
  },
  removeCookie (name) {
    this.setCookie(name, '', -1);
  },
  getUrlParam (str) {
    let param,
      params = location.search.slice(1).split('&');
    params.forEach(function (v) {
      let newArr = v.split('=');
      if (newArr[0] == str) {
        param = newArr[1]
        return false
      }
    });
    return param
  },
  timeFormatter (timestamp, type) {
    let date = new Date(timestamp),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate();
    
    year = year < 10 ? '0' + year : year;
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}-${month}-${day}`;
  },
  dateFormatter (timestamp) {
    
  },
  checkStatus (value) { // projects
    let result = null;
    switch (value) {
      case 0:
        result = $.t('summaryStatus.0');
        break;
      case 1:
        result = $.t('summaryStatus.1');
        break;
      case 2:
        result = $.t('summaryStatus.2');
        break;
      case 3:
        result = $.t('summaryStatus.3');
        break;
      case 4:
        result = $.t('summaryStatus.4');
        break;
      default:
        break;
    }
    return result;
  },
  checkTxtStatus (value) { // projects
    let result = null;
    switch (value) {
      case 0:
        result = $.t('totalStatus.0');
        break;
      case 1:
        result = $.t('totalStatus.1');
        break;
      case 2:
        result = $.t('totalStatus.2');
        break;
      case 3:
        result = $.t('totalStatus.3');
        break;
      case 4:
        result = $.t('totalStatus.4');
        break;
      default:
        break;
    }
    return result;
  },
  userTxStatus (value) {
    let result = null;
    switch (value) {
      case 0:
        result = $.t('userTxStatus.0');
        break;
      case 1:
        result = $.t('userTxStatus.1');
        break;
      case 2:
        result = $.t('userTxStatus.2');
        break;
      case 3:
        result = $.t('userTxStatus.3');
        break;
      case 4:
        result = $.t('userTxStatus.4');
        break;
      case 21:
        result = $.t('userTxStatus.21');
        break;
      case 22:
        result = $.t('userTxStatus.22');
        break;
      case 23:
        result = $.t('userTxStatus.23');
        break;
      default:
        result = '';
        break;
    }
    return result;
  },
  platformTxStatus (value) {
    let result = null;
    switch (value) {
      case 0:
        result = $.t('platformTxStatus.0');
        break;
      case 1:
        result = $.t('platformTxStatus.1');
        break;
      case 2:
        result = $.t('platformTxStatus.2');
        break;
      case 3:
        result = $.t('platformTxStatus.3');
        break;
      default:
        result = '';
        break;
    }
    return result;
  },
  //千分位
  thousandsFormatter (number) {
    if (!Number.isInteger(number)) return number;
    let num = (number || 0).toString(),
      result = '';
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
  }
}