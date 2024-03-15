import axios from 'axios';

import {BRANKAZZ_BASE_URL} from '@env';

const ApiManager = axios.create({
  baseURL: BRANKAZZ_BASE_URL,
  responseType: 'json',
  withCredentials: true,
});

export default ApiManager;
