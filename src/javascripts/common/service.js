import { baseURL } from './constants';

const baseOptions = (options) => {
  let parseFormat = option.type == 'GET' ? { params: options.data } : { contentType: 'application/json', data: JSON.stringify(options.data) };
  return {
    url: baseURL + options.url,
    dataType: 'json',
    ...options,
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

export function baseInfo () {
  return request({
    type: 'GET',
    url: '',
    data: {  }
  });
}
