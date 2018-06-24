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
    url: '/user/user-info'
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
