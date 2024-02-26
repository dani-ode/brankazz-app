import axios from 'axios';

const ApiManager = axios.create({
  baseURL: 'https://brankazz.corpo.id/api',
  responseType: 'json',
  withCredentials: true,
});

export default ApiManager;
