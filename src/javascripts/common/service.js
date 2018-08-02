import { baseURL } from './constants';
import method from './method';

let lang = method.getCookie('witshare.i18n.language');

const baseOptions = (options) => {
  let parseFormat = options.type == 'GET' ?
    { params: options.data } : { contentType: 'application/json', data: JSON.stringify(options.data) };
  console.log(baseURL + options.url);
  return {
    ...options,
    dataType: 'json',
    url: baseURL + options.url,
    ...parseFormat
  };
};

const checkStatus = (data) => {
  data = { ...data };
  if (data.success) {
    return Promise.resolve(data);
  }
  return Promise.reject(data);
};

function request (options) {
  return $.ajax(baseOptions(options))
  .then(checkStatus)
  .catch((err, status) => {
    if (err.status && err.status === 401 && method.getCookie('logined')) {
      method.setCookie('logined', '', 30);
      alert(lang == 'en' ? 'Your account has been logged on by other devices. Please login again.' : '您的账号已在其他设备登录，请重新登录!');
      window.location.href = './index.html';
    }
    return Promise.reject(err);
  });
}

//获取邮箱验证码
export function emailCode (action, email, imgToken, imgVerifyCode) {
  return request({
    type: 'POST',
    url: `/verify-code/email?action=${action}`,
    data: {
      email,
      imgToken,
      imgVerifyCode
    }
  });
}

//注册
export function register (params) {
  return request({
    type: 'POST',
    url: '/register',
    data: params
  });
}

//登录
export function login (params) {
  return request({
    type: 'POST',
    url: '/login',
    data: params
  });
}

//退出
export function logout () {
  return request({
    type: 'POST',
    url: '/logout'
  });
}

//修改重置密码
export function passRequest (action, email, password, verifyCode) {
  return request({
    type: 'POST',
    url: `/user/password?action=${action}`,
    data: {
      email,
      password,
      verifyCode
    }
  });
}

//获取用户信息（只针对本人）
export function userinfo () {
  return request({
    type: 'GET',
    url: '/user-info'
  });
}

// 获取项目列表
export function projectList () {
  return request({
    type: 'GET',
    url: '/project/list'
  });
}

// 获取项目详情
export function projectDetails (projectGid) {
  return request({
    type: 'GET',
    url: `/project/${projectGid}`
  });
}

// 查询用户项目交易信息
export function getTransactionInfo (projectGid) {
  return request({
    type: 'GET',
    url: `/transaction/info?projectGid=${projectGid}&t=${new Date().getTime()}`
  });
}

// 设置用户交易地址
export function setUserAddress (params) {
  return request({
    type: 'POST',
    url: '/transaction/user-address',
    data: params
  });
}

// 提交交易
export function submitTransaction (params) {
  return request({
    type: 'POST',
    url: '/transaction',
    data: params
  });
}

// 个人交易列表
export function getTransactions (gid, pageNum, pageSize) {
  return request({
    type: 'GET',
    url: `/transactions?projectGid=${gid}&pageNum=${pageNum}&pageSize=${pageSize}`
  });
}

// 交易详情
export function ownerTransaction (payTx) {
  return request({
    type: 'GET',
    url: `/transaction/${payTx}`
  });
}

// 首页信息
export function getIndex () {
  return request({
    type: 'GET',
    url: `/index?t=${new Date().getTime()}`
  });
}

// 获取首页交易信息
export function getIndexTransaction (gid, pageNum, pageSize) {
  return request({
    type: 'GET',
    url: `/index-transaction?projectGid=${gid}&pageNum=${pageNum}&pageSize=${pageSize}&t=${new Date().getTime()}`,
  });
}


// 首页提交交易信息
export function submitIndexTransaction (params) {
  return request({
    type: 'POST',
    url: '/index-transaction',
    data: params
  });
}
