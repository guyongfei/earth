import { baseURL } from './constants';

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
  data = { ...data, msg: data.message };
  if (data.success) {
    return Promise.resolve(data);
  }
  return Promise.reject(data);
};

function request (options) {
  return $.ajax(baseOptions(options))
  .then(checkStatus)
  .catch((err, status) => {
    return Promise.reject(err);
  });
}

//获取邮箱验证码
export function emailCode (action, email) {
  return request({
    type: 'POST',
    url: `/verify-code/email?action=${action}`,
    data: {
      email
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
export function logout (params) {
  return request({
    type: 'POST',
    url: '/logout',
    data: params
  });
}

//修改重置密码
export function password (params) {
  return request({
    type: 'POST',
    url: `/user/password?action=${params.action}`,
    data: params.body
  });
}

//获取用户信息（只针对本人）
export function userinfo (params) {
  return request({
    type: 'GET',
    url: '/user/user-info'
  });
}

