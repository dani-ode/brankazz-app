import axios from 'axios';

import {BRANKAZZ_BASE_URL} from '@env';

import {BRANKAZZ_ACCESS_KEY} from '@env';

const ApiManager = axios.create({
  baseURL: BRANKAZZ_BASE_URL,
  responseType: 'json',
  withCredentials: true,
});

ApiManager.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

ApiManager.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

ApiManager.defaults.headers.common['Content-Type'] = 'application/json';

ApiManager.defaults.headers.common['Access-Key'] = BRANKAZZ_ACCESS_KEY;

ApiManager.defaults.timeout = 60000;

ApiManager.defaults.withCredentials = true;

export default ApiManager;
